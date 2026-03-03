import * as React from "react";

import { cn } from "@/lib/utils";

function Input(props: React.ComponentProps<"input">) {
  return (
    <input
      type={props.type}
      data-slot="input"
      className={cn(
        "h-10 w-full min-w-0 rounded-md border border-border bg-surface px-4 py-2.5 text-base text-text shadow-xs transition-[color,box-shadow] outline-none selection:bg-primary selection:text-primary-foreground file:inline-flex file:h-7 file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-text placeholder:text-text-secondary/60 disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 md:text-sm focus-visible:border-primary focus-visible:ring-[3px] focus-visible:ring-primary/30 aria-invalid:border-destructive aria-invalid:ring-destructive/20",
        props.className
      )}
      {...props}
    />
  );
}

export { Input };
