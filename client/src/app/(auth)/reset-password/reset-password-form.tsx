"use client";

import { useState } from "react";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

import { ActionButton } from "@/components/action-button";
import { CustomLink } from "@/components/custom-link";
import { Alert } from "@/components/ui/alert";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { ROUTES } from "@/constants/routes";
import { useResetPassword } from "@/hooks/useAuth";
import { type ResetPasswordType, resetPasswordSchema } from "@/lib/validation";

export function ResetPasswordForm({ token }: { token: string }) {
  const [error, setError] = useState<string | null>(null);
  const resetPassword = useResetPassword();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ResetPasswordType>({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: {
      newPassword: "",
      passwordConfirmation: "",
    },
  });

  const onSubmit = async (data: ResetPasswordType) => {
    setError(null);

    try {
      await resetPassword.mutateAsync({ token, newPassword: data.newPassword });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Reset failed");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <Card className="max-w-sm w-full mx-auto">
        <CardHeader>
          <CardTitle className="text-lg font-bold">Reset Password</CardTitle>
          <CardDescription>Enter your new password below.</CardDescription>
        </CardHeader>
        <CardContent>
          {error && (
            <Alert variant="error" className="mb-4">
              {error}
            </Alert>
          )}
          <form onSubmit={handleSubmit(onSubmit)}>
            <FieldGroup>
              <Field>
                <FieldLabel htmlFor="newPassword">New Password</FieldLabel>
                <Input
                  id="newPassword"
                  type="password"
                  placeholder="New password"
                  {...register("newPassword")}
                  aria-invalid={!!errors.newPassword}
                />
                {errors.newPassword && (
                  <FieldError errors={[errors.newPassword]} />
                )}
              </Field>
              <Field>
                <FieldLabel htmlFor="passwordConfirmation">
                  Confirm Password
                </FieldLabel>

                <Input
                  id="passwordConfirmation"
                  type="password"
                  placeholder="Confirm new password"
                  {...register("passwordConfirmation")}
                  aria-invalid={!!errors.passwordConfirmation}
                />

                {errors.passwordConfirmation && (
                  <FieldError errors={[errors.passwordConfirmation]} />
                )}
              </Field>
            </FieldGroup>
            <ActionButton
              loading={resetPassword.isPending}
              className="w-full mt-4"
            >
              Reset Password
            </ActionButton>
          </form>
        </CardContent>
        <CardFooter>
          <div className="flex w-full justify-center">
            <p className="text-muted-foreground text-center text-sm">
              Remember your password?{" "}
              <CustomLink
                href={ROUTES.SIGN_IN}
                className="text-brand hover:underline"
              >
                Sign in
              </CustomLink>
            </p>
          </div>
        </CardFooter>
      </Card>
    </div>
  );
}
