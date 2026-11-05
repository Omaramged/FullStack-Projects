import { Request, Response } from "express";
import { AuthenticatedRequest } from "../../middleware/authenticate";
import { asyncHandler } from "../../utils/asyncHandler";
import { successResponse } from "../../utils/apiResponse";
import { env } from "../../config/env";
import * as authService from "./auth.service";
import { registerSchema, loginSchema, forgotPasswordSchema, resetPasswordSchema, verifyEmailSchema } from "./auth.validation";
import { validate } from "../../middleware/validate";

const cookieOptions = {
  httpOnly: true,
  secure: env.NODE_ENV === "production",
  sameSite: env.NODE_ENV === "production" ? ("none" as const) : ("lax" as const),
  path: "/",
};

function setAuthCookies(res: Response, accessToken: string, refreshToken: string): void {
  res.cookie("accessToken", accessToken, { ...cookieOptions, maxAge: 15 * 60 * 1000 });
  res.cookie("refreshToken", refreshToken, { ...cookieOptions, maxAge: 7 * 24 * 60 * 60 * 1000 });
}

function clearAuthCookies(res: Response): void {
  res.clearCookie("accessToken", cookieOptions);
  res.clearCookie("refreshToken", cookieOptions);
}

export const register = [
  validate(registerSchema),
  asyncHandler(async (req: Request, res: Response) => {
    const { user, accessToken, refreshToken } = await authService.registerUser(req.body);
    setAuthCookies(res, accessToken, refreshToken);
    res.status(201).json(successResponse({ id: user._id, name: user.name, email: user.email, role: user.role }, "Registered"));
  }),
];

export const login = [
  validate(loginSchema),
  asyncHandler(async (req: Request, res: Response) => {
    const { user, accessToken, refreshToken } = await authService.loginUser(req.body.email, req.body.password);
    setAuthCookies(res, accessToken, refreshToken);
    res.status(200).json(successResponse({ id: user._id, name: user.name, email: user.email, role: user.role }, "Logged in"));
  }),
];

export const logout = asyncHandler(async (_req: Request, res: Response) => {
  clearAuthCookies(res);
  res.status(200).json(successResponse(null, "Logged out"));
});

export const me = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
  const user = await (await import("../../models/User")).User.findById(req.user!.id).select("-password");
  res.status(200).json(successResponse(user));
});

export const verifyEmail = [
  validate(verifyEmailSchema),
  asyncHandler(async (req: Request, res: Response) => {
    const user = await authService.verifyEmailToken(req.body.token);
    res.status(200).json(successResponse({ id: user._id, emailVerified: user.emailVerified }, "Email verified"));
  }),
];

export const forgotPassword = [
  validate(forgotPasswordSchema),
  asyncHandler(async (req: Request, res: Response) => {
    await authService.requestPasswordReset(req.body.email);
    res.status(200).json(successResponse(null, "If the email exists, a reset link has been sent"));
  }),
];

export const resetPassword = [
  validate(resetPasswordSchema),
  asyncHandler(async (req: Request, res: Response) => {
    await authService.resetPassword(req.body.token, req.body.password);
    res.status(200).json(successResponse(null, "Password reset successful"));
  }),
];

export const refresh = asyncHandler(async (req: Request, res: Response) => {
  const token = req.cookies?.refreshToken as string | undefined;
  if (!token) {
    res.status(401).json({ success: false, message: "No refresh token" });
    return;
  }
  try {
    const { verifyRefreshToken, signAccessToken, signRefreshToken } = await import("../../utils/jwt");
    const payload = verifyRefreshToken(token);
    const user = await (await import("../../models/User")).User.findById(payload.sub);
    if (!user) {
      res.status(401).json({ success: false, message: "User not found" });
      return;
    }
    const accessToken = signAccessToken({ sub: user._id.toString(), role: user.role });
    const refreshToken = signRefreshToken(user._id.toString());
    setAuthCookies(res, accessToken, refreshToken);
    res.status(200).json(successResponse(null, "Token refreshed"));
  } catch {
    res.status(401).json({ success: false, message: "Invalid refresh token" });
  }
});