import Image from "next/image";
import { cn } from "@/lib/cn";
import { site } from "@/lib/site";

export function Brand({
  tone = "default",
  className,
}: {
  tone?: "default" | "light";
  className?: string;
}) {
  return (
    <a
      href="/"
      aria-label={`${site.name} ana sayfa`}
      className={cn(
        "group inline-flex items-center gap-2.5 rounded-xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand focus-visible:ring-offset-2 focus-visible:ring-offset-paper",
        className
      )}
    >
      <Image
        src="/logo-icon.png"
        alt=""
        width={44}
        height={44}
        className="h-10 w-10 rounded-[0.65rem] shadow-soft transition-transform duration-200 ease-gentle group-hover:-translate-y-0.5"
        priority
      />
      <span className="flex flex-col leading-tight">
        <span
          className={cn(
            "font-display text-[1.15rem] font-semibold tracking-tight",
            tone === "light" ? "text-white" : "text-ink"
          )}
        >
          Pet Internal
        </span>
        <span
          className={cn(
            "text-[0.68rem] font-medium uppercase tracking-[0.18em]",
            tone === "light" ? "text-white/60" : "text-muted"
          )}
        >
          Veteriner Kliniği
        </span>
      </span>
    </a>
  );
}
