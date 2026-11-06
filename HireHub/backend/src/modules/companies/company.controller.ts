import { Request, Response } from "express";
import { AuthenticatedRequest } from "../../middleware/authenticate";
import { asyncHandler } from "../../utils/asyncHandler";
import { successResponse } from "../../utils/apiResponse";
import { validate } from "../../middleware/validate";
import * as companyService from "./company.service";
import { createCompanySchema, updateCompanySchema } from "./company.validation";
import { authorize } from "../../middleware/authorize";

export const create = [
  authorize("employer"),
  validate(createCompanySchema),
  asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
    const company = await companyService.createCompany(req.user!.id, req.body);
    res.status(201).json(successResponse(company, "Company created"));
  }),
];

export const getMine = [
  authorize("employer"),
  asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
    const company = await companyService.getCompanyByOwner(req.user!.id);
    res.status(200).json(successResponse(company));
  }),
];

export const getById = asyncHandler(async (req: Request, res: Response) => {
  const company = await companyService.getCompanyById(req.params.id as string);
  if (!company) {
    res.status(404).json({ success: false, message: "Company not found" });
    return;
  }
  res.status(200).json(successResponse(company));
});

export const update = [
  authorize("employer"),
  validate(updateCompanySchema),
  asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
    const company = await companyService.updateCompany(req.params.id as string, req.user!.id, req.body);
    res.status(200).json(successResponse(company, "Company updated"));
  }),
];

export const remove = [
  authorize("employer"),
  asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
    await companyService.deleteCompany(req.params.id as string, req.user!.id);
    res.status(200).json(successResponse(null, "Company deleted"));
  }),
];