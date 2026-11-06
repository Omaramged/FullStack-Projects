import { apiFetch } from "./api";

export async function listSavedJobs() {
  return apiFetch<{ success: boolean; data: unknown[] }>("/saved-jobs");
}

export async function saveJob(jobId: string) {
  return apiFetch(`/saved-jobs/${jobId}`, { method: "POST" });
}

export async function unsaveJob(jobId: string) {
  return apiFetch(`/saved-jobs/${jobId}`, { method: "DELETE" });
}