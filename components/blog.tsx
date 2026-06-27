import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Clock3 } from "lucide-react";
import { SectionHeading } from "@/components/section-heading";
import { ButtonLink } from "@/components/ui/button";
import { Reveal } from "@/components/reveal";
import { blogPosts } from "@/lib/site";

export function Blog() {
  return (
    <section id="blog" className="scroll-mt-24 bg-paper py-20 sm:py-24">
      <div className="container-px">
        <SectionHeading
          align="left"
          eyebrow="Blog & Rehber"
          title="Patili dostlarınız için faydalı bilgiler"
        >
          Sağlık, beslenme ve bakım hakkında veteriner hekimlerimizin kaleminden
          pratik rehberler.
        </SectionHeading>

        <div className="mt-12 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {blogPosts.map((post, i) => (
            <Reveal key={post.slug} delay={(i % 3) * 70}>
              <article className="group relative flex h-full flex-col overflow-hidden rounded-2xl border border-hairline bg-surface shadow-soft transition-all duration-200 ease-gentle hover:-translate-y-1 hover:shadow-card">
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
                  <h3 className="mt-2.5 text-pretty font-display text-lg font-semibold leading-snug text-ink transition-colors group-hover:text-brand">
                    {/* Single stretched link covers the whole card */}
                    <Link
                      href={`/blog/${post.slug}`}
                      className="rounded after:absolute after:inset-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand focus-visible:ring-offset-2 focus-visible:ring-offset-surface"
                    >
                      {post.title}
                    </Link>
                  </h3>
                  <p className="mt-2 flex-1 text-sm leading-relaxed text-muted">
                    {post.excerpt}
                  </p>
                  <span
                    aria-hidden="true"
                    className="mt-4 inline-flex items-center gap-1.5 text-sm font-semibold text-brand"
                  >
                    Devamını oku
                    <ArrowRight className="h-4 w-4 transition-transform duration-200 ease-gentle group-hover:translate-x-0.5" aria-hidden="true" />
                  </span>
                </div>
              </article>
            </Reveal>
          ))}
        </div>

        <div className="mt-10 flex justify-center">
          <ButtonLink href="/blog" variant="secondary" size="md">
            Tüm yazıları gör
            <ArrowRight className="h-4 w-4" aria-hidden="true" />
          </ButtonLink>
        </div>
      </div>
    </section>
  );
}
