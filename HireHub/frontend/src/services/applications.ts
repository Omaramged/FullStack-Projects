import { apiFetch } from "./api";

export async function applyToJob(jobId: string, data: { resumeUrl?: string; coverLetter?: string }) {
  return apiFetch(`/jobs/${jobId}/applications`, { method: "POST", body: JSON.stringify(data) });
}

export async function myApplications() {
  return apiFetch<{ success: boolean; data: unknown[] }>("/applications/me");
}

export async function getApplication(id: string) {
  return apiFetch<{ success: boolean; data: unknown }>(`/applications/${id}`);
}

export async function jobApplicants(jobId: string) {
  return apiFetch<{ success: boolean; data: unknown[] }>(`/employer/jobs/${jobId}/applications`);
}

export async function updateApplicationStatus(id: string, status: string, note?: string) {
  return apiFetch(`/applications/${id}/status`, { method: "PATCH", body: JSON.stringify({ status, note }) });
}

export async function withdrawApplication(id: string) {
  return apiFetch(`/applications/${id}`, { method: "DELETE" });
}