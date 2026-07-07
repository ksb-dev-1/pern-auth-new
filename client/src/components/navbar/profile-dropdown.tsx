"use client";

import { useState } from "react";

import Image from "next/image";

import { LogOut, User } from "lucide-react";

import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ROUTES } from "@/constants/routes";
import { useSignout } from "@/hooks/useAuth";
import { useAuthStore } from "@/store/auth-store";

import { CustomLink } from "../custom-link";

const AVATAR_SIZE = 36;

export function ProfileDropdownMenu() {
  const [open, setOpen] = useState<boolean>(false);
  const signout = useSignout();
  const user = useAuthStore((state) => state.user);
  const displayName = user?.name || user?.email || "User";
  const image = user?.imageUrl;

  const handleSignOut = () => {
    signout.mutate();
  };

  return (
    <DropdownMenu open={open} onOpenChange={setOpen}>
      <DropdownMenuTrigger
        className="focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 rounded-full ml-2"
        aria-label="Open user menu"
      >
        <Avatar>
          {image ? (
            <Image
              src={image}
              alt="Profile picture"
              height={AVATAR_SIZE}
              width={AVATAR_SIZE}
              className="border rounded-full object-cover"
            />
          ) : (
            <AvatarFallback>
              <User size={16} aria-hidden="true" />
            </AvatarFallback>
          )}
        </Avatar>
      </DropdownMenuTrigger>

      <DropdownMenuContent align="end" className="w-36">
        <DropdownMenuLabel className="font-bold">
          {displayName}
        </DropdownMenuLabel>
        <DropdownMenuSeparator />

        <DropdownMenuItem asChild className="cursor-pointer">
          <CustomLink href={ROUTES.PROFILE}>
            <User className="mr-2 h-4 w-4" aria-hidden="true" />
            Profile
          </CustomLink>
        </DropdownMenuItem>

        <DropdownMenuItem
          disabled={signout.isPending}
          onClick={handleSignOut}
          className="cursor-pointer"
        >
          <LogOut className="mr-2 h-4 w-4" aria-hidden="true" />
          {signout.isPending ? "Signing out..." : "Sign out"}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
