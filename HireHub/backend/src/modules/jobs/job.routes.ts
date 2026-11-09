import { Router } from "express";
import { authenticate } from "../../middleware/authenticate";
import * as jobController from "./job.controller";

const router = Router();

router.get("/", jobController.list);
router.get("/employer/mine", authenticate, ...jobController.listMine);
router.get("/:id", jobController.getById);
router.post("/", authenticate, ...jobController.create);
router.patch("/:id", authenticate, ...jobController.update);
router.delete("/:id", authenticate, ...jobController.remove);
router.patch("/:id/status", authenticate, ...jobController.setStatus);

export default router;