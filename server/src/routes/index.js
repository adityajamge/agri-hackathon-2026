const express = require("express");
const authRoutes = require("./auth");
const weatherRoutes = require("./weather");
const cropRoutes = require("./crop");

const apiRouter = express.Router();

apiRouter.get("/health", (req, res) => {
  res.json({
    status: "ok",
    service: "cropguard-api",
    timestamp: new Date().toISOString(),
  });
});

apiRouter.use("/auth", authRoutes);
apiRouter.use("/weather", weatherRoutes);
apiRouter.use("/crop", cropRoutes);

module.exports = {
  apiRouter,
};
