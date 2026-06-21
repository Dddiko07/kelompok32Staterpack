import { createContext, useContext, useEffect, useMemo, useState } from "react";

const ThemeContext = createContext(null);

export const ThemeProvider = ({ children }) => {
  // 1. SET STATE AWAL JADI DARK
  const [theme, setTheme] = useState("dark");

  // load theme pertama kali
  useEffect(() => {
    try {
      // 2. JIKA LOCALSTORAGE KOSONG, DEFAULT-KAN KE DARK
      const savedTheme = localStorage.getItem("app_theme") || "dark";
      setTheme(savedTheme);
      document.documentElement.setAttribute("data-theme", savedTheme);
    } catch {
      setTheme("dark");
      document.documentElement.setAttribute("data-theme", "dark");
    }
  }, []);

  // update theme
  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);

    try {
      localStorage.setItem("app_theme", theme);
    } catch {
      // ignore
    }
  }, [theme]);

  // toggle helper
  const toggleTheme = () => {
    setTheme((prev) => (prev === "dark" ? "light" : "dark"));
  };

  const value = useMemo(() => {
    return { theme, setTheme, toggleTheme };
  }, [theme]);

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
};

export const useTheme = () => useContext(ThemeContext);