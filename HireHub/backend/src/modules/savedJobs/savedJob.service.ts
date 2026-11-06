import { SavedJob } from "../../models/SavedJob";
import { Job } from "../../models/Job";

export async function saveJob(candidateId: string, jobId: string) {
  const job = await Job.findById(jobId);
  if (!job) {
    const err = new Error("Job not found") as Error & { statusCode: number };
    err.statusCode = 404;
    throw err;
  }
  try {
    return await SavedJob.create({ candidateId, jobId });
  } catch (e: unknown) {
    const err = new Error("Already saved") as Error & { statusCode: number };
    err.statusCode = 409;
    throw err;
  }
}

export async function unsaveJob(candidateId: string, jobId: string) {
  await SavedJob.deleteOne({ candidateId, jobId });
}

export async function listSavedJobs(candidateId: string) {
  const saved = await SavedJob.find({ candidateId }).populate({
    path: "jobId",
    populate: { path: "companyId", select: "name logo" },
  });
  return saved;
}