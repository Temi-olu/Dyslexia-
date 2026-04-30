import { createContext, useContext, useState } from "react";
import { getLang } from "../Data/Translations";

const LanguageContext = createContext(null);

export const LanguageProvider = ({ children }) => {
  // Language always applies immediately — no pending state
  const [language, setLanguage] = useState(() => {
    try { return localStorage.getItem("dyslexia_language") || "en"; }
    catch { return "en"; }
  });

  // Set language immediately and persist it
  const setLanguageNow = (code) => {
    localStorage.setItem("dyslexia_language", code);
    setLanguage(code);
  };

  const value = {
    language,
    setLanguageNow,
    currentLang: getLang(language),
    // Keep these for backward-compat with Toolspage
    pendingLanguage: language,
    setPendingLanguage: setLanguageNow, // alias — immediate
    saveLanguage: () => true,           // no-op, already saved
    isDirty: false,
  };

  return (
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const ctx = useContext(LanguageContext);
  if (!ctx) throw new Error("useLanguage must be used within LanguageProvider");
  return ctx;
};

export default LanguageContext;