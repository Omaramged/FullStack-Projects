import express from "express";
import auth from "../middleware/auth.js";
import optionalAuth from "../middleware/optionalAuth.js";
import { createLink, listLinks, getLink, updateLink, deleteLink, setStatus, linkAnalytics } from "../controllers/linkController.js";

const router = express.Router();

router.post("/", optionalAuth, createLink);
router.get("/", auth, listLinks);
router.get("/:id", auth, getLink);
router.patch("/:id", auth, updateLink);
router.delete("/:id", auth, deleteLink);
router.patch("/:id/status", auth, setStatus);
router.get("/:id/analytics", auth, linkAnalytics);

export default router;
