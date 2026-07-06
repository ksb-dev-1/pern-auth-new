import { useRouter } from "next/navigation";

import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";

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

  return useMutation<SignupResponse, Error, SignupData>({
    mutationFn: async (data) => {
      const res = await fetch(`${API_BASE}/auth/signup`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
        credentials: "include", // sends refresh cookie (though signup doesn't need it yet)
      });

      const json = await res.json();

      if (!res.ok) {
        throw new Error(json?.error || "Signup failed");
      }
      return json;
    },
    onSuccess: () => {
      toast.success("Account created! Please verify your email.");
      router.push("/verify-email");
    },
    onError: (error: Error) => {
      toast.error(error.message || "Something went wrong");
    },
  });
}
