const express = require("express");
const cors = require("cors");
const { env } = require("./config/env");
const { apiRouter } = require("./routes");
const { queryClient } = require("./db/client");
const { errorHandler, notFoundHandler } = require("./middlewares/error");

const app = express();

const localhostOriginPattern = /^https?:\/\/localhost(?::\d+)?$/i;
const localAppOrigins = new Set([
  "http://localhost",
  "https://localhost",
  "capacitor://localhost",
  "ionic://localhost",
]);

const allowedOrigins = env.CORS_ORIGIN === "*"
  ? "*"
  : env.CORS_ORIGIN.split(",")
      .map((origin) => origin.trim())
      .filter(Boolean);

function isAllowedOrigin(origin) {
  if (allowedOrigins === "*") {
    return true;
  }

  if (allowedOrigins.includes(origin)) {
    return true;
  }

  if (localAppOrigins.has(origin)) {
    return true;
  }

  if (localhostOriginPattern.test(origin)) {
    return true;
  }

  return false;
}

app.use(
  cors({
    origin(origin, callback) {
      if (!origin) {
        return callback(null, true);
      }

      if (isAllowedOrigin(origin)) {
        return callback(null, true);
      }

      return callback(new Error("Blocked by CORS policy"));
    },
    credentials: true,
  }),
);

app.use(express.json({ limit: "15mb" }));

app.get("/", (req, res) => {
  res.json({
    status: "ok",
    service: "CropGuard API",
  });
});

app.use("/api", apiRouter);
app.use(notFoundHandler);
app.use(errorHandler);

const server = app.listen(env.PORT, () => {
  console.log(`CropGuard API listening on port ${env.PORT}`);
});

function shutdown(signal) {
  console.log(`Received ${signal}. Shutting down API server...`);
  server.close(async () => {
    await queryClient.end({ timeout: 5 });
    process.exit(0);
  });
}

process.on("SIGINT", () => shutdown("SIGINT"));
process.on("SIGTERM", () => shutdown("SIGTERM"));
