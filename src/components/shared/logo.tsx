import { cn } from "@/lib/utils";

interface LogoProps {
  size?: number;
  className?: string;
}

export function Logo(props: LogoProps) {
  const size = props.size || 28;

  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 28 28"
      xmlns="http://www.w3.org/2000/svg"
      className={cn("shrink-0", props.className)}
    >
      <rect x="2" y="2" width="10" height="10" rx="2" fill="var(--color-primary)" />
      <rect x="16" y="2" width="10" height="10" rx="2" fill="var(--color-secondary)" />
      <rect x="2" y="16" width="24" height="2" rx="1" fill="var(--color-primary)" />
      <circle cx="8" cy="24" r="1.5" fill="var(--color-secondary)" />
      <circle cx="14" cy="24" r="1.5" fill="var(--color-secondary)" />
      <circle cx="20" cy="24" r="1.5" fill="var(--color-secondary)" />
    </svg>
  );
}
