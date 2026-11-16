import { Request, Response } from "express";
import { AuthenticatedRequest } from "../../middleware/authenticate";
import { asyncHandler } from "../../utils/asyncHandler";
import { successResponse } from "../../utils/apiResponse";
import { authorize } from "../../middleware/authorize";
import * as adminService from "./admin.service";

export const stats = [authorize("admin"), asyncHandler(async (_req: AuthenticatedRequest, res: Response) => {
  const s = await adminService.getStats(); res.status(200).json(successResponse(s));
})];
export const users = [authorize("admin"), asyncHandler(async (_req: AuthenticatedRequest, res: Response) => {
  const u = await adminService.listUsers(); res.status(200).json(successResponse(u));
})];
export const events = [authorize("admin"), asyncHandler(async (_req: AuthenticatedRequest, res: Response) => {
  const e = await adminService.listEvents(); res.status(200).json(successResponse(e));
})];
export const deleteUser = [authorize("admin"), asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
  const id = req.params.id as string; await adminService.deleteUser(id); res.status(200).json(successResponse(null, "User deleted"));
})];
export const deleteEvent = [authorize("admin"), asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
  const id = req.params.id as string; await adminService.deleteEvent(id); res.status(200).json(successResponse(null, "Event deleted"));
})];