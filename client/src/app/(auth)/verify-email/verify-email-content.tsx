"use client";

import { useEffect } from "react";

import { useRouter, useSearchParams } from "next/navigation";

import { LoadingFallback } from "@/components/loading-fallback";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { ROUTES } from "@/constants/routes";
import { useVerifyEmail } from "@/hooks/useAuth";
import { useAuthStore } from "@/store/auth-store";

import { ResendVerificationButton } from "./resend-verification-button";

export function VerifyEmailContent() {
  const searchParams = useSearchParams();
  const token = searchParams.get("token");
  const verify = useVerifyEmail();
  const user = useAuthStore((state) => state.user);
  const userEmail = user?.email;
  const router = useRouter();

  // 🔁 Trigger verification when token is present
  useEffect(() => {
    if (token) {
      verify.mutate(token);
    }
  }, [token]);

  // Redirect if no token and no user
  useEffect(() => {
    if (!token && !userEmail) {
      router.push(ROUTES.SIGN_IN);
    }
  }, [token, userEmail]);

  // ----- Case: No token (post-signup page) -----
  if (!token) {
    if (!userEmail) return null; // will redirect

    return (
      <div className="min-h-screen flex flex-col items-center justify-center text-center px-4">
        <Card className="max-w-sm w-full mx-auto">
          <CardHeader>
            <p className="font-bold text-xl text-green-600 dark:text-green-400">
              Verify your email
            </p>
          </CardHeader>
          <CardContent>
            A verification email has been sent to your inbox. If you don&apos;t
            receive it within 5 minutes, you can try again by clicking the
            button below.
          </CardContent>
          <CardFooter>
            <div className="w-full">
              <ResendVerificationButton email={userEmail} />
            </div>
          </CardFooter>
        </Card>
      </div>
    );
  }

  // ----- Case: Token present (verification flow) -----
  // Show loading while pending or idle (first render)
  if (verify.isPending || verify.status === "idle") {
    return <LoadingFallback color="text-brand" />;
  }

  if (verify.isSuccess) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Card className="max-w-sm w-full">
          <CardHeader>
            <h2 className="text-xl font-bold text-green-600">
              ✅ Email Verified
            </h2>
          </CardHeader>
          <CardContent>
            <p className="text-center">
              Your email has been verified. You will be redirected to sign in
              shortly.
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (verify.isError) {
    if (!userEmail) return null;

    return (
      <div className="min-h-screen flex items-center justify-center">
        <Card className="max-w-sm w-full">
          <CardHeader>
            <h2 className="text-xl font-bold text-red-600 dark:text-red-400">
              ❌ Email verification Failed
            </h2>
          </CardHeader>
          <CardContent>
            <p className="mb-4">
              {verify.error?.message || "Invalid or expired token"}
            </p>
            <p className="text-sm text-muted-foreground">
              You can request a new verification link by clicking below.
            </p>
          </CardContent>
          <CardFooter>
            <div className="w-full">
              <ResendVerificationButton email={userEmail} />
            </div>
          </CardFooter>
        </Card>
      </div>
    );
  }

  return null;
}
