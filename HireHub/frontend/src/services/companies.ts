import { apiFetch } from "./api";

export async function getMyCompany() {
  return apiFetch<{ success: boolean; data: Record<string, unknown> | null }>("/companies/me");
}

export async function createCompany(data: Record<string, unknown>) {
  return apiFetch("/companies", { method: "POST", body: JSON.stringify(data) });
}

export async function updateCompany(id: string, data: Record<string, unknown>) {
  return apiFetch(`/companies/${id}`, { method: "PATCH", body: JSON.stringify(data) });
}

export async function getCompany(id: string) {
  return apiFetch<{ success: boolean; data: Record<string, unknown> }>(`/companies/${id}`);
}