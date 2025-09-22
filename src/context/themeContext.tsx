"use client";

import React, { createContext, useContext, useState, ReactNode } from "react";

// Define context type
interface ThemeContextType {
  isDarkMode: boolean;
  toggleTheme: () => void;
  themeClasses: Record<string, string>;
}

// Create context
const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

// ThemeProvider
export const ThemeProvider = ({ children }: { children: ReactNode }) => {
  const [isDarkMode, setIsDarkMode] = useState(true);

  const toggleTheme = () => setIsDarkMode(prev => !prev);

  const themeClasses = {
    background: isDarkMode
      ? "bg-gradient-to-br from-slate-950 via-purple-950 to-slate-950"
      : "bg-gradient-to-br from-gray-50 via-blue-50 to-purple-50",
    text: isDarkMode ? "text-gray-100" : "text-gray-900",
    textSecondary: isDarkMode ? "text-gray-300" : "text-gray-600",
    textMuted: isDarkMode ? "text-gray-500" : "text-gray-400",
    border: isDarkMode ? "border-gray-800/50" : "border-gray-200/50",
    borderHover: isDarkMode ? "border-gray-700/70" : "border-gray-300/70",
    cardBg: isDarkMode
      ? "bg-gray-900/20 backdrop-blur-xl border border-gray-800/30"
      : "bg-white/40 backdrop-blur-xl border border-gray-200/30",
    glowColor: isDarkMode ? "rgba(99, 102, 241, 0.04)" : "rgba(99, 102, 241, 0.06)",
    inputBg: isDarkMode ? "bg-gray-900/30" : "bg-white/60",
    inputBorder: isDarkMode ? "border-gray-700/50" : "border-gray-300/50",
    inputTextColor: isDarkMode ? "text-gray-100" : "text-gray-900",
    botBubbleBg: isDarkMode ? "bg-gray-800/40" : "bg-white/80",
    botBubbleText: isDarkMode ? "text-gray-100" : "text-gray-900",
    dropdownBg: isDarkMode ? "bg-gray-900/60" : "bg-white/80",
    dropdownBorder: isDarkMode ? "border-gray-700/50" : "border-gray-300/50",
    dropdownText: isDarkMode ? "text-gray-100" : "text-gray-900",
    errorBg: isDarkMode ? "bg-red-900/20 border-red-800/30" : "bg-red-50/80 border-red-200/50",
    errorText: isDarkMode ? "text-red-300" : "text-red-700",
    successBg: isDarkMode ? "bg-green-900/20 border-green-800/30" : "bg-green-50/80 border-green-200/50",
  };

  return (
    <ThemeContext.Provider value={{ isDarkMode, toggleTheme, themeClasses }}>
      {children}
    </ThemeContext.Provider>
  );
};

// Custom hook
export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) throw new Error("useTheme must be used within a ThemeProvider");
  return context;
};
