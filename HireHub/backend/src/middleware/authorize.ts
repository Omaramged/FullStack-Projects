import { Response, NextFunction } from "express";
import { AuthenticatedRequest } from "./authenticate";
import { errorResponse } from "../utils/apiResponse";

export function authorize(...roles: string[]) {
  return (req: AuthenticatedRequest, res: Response, next: NextFunction): void => {
    if (!req.user) {
      res.status(401).json(errorResponse("Authentication required"));
      return;
    }
    if (!roles.includes(req.user.role)) {
      res.status(403).json(errorResponse("Forbidden"));
      return;
    }
    next();
  };
}