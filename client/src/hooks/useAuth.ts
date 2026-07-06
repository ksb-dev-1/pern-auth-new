import { useRouter } from "next/navigation";

import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";

import { ROUTES } from "@/constants/routes";
import { useAuthStore } from "@/store/auth-store";

const API_BASE = process.env.NEXT_PUBLIC_API_URL!;

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
  const setUser = useAuthStore((state) => state.setUser);

  return useMutation<SignupResponse, Error, SignupData>({
    mutationFn: async (data) => {
      const res = await fetch(`${API_BASE}/auth/signup`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
        credentials: "include",
      });

      const json = await res.json();

      if (!res.ok) {
        throw new Error(json?.error || "Signup failed");
      }
      return json;
    },
    onSuccess: (data, variables) => {
      setUser({ email: variables.email });
      toast.success("Account created! Please verify your email.");
      router.push("/verify-email");
    },
    onError: (error) => {
      toast.error(error.message || "Sign up failed");
    },
  });
}

export function useVerifyEmail() {
  const router = useRouter();

  return useMutation({
    mutationFn: async (token: string) => {
      const res = await fetch(`${API_BASE}/auth/verify-email?token=${token}`, {
        method: "GET",
        credentials: "include",
      });

      const json = await res.json();

      if (!res.ok) {
        throw new Error(json?.error || "Verification failed");
      }
      return json;
    },
    onSuccess: () => {
      toast.success("Email verified successfully!");
      setTimeout(() => router.push(ROUTES.SIGN_IN), 2000);
    },
    onError: (error: Error) => {
      toast.error(error.message || "Verification failed");
    },
  });
}

export function useResendVerification() {
  return useMutation({
    mutationFn: async (email: string) => {
      const res = await fetch(`${API_BASE}/auth/resend-verification`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
        credentials: "include",
      });

      const json = await res.json();

      if (!res.ok) {
        throw new Error(json?.error || "Failed to resend verification email");
      }
      return json as { message: string };
    },
    onSuccess: (data) => {
      toast.success(data.message || "Verification email sent!");
    },
    onError: (error: Error) => {
      toast.error(error.message || "Could not resend verification email");
    },
  });
}
