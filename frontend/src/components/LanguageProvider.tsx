"use client";

import React, { createContext, useContext, useEffect, useState } from "react";

interface LanguageContextValue {
  language: string;
  setLanguage: (lang: string) => void;
}

const LanguageContext = createContext<LanguageContextValue>({
  language: "ar",
  setLanguage: () => {},
});

/**
 * Holds the display language for every page and keeps <html lang dir> in step:
 * Arabic and Urdu lay out right-to-left, English and French left-to-right.
 */
export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [language, setLanguage] = useState("ar");

  useEffect(() => {
    document.documentElement.lang = language;
    document.documentElement.dir = language === "ar" || language === "ur" ? "rtl" : "ltr";
  }, [language]);

  return (
    <LanguageContext.Provider value={{ language, setLanguage }}>{children}</LanguageContext.Provider>
  );
}

export function useLanguage() {
  return useContext(LanguageContext);
}
