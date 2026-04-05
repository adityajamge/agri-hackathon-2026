const express = require("express");
const { randomUUID, createHash } = require("node:crypto");
const { and, desc, eq } = require("drizzle-orm");
const { z } = require("zod");
const { env } = require("../config/env");
const { db } = require("../db/client");
const { scanResults, users } = require("../db/schema");
const { HttpError } = require("../lib/httpError");
const { authRequired } = require("../middlewares/auth");

const router = express.Router();

const analyzeSchema = z.object({
  imageBase64: z.string().min(32),
  latitude: z.coerce.number().min(-90).max(90).optional(),
  longitude: z.coerce.number().min(-180).max(180).optional(),
  userId: z.string().uuid().optional(),
});

const MAX_IMAGE_BYTES = 8 * 1024 * 1024;
const CACHE_WINDOW_MS = 10 * 60 * 1000;

function isDataUriBase64Image(value) {
  return /^data:image\/[a-zA-Z0-9.+-]+;base64,/.test(value);
}

function clampProbability(value) {
  if (!Number.isFinite(value)) {
    return 0;
  }
  if (value < 0) {
    return 0;
  }
  if (value > 1) {
    return 1;
  }
  return value;
}

function normalizeScanResponse(scan, { cached }) {
  const probability = Number(scan.probability ?? 0);

  return {
    id: scan.id,
    userId: scan.userId,
    imageUrl: scan.imageUrl,
    cropName: scan.cropName,
    diseaseName: scan.diseaseName,
    probability,
    confidence_percent: Math.round(probability * 100),
    treatment: scan.treatment || {},
    isHealthy: scan.isHealthy,
    latitude: scan.latitude,
    longitude: scan.longitude,
    createdAt: scan.createdAt,
    cached,
  };
}

router.post("/analyze", authRequired, async (req, res, next) => {
  try {
    const payload = analyzeSchema.parse(req.body);

    if (payload.userId && payload.userId !== req.auth.userId) {
      throw new HttpError(403, "userId does not match the authenticated user");
    }

    if (!isDataUriBase64Image(payload.imageBase64)) {
      throw new HttpError(
        400,
        "imageBase64 must be a valid base64 data URI (e.g. data:image/jpeg;base64,...)",
      );
    }

    const estimatedBytes = Math.ceil((payload.imageBase64.length * 3) / 4);
    if (estimatedBytes > MAX_IMAGE_BYTES) {
      throw new HttpError(413, "Image is too large. Please upload an image smaller than 8MB");
    }

    const [user] = await db
      .select({
        id: users.id,
        latitude: users.latitude,
        longitude: users.longitude,
      })
      .from(users)
      .where(eq(users.id, req.auth.userId))
      .limit(1);

    if (!user) {
      throw new HttpError(404, "User account not found");
    }

    const latitude = payload.latitude ?? user.latitude ?? null;
    const longitude = payload.longitude ?? user.longitude ?? null;

    const imageHash = createHash("sha256").update(payload.imageBase64).digest("hex");

    const [cachedScan] = await db
      .select()
      .from(scanResults)
      .where(and(eq(scanResults.userId, req.auth.userId), eq(scanResults.imageHash, imageHash)))
      .orderBy(desc(scanResults.createdAt))
      .limit(1);

    if (cachedScan) {
      const cachedAgeMs = Date.now() - new Date(cachedScan.createdAt).getTime();
      if (cachedAgeMs <= CACHE_WINDOW_MS) {
        return res.json({
          result: normalizeScanResponse(cachedScan, { cached: true }),
        });
      }
    }

    const detailsList = [
      "local_name",
      "description",
      "url",
      "treatment",
      "classification",
      "common_names",
      "cause",
    ].join(",");

    const kindwiseBody = {
      images: [payload.imageBase64],
      similar_images: true,
      details: detailsList,
    };

    const fallbackKindwiseBody = {
      images: [payload.imageBase64],
    };

    if (typeof latitude === "number" && typeof longitude === "number") {
      kindwiseBody.latitude = latitude;
      kindwiseBody.longitude = longitude;
      fallbackKindwiseBody.latitude = latitude;
      fallbackKindwiseBody.longitude = longitude;
    }

    const requestHeaders = {
      "Api-Key": env.CROP_HEALTH_API_KEY,
      "Content-Type": "application/json",
    };

    let cropApiResponse = await fetch(
      `${env.CROP_HEALTH_BASE_URL}/identification`,
      {
      method: "POST",
      headers: requestHeaders,
      body: JSON.stringify(kindwiseBody),
      },
    );

    if (!cropApiResponse.ok) {
      const errorBody = await cropApiResponse.text();

      // Some Kindwise environments still expect modifiers in query params.
      const shouldRetryWithQueryModifiers = /Unknown modifier:\s*details=/i.test(errorBody);

      if (shouldRetryWithQueryModifiers) {
        const cropRequestParams = new URLSearchParams({
          similar_images: "true",
          details: detailsList,
        });

        cropApiResponse = await fetch(
          `${env.CROP_HEALTH_BASE_URL}/identification?${cropRequestParams.toString()}`,
          {
            method: "POST",
            headers: requestHeaders,
            body: JSON.stringify(fallbackKindwiseBody),
          },
        );

        if (!cropApiResponse.ok) {
          const fallbackErrorBody = await cropApiResponse.text();
          throw new HttpError(
            502,
            "Crop health provider request failed. Scan was not charged to your database.",
            fallbackErrorBody,
          );
        }
      } else {
        throw new HttpError(
          502,
          "Crop health provider request failed. Scan was not charged to your database.",
          errorBody,
        );
      }
    }

    const cropApiPayload = await cropApiResponse.json();
    const result = cropApiPayload.result || {};
    const healthyData = result.is_healthy || {};
    const diseaseSuggestions = result.disease?.suggestions || [];
    const topSuggestion = diseaseSuggestions[0] || null;

    const isHealthy = Boolean(healthyData.binary);
    const probability = clampProbability(
      Number(topSuggestion?.probability ?? healthyData.probability ?? 0),
    );

    const diseaseName =
      topSuggestion?.name ||
      (isHealthy ? "Healthy" : "Unknown disease - check image quality and retake scan");

    const treatment = topSuggestion?.details?.treatment || {};
    const cropName = result.crop?.suggestions?.[0]?.name || null;

    const [savedScan] = await db
      .insert(scanResults)
      .values({
        id: randomUUID(),
        userId: req.auth.userId,
        imageUrl: payload.imageBase64,
        imageHash,
        cropName,
        diseaseName,
        probability,
        treatment,
        isHealthy,
        latitude,
        longitude,
        rawResponse: result,
      })
      .returning();

    return res.status(201).json({
      result: normalizeScanResponse(savedScan, { cached: false }),
      raw_result: result,
    });
  } catch (error) {
    return next(error);
  }
});

router.get("/history", authRequired, async (req, res, next) => {
  try {
    const limit = Math.min(Number(req.query.limit || 20), 100);

    const history = await db
      .select()
      .from(scanResults)
      .where(eq(scanResults.userId, req.auth.userId))
      .orderBy(desc(scanResults.createdAt))
      .limit(Number.isFinite(limit) && limit > 0 ? limit : 20);

    return res.json({
      history: history.map((scan) => normalizeScanResponse(scan, { cached: false })),
    });
  } catch (error) {
    return next(error);
  }
});

module.exports = router;
