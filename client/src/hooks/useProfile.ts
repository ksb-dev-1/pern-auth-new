import { useQuery } from "@tanstack/react-query";

import { api } from "@/lib/api";
import { useAuthStore } from "@/store/auth-store";

type Profile = {
  id: string;
  name: string;
  email: string;
  imageUrl?: string;
  isVerified: boolean;
};

export function useProfile() {
  const accessToken = useAuthStore((state) => state.accessToken);

  return useQuery({
    queryKey: ["profile"],
    queryFn: () => api<Profile>("/profile"),
    enabled: !!accessToken,
  });
}
