"use client";

import { useLanguage } from "./LanguageProvider";

export default function SiteFooter() {
  const { copy } = useLanguage();

  return (
    <footer className="mt-16 w-full bg-surface-deep text-ink-on-deep">
      <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-4 px-4 py-8 text-small sm:px-6 md:flex-row lg:px-8">
        <p className="font-bold">{copy.footer.line}</p>
        <p className="text-center">{copy.footer.partners}</p>
        <p>{copy.footer.license}</p>
      </div>
    </footer>
  );
}
