"use client";

import { CheckCircle2, Mail } from "lucide-react";

import { Container } from "@/components/container";
import { LoadingFallback } from "@/components/loading-fallback";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { useProfile } from "@/hooks/useProfile";

export function ProfileContent() {
  const { data, isLoading, error } = useProfile();

  if (isLoading) {
    return <LoadingFallback color="text-brand" />;
  }

  if (!data || error) {
    return <Container>Error: {error?.message || "No data found!"}</Container>;
  }

  const { name, email, imageUrl, isVerified } = data;

  return (
    <Container>
      <Card>
        <CardHeader>
          <div className="flex items-center gap-5">
            <Avatar className="h-20 w-20">
              <AvatarImage src={imageUrl} alt={name} />
              <AvatarFallback className="text-xl font-semibold">
                {name.charAt(0).toUpperCase()}
              </AvatarFallback>
            </Avatar>

            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <h1 className="text-xl font-bold">{name}</h1>

                {isVerified && (
                  <Badge className="gap-1 bg-green-600 text-white">
                    <CheckCircle2 />
                    Verified
                  </Badge>
                )}
              </div>

              <div className="flex items-center gap-2 text-muted-foreground">
                <Mail className="h-4 w-4" />
                <span>{email}</span>
              </div>
            </div>
          </div>
        </CardHeader>
      </Card>
    </Container>
  );
}
