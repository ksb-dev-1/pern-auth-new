import { ComponentProps } from "react";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

import { Spinner } from "./spinner";

interface ActionButtonProps extends ComponentProps<typeof Button> {
  loading?: boolean;
}

export function ActionButton({
  loading = false,
  disabled,
  children,
  className,
  ...props
}: ActionButtonProps) {
  return (
    <Button
      type="submit"
      variant="brand"
      disabled={loading || disabled}
      aria-busy={loading}
      className={cn("font-semibold", className)}
      {...props}
    >
      <span className="inline-flex items-center gap-2">
        {children}
        {loading && (
          <Spinner color="text-white dark:text-background" aria-hidden="true" />
        )}
      </span>
    </Button>
  );
}
