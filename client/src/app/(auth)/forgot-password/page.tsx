import { Metadata } from "next";

import { ForgotPasswordForm } from "./forgot-password-form";

export const metadata: Metadata = {
  title: "Forgot Password - Careerly",
  description:
    "Forgot your Careerly password? Enter your email address to receive a secure link and reset your password to access your account.",
};

export default function ForgotPasswordPage() {
  return <ForgotPasswordForm />;
}
