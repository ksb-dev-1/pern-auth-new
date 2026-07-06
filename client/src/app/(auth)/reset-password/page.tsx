import { Suspense } from "react";

import { MoveLeft } from "lucide-react";
import { Metadata } from "next";

import { CustomLink } from "@/components/custom-link";
import { LoadingFallback } from "@/components/loading-fallback";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { ROUTES } from "@/constants/routes";

import { ResetPasswordForm } from "./reset-password-form";

export const metadata: Metadata = {
  title: "Reset Password - Careerly",
  description:
    "Create a new password to securely access your Careerly account.",
};

async function GetToken({
  searchParams,
}: {
  searchParams: Promise<{ token: string }>;
}) {
  const { token } = await searchParams;

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
            <p className="leading-7">
              You can’t reset your password without a valid token. Please
              request a new password reset link.
            </p>
          </CardContent>
          <CardFooter>
            <CustomLink
              href={ROUTES.SIGN_IN}
              className="text-brand hover:underline flex items-center justify-center gap-2 w-full"
            >
              <MoveLeft size={12} /> Go back to forgot password
            </CustomLink>
          </CardFooter>
        </Card>
      </div>
    );
  }
  return <ResetPasswordForm token={token} />;
}

export default function ResetPasswordPage({
  searchParams,
}: {
  searchParams: Promise<{ token: string }>;
}) {
  return (
    <Suspense fallback={<LoadingFallback color="text-brand" />}>
      <GetToken searchParams={searchParams} />
    </Suspense>
  );
}
