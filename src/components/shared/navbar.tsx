import { Link } from "@tanstack/react-router";
import { Moon, Sun } from "lucide-react";
import { Logo } from "@/components/shared/logo";
import { useTheme } from "@/hooks/use-theme";

export function Navbar() {
  const theme = useTheme();

  const isDark =
    theme.theme === "dark" ||
    (theme.theme === "system" && window.matchMedia("(prefers-color-scheme: dark)").matches);

  const toggleTheme = () => {
    theme.setTheme(isDark ? "light" : "dark");
  };

  return (
    <div className="fixed top-6 left-1/2 -translate-x-1/2 w-[90vw] sm:w-[85vw] md:w-1/2 z-50 px-4 py-4 rounded-2xl border border-border/50 bg-surface/60 backdrop-blur-3xl shadow-xl shadow-primary/5 flex items-center justify-between gap-6">
      <Link
        to="/"
        className="flex items-center gap-3 group no-underline hover:no-underline"
        style={{ textDecoration: "none" }}
      >
        <Logo
          size={28}
          className="shrink-0 transition-transform duration-300 group-hover:scale-110"
        />
        <span className="font-display font-bold text-text text-base sm:text-lg md:text-xl">
          DevBoard
        </span>
      </Link>

      <div
        onClick={toggleTheme}
        title="Toggle theme"
        role="button"
        tabIndex={0}
        className="cursor-pointer transition-transform duration-300 hover:scale-110"
        onKeyDown={(e) => e.key === "Enter" && toggleTheme()}
      >
        {isDark ? (
          <Sun size={26} className="text-text-primary" />
        ) : (
          <Moon size={26} className="text-text-primary" />
        )}
      </div>
    </div>
  );
}
