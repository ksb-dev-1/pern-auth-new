import { cn } from "@/lib/utils";

type ContainerProps = {
  children: React.ReactNode;
  className?: string;
};

export function Container({ children, className }: ContainerProps) {
  return (
    <div
      className={cn(
        "min-h-screen w-full max-w-5xl mx-auto px-4 my-16",
        className,
      )}
    >
      {children}
    </div>
  );
}
