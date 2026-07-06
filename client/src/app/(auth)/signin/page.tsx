import { Metadata } from "next";

import { SignInForm } from "./signin-form";

export const metadata: Metadata = {
  title: "Sign In - App Name",
  description: "Sign in to your App Name account.",
};

export default function SignInPage() {
  return <SignInForm />;
}
