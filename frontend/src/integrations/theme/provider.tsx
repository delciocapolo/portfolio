import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";
import { Toaster } from "sonner";

type Theme = "light" | "dark" | "auto";

type ThemeContextValue = {
  theme: Theme;
  resolved: "light" | "dark";
  setTheme: (theme: Theme) => void;
};

const ThemeContext = createContext<ThemeContextValue | null>(null);

function resolveTheme(mode: Theme): "light" | "dark" {
  if (mode === "auto") {
    return window.matchMedia("(prefers-color-scheme: dark)").matches
      ? "dark"
      : "light";
  }
  return mode;
}

function applyTheme(mode: Theme) {
  const resolved = resolveTheme(mode);
  const root = document.documentElement;

  root.classList.remove("light", "dark");
  root.classList.add(resolved);
  root.style.colorScheme = resolved;

  if (mode === "auto") {
    root.removeAttribute("data-theme");
  } else {
    root.setAttribute("data-theme", mode);
  }

  return resolved;
}

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setThemeState] = useState<Theme>("auto");
  const [resolved, setResolved] = useState<"light" | "dark">("dark");

  // Lê o valor inicial e escuta mudanças do sistema
  useEffect(() => {
    const stored = (localStorage.getItem("theme") as Theme) || "auto";
    setThemeState(stored);
    setResolved(applyTheme(stored));

    const mq = window.matchMedia("(prefers-color-scheme: dark)");
    const onChange = () => {
      // Só reage se estiver em "auto"
      const current = (localStorage.getItem("theme") as Theme) || "auto";
      if (current === "auto") {
        setResolved(applyTheme("auto"));
      }
    };

    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, []);

  const setTheme = useCallback((next: Theme) => {
    localStorage.setItem("theme", next);
    setThemeState(next);
    setResolved(applyTheme(next));
  }, []);

  return (
    <ThemeContext.Provider value={{ theme, resolved, setTheme }}>
      <Toaster />
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const ctx = useContext(ThemeContext);
  if (!ctx) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }
  return ctx;
}
