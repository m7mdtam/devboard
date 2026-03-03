import { createRootRoute, Outlet } from "@tanstack/react-router";
import { useTheme } from "@/hooks/use-theme";
import Particles from "@/components/Particles";
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
      (theme === "system" && window.matchMedia("(prefers-color-scheme: dark)").matches);
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setResolvedTheme(isDark ? "dark" : "light");
  }, [theme]);

  // Particle colors based on theme - black for light, white for dark, with accent colors
  const particleColors = {
    light: ["#000000", "#d92d3f", "#7b8fc9"],
    dark: ["#ffffff", "#ff8888", "#8fa8ff"],
  };

  const currentColors = particleColors[resolvedTheme];

  return (
    <main className="min-h-dvh relative overflow-hidden bg-bg/90">
      {/* Particles background */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <Particles
          particleCount={500}
          particleSpread={25}
          speed={0.03}
          particleColors={currentColors}
          alphaParticles={true}
          particleBaseSize={250}
          sizeRandomness={2.5}
          cameraDistance={15}
          moveParticlesOnHover={true}
          particleHoverFactor={1.5}
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
    const routeWithTitle = [...matches].reverse().find((m) => m.staticData?.title);
    document.title = routeWithTitle?.staticData?.title
      ? `${routeWithTitle.staticData.title} | DevBoard`
      : "DevBoard";
  },
});
