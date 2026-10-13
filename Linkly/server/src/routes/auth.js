import express from "express";
import { register, login, logout, me, updateMe } from "../controllers/authController.js";
import auth from "../middleware/auth.js";

const router = express.Router();

router.post("/register", register);
router.post("/login", login);
router.post("/logout", logout);
router.get("/me", auth, me);
router.patch("/me", auth, updateMe);

export default router;
