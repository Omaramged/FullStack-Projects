import { Request, Response } from "express";
import { AuthenticatedRequest } from "../../middleware/authenticate";
import { asyncHandler } from "../../utils/asyncHandler";
import { successResponse } from "../../utils/apiResponse";
import { validate } from "../../middleware/validate";
import { authorize } from "../../middleware/authorize";
import * as applicationService from "./application.service";
import { createApplicationSchema, updateStatusSchema } from "./application.validation";

export const apply = [
  authorize("candidate"),
  validate(createApplicationSchema),
  asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
    const app = await applicationService.applyToJob(req.user!.id, req.params.jobId as string, req.body);
    res.status(201).json(successResponse(app, "Application submitted"));
  }),
];

export const myApplications = [
  authorize("candidate"),
  asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
    const apps = await applicationService.getMyApplications(req.user!.id);
    res.status(200).json(successResponse(apps));
  }),
];

export const getById = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
  const app = await applicationService.getApplicationById(req.params.id as string, req.user!.id, req.user!.role);
  if (!app) {
    res.status(404).json({ success: false, message: "Application not found" });
    return;
  }
  res.status(200).json(successResponse(app));
});

export const jobApplicants = [
  authorize("employer"),
  asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
    const apps = await applicationService.getJobApplicants(req.params.jobId as string, req.user!.id);
    if (apps === null) {
      res.status(404).json({ success: false, message: "Job not found or not owned" });
      return;
    }
    res.status(200).json(successResponse(apps));
  }),
];

export const updateStatus = [
  authorize("employer"),
  validate(updateStatusSchema),
  asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
    const app = await applicationService.updateApplicationStatus(req.params.id as string, req.user!.id, req.body.status, req.body.note);
    res.status(200).json(successResponse(app, "Status updated"));
  }),
];

export const withdraw = [
  authorize("candidate"),
  asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
    const app = await applicationService.withdrawApplication(req.params.id as string, req.user!.id);
    res.status(200).json(successResponse(app, "Application withdrawn"));
  }),
];

