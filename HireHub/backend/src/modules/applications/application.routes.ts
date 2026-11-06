import { Router } from "express";
import { authenticate } from "../../middleware/authenticate";
import * as applicationController from "./application.controller";

const router = Router();

router.post("/jobs/:jobId/applications", authenticate, ...applicationController.apply);
router.get("/applications/me", authenticate, ...applicationController.myApplications);
router.get("/applications/:id", authenticate, applicationController.getById);
router.get("/employer/jobs/:jobId/applications", authenticate, ...applicationController.jobApplicants);
router.patch("/applications/:id/status", authenticate, ...applicationController.updateStatus);
router.delete("/applications/:id", authenticate, ...applicationController.withdraw);

export default router;