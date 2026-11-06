import { Request, Response } from "express";
import { AuthenticatedRequest } from "../../middleware/authenticate";
import { asyncHandler } from "../../utils/asyncHandler";
import { successResponse } from "../../utils/apiResponse";
import { validate } from "../../middleware/validate";
import { authorize } from "../../middleware/authorize";
import * as jobService from "./job.service";
import { createJobSchema, updateJobSchema, jobQuerySchema } from "./job.validation";

export const list = [
  validate(jobQuerySchema, "query"),
  asyncHandler(async (req: Request, res: Response) => {
    const result = await jobService.listJobs(req.query as Record<string, unknown>);
    res.status(200).json(successResponse(result));
  }),
];

export const getById = asyncHandler(async (req: Request, res: Response) => {
  const job = await jobService.getJobById(req.params.id as string);
  if (!job) {
    res.status(404).json({ success: false, message: "Job not found" });
    return;
  }
  res.status(200).json(successResponse(job));
});

export const create = [
  authorize("employer"),
  validate(createJobSchema),
  asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
    const job = await jobService.createJob(req.user!.id, req.body);
    res.status(201).json(successResponse(job, "Job created"));
  }),
];

export const listMine = [
  authorize("employer"),
  asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
    // need companyId; find company by owner
    const { Company } = await import("../../models/Company");
    const company = await Company.findOne({ ownerId: req.user!.id });
    if (!company) {
      res.status(200).json(successResponse([]));
      return;
    }
    const jobs = await jobService.listJobsByCompany(company._id.toString(), req.user!.id);
    res.status(200).json(successResponse(jobs));
  }),
];

export const update = [
  authorize("employer"),
  validate(updateJobSchema),
  asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
    const job = await jobService.updateJob(req.params.id as string, req.user!.id, req.body);
    res.status(200).json(successResponse(job, "Job updated"));
  }),
];

export const remove = [
  authorize("employer"),
  asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
    await jobService.deleteJob(req.params.id as string, req.user!.id);
    res.status(200).json(successResponse(null, "Job deleted"));
  }),
];

export const setStatus = [
  authorize("employer"),
  asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
    const job = await jobService.setJobStatus(req.params.id as string, req.user!.id, req.body.status);
    res.status(200).json(successResponse(job, "Status updated"));
  }),
];