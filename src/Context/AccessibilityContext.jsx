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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [fontSize, fontFamily, bgColor, isDarkMode]);

  const applyGlobalSettings = () => {
    const root = document.documentElement;
    const body = document.body;
    
    // Set CSS variables
    root.style.setProperty("--app-font-size", `${fontSize}px`);
    root.style.setProperty("--app-font-family", fontFamily);
    root.style.setProperty("--app-bg-color", bgColor);
    
    // Force immediate update
    requestAnimationFrame(() => {
      if (isDarkMode) {
        root.classList.add('dark-mode');
        body.style.setProperty('background-color', '#1e1e1e', 'important');
        body.style.setProperty('color', '#e0e0e0', 'important');
      } else {
        root.classList.remove('dark-mode');
        body.style.setProperty('background-color', bgColor, 'important');
        body.style.setProperty('color', '#1a1a1a', 'important');
      }
    });
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