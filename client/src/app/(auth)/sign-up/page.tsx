import { Metadata } from "next";

import { SignUpForm } from "./signup-form";

export const metadata: Metadata = {
  title: "Sign up - Shortly",
  description:
    "Create a Shortly account to find your next job or hire top talent.",
};

export default function SignUpPage() {
  return <SignUpForm />;
}
