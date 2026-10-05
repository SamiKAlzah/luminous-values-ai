"use client";

import { useRef, useState } from "react";
import { Search } from "lucide-react";
import { requestRoute } from "../lib/routeClient";
import type { RouteResponse } from "../lib/types";
import Button from "./Button";
import { useLanguage } from "./LanguageProvider";

const MAX_CHARS = 500;

interface RouterBoxProps {
  onResult: (result: RouteResponse) => void;
  /** Injected in tests; defaults to the real client. */
  route?: (text: string) => Promise<RouteResponse>;
}

export default function RouterBox({ onResult, route = requestRoute }: RouterBoxProps) {
  const { copy } = useLanguage();
  const [text, setText] = useState("");
  const [pending, setPending] = useState(false);
  // A ref, not state, so a second Enter in the same tick cannot slip past the guard.
  const inFlight = useRef(false);

  async function submit() {
    if (inFlight.current || text.trim().length === 0) return;
    inFlight.current = true;
    setPending(true);
    try {
      onResult(await route(text));
    } finally {
      inFlight.current = false;
      setPending(false);
    }
  }

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        void submit();
      }}
      aria-busy={pending}
      className="rounded-lg border border-line bg-surface-card p-5 shadow-sm sm:p-6"
    >
      <label htmlFor="situation" className="text-h3 font-bold text-ink">
        {copy.router.label}
      </label>
      <textarea
        id="situation"
        value={text}
        maxLength={MAX_CHARS}
        rows={4}
        onChange={(e) => setText(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === "Enter" && !e.shiftKey && !e.nativeEvent.isComposing) {
            e.preventDefault();
            void submit();
          }
        }}
        placeholder={copy.router.placeholder}
        aria-describedby="router-notes"
        className="mt-3 w-full resize-y rounded-md border border-line bg-surface-100 p-3 text-body text-ink placeholder:text-ink-muted"
      />
      <div className="mt-1 text-end text-caption text-ink-muted" aria-live="off">
        {text.length} / {MAX_CHARS} {copy.router.counter}
      </div>

      <div className="mt-3 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div id="router-notes" className="space-y-1 text-small text-ink-muted">
          <p className="font-semibold text-ink">{copy.router.aiNotice}</p>
          <p>{copy.router.privacy}</p>
        </div>
        <Button type="submit" disabled={pending || text.trim().length === 0} className="sm:min-w-44">
          <Search className="h-4 w-4" aria-hidden="true" />
          {pending ? copy.router.submitting : copy.router.submit}
        </Button>
      </div>
    </form>
  );
}
