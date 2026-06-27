import { Clock, Instagram, Mail, MapPin, PawPrint, Phone } from "lucide-react";
import { Brand } from "@/components/brand";
import { WhatsAppIcon } from "@/components/icons";
import { navLinks, site } from "@/lib/site";

const socials = [
  { icon: Instagram, href: site.social.instagram, label: "Instagram" },
  { icon: WhatsAppIcon, href: site.whatsapp, label: "WhatsApp" },
];

export function SiteFooter() {
  return (
    <footer className="bg-brand-950 text-brand-100">
      <div className="container-px py-14 sm:py-16">
        <div className="grid grid-cols-1 gap-10 md:grid-cols-2 lg:grid-cols-12 lg:gap-8">
          {/* Brand */}
          <div className="lg:col-span-4">
            <Brand tone="light" />
            <p className="mt-4 max-w-xs text-sm leading-relaxed text-brand-200/80">
              Çankaya Öveçler'de patili dostlarınız için modern, şefkatli ve
              güvenilir veteriner hizmeti.
            </p>
            <div className="mt-5 flex items-center gap-2.5">
              {socials.map(({ icon: Icon, href, label }) => (
                <a
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={label}
                  className="flex h-10 w-10 items-center justify-center rounded-full bg-white/10 text-white transition-colors duration-200 ease-gentle hover:bg-brand-600"
                >
                  <Icon className="h-[1.1rem] w-[1.1rem]" aria-hidden="true" />
                </a>
              ))}
            </div>
          </div>

          {/* Quick links */}
          <nav aria-label="Alt menü" className="lg:col-span-2">
            <h3 className="font-display text-sm font-semibold uppercase tracking-wider text-white">
              Hızlı Erişim
            </h3>
            <ul className="mt-4 space-y-2.5 text-sm">
              {navLinks.map((l) => (
                <li key={l.href}>
                  <a
                    href={l.href}
                    className="text-brand-200/85 transition-colors hover:text-white"
                  >
                    {l.label}
                  </a>
                </li>
              ))}
            </ul>
          </nav>

          {/* Contact */}
          <div className="lg:col-span-3">
            <h3 className="font-display text-sm font-semibold uppercase tracking-wider text-white">
              İletişim
            </h3>
            <ul className="mt-4 space-y-3 text-sm text-brand-200/85">
              <li className="flex items-start gap-2.5">
                <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-brand-300" aria-hidden="true" />
                <span>
                  {site.address.line}, {site.address.district}
                </span>
              </li>
              <li className="flex items-center gap-2.5">
                <Phone className="h-4 w-4 shrink-0 text-brand-300" aria-hidden="true" />
                <a href={site.phoneHref} className="transition-colors hover:text-white">
                  {site.phoneDisplay}
                </a>
              </li>
              <li className="flex items-center gap-2.5">
                <Mail className="h-4 w-4 shrink-0 text-brand-300" aria-hidden="true" />
                <a href={`mailto:${site.email}`} className="transition-colors hover:text-white">
                  {site.email}
                </a>
              </li>
            </ul>
          </div>

          {/* Hours */}
          <div className="lg:col-span-3">
            <h3 className="font-display text-sm font-semibold uppercase tracking-wider text-white">
              Çalışma Saatleri
            </h3>
            <ul className="mt-4 space-y-2 text-sm text-brand-200/85">
              {site.hours.map((h) => (
                <li key={h.day} className="flex items-center justify-between gap-3">
                  <span className="flex items-center gap-2">
                    <Clock className="h-3.5 w-3.5 text-brand-300" aria-hidden="true" />
                    {h.day}
                  </span>
                  <span className="font-medium text-white/90">{h.time}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="mt-12 flex flex-col items-center justify-between gap-3 border-t border-white/10 pt-7 text-sm text-brand-200/70 sm:flex-row">
          <p>© 2026 {site.name}. Tüm hakları saklıdır.</p>
          <p className="inline-flex items-center gap-1.5">
            Çankaya · Ankara'da sevgiyle
            <PawPrint className="h-4 w-4 text-brand-300" aria-hidden="true" />
          </p>
        </div>
      </div>
    </footer>
  );
}
