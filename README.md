# Pet Internal Veteriner Kliniği

Production marketing landing page for a neighborhood veterinary clinic in
**Öveçler, Çankaya / Ankara**. Warm, editorial, and bilingual-ready — built to feel
like an agency site for a trusted local vet, not a template.

> Brand palette is derived from the clinic logo: a calm **sage-forest green** accent
> on **warm cream** backgrounds, with a genuinely designed **warm dark mode**.

## Tech stack

- **Next.js 14** (App Router) + **TypeScript**
- **Tailwind CSS** (semantic color tokens, `darkMode: "class"`)
- **next/font** — Fraunces (display) + Inter (body), with Turkish `latin-ext`
- **next-themes** — light / dark toggle
- **lucide-react** — line icons (no emoji)
- **next/image** — locally hosted, optimized photos

## Getting started

```bash
npm install
npm run dev      # http://localhost:3000
npm run build    # production build
npm run start    # serve the production build
```

## Project structure

```
app/
  layout.tsx        # fonts, metadata (SEO/OG), JSON-LD, ThemeProvider
  page.tsx          # section composition
  globals.css       # theme tokens (:root / .dark) + base styles
components/
  site-header.tsx   # emergency bar + sticky nav + mobile menu
  hero.tsx          # asymmetric hero + overlapping rating card
  trust-strip.tsx   services.tsx   about.tsx   blog.tsx
  testimonials.tsx  cta-band.tsx   contact.tsx contact-form.tsx
  site-footer.tsx   brand.tsx      section-heading.tsx
  theme-provider.tsx theme-toggle.tsx reveal.tsx  ui/button.tsx
lib/
  site.ts           # ALL copy & data (Turkish) — edit here first
  cn.ts
public/
  images/           # real downloaded photos (Pexels, free license)
  logo-icon.png  favicon.*  og-image.png
tailwind.config.ts  # color scale + design tokens
```

## Customizing

- **Copy & data** → `lib/site.ts` (clinic name, phone, address, hours, blog posts,
  testimonials, nav).
- **Colors** → `app/globals.css` (the `:root` / `.dark` token values) and
  `tailwind.config.ts` (the static `brand` scale).
- **Photos** → drop replacements in `public/images/` keeping the same filenames.
- **Vet name** → the placeholder `Dr. [Ad Soyad]` in `components/about.tsx`.
- **Contact form** → `components/contact-form.tsx` currently opens the visitor's mail
  client (`mailto:`). Wire it to an API route / CRM where marked **TODO** for real
  submissions.

## Notes

- Photos sourced from [Pexels](https://www.pexels.com) (free license) and
  [Openverse](https://openverse.org) (CC0 / public domain), downloaded locally —
  nothing is hotlinked. All imagery is pet-focused with **no identifiable human faces**.
- Accessible: semantic landmarks, alt text, form labels, visible focus rings, skip link,
  `prefers-reduced-motion` support, AA contrast in both themes.
- SEO / GEO: per-page metadata, Open Graph / Twitter cards, `VeterinaryCare` +
  `BlogPosting` JSON-LD, `robots.txt`, a `sitemap.xml` covering every blog post, and an
  `llms.txt` for AI/answer-engine discoverability.
- Blog: six real Turkish guides at `/blog/[slug]`, each statically generated with its own
  metadata and structured data. Edit them in `lib/site.ts`.
