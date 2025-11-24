import { createContext, useState, useContext } from "react";

const AccessibilityContext = createContext();

export function AccessibilityProvider({ children }) {
  const [fontSize, setFontSize] = useState(16);
  const [fontFamily, setFontFamily] = useState("Lexend");
  const [letterSpacing, setLetterSpacing] = useState("normal");
  const [bgColor, setBgColor] = useState("#ffffff");

  return (
    <AccessibilityContext.Provider
      value={{
        fontSize,
        setFontSize,
        fontFamily,
        setFontFamily,
        letterSpacing,
        setLetterSpacing,
        bgColor,
        setBgColor
      }}
    >
      {children}
    </AccessibilityContext.Provider>
  );
}

export function useAccessibility() {
  return useContext(AccessibilityContext);
}
