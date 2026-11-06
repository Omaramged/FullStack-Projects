import { Job, IJob } from "../../models/Job";
import { Company } from "../../models/Company";

async function ensureCompanyOwner(companyId: string, ownerId: string) {
  const company = await Company.findOne({ _id: companyId, ownerId });
  if (!company) {
    const err = new Error("Company not found or not owned") as Error & { statusCode: number };
    err.statusCode = 404;
    throw err;
  }
  return company;
}

export async function createJob(ownerId: string, data: Record<string, unknown>) {
  await ensureCompanyOwner(String(data.companyId), ownerId);
  return Job.create(data);
}

export async function getJobById(id: string) {
  return Job.findById(id).populate("companyId", "name logo location");
}

export async function listJobs(query: Record<string, unknown>) {
  const filter: Record<string, unknown> = {};
  if (query.status) filter.status = query.status;
  else filter.status = "published";

  if (query.location) filter.location = new RegExp(String(query.location), "i");
  if (query.category) filter.category = new RegExp(String(query.category), "i");
  if (query.employmentType) filter.employmentType = query.employmentType;
  if (query.experienceLevel) filter.experienceLevel = query.experienceLevel;
  if (query.workplaceType) filter.workplaceType = query.workplaceType;
  if (query.minSalary) filter.salaryMax = { $gte: Number(query.minSalary) };
  if (query.maxSalary) filter.salaryMin = { $lte: Number(query.maxSalary) };
  if (query.search) {
    filter.$text = { $search: String(query.search) };
  }

  const page = Number(query.page) || 1;
  const limit = Number(query.limit) || 10;
  const skip = (page - 1) * limit;
  const sort = query.sort === "oldest" ? { createdAt: 1 as const } : { createdAt: -1 as const };

  const [items, total] = await Promise.all([
    Job.find(filter).populate("companyId", "name logo location").sort(sort).skip(skip).limit(limit),
    Job.countDocuments(filter),
  ]);
  return { items, total, page, limit, totalPages: Math.ceil(total / limit) };
}

export async function listJobsByCompany(companyId: string, ownerId: string) {
  await ensureCompanyOwner(companyId, ownerId);
  return Job.find({ companyId }).sort({ createdAt: -1 });
}

export async function updateJob(id: string, ownerId: string, data: Record<string, unknown>) {
  const job = await Job.findById(id);
  if (!job) {
    const err = new Error("Job not found") as Error & { statusCode: number };
    err.statusCode = 404;
    throw err;
  }
  await ensureCompanyOwner(job.companyId.toString(), ownerId);
  Object.assign(job, data);
  await job.save();
  return job;
}

export async function deleteJob(id: string, ownerId: string) {
  const job = await Job.findById(id);
  if (!job) {
    const err = new Error("Job not found") as Error & { statusCode: number };
    err.statusCode = 404;
    throw err;
  }
  await ensureCompanyOwner(job.companyId.toString(), ownerId);
  if (job.status !== "draft") {
    const err = new Error("Only draft jobs can be deleted") as Error & { statusCode: number };
    err.statusCode = 400;
    throw err;
  }
  await job.deleteOne();
}

export async function setJobStatus(id: string, ownerId: string, status: string) {
  return updateJob(id, ownerId, { status });
}