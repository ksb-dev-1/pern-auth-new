"use client";

import { useEffect, useState } from "react";

import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm } from "react-hook-form";

import { ActionButton } from "@/components/action-button";
import { CustomLink } from "@/components/custom-link";
import { PasswordField } from "@/components/shared/password-field";
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
import { useSignin } from "@/hooks/useAuth";
import { SignInType, signInSchema } from "@/lib/validation";

export function SignInForm() {
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const signin = useSignin();

  const form = useForm<SignInType>({
    resolver: zodResolver(signInSchema),
    defaultValues: {
      email: "",
      password: "",
      rememberMe: false,
    },
  });

  useEffect(() => {
    form.reset(form.formState.defaultValues);
  }, [form]);

  async function onSubmit({ email, password }: SignInType) {
    setErrorMessage(null);
    try {
      await signin.mutateAsync({ email, password });
      // Note: rememberMe is handled by sessionStorage duration (we already persist via Zustand)
      // If rememberMe is true, we could adjust the persist config later, but sessionStorage is cleared on browser close.
      // For now, we just use the existing behavior.
    } catch (err) {
      setErrorMessage(err instanceof Error ? err.message : "Signin failed");
    }
  }

  const loading = signin.isPending;

  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <Card className="max-w-sm w-full mx-auto">
        <CardHeader>
          <CardTitle className="text-lg font-bold">
            Sign in to <span className="text-brand">Shortly</span>
          </CardTitle>
          <CardDescription>
            Fill in the fields below to sign in to your account.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {errorMessage && (
            <Alert variant="error" className="mb-4 flex items-center flex-wrap">
              {errorMessage}
            </Alert>
          )}

          <form onSubmit={form.handleSubmit(onSubmit)}>
            <FieldGroup>
              <Controller
                name="email"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel htmlFor={field.name}>Email</FieldLabel>
                    <Input
                      {...field}
                      id={field.name}
                      aria-invalid={fieldState.invalid}
                      placeholder="your@email.com"
                      autoComplete="off"
                    />
                    {fieldState.invalid && (
                      <FieldError errors={[fieldState.error]} />
                    )}
                  </Field>
                )}
              />

              <Controller
                name="password"
                control={form.control}
                render={({ field, fieldState }) => (
                  <PasswordField
                    field={field}
                    fieldState={fieldState}
                    showForgotPassword
                    placeholder="Enter your password"
                  />
                )}
              />
            </FieldGroup>

            <ActionButton loading={loading} className="w-full mt-4">
              Sign in
            </ActionButton>
          </form>
        </CardContent>

        <CardFooter>
          <div className="flex w-full justify-center">
            <p className="text-muted-foreground text-center text-sm">
              Don&apos;t have an account?{" "}
              <CustomLink
                href={ROUTES.SIGN_UP}
                className="text-brand underline"
              >
                Sign up
              </CustomLink>
            </p>
          </div>
        </CardFooter>
      </Card>
    </div>
  );
}
