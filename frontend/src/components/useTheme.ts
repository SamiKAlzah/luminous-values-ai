"use client";

import { useSyncExternalStore } from "react";

export type ThemeId = "light" | "dark" | "emerald";

export const THEMES: { id: ThemeId; name: string }[] = [
  { id: "light", name: "نجد" },
  { id: "dark", name: "الليل" },
  { id: "emerald", name: "الزمرد" },
];

const STORAGE_KEY = "lv-theme";
const listeners = new Set<() => void>();

function isTheme(value: unknown): value is ThemeId {
  return THEMES.some((t) => t.id === value);
}

// The pre-paint script in layout.tsx has already put the saved theme on <html>,
// so the document attribute is the single source of truth.
function getSnapshot(): ThemeId {
  const current = document.documentElement.dataset.theme;
  return isTheme(current) ? current : "light";
}

function getServerSnapshot(): ThemeId {
  return "light";
}

function subscribe(listener: () => void) {
  listeners.add(listener);
  const onStorage = (e: StorageEvent) => {
    if (e.key === STORAGE_KEY && isTheme(e.newValue)) {
      document.documentElement.dataset.theme = e.newValue;
      listener();
    }
  };
  window.addEventListener("storage", onStorage);
  return () => {
    listeners.delete(listener);
    window.removeEventListener("storage", onStorage);
  };
}

export function setTheme(theme: ThemeId) {
  document.documentElement.dataset.theme = theme;
  try {
    localStorage.setItem(STORAGE_KEY, theme);
  } catch {
    // storage unavailable (private mode): the choice lasts for this visit only
  }
  listeners.forEach((l) => l());
}

export function useTheme() {
  const theme = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
  return { theme, setTheme };
}
