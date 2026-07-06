"use client";

import { useRouter } from "next/navigation";

import { LoadingFallback } from "@/components/loading-fallback";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { ROUTES } from "@/constants/routes";

import { ResendVerificationButton } from "./resend-verification-button";

export function VerifyEmailContent() {
  const session = {
    user: {
      id: "",
      email: "email",
      image: "",
    },
  };
  const isPending = false;
  const user = session?.user;
  const error = "";
  const router = useRouter();

  if (isPending) {
    return <LoadingFallback color="text-brand" />;
  }

  if (error) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center space-y-4">
        <p className="font-bolf text-xl">Failed to fetch user session</p>
        <p className="text-sm text-slate-600 dark:text-muted-foreground">
          Refresh page to try again
        </p>
      </div>
    );
  }

  if (!user?.email) {
    router.push(ROUTES.SIGN_IN);
    return;
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center text-center px-4">
      <Card className="max-w-sm w-full mx-auto">
        <CardHeader>
          <p className="font-bold text-xl text-green-600 dark:text-green-400">
            Verify your email
          </p>
        </CardHeader>
        <CardContent>
          A verification email has been sent to your inbox. If you don&apos;t
          receive it within 5 minutes, you can try again by clicking the button
          below.
        </CardContent>
        <CardFooter>
          <div className="w-full">
            <ResendVerificationButton email={user.email} />
          </div>
        </CardFooter>
      </Card>
    </div>
  );
}
