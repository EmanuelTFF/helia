import React, { createContext, useState, useContext, ReactNode } from "react";

interface ThemeContextType {
  darkTheme: boolean;
  toggleTheme: () => void;
  colors: {
    background: string;
    textPrimary: string;
    textSecondary: string;
    cardBackground: string;
    border: string;
  };
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeProvider = ({ children }: { children: ReactNode }) => {
  const [darkTheme, setDarkTheme] = useState(false);

  const toggleTheme = () => setDarkTheme(!darkTheme);

  const colors = {
    background: darkTheme ? "#121212" : "#F5F5F5",
    textPrimary: darkTheme ? "#FFFFFF" : "#6B4F3E",
    textSecondary: darkTheme ? "#BBBBBB" : "#9C6B4D",
    cardBackground: darkTheme ? "#1E1E1E" : "#E8D9C5",
    border: darkTheme ? "#333333" : "#D4B999",
  };

  return (
    <ThemeContext.Provider value={{ darkTheme, toggleTheme, colors }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) throw new Error("useTheme must be used within ThemeProvider");
  return context;
};
