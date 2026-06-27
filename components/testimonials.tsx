import { Quote, Star } from "lucide-react";
import { SectionHeading } from "@/components/section-heading";
import { Reveal } from "@/components/reveal";
import { testimonials } from "@/lib/site";

export function Testimonials() {
  return (
    <section className="bg-cream py-20 sm:py-24">
      <div className="container-px">
        <SectionHeading eyebrow="Pati Aileleri" title="Bize güvenen ailelerin sözleri">
          Çankaya'dan yüzlerce pati sahibi, dostlarını yıllardır bize emanet ediyor.
        </SectionHeading>

        <div className="mt-14 grid grid-cols-1 gap-6 md:grid-cols-3">
          {testimonials.map((t, i) => (
            <Reveal key={t.name} delay={(i % 3) * 80}>
              <figure className="flex h-full flex-col rounded-2xl border border-hairline bg-surface p-6 shadow-soft sm:p-7">
                <Quote className="h-7 w-7 text-brand-300" aria-hidden="true" />
                <div className="mt-3 flex items-center gap-0.5 text-gold" aria-label="5 üzerinden 5 yıldız">
                  {Array.from({ length: 5 }).map((_, s) => (
                    <Star key={s} className="h-4 w-4 fill-current" aria-hidden="true" />
                  ))}
                </div>
                <blockquote className="mt-4 flex-1 text-[1.02rem] leading-relaxed text-ink/90">
                  “{t.quote}”
                </blockquote>
                <figcaption className="mt-6 flex items-center gap-3 border-t border-hairline pt-5">
                  <span
                    aria-hidden="true"
                    className="flex h-11 w-11 items-center justify-center rounded-full bg-brand-100 font-display text-lg font-semibold text-brand-700 dark:bg-brand-900/50 dark:text-brand-200"
                  >
                    {t.name.charAt(0)}
                  </span>
                  <span className="leading-tight">
                    <span className="block font-semibold text-ink">{t.name}</span>
                    <span className="block text-sm text-muted">{t.pet}</span>
                  </span>
                </figcaption>
              </figure>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
