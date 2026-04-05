const express = require("express");
const { randomUUID } = require("node:crypto");
const { desc, eq } = require("drizzle-orm");
const { z } = require("zod");
const { db } = require("../db/client");
const { communityReports, users } = require("../db/schema");
const { authRequired } = require("../middlewares/auth");
const { HttpError } = require("../lib/httpError");

const router = express.Router();

const severityEnum = z.enum(["low", "medium", "high"]);

const createReportSchema = z.object({
  crop: z.string().trim().min(2).max(80),
  issue: z.string().trim().min(2).max(120),
  severity: severityEnum,
  note: z.string().trim().max(500).optional(),
  latitude: z.coerce.number().min(-90).max(90).optional(),
  longitude: z.coerce.number().min(-180).max(180).optional(),
});

const listReportsQuerySchema = z.object({
  limit: z.coerce.number().min(1).max(100).optional(),
  lat: z.coerce.number().min(-90).max(90).optional(),
  lon: z.coerce.number().min(-180).max(180).optional(),
});

function toRadians(value) {
  return (value * Math.PI) / 180;
}

function distanceKm(lat1, lon1, lat2, lon2) {
  const earthRadiusKm = 6371;
  const dLat = toRadians(lat2 - lat1);
  const dLon = toRadians(lon2 - lon1);

  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRadians(lat1)) * Math.cos(toRadians(lat2)) * Math.sin(dLon / 2) ** 2;

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return earthRadiusKm * c;
}

function mapReport(record, viewerCoordinates) {
  const hasViewerCoordinates =
    viewerCoordinates &&
    Number.isFinite(viewerCoordinates.latitude) &&
    Number.isFinite(viewerCoordinates.longitude);

  const computedDistance = hasViewerCoordinates
    ? distanceKm(
        viewerCoordinates.latitude,
        viewerCoordinates.longitude,
        record.latitude,
        record.longitude,
      )
    : null;

  return {
    id: record.id,
    reporter: record.reporter,
    crop: record.crop,
    issue: record.issue,
    severity: record.severity,
    note: record.note,
    latitude: record.latitude,
    longitude: record.longitude,
    createdAt: record.createdAt,
    distanceKm: computedDistance !== null ? Math.round(computedDistance * 10) / 10 : null,
  };
}

router.use(authRequired);

router.get("/reports", async (req, res, next) => {
  try {
    const query = listReportsQuerySchema.parse(req.query);
    const limit = query.limit || 40;

    const records = await db
      .select({
        id: communityReports.id,
        crop: communityReports.crop,
        issue: communityReports.issue,
        severity: communityReports.severity,
        note: communityReports.note,
        latitude: communityReports.latitude,
        longitude: communityReports.longitude,
        createdAt: communityReports.createdAt,
        reporter: users.fullName,
      })
      .from(communityReports)
      .innerJoin(users, eq(communityReports.userId, users.id))
      .orderBy(desc(communityReports.createdAt))
      .limit(limit);

    const viewerCoordinates =
      typeof query.lat === "number" && typeof query.lon === "number"
        ? { latitude: query.lat, longitude: query.lon }
        : null;

    return res.json({
      reports: records.map((record) => mapReport(record, viewerCoordinates)),
    });
  } catch (error) {
    return next(error);
  }
});

router.post("/reports", async (req, res, next) => {
  try {
    const payload = createReportSchema.parse(req.body);

    const [user] = await db
      .select({
        id: users.id,
        fullName: users.fullName,
        latitude: users.latitude,
        longitude: users.longitude,
      })
      .from(users)
      .where(eq(users.id, req.auth.userId))
      .limit(1);

    if (!user) {
      throw new HttpError(404, "User account not found");
    }

    const latitude = payload.latitude ?? user.latitude;
    const longitude = payload.longitude ?? user.longitude;

    if (!Number.isFinite(latitude) || !Number.isFinite(longitude)) {
      throw new HttpError(
        400,
        "Report location is required. Allow GPS access or complete onboarding with map location.",
      );
    }

    const [created] = await db
      .insert(communityReports)
      .values({
        id: randomUUID(),
        userId: user.id,
        crop: payload.crop,
        issue: payload.issue,
        severity: payload.severity,
        note: payload.note || "",
        latitude,
        longitude,
      })
      .returning();

    return res.status(201).json({
      report: mapReport(
        {
          ...created,
          reporter: user.fullName,
        },
        null,
      ),
    });
  } catch (error) {
    return next(error);
  }
});

module.exports = router;
