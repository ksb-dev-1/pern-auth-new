"use client";

import { useState } from "react";

import { useSearchParams } from "next/navigation";

import { zodResolver } from "@hookform/resolvers/zod";
import { MoveLeft } from "lucide-react";
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

export function ResetPasswordForm() {
  const searchParams = useSearchParams();
  const token = searchParams.get("token");
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
    if (!token) return;

    setError(null);

    try {
      await resetPassword.mutateAsync({ token, newPassword: data.newPassword });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Reset failed");
    }
  };

  if (!token) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center text-center px-4">
        <Card className="max-w-sm w-full mx-auto">
          <CardHeader>
            <p className="font-bold text-xl text-red-600 dark:text-red-400">
              Token is missing!
            </p>
          </CardHeader>
          <CardContent>
            <p>
              You can’t reset your password without a valid token. Please
              request a new password reset link.
            </p>
          </CardContent>
          <CardFooter>
            <CustomLink
              href={ROUTES.SIGN_IN}
              className="text-brand underline flex items-center justify-center gap-2 w-full"
            >
              <MoveLeft size={12} /> Go back to send email
            </CustomLink>
          </CardFooter>
        </Card>
      </div>
    );
  }

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
                className="text-brand underline"
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
