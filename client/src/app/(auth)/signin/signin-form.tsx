"use client";

import { useEffect, useState } from "react";

import { useRouter } from "next/navigation";

import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm } from "react-hook-form";
import { FaGithub } from "react-icons/fa";
import { FcGoogle } from "react-icons/fc";
import { toast } from "sonner";

import { ActionButton } from "@/components/action-button";
import { CustomLink } from "@/components/custom-link";
import { PasswordField } from "@/components/shared/password-field";
import { Spinner } from "@/components/spinner";
import { Alert } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { ROUTES } from "@/constants/routes";
import { SignInType, signInSchema } from "@/lib/validation";

export function SignInForm() {
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [loadingProvider, setLoadingProvider] = useState<
    "google" | "github" | null
  >(null);
  const router = useRouter();

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

  async function onSubmit({ email, password, rememberMe }: SignInType) {}

  async function handleSocialSignIn(provider: "github" | "google") {}

  const loading = form.formState.isSubmitting;

  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <Card className="max-w-sm w-full mx-auto">
        <CardHeader>
          <CardTitle className="text-lg font-bold">
            Sign in to <span className="text-brand">Careerly</span>
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

            <Controller
              name="rememberMe"
              control={form.control}
              render={({ field }) => (
                <div className="flex items-center gap-2 mt-4">
                  <Checkbox
                    id={field.name}
                    checked={!!field.value}
                    onCheckedChange={(checked) =>
                      field.onChange(checked === true)
                    }
                    className={`cursor-pointer ${field.value ? "bg-brand! text-white! dark:text-background! border-brand!" : ""}`}
                  />
                  <FieldLabel htmlFor={field.name} className="cursor-pointer">
                    Remember me
                  </FieldLabel>
                </div>
              )}
            />

            <ActionButton loading={loading} className="w-full mt-4">
              Sign in
            </ActionButton>
          </form>

          <div className="grid grid-cols-2 gap-4 border-t pt-6 mt-6">
            <Button
              variant="outline"
              disabled={loadingProvider !== null}
              onClick={() => handleSocialSignIn("google")}
              className="w-full"
            >
              <FcGoogle /> Google {loadingProvider === "google" && <Spinner />}
            </Button>

            <Button
              variant="outline"
              disabled={loadingProvider !== null}
              onClick={() => handleSocialSignIn("github")}
              className="w-full"
            >
              <FaGithub /> Github
              {loadingProvider === "github" && <Spinner />}
            </Button>
          </div>
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
