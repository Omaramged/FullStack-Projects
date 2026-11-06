import { apiFetch } from "./api";

export interface Job {
  _id: string;
  companyId: { _id: string; name: string; logo?: string; location?: string } | string;
  title: string;
  description: string;
  responsibilities?: string;
  requirements?: string;
  skills?: string[];
  category?: string;
  employmentType?: string;
  experienceLevel?: string;
  workplaceType?: string;
  location?: string;
  salaryMin?: number;
  salaryMax?: number;
  salaryCurrency?: string;
  benefits?: string;
  status?: string;
  applicationDeadline?: string;
  createdAt?: string;
}

export interface JobsResponse {
  success: boolean;
  data: {
    items: Job[];
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

export async function listJobs(params: Record<string, string | number | undefined> = {}) {
  const qs = new URLSearchParams();
  Object.entries(params).forEach(([k, v]) => {
    if (v !== undefined && v !== "") qs.set(k, String(v));
  });
  return apiFetch<JobsResponse>(`/jobs?${qs.toString()}`);
}

export async function getJob(id: string) {
  return apiFetch<{ success: boolean; data: Job }>(`/jobs/${id}`);
}

export async function createJob(data: Record<string, unknown>) {
  return apiFetch("/jobs", { method: "POST", body: JSON.stringify(data) });
}

export async function updateJob(id: string, data: Record<string, unknown>) {
  return apiFetch(`/jobs/${id}`, { method: "PATCH", body: JSON.stringify(data) });
}

export async function deleteJob(id: string) {
  return apiFetch(`/jobs/${id}`, { method: "DELETE" });
}

export async function setJobStatus(id: string, status: string) {
  return apiFetch(`/jobs/${id}/status`, { method: "PATCH", body: JSON.stringify({ status }) });
}

export async function myJobs() {
  return apiFetch<{ success: boolean; data: Job[] }>("/jobs/employer/mine");
}