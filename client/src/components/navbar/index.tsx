"use client"

import {ModeToggle} from "@/components/navbar/mode-toggle";
import {ProfileDropdownMenu} from "@/components/navbar/profile-dropdown"
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { ROUTES } from "@/constants/routes";
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

export  function Navbar() {
    const session = {user:{
        id:"",
        image:""
    }}
    const isPending = false


  let content;

  if (isPending) {
    content = <Loading />;
  } else if (session?.user?.id) {
    content = <SignedIn imageUrl={session.user.image} />;
  } else {
    content = <NotSignedIn />;
  }
  return <NavbarLayout>{content}</NavbarLayout>;
}
