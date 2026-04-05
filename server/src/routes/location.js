const express = require("express");
const { z } = require("zod");
const { HttpError } = require("../lib/httpError");

const router = express.Router();

const reverseQuerySchema = z.object({
  lat: z.coerce.number().min(-90).max(90),
  lon: z.coerce.number().min(-180).max(180),
});

function pickFirstNonEmpty(values) {
  return values.find((value) => typeof value === "string" && value.trim().length > 0) || null;
}

router.get("/reverse", async (req, res, next) => {
  try {
    const query = reverseQuerySchema.parse(req.query);

    const params = new URLSearchParams({
      lat: String(query.lat),
      lon: String(query.lon),
      format: "jsonv2",
      zoom: "14",
      addressdetails: "1",
    });

    const response = await fetch(`https://nominatim.openstreetmap.org/reverse?${params.toString()}`, {
      headers: {
        Accept: "application/json",
        "User-Agent": "CropGuard/1.0 (+https://cropguard.local)",
      },
    });

    if (!response.ok) {
      const errorBody = await response.text();
      throw new HttpError(502, "Failed to resolve location name", errorBody);
    }

    const payload = await response.json();
    const address = payload.address || {};

    const village = pickFirstNonEmpty([
      address.village,
      address.hamlet,
      address.suburb,
      address.town,
      address.city,
      address.county,
    ]);

    const district = pickFirstNonEmpty([
      address.state_district,
      address.district,
      address.county,
      address.state,
    ]);

    const shortName =
      [village, district].filter(Boolean).join(", ") ||
      pickFirstNonEmpty([payload.display_name, address.state, address.country]) ||
      "Unknown location";

    return res.json({
      location: {
        latitude: query.lat,
        longitude: query.lon,
        displayName: pickFirstNonEmpty([payload.display_name]) || shortName,
        shortName,
        village,
        district,
        state: pickFirstNonEmpty([address.state]),
        country: pickFirstNonEmpty([address.country]),
      },
    });
  } catch (error) {
    return next(error);
  }
});

module.exports = router;
