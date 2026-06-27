"use client";

import { useId, useState } from "react";
import { Plus } from "lucide-react";
import type { FAQ } from "@/lib/site";

/**
 * Sliding FAQ accordion — open/close animates height + opacity (grid-rows trick),
 * with a rotating "+" icon. Mirrors the mevzuatbot collapsible feel.
 */
export function FaqAccordion({ items }: { items: FAQ[] }) {
  return (
    <div className="mt-4 divide-y divide-hairline overflow-hidden rounded-2xl border border-hairline bg-surface px-5">
      {items.map((f, i) => (
        <FaqItem key={i} faq={f} />
      ))}
    </div>
  );
}

function FaqItem({ faq }: { faq: FAQ }) {
  const [open, setOpen] = useState(false);
  const panelId = useId();

  return (
    <div>
      <button
        type="button"
        aria-expanded={open}
        aria-controls={panelId}
        onClick={() => setOpen((o) => !o)}
        className="flex w-full items-center justify-between gap-4 py-4 text-left font-medium text-ink transition-colors duration-200 ease-gentle hover:text-brand"
      >
        <span>{faq.q}</span>
        <Plus
          className={
            "h-5 w-5 shrink-0 text-brand transition-transform duration-300 ease-gentle " +
            (open ? "rotate-45" : "rotate-0")
          }
          aria-hidden="true"
        />
      </button>
      <div
        id={panelId}
        role="region"
        className={
          "grid transition-all duration-300 ease-gentle " +
          (open ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0")
        }
      >
        <div className="overflow-hidden">
          <p className="pb-4 leading-relaxed text-muted">{faq.a}</p>
        </div>
      </div>
    </div>
  );
}
