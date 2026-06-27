import Image from "next/image";
import Link from "next/link";
import type { Metadata } from "next";
import { ArrowLeft, Clock3 } from "lucide-react";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { CtaBand } from "@/components/cta-band";
import { blogPosts } from "@/lib/site";

export const metadata: Metadata = {
  title: "Blog & Rehber",
  description:
    "Kedi ve köpek sağlığı, aşılama, beslenme, diş bakımı ve mevsimsel bakım hakkında Pet Internal veteriner hekimlerinin pratik rehberleri.",
  alternates: { canonical: "/blog" },
};

export default function BlogIndexPage() {
  return (
    <>
      <SiteHeader />
      <main id="main">
        <section className="bg-paper py-14 sm:py-20">
          <div className="container-px">
            <Link
              href="/"
              className="inline-flex items-center gap-1.5 text-sm font-medium text-muted transition-colors hover:text-brand"
            >
              <ArrowLeft className="h-4 w-4" aria-hidden="true" />
              Ana sayfa
            </Link>
            <h1 className="mt-6 max-w-2xl text-balance font-display text-4xl font-semibold leading-tight tracking-tight text-ink">
              Blog &amp; Rehber
            </h1>
            <p className="mt-4 max-w-2xl text-lg leading-relaxed text-muted">
              Dostlarınızın sağlığı, beslenmesi ve bakımı hakkında veteriner
              hekimlerimizin kaleminden pratik ve güncel rehberler.
            </p>

            <div className="mt-12 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {blogPosts.map((post) => (
                <article
                  key={post.slug}
                  className="group relative flex h-full flex-col overflow-hidden rounded-2xl border border-hairline bg-surface shadow-soft transition-all duration-200 ease-gentle hover:-translate-y-1 hover:shadow-card"
                >
                  <div className="relative aspect-[3/2] overflow-hidden bg-cream">
                    <Image
                      src={post.image}
                      alt={post.imageAlt}
                      fill
                      sizes="(max-width: 640px) 90vw, (max-width: 1024px) 45vw, 30vw"
                      className="object-cover transition-transform duration-300 ease-gentle group-hover:scale-[1.04]"
                    />
                    <span className="absolute left-3 top-3 rounded-full bg-paper/90 px-3 py-1 text-xs font-semibold text-brand-700 shadow-soft backdrop-blur-sm dark:text-brand-200">
                      {post.category}
                    </span>
                  </div>
                  <div className="flex flex-1 flex-col p-5">
                    <div className="flex items-center gap-3 text-xs text-muted">
                      <time dateTime={post.dateISO}>{post.date}</time>
                      <span className="inline-flex items-center gap-1">
                        <Clock3 className="h-3.5 w-3.5" aria-hidden="true" />
                        {post.readTime}
                      </span>
                    </div>
                    <h2 className="mt-2.5 text-pretty font-display text-lg font-semibold leading-snug text-ink transition-colors group-hover:text-brand">
                      <Link
                        href={`/blog/${post.slug}`}
                        className="rounded after:absolute after:inset-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand focus-visible:ring-offset-2 focus-visible:ring-offset-surface"
                      >
                        {post.title}
                      </Link>
                    </h2>
                    <p className="mt-2 flex-1 text-sm leading-relaxed text-muted">
                      {post.excerpt}
                    </p>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>

        <CtaBand />
      </main>
      <SiteFooter />
    </>
  );
}
