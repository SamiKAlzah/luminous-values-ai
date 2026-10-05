"use client";

import { useLanguage } from "./LanguageProvider";

export default function SkipLink() {
  const { copy } = useLanguage();

  return (
    <a
      href="#main"
      className="sr-only rounded-md bg-brand px-4 py-2 text-small font-bold text-on-brand focus:not-sr-only focus:absolute focus:start-4 focus:top-4 focus:z-[60]"
    >
      {copy.skipLink}
    </a>
  );
}
