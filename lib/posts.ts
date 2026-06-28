// ── Blog post types + loader ─────────────────────────────────────────
// Posts live as JSON in lib/posts/*.json. They are auto-discovered so that
// posts published through /admin (committed by the Cloudflare Worker) appear
// on the next build with no code changes.

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
  author?: string;
  published?: boolean;
};

// Webpack auto-imports every .json in ./posts (build-time bundle).
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const ctx = (require as any).context("./posts", false, /\.json$/);

export const blogPosts: BlogPost[] = (ctx.keys() as string[])
  .map((key: string) => ctx(key) as BlogPost)
  .filter((p) => p.published !== false)
  .sort((a, b) => (a.dateISO < b.dateISO ? 1 : -1)); // newest first

export function getPost(slug: string): BlogPost | undefined {
  return blogPosts.find((p) => p.slug === slug);
}
