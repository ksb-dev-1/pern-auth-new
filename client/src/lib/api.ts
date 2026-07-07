import { useAuthStore } from "@/store/auth-store";

const API_BASE = process.env.NEXT_PUBLIC_API_URL!;

export async function api<T>(
  endpoint: string,
  options: RequestInit = {},
): Promise<T> {
  // Get token and ensure it's not null
  const currentToken = useAuthStore.getState().accessToken;

  if (!currentToken) {
    throw new Error("Not authenticated");
  }

  let token: string = currentToken; // now token is definitely string

  // Helper to build headers
  const buildHeaders = (t: string): HeadersInit => ({
    "Content-Type": "application/json",
    ...options.headers,
    Authorization: `Bearer ${t}`,
  });

  // First attempt
  let res = await fetch(`${API_BASE}${endpoint}`, {
    ...options,
    headers: buildHeaders(token),
    credentials: "include",
  });

  // If 401, try refresh once
  if (res.status === 401) {
    const refreshRes = await fetch(`${API_BASE}/auth/refresh`, {
      method: "POST",
      credentials: "include",
    });

    if (refreshRes.ok) {
      const { accessToken } = await refreshRes.json();

      if (!accessToken) {
        throw new Error("Refresh failed: no token returned");
      }
      // Update store
      useAuthStore.getState().setToken(accessToken);
      token = accessToken; // token is now the new string

      // Retry original request
      res = await fetch(`${API_BASE}${endpoint}`, {
        ...options,
        headers: buildHeaders(token),
        credentials: "include",
      });
    } else {
      useAuthStore.getState().clearAuth();

      window.location.href = "/signin";

      throw new Error("Session expired. Please sign in again.");
    }
  }

  // Handle other errors
  const data = await res.json();

  if (!res.ok) {
    throw new Error(data?.error || `Request failed with status ${res.status}`);
  }

  return data;
}
