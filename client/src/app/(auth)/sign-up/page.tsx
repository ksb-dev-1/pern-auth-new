import { Metadata } from "next";

import { SignUpForm } from "./signup-form";

export const metadata: Metadata = {
  title: "Sign up - Shortly",
  description:
    "Create a Shortly account to shorten URLs, create custom aliases, generate QR codes, and track link analytics.",
};

export default function SignUpPage() {
  return <SignUpForm />;
}
