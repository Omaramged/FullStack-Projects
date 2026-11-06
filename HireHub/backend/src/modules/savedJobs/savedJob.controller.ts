import { Request, Response } from "express";
import { AuthenticatedRequest } from "../../middleware/authenticate";
import { asyncHandler } from "../../utils/asyncHandler";
import { successResponse } from "../../utils/apiResponse";
import { authorize } from "../../middleware/authorize";
import * as savedJobService from "./savedJob.service";

export const save = [
  authorize("candidate"),
  asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
    const saved = await savedJobService.saveJob(req.user!.id, req.params.jobId as string);
    res.status(201).json(successResponse(saved, "Job saved"));
  }),
];

export const unsave = [
  authorize("candidate"),
  asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
    await savedJobService.unsaveJob(req.user!.id, req.params.jobId as string);
    res.status(200).json(successResponse(null, "Job unsaved"));
  }),
];

export const list = [
  authorize("candidate"),
  asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
    const saved = await savedJobService.listSavedJobs(req.user!.id);
    res.status(200).json(successResponse(saved));
  }),
];