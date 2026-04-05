const express = require("express");
const bcrypt = require("bcryptjs");
const { randomUUID } = require("node:crypto");
const { eq } = require("drizzle-orm");
const { z } = require("zod");
const { db } = require("../db/client");
const { users } = require("../db/schema");
const { authRequired } = require("../middlewares/auth");
const { HttpError } = require("../lib/httpError");
const { signAuthToken } = require("../lib/jwt");

const router = express.Router();

const numberSchema = z.preprocess(
  (value) => {
    if (value === undefined || value === null || value === "") {
      return undefined;
    }
    const parsed = Number(value);
    return Number.isFinite(parsed) ? parsed : value;
  },
  z.number().finite().optional(),
);

const registerSchema = z.object({
  fullName: z.string().trim().min(2).max(120),
  email: z.string().trim().toLowerCase().email(),
  password: z.string().min(6).max(72),
  farmName: z.string().trim().min(2).max(120),
  village: z.string().trim().min(2).max(120),
  district: z.string().trim().min(2).max(120),
  primaryCrop: z.string().trim().min(2).max(80),
  latitude: numberSchema,
  longitude: numberSchema,
});

const loginSchema = z.object({
  email: z.string().trim().toLowerCase().email(),
  password: z.string().min(6).max(72),
});

function toPublicUser(user) {
  return {
    id: user.id,
    fullName: user.fullName,
    email: user.email,
    farmName: user.farmName,
    village: user.village,
    district: user.district,
    primaryCrop: user.primaryCrop,
    latitude: user.latitude,
    longitude: user.longitude,
    createdAt: user.createdAt,
  };
}

router.post("/register", async (req, res, next) => {
  try {
    const payload = registerSchema.parse(req.body);

    const [existingUser] = await db
      .select({ id: users.id })
      .from(users)
      .where(eq(users.email, payload.email))
      .limit(1);

    if (existingUser) {
      throw new HttpError(409, "An account with this email already exists");
    }

    const passwordHash = await bcrypt.hash(payload.password, 12);
    const userId = randomUUID();

    const [createdUser] = await db
      .insert(users)
      .values({
        id: userId,
        fullName: payload.fullName,
        email: payload.email,
        passwordHash,
        farmName: payload.farmName,
        village: payload.village,
        district: payload.district,
        primaryCrop: payload.primaryCrop,
        latitude: payload.latitude,
        longitude: payload.longitude,
      })
      .returning();

    const token = signAuthToken({
      id: createdUser.id,
      email: createdUser.email,
    });

    return res.status(201).json({
      token,
      user: toPublicUser(createdUser),
    });
  } catch (error) {
    return next(error);
  }
});

router.post("/login", async (req, res, next) => {
  try {
    const payload = loginSchema.parse(req.body);

    const [user] = await db
      .select()
      .from(users)
      .where(eq(users.email, payload.email))
      .limit(1);

    if (!user) {
      throw new HttpError(401, "Invalid email or password");
    }

    const isValidPassword = await bcrypt.compare(payload.password, user.passwordHash);
    if (!isValidPassword) {
      throw new HttpError(401, "Invalid email or password");
    }

    const token = signAuthToken({
      id: user.id,
      email: user.email,
    });

    return res.json({
      token,
      user: toPublicUser(user),
    });
  } catch (error) {
    return next(error);
  }
});

router.get("/me", authRequired, async (req, res, next) => {
  try {
    const [user] = await db
      .select()
      .from(users)
      .where(eq(users.id, req.auth.userId))
      .limit(1);

    if (!user) {
      throw new HttpError(404, "User account not found");
    }

    return res.json({
      user: toPublicUser(user),
    });
  } catch (error) {
    return next(error);
  }
});

module.exports = router;
