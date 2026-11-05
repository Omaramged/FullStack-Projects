import { Request, Response, NextFunction } from "express";
import { verifyAccessToken } from "../utils/jwt";
import { User } from "../models/User";
import { errorResponse } from "../utils/apiResponse";

export interface AuthenticatedRequest extends Request {
  user?: {
    id: string;
    role: string;
  };
}

export async function authenticate(
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): Promise<void> {
  const token = req.cookies?.accessToken as string | undefined;
  if (!token) {
    res.status(401).json(errorResponse("Authentication required"));
    return;
  }
  try {
    const payload = verifyAccessToken(token);
    const user = await User.findById(payload.sub).select("_id role");
    if (!user) {
      res.status(401).json(errorResponse("User not found"));
      return;
    }
    req.user = { id: user._id.toString(), role: user.role };
    next();
  } catch {
    res.status(401).json(errorResponse("Invalid or expired token"));
  }
}