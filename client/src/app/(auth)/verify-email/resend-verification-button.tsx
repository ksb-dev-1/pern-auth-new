"use client";

import { ActionButton } from "@/components/action-button";
import { useResendVerificationEmail } from "@/hooks/useAuth";

export function ResendVerificationButton({ email }: { email: string }) {
  const resend = useResendVerificationEmail();

  async function resendVerificationEmail() {
    if (!email) {
      return;
    }
    await resend.mutateAsync(email);
  }

  return (
    <div className="space-y-4">
      {resend.isSuccess && (
        <div role="status" className="text-sm text-green-600">
          Verification email sent! Please check your inbox.
        </div>
      )}

      {resend.isError && (
        <div role="alert" className="text-sm text-red-600">
          {resend.error?.message || "Failed to resend verification email"}
        </div>
      )}

      <ActionButton
        onClick={resendVerificationEmail}
        loading={resend.isPending}
        className="w-full"
      >
        Resend verification email
      </ActionButton>
    </div>
  );
}
