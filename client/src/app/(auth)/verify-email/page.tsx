import type { Metadata } from "next";

import { VerifyEmailContent } from "./verify-email-content";

export const metadata: Metadata = {
  title: "Verify Email - App Name",
  description:
    "Verify your email address to activate your App Name account and start finding jobs or hiring talented professionals.",
};

export default async function VerifyEmailPage() {
  return <VerifyEmailContent />;
}
