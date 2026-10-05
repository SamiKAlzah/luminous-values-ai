"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Globe2, Moon, Gem, Sun } from "lucide-react";
import { useLanguage } from "./LanguageProvider";
import { Khatam } from "./Ornament";
import { THEMES, useTheme, type ThemeId } from "./useTheme";

const LANGUAGES = [
  { code: "ar", label: "العربية" },
  { code: "en", label: "English" },
];

const THEME_ICONS: Record<ThemeId, React.ComponentType<{ className?: string }>> = {
  light: Sun,
  dark: Moon,
  emerald: Gem,
};

export default function Header() {
  const { language, setLanguage, copy } = useLanguage();
  const pathname = usePathname();
  const { theme, setTheme } = useTheme();

  const nav = [
    { href: "/", label: copy.nav.home },
    { href: "/about", label: copy.nav.about },
  ];

  return (
    <header className="z-50 md:sticky md:top-0 w-full border-b border-line bg-surface-100">
      <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-x-4 gap-y-2 px-4 py-3 sm:px-6 lg:px-8">
        <Link href="/" className="flex items-center gap-3 rounded-md">
          <Khatam size={36} />
          <span className="flex flex-col">
            <span className="text-h3 font-bold text-ink">{copy.siteName}</span>
            <span className="hidden text-caption text-ink-muted sm:block">{copy.tagline}</span>
          </span>
        </Link>

        <nav aria-label={copy.nav.label} className="order-last flex w-full gap-1 md:order-none md:w-auto">
          {nav.map((item) => {
            const active = pathname === item.href || pathname === `${item.href}/`;
            return (
              <Link
                key={item.href}
                href={item.href}
                aria-current={active ? "page" : undefined}
                className={`inline-flex min-h-11 items-center rounded-md px-4 text-small font-semibold ${
                  active
                    ? "bg-brand-tint text-ink"
                    : "text-ink-muted hover:bg-surface-200 hover:text-ink"
                }`}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div className="flex flex-wrap items-center gap-2">
          <label className="flex min-h-11 items-center gap-2 rounded-md border border-line bg-surface-card px-3 text-small text-ink">
            <Globe2 className="h-4 w-4 text-brand" aria-hidden="true" />
            <span className="sr-only">{copy.languageLabel}</span>
            <select
              value={language}
              onChange={(e) => setLanguage(e.target.value)}
              className="cursor-pointer bg-transparent text-small font-medium text-ink"
            >
              {LANGUAGES.map((l) => (
                <option key={l.code} value={l.code}>
                  {l.label}
                </option>
              ))}
            </select>
          </label>

          <div
            role="group"
            aria-label={copy.themeLabel}
            className="flex rounded-md border border-line bg-surface-card p-0.5"
          >
            {THEMES.map((t) => {
              const Icon = THEME_ICONS[t.id];
              const selected = theme === t.id;
              return (
                <button
                  key={t.id}
                  type="button"
                  aria-pressed={selected}
                  onClick={() => setTheme(t.id)}
                  className={`inline-flex min-h-10 items-center gap-1.5 rounded-sm px-3 text-small font-semibold ${
                    selected
                      ? "bg-brand text-on-brand"
                      : "text-ink-muted hover:bg-surface-200 hover:text-ink"
                  }`}
                >
                  <Icon className="h-4 w-4" aria-hidden="true" />
                  <span>{copy.themes[t.id]}</span>
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </header>
  );
}
