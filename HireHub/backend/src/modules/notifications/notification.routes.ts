import { Router } from "express";
import { authenticate } from "../../middleware/authenticate";
import * as notificationController from "./notification.controller";

const router = Router();

router.get("/notifications", authenticate, notificationController.list);
router.patch("/notifications/:id/read", authenticate, notificationController.markRead);
router.patch("/notifications/read-all", authenticate, notificationController.markAllRead);

export default router;