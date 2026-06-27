import type { Metadata, Viewport } from "next";
import { Fraunces, Inter } from "next/font/google";
import { ThemeProvider } from "@/components/theme-provider";
import { WhatsAppFab } from "@/components/whatsapp-fab";
import { site } from "@/lib/site";
import "./globals.css";

const fraunces = Fraunces({
  subsets: ["latin", "latin-ext"],
  variable: "--font-fraunces",
  display: "swap",
});

const inter = Inter({
  subsets: ["latin", "latin-ext"],
  variable: "--font-inter",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://petinternal.com"),
  title: {
    default: `${site.name} · Çankaya, Ankara`,
    template: `%s · ${site.shortName}`,
  },
  description:
    "Çankaya Öveçler'de modern ve şefkatli veteriner hizmeti. Genel muayene, aşılama, kısırlaştırma, diş sağlığı, laboratuvar ve 7/24 acil destek. Randevu: 0536 290 69 58.",
  keywords: [
    "veteriner Çankaya",
    "veteriner Ankara",
    "Öveçler veteriner",
    "kedi köpek veteriner",
    "acil veteriner",
    "kısırlaştırma",
    "aşılama",
  ],
  authors: [{ name: site.name }],
  openGraph: {
    type: "website",
    locale: "tr_TR",
    siteName: site.name,
    title: `${site.name} · Çankaya, Ankara`,
    description:
      "Modern donanım, sıcak bir yaklaşım. Çankaya'da kedi, köpek ve tüm patili dostlarınız için bütünsel veteriner hizmeti.",
    images: [{ url: "/og-image.png", width: 1200, height: 630, alt: site.name }],
  },
  twitter: {
    card: "summary_large_image",
    title: `${site.name} · Çankaya, Ankara`,
    description:
      "Çankaya Öveçler'de modern ve şefkatli veteriner hizmeti. 7/24 acil destek.",
    images: ["/og-image.png"],
  },
  icons: {
    icon: [{ url: "/favicon.ico" }, { url: "/favicon-32.png", type: "image/png", sizes: "32x32" }],
    apple: [{ url: "/apple-touch-icon.png" }],
  },
  alternates: { canonical: "/" },
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#FAF9F5" },
    { media: "(prefers-color-scheme: dark)", color: "#0F130F" },
  ],
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "VeterinaryCare",
  name: site.name,
  image: "https://petinternal.com/og-image.png",
  "@id": "https://petinternal.com",
  url: "https://petinternal.com",
  telephone: "+905362906958",
  email: site.email,
  address: {
    "@type": "PostalAddress",
    streetAddress: "Öveçler, 1335. Sk. 8/B",
    addressLocality: "Çankaya",
    addressRegion: "Ankara",
    postalCode: "06460",
    addressCountry: "TR",
  },
  openingHoursSpecification: [
    {
      "@type": "OpeningHoursSpecification",
      dayOfWeek: [
        "Monday",
        "Tuesday",
        "Wednesday",
        "Thursday",
        "Friday",
        "Saturday",
        "Sunday",
      ],
      opens: "00:00",
      closes: "23:59",
    },
  ],
  areaServed: "Çankaya, Ankara",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      lang="tr"
      suppressHydrationWarning
      className={`${fraunces.variable} ${inter.variable}`}
    >
      <body className="min-h-screen bg-paper text-ink antialiased">
        <ThemeProvider
          attribute="class"
          defaultTheme="light"
          enableSystem
          disableTransitionOnChange
        >
          <a
            href="#main"
            className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[100] focus:rounded-lg focus:bg-brand-600 focus:px-4 focus:py-2 focus:text-white"
          >
            İçeriğe geç
          </a>
          {children}
          <WhatsAppFab />
        </ThemeProvider>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </body>
    </html>
  );
}
