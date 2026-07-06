import { Metadata } from "next";

import { ForgotPasswordForm } from "./forgot-password-form";

export const metadata: Metadata = {
  title: "Forgot Password - Shortly",
  description:
    "Forgot your Shortly password? Enter your email address to receive a secure link and reset your password to access your account.",
};

export default function ForgotPasswordPage() {
  return <ForgotPasswordForm />;
}
