import { createContext, useContext, useState, useEffect } from "react";

const ThemeContext = createContext();

export const ThemeProvider = ({ children }) => {
  const [isLightTheme, setIsLightTheme] = useState(() => {
    const savedTheme = localStorage.getItem("theme");
    return savedTheme ? savedTheme === "light" : false;
  });

  const handleThemeToggle = () => {
    setIsLightTheme((prevTheme) => {
      const newTheme = !prevTheme;
      localStorage.setItem("theme", newTheme ? "light" : "dark");
      return newTheme;
    });
  };

  useEffect(() => {
    if (isLightTheme) {
      document.documentElement.classList.add("light-theme-variables");
      document.documentElement.classList.remove("dark-theme-variables");
    } else {
      document.documentElement.classList.add("dark-theme-variables");
      document.documentElement.classList.remove("light-theme-variables");
    }
    localStorage.setItem("theme", isLightTheme ? "light" : "dark");
  }, [isLightTheme]);

  return (
    <ThemeContext.Provider value={{ isLightTheme, handleThemeToggle }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useThemeContext = () => useContext(ThemeContext);
