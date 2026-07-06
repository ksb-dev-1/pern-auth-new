"use client";

import { useEffect, useState } from "react";

import { useRouter, useSearchParams } from "next/navigation";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

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

const resetPasswordSchema = z
  .object({
    newPassword: z.string().min(8, "Password must be at least 8 characters"),
    confirmPassword: z
      .string()
      .min(8, "Password must be at least 8 characters"),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

export function ResetPasswordForm() {
  const searchParams = useSearchParams();
  const token = searchParams.get("token");
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const resetPassword = useResetPassword();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: { newPassword: "", confirmPassword: "" },
  });

  // If no token, redirect to forgot password
  useEffect(() => {
    if (!token) {
      router.push(ROUTES.FORGOT_PASSWORD);
    }
  }, [token, router]);

  const onSubmit = async (data: {
    newPassword: string;
    confirmPassword: string;
  }) => {
    if (!token) return;
    setError(null);
    try {
      await resetPassword.mutateAsync({ token, newPassword: data.newPassword });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Reset failed");
    }
  };

  if (!token) {
    return null; // will redirect
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
                <FieldLabel htmlFor="confirmPassword">
                  Confirm Password
                </FieldLabel>
                <Input
                  id="confirmPassword"
                  type="password"
                  placeholder="Confirm new password"
                  {...register("confirmPassword")}
                  aria-invalid={!!errors.confirmPassword}
                />
                {errors.confirmPassword && (
                  <FieldError errors={[errors.confirmPassword]} />
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
