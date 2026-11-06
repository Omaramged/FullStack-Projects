import { apiFetch } from "./api";

export async function listNotifications() {
  return apiFetch<{ success: boolean; data: unknown[] }>("/notifications");
}

export async function markNotificationRead(id: string) {
  return apiFetch(`/notifications/${id}/read`, { method: "PATCH" });
}

export async function markAllNotificationsRead() {
  return apiFetch("/notifications/read-all", { method: "PATCH" });
}