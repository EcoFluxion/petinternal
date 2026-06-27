import Image from "next/image";
import { Check, Stethoscope } from "lucide-react";
import { ButtonLink } from "@/components/ui/button";

const points = [
  "10+ yıl klinik deneyimi",
  "Güncel tıbbi protokoller ve sürekli eğitim",
  "Şeffaf fiyatlandırma ve net bilgilendirme",
  "7/24 ulaşılabilir acil hat",
];

export function About() {
  return (
    <section id="hakkimizda" className="scroll-mt-24 bg-cream py-20 sm:py-24">
      <div className="container-px grid grid-cols-1 items-center gap-12 lg:grid-cols-2 lg:gap-16">
        {/* Photo */}
        <div className="relative mx-auto w-full max-w-md lg:mx-0">
          <div className="relative aspect-square overflow-hidden rounded-[1.75rem] bg-cream shadow-lift ring-1 ring-black/5">
            <Image
              src="/images/oyku.png"
              alt="Uzman Veteriner Hekim Öykü Yalçın"
              fill
              sizes="(max-width: 1024px) 90vw, 40vw"
              className="object-cover"
            />
          </div>
          {/* Name plate */}
          <div className="absolute -bottom-5 left-4 flex items-center gap-3 rounded-2xl border border-hairline bg-surface/95 px-4 py-3 shadow-card backdrop-blur-sm sm:left-6">
            <span className="flex h-10 w-10 items-center justify-center rounded-full bg-brand-100 text-brand-700 dark:bg-brand-900/50 dark:text-brand-200">
              <Stethoscope className="h-5 w-5" aria-hidden="true" />
            </span>
            <span className="leading-tight">
              <span className="block font-display text-[0.95rem] font-semibold text-ink">
                Öykü Yalçın
              </span>
              <span className="block text-xs text-muted">
                Uzman Veteriner Hekim
              </span>
            </span>
          </div>
        </div>

        {/* Copy */}
        <div>
          <span className="eyebrow">Hakkımızda</span>
          <h2 className="mt-3 text-balance font-display text-3xl font-semibold leading-tight tracking-tight text-ink sm:text-4xl">
            Mahallenizin güvendiği veteriner kliniği
          </h2>
          <p className="mt-5 text-lg leading-relaxed text-muted">
            Pet Internal olarak Çankaya Öveçler'de, patili dostlarınıza kendi
            ailemizden biriymiş gibi yaklaşıyoruz. Modern tıbbi donanımı; sabırlı,
            şeffaf ve şefkatli bir yaklaşımla birleştiriyoruz.
          </p>
          <p className="mt-4 text-lg leading-relaxed text-muted">
            Uzman veteriner hekimimiz Öykü Yalçın ve ekibiyle amacımız yalnızca
            tedavi etmek değil; doğru bilgilendirme ve koruyucu hekimlikle
            dostlarınızın yıllar boyunca sağlıklı ve mutlu kalmasını sağlamak.
          </p>

          <ul className="mt-7 grid grid-cols-1 gap-3 sm:grid-cols-2">
            {points.map((p) => (
              <li key={p} className="flex items-start gap-3">
                <span className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-brand-100 text-brand-700 dark:bg-brand-900/50 dark:text-brand-200">
                  <Check className="h-4 w-4" aria-hidden="true" />
                </span>
                <span className="text-[0.95rem] font-medium text-ink/90">{p}</span>
              </li>
            ))}
          </ul>

          <div className="mt-9">
            <ButtonLink href="/#iletisim" variant="primary" size="lg">
              Randevu Al
            </ButtonLink>
          </div>
        </div>
      </div>
    </section>
  );
}
