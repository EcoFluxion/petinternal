import { Clock, Mail, MapPin, Phone } from "lucide-react";
import { ContactForm } from "@/components/contact-form";
import { site } from "@/lib/site";

export function Contact() {
  return (
    <section id="iletisim" className="scroll-mt-24 bg-paper py-20 sm:py-24">
      <div className="container-px">
        <div className="max-w-2xl">
          <span className="eyebrow">İletişim</span>
          <h2 className="mt-3 text-balance font-display text-3xl font-semibold leading-tight tracking-tight text-ink sm:text-4xl">
            Çankaya'da, yanı başınızdayız
          </h2>
          <p className="mt-4 text-lg leading-relaxed text-muted">
            Randevu, soru ya da acil bir durum — bize ulaşmanın en kolay yolunu
            seçin.
          </p>
        </div>

        <div className="mt-12 grid grid-cols-1 gap-8 lg:grid-cols-2">
          {/* Details + map */}
          <div className="flex flex-col gap-6">
            <ul className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <li className="flex items-start gap-3.5 rounded-2xl border border-hairline bg-surface p-5 shadow-soft">
                <span className="mt-0.5 flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-brand-100 text-brand-700 dark:bg-brand-900/50 dark:text-brand-200">
                  <MapPin className="h-5 w-5" aria-hidden="true" />
                </span>
                <span className="text-sm leading-relaxed">
                  <span className="block font-semibold text-ink">Adres</span>
                  <a
                    href={site.mapsLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-muted transition-colors hover:text-brand"
                  >
                    {site.address.line}, {site.address.district}
                  </a>
                </span>
              </li>

              <li className="flex items-start gap-3.5 rounded-2xl border border-hairline bg-surface p-5 shadow-soft">
                <span className="mt-0.5 flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-brand-100 text-brand-700 dark:bg-brand-900/50 dark:text-brand-200">
                  <Phone className="h-5 w-5" aria-hidden="true" />
                </span>
                <span className="text-sm leading-relaxed">
                  <span className="block font-semibold text-ink">Telefon</span>
                  <a
                    href={site.phoneHref}
                    className="text-muted transition-colors hover:text-brand"
                  >
                    {site.phoneDisplay}
                  </a>
                </span>
              </li>

              <li className="flex items-start gap-3.5 rounded-2xl border border-hairline bg-surface p-5 shadow-soft">
                <span className="mt-0.5 flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-brand-100 text-brand-700 dark:bg-brand-900/50 dark:text-brand-200">
                  <Mail className="h-5 w-5" aria-hidden="true" />
                </span>
                <span className="text-sm leading-relaxed">
                  <span className="block font-semibold text-ink">E-posta</span>
                  <a
                    href={`mailto:${site.email}`}
                    className="text-muted transition-colors hover:text-brand"
                  >
                    {site.email}
                  </a>
                </span>
              </li>

              <li className="flex items-start gap-3.5 rounded-2xl border border-hairline bg-surface p-5 shadow-soft">
                <span className="mt-0.5 flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-brand-100 text-brand-700 dark:bg-brand-900/50 dark:text-brand-200">
                  <Clock className="h-5 w-5" aria-hidden="true" />
                </span>
                <span className="text-sm leading-relaxed">
                  <span className="block font-semibold text-ink">Çalışma Saatleri</span>
                  <span className="mt-1 block space-y-1 text-muted">
                    {site.hours.map((h) => (
                      <span
                        key={h.day}
                        className="flex items-center justify-between gap-3"
                      >
                        <span className="whitespace-nowrap">{h.day}</span>
                        <span className="whitespace-nowrap font-medium text-ink/80">
                          {h.time}
                        </span>
                      </span>
                    ))}
                  </span>
                </span>
              </li>
            </ul>

            <div className="overflow-hidden rounded-2xl border border-hairline shadow-soft">
              <iframe
                title="Pet Internal Veteriner Kliniği konum haritası"
                src={site.mapsEmbed}
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                className="h-[300px] w-full border-0 grayscale-[0.15]"
              />
            </div>
          </div>

          {/* Form */}
          <ContactForm />
        </div>
      </div>
    </section>
  );
}
