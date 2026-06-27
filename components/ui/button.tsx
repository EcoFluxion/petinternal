import type { ReactNode } from "react";
import { cn } from "@/lib/cn";

type Variant = "primary" | "secondary" | "ghost" | "onBrand" | "onBrandOutline";
type Size = "sm" | "md" | "lg";

const base =
  "inline-flex items-center justify-center gap-2 rounded-full font-medium transition-colors duration-200 ease-gentle focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand focus-visible:ring-offset-2 focus-visible:ring-offset-paper";

const sizes: Record<Size, string> = {
  sm: "px-4 py-2 text-sm",
  md: "px-5 py-2.5 text-[0.95rem]",
  lg: "px-6 py-3 text-base",
};

const variants: Record<Variant, string> = {
  primary: "bg-brand-600 text-white shadow-soft hover:bg-brand-700",
  secondary:
    "bg-surface text-ink ring-1 ring-hairline hover:bg-cream hover:ring-brand-300 dark:hover:ring-brand-700",
  ghost: "text-ink hover:bg-cream",
  onBrand: "bg-white text-brand-700 shadow-soft hover:bg-cream",
  onBrandOutline:
    "text-white ring-1 ring-white/40 hover:bg-white/10 hover:ring-white/70",
};

type Props = {
  href: string;
  children: ReactNode;
  variant?: Variant;
  size?: Size;
  className?: string;
  external?: boolean;
  ariaLabel?: string;
};

export function ButtonLink({
  href,
  children,
  variant = "primary",
  size = "md",
  className,
  external,
  ariaLabel,
}: Props) {
  const isExternal = external ?? href.startsWith("http");
  return (
    <a
      href={href}
      aria-label={ariaLabel}
      {...(isExternal ? { target: "_blank", rel: "noopener noreferrer" } : {})}
      className={cn(base, sizes[size], variants[variant], className)}
    >
      {children}
    </a>
  );
}
