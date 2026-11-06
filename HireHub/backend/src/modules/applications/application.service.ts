import { Application, ApplicationStatus } from "../../models/Application";
import { Job } from "../../models/Job";
import { Company } from "../../models/Company";
import { Notification } from "../../models/Notification";

export async function applyToJob(candidateId: string, jobId: string, data: { resumeUrl?: string; coverLetter?: string }) {
  const job = await Job.findById(jobId);
  if (!job || job.status !== "published") {
    const err = new Error("Job not available") as Error & { statusCode: number };
    err.statusCode = 404;
    throw err;
  }
  const company = await Company.findById(job.companyId);
  if (!company) throw new Error("Company not found");

  const existing = await Application.findOne({ jobId, candidateId });
  if (existing) {
    const err = new Error("Already applied to this job") as Error & { statusCode: number };
    err.statusCode = 409;
    throw err;
  }

  const application = await Application.create({
    jobId,
    candidateId,
    companyId: company._id,
    resumeUrl: data.resumeUrl || undefined,
    coverLetter: data.coverLetter || "",
    status: "applied",
    statusHistory: [{ status: "applied", changedBy: candidateId as unknown as import("mongoose").Types.ObjectId, changedAt: new Date() }],
  });

  // notify employer
  await Notification.create({
    userId: company.ownerId,
    title: "New application received",
    message: `A candidate applied to ${job.title}`,
    type: "application_received",
  });

  return application;
}

export async function getMyApplications(candidateId: string) {
  return Application.find({ candidateId })
    .populate("jobId", "title location")
    .populate("companyId", "name logo")
    .sort({ createdAt: -1 });
}

export async function getApplicationById(id: string, userId: string, role: string) {
  const app = await Application.findById(id)
    .populate("jobId", "title location")
    .populate("companyId", "name logo ownerId")
    .populate("candidateId", "name email avatar");
  if (!app) return null;
  // authorization
  if (role === "candidate" && app.candidateId._id.toString() !== userId) return null;
  if (role === "employer") {
    const company = app.companyId as unknown as { ownerId: { toString: () => string } };
    if (company.ownerId.toString() !== userId) return null;
  }
  return app;
}

export async function getJobApplicants(jobId: string, ownerId: string) {
  const job = await Job.findById(jobId);
  if (!job) return null;
  const company = await Company.findById(job.companyId);
  if (!company || company.ownerId.toString() !== ownerId) return null;
  return Application.find({ jobId })
    .populate("candidateId", "name email avatar")
    .sort({ createdAt: -1 });
}

export async function updateApplicationStatus(id: string, ownerId: string, status: string, note?: string) {
  const app = await Application.findById(id);
  if (!app) {
    const err = new Error("Application not found") as Error & { statusCode: number };
    err.statusCode = 404;
    throw err;
  }
  const company = await Company.findById(app.companyId);
  if (!company || company.ownerId.toString() !== ownerId) {
    const err = new Error("Not authorized") as Error & { statusCode: number };
    err.statusCode = 403;
    throw err;
  }
  app.status = status as ApplicationStatus;
  app.statusHistory.push({ status: status as ApplicationStatus, changedBy: company.ownerId, changedAt: new Date(), note });
  await app.save();

  await Notification.create({
    userId: app.candidateId,
    title: "Application status updated",
    message: `Your application status changed to ${status}`,
    type: "status_update",
  });

  return app;
}

export async function withdrawApplication(id: string, candidateId: string) {
  const app = await Application.findById(id);
  if (!app || app.candidateId.toString() !== candidateId) {
    const err = new Error("Application not found") as Error & { statusCode: number };
    err.statusCode = 404;
    throw err;
  }
  if (app.status === "hired" || app.status === "rejected") {
    const err = new Error("Cannot withdraw at this stage") as Error & { statusCode: number };
    err.statusCode = 400;
    throw err;
  }
  app.status = "withdrawn";
  app.statusHistory.push({ status: "withdrawn", changedBy: app.candidateId, changedAt: new Date() });
  await app.save();
  return app;
}