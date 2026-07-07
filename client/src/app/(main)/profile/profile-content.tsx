"use client";

import { CheckCircle2, Mail } from "lucide-react";

import { Container } from "@/components/container";
import { LoadingFallback } from "@/components/loading-fallback";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { useProfile } from "@/hooks/useProfile";

import { EditProfile } from "./edit-dialog";

export function ProfileContent() {
  const { data, isLoading, error } = useProfile();

  if (isLoading) {
    return <LoadingFallback color="text-brand" />;
  }

  if (error) {
    return (
      <Container className="flex flex-col items-center justify-center space-y-4 -mt-16">
        <p className="text-red-600 font-bold text-xl text-center">
          Error Loading Profile!
        </p>
        <p className="text-sm text-muted-foreground text-center">
          {error?.message || "Please try again later."}
        </p>
        <Button variant="outline" onClick={() => window.location.reload()}>
          Refresh
        </Button>
      </Container>
    );
  }

  if (!data) {
    return <LoadingFallback color="text-brand" />;
  }

  const { name, email, imageUrl, isVerified } = data;
  const initials = name?.charAt(0).toUpperCase() || "U";

  return (
    <Container>
      <Card className="relative">
        <CardHeader>
          <div className="flex flex-col sm:flex-row sm:text-left sm:items-center gap-4">
            <Avatar className="h-24 w-24 shrink-0">
              <AvatarImage src={imageUrl || ""} alt={name} />
              <AvatarFallback className="text-2xl font-bold">
                {initials}
              </AvatarFallback>
            </Avatar>

            <div className="flex-1 space-y-2">
              <div className="flex items-center gap-2">
                <h1 className="text-lg font-bold tracking-tight">{name}</h1>
                {isVerified && (
                  <Badge className="gap-1 bg-green-600 hover:bg-green-600 text-white border-0 w-fit">
                    <CheckCircle2 className="h-3 w-3" />
                    Verified
                  </Badge>
                )}
              </div>

              <div className="flex items-center gap-2 text-muted-foreground">
                <Mail className="h-4 w-4" />
                <span className="text-sm">{email}</span>
              </div>
            </div>

            <EditProfile currentName={name} currentImageUrl={imageUrl} />
          </div>
        </CardHeader>

        <CardContent>
          <div className="border-t pt-4">
            <p className="text-sm text-muted-foreground">
              Member since -{" "}
              <span className="text-foreground font-medium">
                {new Date().toLocaleDateString("en-US", {
                  month: "long",
                  year: "numeric",
                })}
              </span>
            </p>
          </div>
        </CardContent>
      </Card>
    </Container>
  );
}
