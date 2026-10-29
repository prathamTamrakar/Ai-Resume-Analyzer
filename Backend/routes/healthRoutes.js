import express from "express";
import mongoose from "mongoose";

const router = express.Router();

const getDatabaseStatus = () => {
  const states = {
    0: "disconnected",
    1: "connected",
    2: "connecting",
    3: "disconnecting",
  };
  return states[mongoose.connection.readyState] || "unknown";
};

router.get("/", (req, res) => {
  const dbStatus = getDatabaseStatus();
  const isHealthy = mongoose.connection.readyState === 1;

  const healthData = {
    status: isHealthy ? "OK" : "DEGRADED",
    timestamp: new Date().toISOString(),
    uptime: `${Math.floor(process.uptime())}s`,
    environment: process.env.NODE_ENV || "development",
    services: {
      server: "healthy",
      database: dbStatus,
    },
  };

  res.status(isHealthy ? 200 : 503).json(healthData);
});

export default router;
