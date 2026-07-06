"use client";

import { useEffect, useState } from "react";

import { zodResolver } from "@hookform/resolvers/zod";
import { MoveLeft } from "lucide-react";
import { Controller, useForm } from "react-hook-form";

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
import { Field, FieldError, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { ROUTES } from "@/constants/routes";
import { ForgotPasswordType, forgotPasswordSchema } from "@/lib/validation";

export function ForgotPasswordForm() {
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const form = useForm<ForgotPasswordType>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: {
      email: "",
    },
  });

  useEffect(() => {
    form.reset(form.formState.defaultValues);
  }, [form]);

  async function onSubmit({ email }: ForgotPasswordType) {}

  const loading = form.formState.isSubmitting;

  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <Card className="max-w-sm w-full mx-auto">
        <CardHeader>
          <CardTitle className="text-lg font-bold">Forgot Password</CardTitle>
          <CardDescription>
            Enter your registered email below and we’ll send you a password
            reset link
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

            <ActionButton loading={loading} className="w-full mt-4">
              Submit
            </ActionButton>
          </form>
        </CardContent>
        <CardFooter>
          <CustomLink
            href={ROUTES.SIGN_IN}
            className="text-brand font-medium underline flex items-center justify-center gap-2"
          >
            <MoveLeft size={12} /> Bcak to Sign in
          </CustomLink>
        </CardFooter>
      </Card>
    </div>
  );
}
