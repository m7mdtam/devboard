import { cn } from "@/lib/utils";
import type { ReactNode } from "react";

interface PageSectionProps {
  children: ReactNode;
  className?: string;
}

export function PageSection({ children, className }: PageSectionProps) {
  return (
    <div
      className={cn(
        "p-4 sm:p-5 md:p-4 rounded-2xl bg-surface-raised border border-border/60",
        className
      )}
    >
      {children}
    </div>
  );
}
