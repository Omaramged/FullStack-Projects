import { Request, Response } from "express";
import { AuthenticatedRequest } from "../../middleware/authenticate";
import { asyncHandler } from "../../utils/asyncHandler";
import { successResponse } from "../../utils/apiResponse";
import { validate } from "../../middleware/validate";
import { env } from "../../config/env";
import * as authService from "./auth.service";
import { registerSchema, loginSchema } from "./auth.validation";

const cookieOptions = { httpOnly: true, secure: env.NODE_ENV === "production", sameSite: env.NODE_ENV === "production" ? ("none" as const) : ("lax" as const), path: "/" };
function setAuthCookies(res: Response, accessToken: string, refreshToken: string) {
  res.cookie("accessToken", accessToken, { ...cookieOptions, maxAge: 15 * 60 * 1000 });
  res.cookie("refreshToken", refreshToken, { ...cookieOptions, maxAge: 7 * 24 * 60 * 60 * 1000 });
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
  res.clearCookie("accessToken", cookieOptions);
  res.clearCookie("refreshToken", cookieOptions);
  res.status(200).json(successResponse(null, "Logged out"));
});
export const me = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
  const { User } = await import("../../models/User");
  const user = await User.findById(req.user!.id).select("-password");
  res.status(200).json(successResponse(user));
});