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
    onSuccess: (_data, variables) => {
      setUser({
        name: variables.name || null,
        email: variables.email,
      });
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

export function useSignin() {
  const router = useRouter();
  const setAuth = useAuthStore((state) => state.setAuth);

  return useMutation({
    mutationFn: async (data: { email: string; password: string }) => {
      const res = await fetch(`${API_BASE}/auth/signin`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
        credentials: "include", // sends refresh cookie
      });

      const json = await res.json();

      if (!res.ok) {
        throw new Error(json?.error || "Signin failed");
      }
      return json as {
        accessToken: string;
        user: { id: string; email: string; name?: string };
      };
    },
    onSuccess: (data) => {
      // Store token & user in Zustand (persisted to sessionStorage)
      setAuth(data.accessToken, data.user);
      toast.success("Welcome back!");
      router.push(ROUTES.HOME); // change to your desired route
    },
    onError: (error: Error) => {
      toast.error(error.message || "Invalid email or password");
    },
  });
}

export function useSignout() {
  const router = useRouter();
  const clearAuth = useAuthStore((state) => state.clearAuth);
  const accessToken = useAuthStore((state) => state.accessToken);

  return useMutation({
    mutationFn: async () => {
      const res = await fetch(`${API_BASE}/auth/logout`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`, // 👈 required
        },
        credentials: "include", // sends refresh token cookie
      });

      if (!res.ok) {
        const json = await res.json();
        throw new Error(json?.error || "Logout failed");
      }

      return await res.json();
    },
    onSuccess: () => {
      clearAuth();
      toast.success("Logged out successfully");
      router.push(ROUTES.SIGN_IN);
    },
    onError: (error) => {
      toast.error(error.message || "Failed to sign out");
      // Still clear local auth even if server fails (e.g., token expired)
      clearAuth();
      router.push(ROUTES.SIGN_IN);
    },
  });
}
