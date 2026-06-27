"use client";

import { useEffect, useState } from "react";
import { Cookie } from "lucide-react";

const STORAGE_KEY = "pi-cookie-consent";

export function CookieConsent() {
  const [show, setShow] = useState(false);

  useEffect(() => {
    try {
      if (!localStorage.getItem(STORAGE_KEY)) setShow(true);
    } catch {
      /* localStorage unavailable — stay hidden */
    }
  }, []);

  function decide(value: "accepted" | "rejected") {
    try {
      localStorage.setItem(STORAGE_KEY, value);
    } catch {
      /* ignore */
    }
    setShow(false);
  }

  if (!show) return null;

  return (
    <section
      aria-label="Çerez bildirimi"
      className="animate-fade-up fixed inset-x-3 bottom-3 z-[60] sm:inset-x-auto sm:bottom-5 sm:left-5 sm:max-w-sm"
    >
      <div className="rounded-2xl border border-hairline bg-surface p-4 shadow-lift">
        <div className="flex items-start gap-3">
          <span className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-brand-100 text-brand-700 dark:bg-brand-900/50 dark:text-brand-200">
            <Cookie className="h-[1.1rem] w-[1.1rem]" aria-hidden="true" />
          </span>
          <div className="min-w-0">
            <p className="text-sm leading-relaxed text-ink/90">
              Size daha iyi bir deneyim sunmak için çerezler kullanıyoruz.
            </p>
            <div className="mt-3 flex flex-wrap gap-2">
              <button
                type="button"
                onClick={() => decide("accepted")}
                className="rounded-full bg-brand-600 px-4 py-2 text-sm font-medium text-white shadow-soft transition-colors duration-200 ease-gentle hover:bg-brand-700"
              >
                Kabul Et
              </button>
              <button
                type="button"
                onClick={() => decide("rejected")}
                className="rounded-full px-4 py-2 text-sm font-medium text-ink ring-1 ring-hairline transition-colors duration-200 ease-gentle hover:bg-cream"
              >
                Reddet
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
