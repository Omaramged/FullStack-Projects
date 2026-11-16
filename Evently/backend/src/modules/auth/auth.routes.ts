import { Router } from "express";
import { authenticate } from "../../middleware/authenticate";
import * as authController from "./auth.controller";
const router = Router();
router.post("/register", ...authController.register);
router.post("/login", ...authController.login);
router.post("/logout", authController.logout);
router.get("/me", authenticate, authController.me);
export default router;