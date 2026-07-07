"use client";

import { Container } from "@/components/container";
import { LoadingFallback } from "@/components/loading-fallback";
import { useProfile } from "@/hooks/useProfile";

export function ProfileContent() {
  const { data, isLoading, error } = useProfile();

  if (isLoading) {
    return <LoadingFallback color="text-brand" />;
  }

  if (error) {
    return <Container>Error: {error.message}</Container>;
  }

  console.log(data);

  return <Container>Profile</Container>;
}
