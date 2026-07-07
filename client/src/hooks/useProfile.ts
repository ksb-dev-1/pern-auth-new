import { useQuery } from "@tanstack/react-query";

import { api } from "@/lib/api";
import { useAuthStore } from "@/store/auth-store";

export function useProfile() {
  const accessToken = useAuthStore((state) => state.accessToken);

  return useQuery({
    queryKey: ["profile"],
    queryFn: () => api("/profile"),
    enabled: !!accessToken,
  });
}
