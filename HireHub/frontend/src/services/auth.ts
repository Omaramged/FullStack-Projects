import { apiFetch } from "./api";

export interface AuthUser {
  id: string;
  name: string;
  email: string;
  role: "candidate" | "employer" | "admin";
}

export async function register(input: {
  name: string;
  email: string;
  password: string;
  role: "candidate" | "employer";
}) {
  return apiFetch<{ success: boolean; data: AuthUser }>("/auth/register", {
    method: "POST",
    body: JSON.stringify(input),
  });
}

export async function login(email: string, password: string) {
  return apiFetch<{ success: boolean; data: AuthUser }>("/auth/login", {
    method: "POST",
    body: JSON.stringify({ email, password }),
  });
}

export async function logout() {
  return apiFetch("/auth/logout", { method: "POST" });
}

export async function me() {
  return apiFetch<{ success: boolean; data: AuthUser | null }>("/auth/me");
}

export async function forgotPassword(email: string) {
  return apiFetch("/auth/forgot-password", {
    method: "POST",
    body: JSON.stringify({ email }),
  });
}

export async function resetPassword(token: string, password: string) {
  return apiFetch("/auth/reset-password", {
    method: "POST",
    body: JSON.stringify({ token, password }),
  });
}

export async function verifyEmail(token: string) {
  return apiFetch("/auth/verify-email", {
    method: "POST",
    body: JSON.stringify({ token }),
  });
}