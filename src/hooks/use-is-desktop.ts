import { useState, useEffect } from "react";
import { BREAKPOINTS } from "@/constants";

export function useIsDesktop(): boolean {
  const [isDesktop, setIsDesktop] = useState(
    window.innerWidth >= BREAKPOINTS.md
  );

  useEffect(() => {
    const handleResize = () =>
      setIsDesktop(window.innerWidth >= BREAKPOINTS.md);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return isDesktop;
}
