import type { Metadata } from "next";

import { VerifyEmailContent } from "./verify-email-content";

export const metadata: Metadata = {
  title: "Verify Email - Shortly",
  description:
    "Verify your email address to activate your Shortly account and access all URL shortening features.",
};

export default function VerifyEmailPage() {
  return <VerifyEmailContent />;
}
