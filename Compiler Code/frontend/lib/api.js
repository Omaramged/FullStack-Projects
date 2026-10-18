const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

export function saveToken(token) {
  localStorage.setItem("token", token);
}

export function getToken() {
  return localStorage.getItem("token");
}

export function saveUser(user) {
  localStorage.setItem("user", JSON.stringify(user));
}

export function getUser() {
  return JSON.parse(localStorage.getItem("user") || "null");
}

export function logout() {
  localStorage.removeItem("token");
  localStorage.removeItem("user");
}

export async function api(path, options = {}) {
  let res;
  const token = getToken();

  res = await fetch(`${API_URL}${path}`, {
    method: options.method || "GET",
    headers: {
      "Content-Type": "application/json",
      ...(token && { Authorization: `Bearer ${token}` }),
    },
    body: options.body ? JSON.stringify(options.body) : undefined,
  });

  let data = null;

  try {
    data = await res.json();
  } catch (err) {
    data = null;
  }

  if (!res.ok) {
    if (res.status === 401 && typeof window !== "undefined" && path !== "/api/auth/login") {
      logout();
      window.location.href = "/login";
      throw new Error(data?.error || "Please log in first");
    }

    throw new Error(data?.error || "Something went wrong, please try again");
  }

  return data;
}
