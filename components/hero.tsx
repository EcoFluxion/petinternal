import Image from "next/image";
import { MapPin, PawPrint, Star } from "lucide-react";
import { ButtonLink } from "@/components/ui/button";
import { WhatsAppIcon } from "@/components/icons";
import { site } from "@/lib/site";

export function Hero() {
  return (
    <section className="relative overflow-hidden">
      {/* restrained decorative wash behind the photo only — not a hero gradient */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute right-[-10%] top-[-10%] hidden h-[36rem] w-[36rem] rounded-full bg-brand-100/50 blur-3xl dark:bg-brand-900/30 lg:block"
      />
      <div className="container-px relative grid grid-cols-1 items-center gap-12 py-14 sm:py-20 lg:grid-cols-12 lg:gap-10 lg:py-24">
        {/* Copy */}
        <div className="lg:col-span-6 lg:pr-6">
          <span className="eyebrow">
            <PawPrint className="h-4 w-4" aria-hidden="true" />
            Çankaya · Ankara
          </span>
          <h1 className="mt-5 text-balance font-display text-4xl font-semibold leading-[1.08] tracking-tight text-ink sm:text-5xl lg:text-[3.4rem]">
            Patili dostlarınıza{" "}
            <span className="text-brand">şefkatle ve uzmanlıkla</span> bakıyoruz.
          </h1>
          <p className="mt-6 max-w-xl text-lg leading-relaxed text-muted">
            Çankaya Öveçler'de; uzman veteriner hekimimiz Öykü Yalçın ve ekibiyle,
            modern tıbbi donanımı sıcak ve sabırlı bir yaklaşımla birleştiriyoruz.
            Kedi, köpek ve tüm dostlarınız için koruyucu hekimlikten cerrahiye
            bütünsel sağlık hizmeti.
          </p>

          <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center">
            <ButtonLink href="/#iletisim" variant="primary" size="lg">
              Randevu Al
            </ButtonLink>
            <ButtonLink href={site.whatsapp} variant="secondary" size="lg">
              <WhatsAppIcon className="h-[1.15rem] w-[1.15rem]" />
              WhatsApp'tan Yaz
            </ButtonLink>
          </div>

          <div className="mt-8 flex items-center gap-2 text-sm text-muted">
            <MapPin className="h-4 w-4 text-brand" aria-hidden="true" />
            Öveçler, 1335. Sk. — bugün randevuya açığız
          </div>
        </div>

        {/* Photo + overlapping card */}
        <div className="lg:col-span-6">
          <div className="relative mx-auto max-w-md lg:ml-auto lg:mr-0">
            <div className="relative aspect-[4/5] overflow-hidden rounded-[1.75rem] bg-cream shadow-lift ring-1 ring-black/5">
              <Image
                src="/images/hero-pet-care.jpg"
                alt="Sahibinin kucağında huzurla dinlenen bir kedi"
                fill
                priority
                sizes="(max-width: 1024px) 90vw, 38vw"
                className="object-cover"
              />
            </div>

            {/* Floating rating card */}
            <div className="absolute -bottom-5 -left-2 w-[13.5rem] rounded-2xl border border-hairline bg-surface/95 p-4 shadow-card backdrop-blur-sm sm:-left-6 sm:w-[14.5rem]">
              <div
                className="flex items-center gap-1 text-gold"
                role="img"
                aria-label="5 üzerinden 5 yıldız"
              >
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star key={i} className="h-5 w-5 fill-current" aria-hidden="true" />
                ))}
              </div>
              <p className="mt-2.5 text-sm text-muted">
                Pati dostlarının bizleri değerlendirmesi
              </p>
            </div>

            {/* small 7/24 pill */}
            <div className="absolute -right-3 top-5 rounded-full border border-hairline bg-surface/95 px-3.5 py-1.5 text-xs font-semibold text-brand shadow-soft backdrop-blur-sm">
              7/24 Acil Açık
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
