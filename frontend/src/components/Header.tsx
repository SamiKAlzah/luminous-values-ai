"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Globe2, Moon, Gem, Sun } from "lucide-react";
import AudioPlayer from "./AudioPlayer";
import { Khatam } from "./Ornament";
import { THEMES, useTheme, type ThemeId } from "./useTheme";

interface HeaderProps {
  language: string;
  onLanguageChange: (lang: string) => void;
}

const LANGUAGES = [
  { code: "ar", label: "العربية" },
  { code: "en", label: "English" },
  { code: "fr", label: "Français" },
  { code: "ur", label: "اردو" },
];

const NAV = [
  { href: "/", label: "الرحلة" },
  { href: "/about", label: "حول المنصة والتحقق" },
];

const THEME_ICONS: Record<ThemeId, React.ComponentType<{ className?: string }>> = {
  light: Sun,
  dark: Moon,
  emerald: Gem,
};

export default function Header({ language, onLanguageChange }: HeaderProps) {
  const pathname = usePathname();
  const { theme, setTheme } = useTheme();

  return (
    <header className="sticky top-0 z-50 w-full border-b border-line bg-surface-100">
      <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-x-4 gap-y-2 px-4 py-3 sm:px-6 lg:px-8">
        {/* الهوية */}
        <Link href="/" className="flex items-center gap-3 rounded-md">
          <Khatam size={36} />
          <span className="flex flex-col">
            <span className="text-h3 font-bold text-ink">
              قيم مضيئة <span className="text-small font-semibold text-brand">AI</span>
            </span>
            <span className="hidden text-caption text-ink-muted sm:block">
              تهدي الروح إلى هدوئها، وترتقي بالسلوك إلى غايته
            </span>
          </span>
        </Link>

        {/* التنقل */}
        <nav aria-label="التنقل الرئيسي" className="order-last flex w-full gap-1 md:order-none md:w-auto">
          {NAV.map((item) => {
            const active = pathname === item.href;
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

        {/* الأدوات: الصوت واللغة والمظهر */}
        <div className="flex flex-wrap items-center gap-2">
          <AudioPlayer />

          <label className="flex min-h-11 items-center gap-2 rounded-md border border-line bg-surface-card px-3 text-small text-ink">
            <Globe2 className="h-4 w-4 text-brand" aria-hidden="true" />
            <span className="sr-only">لغة العرض</span>
            <select
              value={language}
              onChange={(e) => onLanguageChange(e.target.value)}
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
            aria-label="المظهر"
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
                  <span>{t.name}</span>
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </header>
  );
}
