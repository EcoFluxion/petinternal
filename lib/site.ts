// ── Single source of truth for clinic content (Turkish) ──────────────
import yazPost from "./posts/yaz-sicaginda-pati-bakimi.json";
import disPost from "./posts/dis-tasi-ve-agiz-sagligi.json";
import kediPost from "./posts/kedilerde-kusma.json";
import kopekPost from "./posts/kopek-asi-takvimi.json";
import yavruPost from "./posts/yavru-kedi-beslenmesi.json";
import kisirPost from "./posts/kisirlastirma-rehberi.json";

export const site = {
  name: "Pet Internal Veteriner Kliniği",
  shortName: "Pet Internal",
  phoneDisplay: "0536 290 69 58",
  phoneHref: "tel:+905362906958",
  whatsapp: "https://wa.me/905362906958",
  email: "pati@petinternal.com",
  address: {
    line: "Öveçler, 1335. Sk. 8/B",
    district: "06460 Çankaya / Ankara",
    full: "Öveçler, 1335. Sk. 8/B, 06460 Çankaya/Ankara",
  },
  // Keyless Google Maps embed for the clinic address
  mapsEmbed:
    "https://www.google.com/maps?q=" +
    encodeURIComponent("Öveçler 1335. Sk. 8/B, 06460 Çankaya Ankara") +
    "&z=15&output=embed",
  mapsLink:
    "https://www.google.com/maps/search/?api=1&query=" +
    encodeURIComponent("Öveçler 1335. Sk. 8/B, 06460 Çankaya Ankara"),
  hours: [
    { day: "Pazartesi – Cuma", time: "09:00 – 20:00" },
    { day: "Cumartesi – Pazar", time: "10:00 – 18:00" },
    { day: "Acil servis", time: "7/24 açık" },
  ],
  social: {
    instagram: "https://www.instagram.com/petinternal/",
  },
} as const;

// Root-anchored so they work from any route (e.g. /blog/...), not just home.
export const navLinks = [
  { label: "Hizmetler", href: "/#hizmetler" },
  { label: "Hakkımızda", href: "/#hakkimizda" },
  { label: "Blog", href: "/blog" },
  { label: "İletişim", href: "/#iletisim" },
] as const;

export type BlogBlock =
  | { type: "h2"; text: string }
  | { type: "p"; text: string }
  | { type: "ul"; items: string[] }
  | { type: "callout"; text: string };

export type FAQ = { q: string; a: string };

export type BlogPost = {
  slug: string;
  title: string;
  category: string;
  excerpt: string;
  image: string;
  imageAlt: string;
  readTime: string;
  date: string;
  dateISO: string;
  updatedISO: string;
  keywords: string[];
  intro: string;
  body: BlogBlock[];
  faqs: FAQ[];
};

// Long-form articles live as JSON in lib/posts/*.json (ordered freshest first).
export const blogPosts: BlogPost[] = [
  yazPost,
  disPost,
  kediPost,
  kopekPost,
  yavruPost,
  kisirPost,
] as unknown as BlogPost[];

export function getPost(slug: string): BlogPost | undefined {
  return blogPosts.find((p) => p.slug === slug);
}

export type Testimonial = {
  quote: string;
  name: string;
  pet: string;
};

export const testimonials: Testimonial[] = [
  {
    quote:
      "Pamuk'umuz için gece yarısı aradığımızda bile bizi geri çevirmediler. Gösterdikleri ilgi ve şefkat için minnettarız.",
    name: "Elif K.",
    pet: "Pamuk · Kedi",
  },
  {
    quote:
      "Köpeğimiz Zeytin'in ameliyatı çok titiz yapıldı ve süreç boyunca sürekli bilgilendirildik. Gönül rahatlığıyla güveniyoruz.",
    name: "Mert A.",
    pet: "Zeytin · Köpek",
  },
  {
    quote:
      "Yıllardır tüm kontrolleri burada yaptırıyoruz. Hem hekimler hem de ekip inanılmaz sıcakkanlı ve ilgili.",
    name: "Selin D.",
    pet: "Duman · Kedi",
  },
];
