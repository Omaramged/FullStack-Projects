import express from "express";
import cors from "cors";
import helmet from "helmet";
import cookieParser from "cookie-parser";
import rateLimit from "express-rate-limit";
import mongoose from "mongoose";
import authRoutes from "./routes/auth.js";
import linkRoutes from "./routes/links.js";
import analyticsRoutes from "./routes/analytics.js";
import redirectRoutes from "./routes/redirect.js";

const app = express();

app.use(helmet());
app.use(express.json({ limit: "100kb" }));
app.use(cookieParser());
app.use(
  cors({
    origin: process.env.CLIENT_URL || "http://localhost:3000",
    credentials: true,
  })
);

const guestLimiter = rateLimit({ windowMs: 15 * 60 * 1000, max: 30 });
const authLimiter = rateLimit({ windowMs: 15 * 60 * 1000, max: 100 });
app.use("/api/links", guestLimiter);
app.use("/api/auth", authLimiter);

app.get("/api/health", (req, res) => {
  const db = mongoose.connection.readyState === 1 ? "connected" : "disconnected";
  res.json({ success: true, message: "Linkly API is running", data: { db } });
});

app.use("/api/auth", authRoutes);
app.use("/api/links", linkRoutes);
app.use("/api/analytics", analyticsRoutes);
app.use("/", redirectRoutes);

app.use((req, res) => {
  res.status(404).json({ success: false, message: "Route not found" });
});

app.use((err, req, res, next) => {
  console.log(err.message);
  res.status(500).json({ success: false, message: "Something went wrong" });
});

export default app;
