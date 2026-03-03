import { createRootRoute, Outlet } from "@tanstack/react-router";
import { useTheme } from "@/hooks/use-theme";
import Aurora from "@/components/Aurora";
import { useEffect, useState } from "react";

declare module "@tanstack/react-router" {
  interface StaticDataRouteOption {
    title?: string;
  }
}

function RootComponent() {
  const { theme } = useTheme();
  const [resolvedTheme, setResolvedTheme] = useState<"light" | "dark">("light");

  useEffect(() => {
    const isDark =
      theme === "dark" ||
      (theme === "system" &&
        window.matchMedia("(prefers-color-scheme: dark)").matches);
    setResolvedTheme(isDark ? "dark" : "light");
  }, [theme]);

  // Color stops for Aurora based on theme - uses primary, secondary, white, and black
  const auroraColors = {
    light: ["#ffffff", "#d92d3f", "#7b8fc9"], // White -> Primary Red -> Secondary Blue
    dark: ["#000000", "#ff8888", "#8fa8ff"], // Black -> Primary Red (lighter) -> Secondary Blue (lighter)
  };

  const currentColors = auroraColors[resolvedTheme];

  return (
    <main className="min-h-dvh relative overflow-hidden bg-bg/90">
      {/* Aurora background */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <Aurora
          colorStops={currentColors}
          amplitude={0.8}
          blend={0.6}
          speed={1.0}
        />
      </div>

      {/* Content */}
      <div className="relative z-10">
        <Outlet />
      </div>
    </main>
  );
}

export const Route = createRootRoute({
  component: RootComponent,
  beforeLoad: ({ matches }) => {
    const routeWithTitle = [...matches]
      .reverse()
      .find((m) => m.staticData?.title);
    document.title = routeWithTitle?.staticData?.title
      ? `${routeWithTitle.staticData.title} | DevBoard`
      : "DevBoard";
  },
});
