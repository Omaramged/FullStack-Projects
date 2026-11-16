import { apiFetch } from "./api";
export async function register(input: { name: string; email: string; password: string; role?: string }) {
  return apiFetch<{ success: boolean; data: { id: string; name: string; email: string; role: string } }>("/auth/register", { method: "POST", body: JSON.stringify(input) });
}
export async function login(email: string, password: string) {
  return apiFetch<{ success: boolean; data: { id: string; name: string; email: string; role: string } }>("/auth/login", { method: "POST", body: JSON.stringify({ email, password }) });
}
export async function logout() { return apiFetch("/auth/logout", { method: "POST" }); }
export async function me() { return apiFetch<{ success: boolean; data: { id: string; name: string; email: string; role: string } | null }>("/auth/me"); }