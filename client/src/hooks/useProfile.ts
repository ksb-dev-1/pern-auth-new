import { useQuery } from "@tanstack/react-query";

import { useAuthStore } from "@/store/auth-store";

const API_BASE = process.env.NEXT_PUBLIC_API_URL!;

export function useProfile() {
  const accessToken = useAuthStore((state) => state.accessToken); // get token from store

  return useQuery({
    queryKey: ["profile"],
    queryFn: async () => {
      const res = await fetch(`${API_BASE}/profile`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
        credentials: "include",
      });

      // Handle token expiration (optional)
      if (res.status === 401) {
        // Try refresh
        const refreshRes = await fetch(`${API_BASE}/auth/refresh`, {
          method: "POST",
          credentials: "include",
        });

        if (!refreshRes.ok) {
          throw new Error("Session expired. Please login again.");
        }

        const refreshData = await refreshRes.json();
        useAuthStore.getState().setToken(refreshData.accessToken);

        // Retry original request
        const retryRes = await fetch(`${API_BASE}/profile`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${refreshData.accessToken}`,
          },
          credentials: "include",
        });

        if (!retryRes.ok) {
          throw new Error("Failed to fetch profile after refresh");
        }

        return retryRes.json();
      }

      if (!res.ok) {
        const error = await res.json();
        throw new Error(error?.error || "Failed to fetch profile");
      }

      return res.json();
    },
    enabled: !!accessToken,
  });
}
