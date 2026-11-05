import { Router } from "express";
import { authenticate } from "../../middleware/authenticate";
import * as authController from "./auth.controller";

const router = Router();

router.post("/register", ...authController.register);
router.post("/login", ...authController.login);
router.post("/logout", authController.logout);
router.get("/me", authenticate, authController.me);
router.post("/verify-email", ...authController.verifyEmail);
router.post("/forgot-password", ...authController.forgotPassword);
router.post("/reset-password", ...authController.resetPassword);
router.post("/refresh", authController.refresh);

export default router;