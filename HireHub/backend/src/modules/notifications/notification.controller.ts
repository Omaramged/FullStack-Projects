import { Request, Response } from "express";
import { AuthenticatedRequest } from "../../middleware/authenticate";
import { asyncHandler } from "../../utils/asyncHandler";
import { successResponse } from "../../utils/apiResponse";
import * as notificationService from "./notification.service";

export const list = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
  const items = await notificationService.listNotifications(req.user!.id);
  res.status(200).json(successResponse(items));
});

export const markRead = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
  const n = await notificationService.markRead(req.params.id as string, req.user!.id);
  res.status(200).json(successResponse(n));
});

export const markAllRead = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
  await notificationService.markAllRead(req.user!.id);
  res.status(200).json(successResponse(null, "All marked as read"));
});