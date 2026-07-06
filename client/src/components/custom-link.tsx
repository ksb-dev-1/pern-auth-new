"use client";

import { MouseEvent, ReactNode } from "react";

import Link, { LinkProps } from "next/link";

import NProgress from "nprogress";

interface CustomLinkProps
  extends LinkProps,
    Omit<
      React.AnchorHTMLAttributes<HTMLAnchorElement>,
      keyof LinkProps
    > {
  children: ReactNode;
  isActive?: boolean;
}

export function CustomLink({
  children,
  isActive = false,
  onClick,
  href,
  ...props
}: CustomLinkProps) {
  const handleClick = (e: MouseEvent<HTMLAnchorElement>) => {
    onClick?.(e);

    // If the user's onClick prevented navigation, don't start the progress bar.
    if (e.defaultPrevented) return;

    if (isActive) return;

    const isRegularNavigation =
      e.button === 0 &&
      !e.metaKey &&
      !e.ctrlKey &&
      !e.shiftKey &&
      !e.altKey;

    if (!isRegularNavigation) return;

    const hrefString = href.toString();

    const isExternal =
      hrefString.startsWith("http://") ||
      hrefString.startsWith("https://") ||
      hrefString.startsWith("mailto:") ||
      hrefString.startsWith("tel:");

    if (!isExternal) {
      NProgress.start();
    }
  };

  return (
    <Link
      href={href}
      onClick={handleClick}
      {...props}
    >
      {children}
    </Link>
  );
}