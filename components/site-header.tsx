"use client";

import { useEffect, useRef, useState } from "react";
import { CalendarCheck, Instagram, Menu, PhoneCall, X } from "lucide-react";
import { Brand } from "@/components/brand";
import { ThemeToggle } from "@/components/theme-toggle";
import { ButtonLink } from "@/components/ui/button";
import { WhatsAppIcon } from "@/components/icons";
import { navLinks, site } from "@/lib/site";
import { cn } from "@/lib/cn";

export function SiteHeader() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const panelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Lock body scroll while the mobile menu is open
  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  // Take the collapsed menu out of the tab order / a11y tree
  useEffect(() => {
    if (panelRef.current) panelRef.current.inert = !open;
  }, [open]);

  return (
    <div id="top">
      {/* Emergency bar */}
      <div className="bg-brand-900 text-white">
        <div className="container-px flex items-center justify-center gap-x-3 py-2 text-[0.8rem] sm:justify-between sm:text-sm">
          <span className="inline-flex flex-wrap items-center justify-center gap-x-2 gap-y-0.5 text-center text-white/85">
            <PhoneCall className="h-4 w-4 shrink-0 text-brand-200" aria-hidden="true" />
            Acil bir durum mu var? Hemen arayın:
            <a
              href={site.phoneHref}
              className="whitespace-nowrap font-semibold text-white underline-offset-4 hover:underline"
            >
              {site.phoneDisplay}
            </a>
          </span>
          <span className="hidden items-center gap-3 sm:inline-flex">
            <span className="text-white/55">Bizi takip edin</span>
            <a
              href={site.social.instagram}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Instagram"
              className="text-white/85 transition-colors hover:text-white"
            >
              <Instagram className="h-[1.05rem] w-[1.05rem]" aria-hidden="true" />
            </a>
            <a
              href={site.whatsapp}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="WhatsApp"
              className="text-white/85 transition-colors hover:text-white"
            >
              <WhatsAppIcon className="h-[1.05rem] w-[1.05rem]" />
            </a>
          </span>
        </div>
      </div>

      {/* Sticky header */}
      <header
        className={cn(
          "sticky top-0 z-50 transition-colors duration-200 ease-gentle",
          scrolled
            ? "border-b border-hairline bg-paper/85 backdrop-blur-md supports-[backdrop-filter]:bg-paper/70"
            : "border-b border-transparent bg-paper"
        )}
      >
        <div className="container-px flex h-[4.5rem] items-center justify-between gap-4">
          <Brand />

          <nav aria-label="Ana menü" className="hidden items-center gap-8 lg:flex">
            {navLinks.map((l) => (
              <a
                key={l.href}
                href={l.href}
                className="text-[0.95rem] font-medium text-ink/80 transition-colors duration-200 ease-gentle hover:text-brand"
              >
                {l.label}
              </a>
            ))}
          </nav>

          <div className="flex items-center gap-2 sm:gap-3">
            <ThemeToggle />
            <ButtonLink
              href="/#iletisim"
              variant="primary"
              size="md"
              className="hidden sm:inline-flex"
            >
              <CalendarCheck className="h-[1.05rem] w-[1.05rem]" aria-hidden="true" />
              Randevu Al
            </ButtonLink>
            <button
              type="button"
              aria-label={open ? "Menüyü kapat" : "Menüyü aç"}
              aria-expanded={open}
              aria-controls="mobile-menu"
              onClick={() => setOpen((v) => !v)}
              className="inline-flex h-10 w-10 items-center justify-center rounded-full text-ink ring-1 ring-hairline transition-colors duration-200 ease-gentle hover:bg-cream lg:hidden"
            >
              {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>
        </div>

        {/* Mobile menu */}
        <div
          id="mobile-menu"
          ref={panelRef}
          className={cn(
            "overflow-hidden border-hairline bg-paper transition-[max-height,opacity] duration-300 ease-gentle lg:hidden",
            open ? "max-h-[24rem] border-t opacity-100" : "max-h-0 opacity-0"
          )}
        >
          <nav aria-label="Mobil menü" className="container-px flex flex-col py-3">
            {navLinks.map((l) => (
              <a
                key={l.href}
                href={l.href}
                onClick={() => setOpen(false)}
                className="border-b border-hairline py-3.5 text-base font-medium text-ink/90 transition-colors hover:text-brand"
              >
                {l.label}
              </a>
            ))}
            <div className="flex flex-col gap-3 pt-4">
              <ButtonLink href="#iletisim" variant="primary" size="lg">
                <CalendarCheck className="h-[1.05rem] w-[1.05rem]" aria-hidden="true" />
                Randevu Al
              </ButtonLink>
              <ButtonLink href={site.phoneHref} variant="secondary" size="lg" external={false}>
                <PhoneCall className="h-[1.05rem] w-[1.05rem]" aria-hidden="true" />
                {site.phoneDisplay}
              </ButtonLink>
            </div>
            <div className="mt-4 flex items-center gap-3 border-t border-hairline pt-4">
              <span className="text-sm text-muted">Bizi takip edin</span>
              <a
                href={site.social.instagram}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Instagram"
                onClick={() => setOpen(false)}
                className="inline-flex h-9 w-9 items-center justify-center rounded-full text-ink ring-1 ring-hairline transition-colors hover:bg-cream"
              >
                <Instagram className="h-[1.05rem] w-[1.05rem]" aria-hidden="true" />
              </a>
              <a
                href={site.whatsapp}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="WhatsApp"
                onClick={() => setOpen(false)}
                className="inline-flex h-9 w-9 items-center justify-center rounded-full text-ink ring-1 ring-hairline transition-colors hover:bg-cream"
              >
                <WhatsAppIcon className="h-[1.05rem] w-[1.05rem]" />
              </a>
            </div>
          </nav>
        </div>
      </header>
    </div>
  );
}
