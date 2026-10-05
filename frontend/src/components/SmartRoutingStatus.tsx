"use client";

import { useEffect, useState } from "react";
import { useLanguage } from "./LanguageProvider";

type Status = "unknown" | "available" | "unavailable";

/** Asks the function whether an API key is configured. "Configured" is not "tested". */
export default function SmartRoutingStatus() {
  const { copy } = useLanguage();
  const [status, setStatus] = useState<Status>("unknown");

  useEffect(() => {
    const controller = new AbortController();
    fetch("/.netlify/functions/route", { signal: controller.signal })
      .then((r) => (r.ok ? r.json() : null))
      .then((body: unknown) => {
        if (typeof body === "object" && body !== null && "available" in body) {
          setStatus((body as { available: unknown }).available === true ? "available" : "unavailable");
        }
      })
      .catch(() => {});
    return () => controller.abort();
  }, []);

  const label = {
    available: copy.about.statusAvailable,
    unavailable: copy.about.statusUnavailable,
    unknown: copy.about.statusUnknown,
  }[status];

  return (
    <p className="text-body text-ink">
      <span className="font-semibold">{copy.about.statusTitle}: </span>
      <span role="status">{label}</span>
    </p>
  );
}
