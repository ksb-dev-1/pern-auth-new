import { Metadata } from "next";

import { SignUpForm } from "./signup-form";

export const metadata: Metadata = {
  title: "Sign up - App Name",
  description:
    "Create a App Name account to find your next job or hire top talent.",
};

export default function SignUpPage() {
  return <SignUpForm />;
}
