import { PawPrint, Phone } from "lucide-react";
import { ButtonLink } from "@/components/ui/button";
import { site } from "@/lib/site";

export function CtaBand() {
  return (
    <section className="bg-paper py-16 sm:py-20">
      <div className="container-px">
        <div className="relative overflow-hidden rounded-[2rem] bg-brand-800 px-6 py-12 text-center shadow-lift sm:px-12 sm:py-16">
          {/* restrained single-tone decorative paw, not a rainbow gradient */}
          <PawPrint
            aria-hidden="true"
            className="pointer-events-none absolute -right-6 -top-6 h-40 w-40 rotate-12 text-white/5"
          />
          <PawPrint
            aria-hidden="true"
            className="pointer-events-none absolute -bottom-10 -left-8 h-44 w-44 -rotate-12 text-white/5"
          />
          <div className="relative mx-auto max-w-2xl">
            <h2 className="text-balance font-display text-3xl font-semibold leading-tight tracking-tight text-white sm:text-4xl">
              Dostunuzun sağlığı için bugün bir adım atın
            </h2>
            <p className="mt-4 text-lg leading-relaxed text-brand-100">
              Randevu oluşturun ya da hemen bizi arayın — Çankaya Öveçler'de
              yanınızdayız.
            </p>
            <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
              <ButtonLink href="/#iletisim" variant="onBrand" size="lg">
                Randevu Al
              </ButtonLink>
              <ButtonLink
                href={site.phoneHref}
                variant="onBrandOutline"
                size="lg"
                external={false}
              >
                <Phone className="h-[1.1rem] w-[1.1rem]" aria-hidden="true" />
                Ara: {site.phoneDisplay}
              </ButtonLink>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
