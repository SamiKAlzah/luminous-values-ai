"use client";

import Image from "next/image";
import { useLanguage } from "./LanguageProvider";

/*
 * The programme's gold calligraphy logo on its own black stage. The image
 * carries its own dark ground, so it is shown as a framed panel in every theme
 * rather than being recoloured. The crop keeps the whole wordmark; only the
 * empty black above and the floor reflection below are trimmed as it widens.
 */
export default function BrandBanner({ className = "" }: { className?: string }) {
  const { copy } = useLanguage();

  return (
    <div
      className={`overflow-hidden rounded-xl border border-ornament-gold/40 bg-black shadow-md ${className}`}
    >
      <Image
        src="/brand/qiyam-mudiaa-logo.jpg"
        alt={copy.siteName}
        width={2000}
        height={835}
        priority
        className="aspect-[2/1] w-full object-cover object-center sm:aspect-[3/1] lg:aspect-[4/1]"
      />
    </div>
  );
}
