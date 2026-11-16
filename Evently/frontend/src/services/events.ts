import { apiFetch } from "./api";
export interface Event { _id: string; title: string; description: string; coverImage?: string; category?: string; startDate?: string; endDate?: string; startTime?: string; endTime?: string; location?: string; meetingLink?: string; eventType?: string; capacity?: number; registrationDeadline?: string; status?: string; organizerId?: { _id: string; name: string } | string; }
export async function listEvents(params: Record<string, string | number | undefined> = {}) {
  const qs = new URLSearchParams();
  Object.entries(params).forEach(([k, v]) => { if (v !== undefined && v !== "") qs.set(k, String(v)); });
  return apiFetch<{ success: boolean; data: { items: Event[]; total: number; page: number; totalPages: number } }>(`/events?${qs.toString()}`);
}
export async function getEvent(id: string) { return apiFetch<{ success: boolean; data: Event }>(`/events/${id}`); }
export async function createEvent(data: Record<string, unknown>) { return apiFetch("/events", { method: "POST", body: JSON.stringify(data) }); }
export async function updateEvent(id: string, data: Record<string, unknown>) { return apiFetch(`/events/${id}`, { method: "PUT", body: JSON.stringify(data) }); }
export async function deleteEvent(id: string) { return apiFetch(`/events/${id}`, { method: "DELETE" }); }
export async function publishEvent(id: string, status: string) { return apiFetch(`/events/${id}`, { method: "PUT", body: JSON.stringify({ status }) }); }