"use client";

import React, { createContext, useContext, useEffect, useSyncExternalStore } from "react";
import { UI_COPY, asLang, type UiCopy } from "../lib/copy";
import type { Lang } from "../lib/types";

const STORAGE_KEY = "lv-lang";
const listeners = new Set<() => void>();

// The language lives in localStorage so it survives navigation and reloads; the server
// snapshot is Arabic, so the first client render matches the static HTML.
function getSnapshot(): Lang {
  try {
    return asLang(localStorage.getItem(STORAGE_KEY) ?? "ar");
  } catch {
    return "ar";
  }
}

function getServerSnapshot(): Lang {
  return "ar";
}

function subscribe(listener: () => void) {
  listeners.add(listener);
  window.addEventListener("storage", listener);
  return () => {
    listeners.delete(listener);
    window.removeEventListener("storage", listener);
  };
}

let memoryLanguage: Lang | null = null;

function readLanguage(): Lang {
  return memoryLanguage ?? getSnapshot();
}

interface LanguageContextValue {
  language: Lang;
  setLanguage: (lang: string) => void;
  copy: UiCopy;
}

const LanguageContext = createContext<LanguageContextValue>({
  language: "ar",
  setLanguage: () => {},
  copy: UI_COPY.ar,
});

/**
 * Holds the display language (Arabic or English) for every page and keeps
 * <html lang dir> in step: Arabic lays out right-to-left, English left-to-right.
 */
export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const language = useSyncExternalStore(subscribe, readLanguage, getServerSnapshot);

  useEffect(() => {
    document.documentElement.lang = language;
    document.documentElement.dir = language === "ar" ? "rtl" : "ltr";
    // Translate whichever known page title is showing; leave any other title alone.
    const titles = (c: UiCopy) => [c.metaTitle, c.about.metaTitle];
    const i = [UI_COPY.ar, UI_COPY.en]
      .map((c) => titles(c).indexOf(document.title))
      .find((n) => n !== -1);
    if (i !== undefined) document.title = titles(UI_COPY[language])[i];
  }, [language]);

  const setLanguage = (next: string) => {
    const lang = asLang(next);
    memoryLanguage = lang;
    try {
      localStorage.setItem(STORAGE_KEY, lang);
    } catch {
      // storage unavailable: the choice lasts for this visit only (memoryLanguage)
    }
    listeners.forEach((l) => l());
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, copy: UI_COPY[language] }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  return useContext(LanguageContext);
}
