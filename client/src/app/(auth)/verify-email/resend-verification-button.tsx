"use client";

import { useState } from "react";

import { ActionButton } from "@/components/action-button";

export function ResendVerificationButton({ email }: { email: string }) {
  const [isLoading, setIsLoading] = useState(false);
  const [success, setSuccess] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function resendVerificationEmail() {}

  return (
    <div className="space-y-4">
      {success && (
        <div role="status" className="text-sm text-green-600">
          {success}
        </div>
      )}
      {error && (
        <div role="alert" className="text-sm text-red-600">
          {error}
        </div>
      )}

      <ActionButton
        onClick={resendVerificationEmail}
        loading={isLoading}
        className="w-full"
      >
        Resend verification email
      </ActionButton>
    </div>
  );
}
