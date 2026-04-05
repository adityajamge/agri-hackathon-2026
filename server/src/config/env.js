const dotenv = require("dotenv");

dotenv.config();

function cleanEnvValue(value) {
  if (typeof value !== "string") {
    return value;
  }
  return value.replace(/^['"]|['"]$/g, "").trim();
}

function getRequired(name) {
  const value = cleanEnvValue(process.env[name]);
  if (!value) {
    throw new Error(`Missing required env variable: ${name}`);
  }
  return value;
}

const env = Object.freeze({
  NODE_ENV: process.env.NODE_ENV || "development",
  PORT: Number(process.env.PORT || 3000),
  CORS_ORIGIN: cleanEnvValue(process.env.CORS_ORIGIN) || "*",
  DATABASE_URL: getRequired("DATABASE_URL"),
  JWT_SECRET: cleanEnvValue(process.env.JWT_SECRET) || "change-this-in-production",
  JWT_EXPIRES_IN: cleanEnvValue(process.env.JWT_EXPIRES_IN) || "7d",
  CROP_HEALTH_API_KEY: getRequired("CROP_HEALTH_API_KEY"),
  CROP_HEALTH_BASE_URL:
    cleanEnvValue(process.env.CROP_HEALTH_BASE_URL) || "https://crop.kindwise.com/api/v1",
  OPEN_METEO_BASE_URL:
    cleanEnvValue(process.env.OPEN_METEO_BASE_URL) || "https://api.open-meteo.com/v1",
});

if (env.NODE_ENV === "production" && env.JWT_SECRET === "change-this-in-production") {
  throw new Error("JWT_SECRET must be set to a secure value in production");
}

module.exports = {
  env,
};
