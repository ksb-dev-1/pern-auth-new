import { Metadata } from "next";

import { SignInForm } from "./signin-form";

export const metadata: Metadata = {
  title: "Sign In - Shortly",
  description: "Sign in to your Shortly account.",
};

export default function SignInPage() {
  return <SignInForm />;
}
