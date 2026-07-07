import { useQuery } from "@tanstack/react-query";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

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

interface UpdateProfileData {
  name?: string;
  image?: File;
}

interface UpdateProfileResponse {
  message: string;
  user: {
    id: string;
    email: string;
    name: string;
    imageUrl: string | null;
    isVerified: boolean;
  };
}

export function useUpdateProfile() {
  const queryClient = useQueryClient();
  const setUser = useAuthStore((state) => state.setUser);

  return useMutation<UpdateProfileResponse, Error, UpdateProfileData>({
    mutationFn: async (data: UpdateProfileData) => {
      const formData = new FormData();
      if (data.name) formData.append("name", data.name);
      if (data.image) formData.append("image", data.image);

      return api<UpdateProfileResponse>("/profile", {
        method: "PUT",
        body: formData, // automatically handled as multipart/form-data
      });
    },
    onSuccess: (data) => {
      // Update Zustand store with new user data
      setUser(data.user);
      // Invalidate profile query to refetch
      queryClient.invalidateQueries({ queryKey: ["profile"] });
      toast.success(data.message || "Profile updated successfully!");
    },
    onError: (error) => {
      toast.error(error.message || "Failed to update profile");
    },
  });
}
