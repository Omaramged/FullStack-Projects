import { Router } from "express";
import { authenticate } from "../../middleware/authenticate";
import * as savedJobController from "./savedJob.controller";

const router = Router();

router.get("/saved-jobs", authenticate, ...savedJobController.list);
router.post("/saved-jobs/:jobId", authenticate, ...savedJobController.save);
router.delete("/saved-jobs/:jobId", authenticate, ...savedJobController.unsave);

export default router;