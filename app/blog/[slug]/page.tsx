import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { ArrowLeft, Check, Clock3, Info, RefreshCw, Stethoscope } from "lucide-react";
import { CtaBand } from "@/components/cta-band";
import { CoverImage } from "@/components/cover-image";
import { FaqAccordion } from "@/components/faq";
import { site } from "@/lib/site";
import { blogPosts, getPost, type BlogPost } from "@/lib/posts";

export function generateStaticParams() {
  return blogPosts.map((p) => ({ slug: p.slug }));
}

const trFull = new Intl.DateTimeFormat("tr-TR", {
  day: "numeric",
  month: "long",
  year: "numeric",
});

function wordCount(post: BlogPost): number {
  if (post.contentHtml) {
    const text = post.contentHtml.replace(/<[^>]+>/g, " ");
    return text.trim().split(/\s+/).filter(Boolean).length;
  }
  const parts: string[] = [post.intro];
  for (const b of post.body ?? []) {
    if (b.type === "ul") parts.push(...b.items);
    else parts.push(b.text);
  }
  return parts.join(" ").trim().split(/\s+/).filter(Boolean).length;
}

export function generateMetadata({
  params,
}: {
  params: { slug: string };
}): Metadata {
  const post = getPost(params.slug);
  if (!post) return {};
  return {
    title: post.title,
    description: post.excerpt,
    keywords: post.keywords,
    alternates: { canonical: `/blog/${post.slug}` },
    openGraph: {
      type: "article",
      title: post.title,
      description: post.excerpt,
      publishedTime: post.dateISO,
      modifiedTime: post.updatedISO,
      url: `/blog/${post.slug}`,
      images: [{ url: post.image, alt: post.imageAlt }],
    },
    twitter: {
      card: "summary_large_image",
      title: post.title,
      description: post.excerpt,
      images: [post.image],
    },
  };
}

export default function BlogPostPage({ params }: { params: { slug: string } }) {
  const post = getPost(params.slug);
  if (!post) notFound();

  const others = blogPosts.filter((p) => p.slug !== post.slug).slice(0, 3);
  const updated = trFull.format(new Date(post.updatedISO));

  const blogPostingLd = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: post.title,
    description: post.excerpt,
    image: `https://petinternal.com${post.image}`,
    datePublished: post.dateISO,
    dateModified: post.updatedISO,
    wordCount: wordCount(post),
    keywords: post.keywords.join(", "),
    articleSection: post.category,
    inLanguage: "tr-TR",
    author: {
      "@type": "Person",
      name: post.author ?? "Öykü Yalçın",
      jobTitle: "Uzman Veteriner Hekim",
    },
    publisher: {
      "@type": "VeterinaryCare",
      name: site.name,
      logo: {
        "@type": "ImageObject",
        url: "https://petinternal.com/logo-icon.png",
      },
    },
    mainEntityOfPage: `https://petinternal.com/blog/${post.slug}`,
  };

  const faqLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: post.faqs.map((f) => ({
      "@type": "Question",
      name: f.q,
      acceptedAnswer: { "@type": "Answer", text: f.a },
    })),
  };

  const breadcrumbLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Ana Sayfa", item: "https://petinternal.com" },
      { "@type": "ListItem", position: 2, name: "Blog", item: "https://petinternal.com/blog" },
      { "@type": "ListItem", position: 3, name: post.title, item: `https://petinternal.com/blog/${post.slug}` },
    ],
  };

  return (
    <>
      <main id="main">
        <article className="bg-paper py-12 sm:py-16">
          <div className="container-px">
            <div className="mx-auto max-w-3xl">
              <Link
                href="/blog"
                className="inline-flex items-center gap-1.5 text-sm font-medium text-muted transition-colors hover:text-brand"
              >
                <ArrowLeft className="h-4 w-4" aria-hidden="true" />
                Tüm yazılar
              </Link>

              <div className="mt-6 flex flex-wrap items-center gap-3 text-sm text-muted">
                <span className="rounded-full bg-brand-100 px-3 py-1 text-xs font-semibold text-brand-700 dark:bg-brand-900/50 dark:text-brand-200">
                  {post.category}
                </span>
                <time dateTime={post.dateISO}>{post.date}</time>
                <span className="inline-flex items-center gap-1">
                  <Clock3 className="h-3.5 w-3.5" aria-hidden="true" />
                  {post.readTime}
                </span>
                <span className="inline-flex items-center gap-1">
                  <RefreshCw className="h-3.5 w-3.5" aria-hidden="true" />
                  Güncellendi: {updated}
                </span>
              </div>

              <h1 className="mt-4 text-balance font-display text-3xl font-semibold leading-tight tracking-tight text-ink sm:text-4xl">
                {post.title}
              </h1>
            </div>

            <div className="mx-auto mt-8 max-w-4xl">
              <div className="relative aspect-[16/9] overflow-hidden rounded-2xl bg-cream shadow-card ring-1 ring-black/5">
                <CoverImage
                  src={post.image}
                  alt={post.imageAlt}
                  priority
                  className="absolute inset-0 h-full w-full object-cover"
                />
              </div>
            </div>

            <div className="mx-auto mt-10 max-w-3xl">
              <p className="text-lg leading-relaxed text-ink/90">{post.intro}</p>

              {post.contentHtml ? (
                <div
                  className="post-html mt-6"
                  dangerouslySetInnerHTML={{ __html: post.contentHtml }}
                />
              ) : null}

              {(post.body ?? []).map((b, i) => {
                if (b.type === "h2") {
                  return (
                    <h2
                      key={i}
                      className="mt-9 font-display text-xl font-semibold text-ink sm:text-2xl"
                    >
                      {b.text}
                    </h2>
                  );
                }
                if (b.type === "p") {
                  return (
                    <p key={i} className="mt-3 leading-relaxed text-muted">
                      {b.text}
                    </p>
                  );
                }
                if (b.type === "ul") {
                  return (
                    <ul key={i} className="mt-4 space-y-2.5">
                      {b.items.map((it, j) => (
                        <li key={j} className="flex items-start gap-3">
                          <span className="mt-1 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-brand-100 text-brand-700 dark:bg-brand-900/50 dark:text-brand-200">
                            <Check className="h-3.5 w-3.5" aria-hidden="true" />
                          </span>
                          <span className="leading-relaxed text-muted">{it}</span>
                        </li>
                      ))}
                    </ul>
                  );
                }
                // callout
                return (
                  <div
                    key={i}
                    className="mt-6 flex items-start gap-3 rounded-2xl border-l-4 border-brand bg-cream p-4 sm:p-5"
                  >
                    <Info className="mt-0.5 h-5 w-5 shrink-0 text-brand" aria-hidden="true" />
                    <p className="leading-relaxed text-ink/90">{b.text}</p>
                  </div>
                );
              })}

              {/* FAQ */}
              {post.faqs.length > 0 && (
                <section className="mt-12 border-t border-hairline pt-8">
                  <h2 className="font-display text-2xl font-semibold text-ink">
                    Sık Sorulan Sorular
                  </h2>
                  <FaqAccordion items={post.faqs} />
                </section>
              )}

              {/* Author + disclaimer */}
              <div className="mt-10 flex items-start gap-3 rounded-2xl border border-hairline bg-cream p-5">
                <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-brand-100 text-brand-700 dark:bg-brand-900/50 dark:text-brand-200">
                  <Stethoscope className="h-5 w-5" aria-hidden="true" />
                </span>
                <p className="text-sm leading-relaxed text-muted">
                  Bu yazı, uzman veteriner hekimimiz{" "}
                  <strong className="font-semibold text-ink">
                    {post.author ?? "Öykü Yalçın"}
                  </strong>{" "}
                  tarafından hazırlanmıştır. İçerik genel bilgilendirme amaçlıdır;
                  dostunuza özel durumlar için lütfen{" "}
                  <a href={site.phoneHref} className="font-medium text-brand hover:text-brand-700">
                    kliniğimize danışın
                  </a>
                  .
                </p>
              </div>

              {/* Other guides — internal linking */}
              <div className="mt-12 border-t border-hairline pt-8">
                <h2 className="font-display text-xl font-semibold text-ink">
                  Diğer rehberler
                </h2>
                <ul className="mt-4 space-y-2">
                  {others.map((o) => (
                    <li key={o.slug}>
                      <Link
                        href={`/blog/${o.slug}`}
                        className="inline-flex items-center gap-2 text-brand transition-colors hover:text-brand-700"
                      >
                        {o.title}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </article>

        <CtaBand />
      </main>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify([blogPostingLd, faqLd, breadcrumbLd]),
        }}
      />
    </>
  );
}
