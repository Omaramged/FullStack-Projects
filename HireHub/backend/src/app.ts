import express from "express";
import helmet from "helmet";
import cors from "cors";
import cookieParser from "cookie-parser";
import morgan from "morgan";
import { env } from "./config/env";
import { errorHandler } from "./middleware/errorHandler";
import authRoutes from "./modules/auth/auth.routes";
import companyRoutes from "./modules/companies/company.routes";
import jobRoutes from "./modules/jobs/job.routes";
import applicationRoutes from "./modules/applications/application.routes";
import savedJobRoutes from "./modules/savedJobs/savedJob.routes";
import notificationRoutes from "./modules/notifications/notification.routes";

const app = express();

app.use(helmet());
app.use(
  cors({
    origin: env.CLIENT_URL,
    credentials: true,
  })
);
app.use(express.json({ limit: "1mb" }));
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

if (env.NODE_ENV !== "test") {
  app.use(morgan("dev"));
}

app.get("/api/v1/health", (_req, res) => {
  res.status(200).json({ success: true, message: "OK", data: { status: "ok" } });
});

app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/companies", companyRoutes);
app.use("/api/v1/jobs", jobRoutes);
app.use("/api/v1", applicationRoutes);
app.use("/api/v1", savedJobRoutes);
app.use("/api/v1", notificationRoutes);

app.use((_req, res) => {
  res.status(404).json({ success: false, message: "Route not found" });
});

app.use(errorHandler);

export default app;