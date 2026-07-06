"use client";

import { ModeToggle } from "@/components/navbar/mode-toggle";
import { ProfileDropdownMenu } from "@/components/navbar/profile-dropdown";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { ROUTES } from "@/constants/routes";
import { useAuthStore } from "@/store/auth-store";

import { CustomLink } from "../custom-link";

function NavbarLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="border-b h-16 w-full flex items-center justify-center">
      <nav className="flex items-center justify-between max-w-5xl w-full mx-auto px-4">
        <CustomLink href={ROUTES.HOME} className="font-extrabold">
          PERN AUTH
        </CustomLink>
        <div className="flex items-center gap-2">
          <ModeToggle />
          {children}
        </div>
      </nav>
    </div>
  );
}

function NotSignedIn() {
  return (
    <Button asChild variant="brand">
      <CustomLink href={ROUTES.SIGN_IN}>Sign in</CustomLink>
    </Button>
  );
}

function SignedIn({ imageUrl }: { imageUrl: string | null | undefined }) {
  return <ProfileDropdownMenu image={imageUrl} />;
}

function Loading() {
  return <Skeleton className="h-9 w-9 rounded-full" />;
}

export function Navbar() {
  const user = useAuthStore((state) => state.user);
  const accessToken = useAuthStore((state) => state.accessToken);

  // Derive authentication status from store
  const isAuthenticated = !!accessToken && !!user;
  const isLoading = false; // Zustand doesn't have a loading state by default

  let content;

  if (isLoading) {
    content = <Loading />;
  } else if (isAuthenticated) {
    content = <SignedIn imageUrl={user?.imageUrl} />;
  } else {
    content = <NotSignedIn />;
  }

  return <NavbarLayout>{content}</NavbarLayout>;
}
