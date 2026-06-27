import type { ReactNode } from "react";
import { cn } from "@/lib/cn";

export function SectionHeading({
  eyebrow,
  title,
  children,
  align = "center",
}: {
  eyebrow: string;
  title: ReactNode;
  children?: ReactNode;
  align?: "center" | "left";
}) {
  return (
    <div
      className={cn(
        "max-w-2xl",
        align === "center" ? "mx-auto text-center" : ""
      )}
    >
      <span className="eyebrow">{eyebrow}</span>
      <h2 className="mt-3 text-balance font-display text-3xl font-semibold leading-tight tracking-tight text-ink sm:text-4xl">
        {title}
      </h2>
      {children ? (
        <p className="mt-4 text-pretty text-lg leading-relaxed text-muted">
          {children}
        </p>
      ) : null}
    </div>
  );
}
