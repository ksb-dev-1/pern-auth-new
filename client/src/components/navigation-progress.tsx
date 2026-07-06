"use client";

import { useEffect } from "react";

import { usePathname, useSearchParams } from "next/navigation";

import NProgress from "nprogress";

export function NavigationProgress() {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  useEffect(() => {
    NProgress.done(); // always stop on route change
  }, [pathname, searchParams]);

  return null;
}
