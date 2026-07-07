"use client";

import { CheckCircle2, Mail, SquarePen } from "lucide-react";

import { Container } from "@/components/container";
import { LoadingFallback } from "@/components/loading-fallback";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { useProfile } from "@/hooks/useProfile";

export function ProfileContent() {
  const { data, isLoading, error } = useProfile();

  if (isLoading) {
    return (
      <Container className="flex items-center justify-center min-h-[50vh]">
        <LoadingFallback color="text-brand" />
      </Container>
    );
  }

  if (!data || error) {
    return (
      <Container className="flex items-center justify-center min-h-[50vh]">
        <Card className="max-w-md w-full p-6 text-center">
          <p className="text-red-600 font-medium">Error Loading Profile</p>
          <p className="text-sm text-muted-foreground mt-1">
            {error?.message || "Please try again later."}
          </p>
          <Button
            variant="outline"
            className="mt-4"
            onClick={() => window.location.reload()}
          >
            Refresh
          </Button>
        </Card>
      </Container>
    );
  }

  const { name, email, imageUrl, isVerified } = data;
  const initials = name?.charAt(0).toUpperCase() || "U";

  return (
    <Container>
      <Card className="relative">
        <CardHeader>
          <div className="flex flex-col sm:flex-row sm:text-left sm:items-center gap-4">
            {/* Avatar - larger and centered on mobile */}
            <Avatar className="h-20 w-20 sm:h-24 sm:w-24 shrink-0">
              <AvatarImage src={imageUrl || ""} alt={name} />
              <AvatarFallback className="text-2xl font-bold">
                {initials}
              </AvatarFallback>
            </Avatar>

            {/* User Info */}
            <div className="flex-1 space-y-2">
              <div className="flex items-center gap-2">
                <h1 className="text-xl font-bold tracking-tight">{name}</h1>
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

            {/* Edit Button */}
            <Button
              variant="outline"
              size="sm"
              className="absolute top-4 right-4 gap-2 shrink-0"
              onClick={() => console.log("Edit profile")}
            >
              <SquarePen className="h-3.5 w-3.5" />
              Edit
            </Button>
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
