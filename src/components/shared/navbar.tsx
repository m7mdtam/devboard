import { Link } from "@tanstack/react-router";
import { Moon, Sun } from "lucide-react";
import { motion } from "motion/react";
import { Button } from "@/components/ui/button";
import { useTheme } from "@/hooks/use-theme";

export function Navbar() {
  const theme = useTheme();

  const isDark =
    theme.theme === "dark" ||
    (theme.theme === "system" &&
      window.matchMedia("(prefers-color-scheme: dark)").matches);

  const toggleTheme = () => {
    theme.setTheme(isDark ? "light" : "dark");
  };

  return (
    <motion.nav
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.4 }}
      className="fixed top-0 left-0 right-0 w-full h-16 bg-surface border-b border-border backdrop-blur-sm z-50"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 h-full flex flex-row items-center justify-between">
        <Link to="/" className="flex flex-row items-center gap-2">
          <div className="bg-linear-to-br from-primary to-secondary rounded-md w-6 h-6" />
          <span className="font-display font-bold text-text text-lg hidden sm:inline">
            DevBoard
          </span>
        </Link>

        <Button
          variant="ghost"
          size="icon"
          onClick={toggleTheme}
          title="Toggle theme"
          type="button"
        >
          {isDark ? (
            <Sun size={18} className="text-text-secondary" />
          ) : (
            <Moon size={18} className="text-text-secondary" />
          )}
        </Button>
      </div>
    </motion.nav>
  );
}
