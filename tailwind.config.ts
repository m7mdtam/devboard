import type { Config } from "tailwindcss";

export default {
  darkMode: ["selector", '[data-theme="dark"]'],
  theme: {
    extend: {
      colors: {
        background: "var(--color-bg)",
        surface: "var(--color-surface)",
        "surface-raised": "var(--color-surface-raised)",
        border: "var(--color-border)",
        "border-hover": "var(--color-border-hover)",
        text: "var(--color-text)",
        "text-secondary": "var(--color-text-secondary)",
        primary: {
          DEFAULT: "var(--color-primary)",
          hover: "var(--color-primary-hover)",
          light: "var(--color-primary-light)",
          foreground: "var(--color-primary-foreground)",
        },
        secondary: {
          DEFAULT: "var(--color-secondary)",
          hover: "var(--color-secondary-hover)",
          light: "var(--color-secondary-light)",
          foreground: "var(--color-secondary-foreground)",
        },
        destructive: {
          DEFAULT: "var(--color-destructive)",
          foreground: "var(--color-destructive-foreground)",
        },
        todo: {
          DEFAULT: "var(--color-todo)",
          foreground: "var(--color-todo-fg)",
        },
        inprogress: {
          DEFAULT: "var(--color-inprogress)",
          foreground: "var(--color-inprogress-fg)",
        },
        done: {
          DEFAULT: "var(--color-done)",
          foreground: "var(--color-done-fg)",
        },
        "priority-low": "var(--color-priority-low)",
        "priority-medium": "var(--color-priority-medium)",
        "priority-high": "var(--color-priority-high)",
      },
    },
  },
} satisfies Config;
