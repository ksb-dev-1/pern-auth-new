"use client";

import { useEffect, useState } from "react";

import { useRouter } from "next/navigation";

import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm } from "react-hook-form";

import { ActionButton } from "@/components/action-button";
import { PasswordField } from "@/components/shared/password-field";
import { Alert } from "@/components/ui/alert";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { FieldGroup } from "@/components/ui/field";
import { ROUTES } from "@/constants/routes";
import { ResetPasswordType, resetPasswordSchema } from "@/lib/validation";

export function ResetPasswordForm({ token }: { token: string }) {
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const router = useRouter();

  const form = useForm<ResetPasswordType>({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: {
      newPassword: "",
      passwordConfirmation: "",
    },
  });

  useEffect(() => {
    form.reset(form.formState.defaultValues);
  }, [form]);

  async function onSubmit({ newPassword }: ResetPasswordType) {}

  const loading = form.formState.isSubmitting;

  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <Card className="max-w-sm w-full mx-auto">
        <CardHeader>
          <CardTitle className="text-lg font-bold">Reset Password</CardTitle>
          <CardDescription>
            Set a new password for your account.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {successMessage && (
            <Alert
              variant="success"
              className="mb-4 flex items-center flex-wrap"
            >
              {successMessage}
            </Alert>
          )}

          {errorMessage && (
            <Alert variant="error" className="mb-4 flex items-center flex-wrap">
              {errorMessage}
            </Alert>
          )}

          <form onSubmit={form.handleSubmit(onSubmit)}>
            <FieldGroup>
              <Controller
                name="newPassword"
                control={form.control}
                render={({ field, fieldState }) => (
                  <PasswordField
                    field={field}
                    fieldState={fieldState}
                    label="Password"
                    placeholder="Create a password"
                  />
                )}
              />

              <Controller
                name="passwordConfirmation"
                control={form.control}
                render={({ field, fieldState }) => (
                  <PasswordField
                    field={field}
                    fieldState={fieldState}
                    label="Confirm Password"
                    placeholder="Re-enter your password"
                  />
                )}
              />
            </FieldGroup>

            <ActionButton loading={loading} className="w-full mt-4">
              Send password reset link
            </ActionButton>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
