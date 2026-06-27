import {
  Bath,
  HeartPulse,
  Microscope,
  Salad,
  Scissors,
  Siren,
  Sparkles,
  Stethoscope,
  Syringe,
  type LucideIcon,
} from "lucide-react";
import { SectionHeading } from "@/components/section-heading";
import { Reveal } from "@/components/reveal";

type Service = { icon: LucideIcon; title: string; desc: string };

const services: Service[] = [
  {
    icon: Stethoscope,
    title: "Genel Muayene & Check-up",
    desc: "Düzenli kontrollerle dostlarınızın sağlığını korur, sorunları erken yakalarız.",
  },
  {
    icon: Syringe,
    title: "Aşılama & Mikroçip",
    desc: "Koruyucu aşı takvimi ve yasal mikroçip ile kalıcı kimliklendirme.",
  },
  {
    icon: Scissors,
    title: "Kısırlaştırma & Cerrahi",
    desc: "Steril ortamda, anestezi takibiyle güvenli ve titiz operasyonlar.",
  },
  {
    icon: Sparkles,
    title: "Diş Sağlığı",
    desc: "Diş taşı temizliği, ağız bakımı ve düzenli diş kontrolleri.",
  },
  {
    icon: Microscope,
    title: "Laboratuvar & Görüntüleme",
    desc: "Yerinde kan tahlili, dijital röntgen ve ultrason ile hızlı teşhis.",
  },
  {
    icon: HeartPulse,
    title: "Dermatoloji & Dahiliye",
    desc: "Cilt ve iç hastalıklarında uzman teşhis ve tedavi yaklaşımı.",
  },
  {
    icon: Siren,
    title: "Acil Müdahale",
    desc: "Beklenmedik durumlarda 7/24 hızlı, sakin ve etkin destek.",
  },
  {
    icon: Bath,
    title: "Pet Kuaför & Bakım",
    desc: "Tıraş, banyo, tırnak ve kulak bakımıyla bütünsel hijyen.",
  },
  {
    icon: Salad,
    title: "Beslenme Danışmanlığı",
    desc: "Yaşa, ırka ve sağlık durumuna özel kişiselleştirilmiş beslenme planları.",
  },
];

export function Services() {
  return (
    <section id="hizmetler" className="scroll-mt-24 bg-paper py-20 sm:py-24">
      <div className="container-px">
        <SectionHeading eyebrow="Hizmetlerimiz" title="Tek çatı altında bütünsel bakım">
          Koruyucu hekimlikten ileri cerrahiye kadar, dostlarınızın ihtiyaç
          duyabileceği her hizmet aynı şefkatli ekipten.
        </SectionHeading>

        <div className="mt-14 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {services.map(({ icon: Icon, title, desc }, i) => (
            <Reveal key={title} delay={(i % 3) * 70}>
              <article className="group h-full rounded-2xl border border-hairline bg-surface p-6 shadow-soft transition-all duration-200 ease-gentle hover:-translate-y-1 hover:border-brand-200 hover:shadow-card dark:hover:border-brand-700">
                <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-brand-50 text-brand-700 transition-colors duration-200 ease-gentle group-hover:bg-brand-100 dark:bg-brand-900/40 dark:text-brand-200">
                  <Icon className="h-6 w-6" aria-hidden="true" />
                </span>
                <h3 className="mt-5 font-display text-xl font-semibold text-ink">
                  {title}
                </h3>
                <p className="mt-2 text-[0.95rem] leading-relaxed text-muted">
                  {desc}
                </p>
              </article>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
