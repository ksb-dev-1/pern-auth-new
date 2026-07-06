import { Suspense } from "react";

import { Metadata } from "next";

import { LoadingFallback } from "@/components/loading-fallback";

import { ResetPasswordForm } from "./reset-password-form";

export const metadata: Metadata = {
  title: "Reset Password - Shortly",
  description: "Create a new password to securely access your Shortly account.",
};

export default function ResetPasswordPage() {
  return (
    <Suspense fallback={<LoadingFallback color="text-brand" />}>
      <ResetPasswordForm />
    </Suspense>
  );
}
