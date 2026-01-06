import { createContext, useState, useContext, useEffect } from "react";

const AccessibilityContext = createContext();

export function AccessibilityProvider({ children }) {
  // Load settings from localStorage or use defaults
  const [fontSize, setFontSize] = useState(() => {
    return parseInt(localStorage.getItem("fontSize")) || 16;
  });
  
  const [fontFamily, setFontFamily] = useState(() => {
    return localStorage.getItem("fontFamily") || "Lexend";
  });
  
  const [bgColor, setBgColor] = useState(() => {
    return localStorage.getItem("bgColor") || "#ffffff";
  });

  const [isDarkMode, setIsDarkMode] = useState(() => {
    return localStorage.getItem("darkMode") === "true";
  });

  // Apply settings globally on mount and when they change
  useEffect(() => {
    applyGlobalSettings();
  }, [fontSize, fontFamily, bgColor, isDarkMode]);

  const applyGlobalSettings = () => {
    document.documentElement.style.setProperty("--app-font-size", `${fontSize}px`);
    document.documentElement.style.setProperty("--app-font-family", fontFamily);
    document.documentElement.style.setProperty("--app-bg-color", bgColor);
    
    if (isDarkMode) {
      document.documentElement.classList.add('dark-mode');
      document.body.style.backgroundColor = '#1e1e1e';
      document.body.style.color = '#e0e0e0';
    } else {
      document.documentElement.classList.remove('dark-mode');
      document.body.style.backgroundColor = bgColor;
      document.body.style.color = '#1a1a1a';
    }
  };

  const saveSettings = () => {
    localStorage.setItem("fontSize", fontSize);
    localStorage.setItem("fontFamily", fontFamily);
    localStorage.setItem("bgColor", bgColor);
    localStorage.setItem("darkMode", isDarkMode);
    applyGlobalSettings();
    return true; // Return success
  };

  return (
    <AccessibilityContext.Provider
      value={{
        fontSize,
        setFontSize,
        fontFamily,
        setFontFamily,
        bgColor,
        setBgColor,
        isDarkMode,
        setIsDarkMode,
        saveSettings,
        applyGlobalSettings
      }}
    >
      {children}
    </AccessibilityContext.Provider>
  );
}

export function useAccessibility() {
  return useContext(AccessibilityContext);
}

