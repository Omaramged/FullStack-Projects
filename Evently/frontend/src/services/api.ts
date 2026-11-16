const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:5001/api";
export class ApiError extends Error { status: number; constructor(m: string, s: number) { super(m); this.status = s; } }
export async function apiFetch<T>(path: string, options: RequestInit = {}): Promise<T> {
  const url = path.startsWith("http") ? path : `${API_URL}${path}`;
  const res = await fetch(url, { ...options, credentials: "include", headers: { "Content-Type": "application/json", ...(options.headers ?? {}) } });
  let data: unknown = null;
  try { data = await res.json(); } catch { data = null; }
  if (!res.ok) {
    const message = (data && typeof data === "object" && "message" in data && typeof (data as { message: unknown }).message === "string") ? (data as { message: string }).message : `Request failed with status ${res.status}`;
    throw new ApiError(message, res.status);
  }
  return data as T;
}