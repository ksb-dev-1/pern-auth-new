import { useRouter } from "next/navigation";

import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";

import { apiFetch } from "@/lib/api";

interface SignupData {
  name?: string;
  email: string;
  password: string;
}

interface SignupResponse {
  message: string;
}

export function useSignup() {
  const router = useRouter();

  return useMutation<SignupResponse, Error, SignupData>({
    mutationFn: (data) =>
      apiFetch<SignupResponse>("/auth/signup", {
        method: "POST",
        body: JSON.stringify(data),
      }),
    onSuccess: () => {
      toast.success("Account created! Please verify your email.");
      router.push("/verify-email");
    },
    onError: (error: Error) => {
      toast.error(error.message || "Sign up failed");
    },
  });
}
