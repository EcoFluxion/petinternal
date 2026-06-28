"use client";

import { useMemo, useState, type FormEvent } from "react";
import { CheckCircle2, Loader2, Lock, Send } from "lucide-react";
import { PUBLISH_ENDPOINT, SITE_URL } from "@/lib/admin-config";

function slugify(input: string): string {
  const map: Record<string, string> = {
    ç: "c", ğ: "g", ı: "i", İ: "i", ö: "o", ş: "s", ü: "u",
    Ç: "c", Ğ: "g", Ö: "o", Ş: "s", Ü: "u",
  };
  return input
    .replace(/[çğıİöşüÇĞÖŞÜ]/g, (c) => map[c] ?? c)
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");
}

const field =
  "w-full rounded-xl border border-hairline bg-paper px-4 py-2.5 text-[0.95rem] text-ink placeholder:text-muted/80 transition-colors focus:border-brand focus:outline-none focus:ring-2 focus:ring-brand/30";
const label = "mb-1.5 block text-sm font-medium text-ink";

export function AdminEditor() {
  const [password, setPassword] = useState("");
  const [authed, setAuthed] = useState(false);

  const [title, setTitle] = useState("");
  const [slugTouched, setSlugTouched] = useState(false);
  const [slug, setSlug] = useState("");
  const [category, setCategory] = useState("Genel");
  const [cover, setCover] = useState("");
  const [author, setAuthor] = useState("");
  const [excerpt, setExcerpt] = useState("");
  const [content, setContent] = useState("");
  const [tags, setTags] = useState("");
  const [published, setPublished] = useState(true);

  const [status, setStatus] = useState<"idle" | "sending" | "ok" | "error">("idle");
  const [message, setMessage] = useState("");

  const effectiveSlug = useMemo(
    () => (slugTouched ? slug : slugify(title)),
    [slug, slugTouched, title]
  );

  async function handlePublish(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus("sending");
    setMessage("");
    try {
      const res = await fetch(PUBLISH_ENDPOINT, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          password,
          title: title.trim(),
          slug: effectiveSlug,
          category: category.trim() || "Genel",
          cover: cover.trim(),
          author: author.trim(),
          excerpt: excerpt.trim(),
          content,
          tags: tags
            .split(",")
            .map((t) => t.trim())
            .filter(Boolean),
          published,
        }),
      });
      if (res.status === 401) {
        setStatus("error");
        setMessage("Şifre hatalı. Lütfen tekrar giriş yapın.");
        setAuthed(false);
        return;
      }
      if (!res.ok) {
        const txt = await res.text().catch(() => "");
        throw new Error(txt || `Hata: ${res.status}`);
      }
      setStatus("ok");
      setMessage(
        `“${title}” gönderildi. Yazı ~1–2 dakika içinde yayında olacak: ${SITE_URL}/blog/${effectiveSlug}`
      );
      // reset content fields, keep session
      setTitle(""); setSlug(""); setSlugTouched(false); setCover("");
      setExcerpt(""); setContent(""); setTags("");
    } catch (err) {
      setStatus("error");
      setMessage(err instanceof Error ? err.message : "Bir hata oluştu.");
    }
  }

  // ── Login gate ──────────────────────────────────────────────────────
  if (!authed) {
    return (
      <div className="mx-auto flex min-h-[60vh] max-w-sm flex-col justify-center px-5 py-16">
        <div className="rounded-2xl border border-hairline bg-surface p-7 shadow-card">
          <span className="flex h-11 w-11 items-center justify-center rounded-full bg-brand-100 text-brand-700 dark:bg-brand-900/50 dark:text-brand-200">
            <Lock className="h-5 w-5" aria-hidden="true" />
          </span>
          <h1 className="mt-4 font-display text-xl font-semibold text-ink">
            Yönetim Girişi
          </h1>
          <p className="mt-1 text-sm text-muted">Blog yazısı yayınlamak için şifrenizi girin.</p>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              if (password.trim()) setAuthed(true);
            }}
            className="mt-5"
          >
            <label htmlFor="pw" className={label}>Şifre</label>
            <input
              id="pw"
              type="password"
              autoComplete="current-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className={field}
              placeholder="••••••••"
              required
            />
            <button
              type="submit"
              className="mt-4 inline-flex w-full items-center justify-center gap-2 rounded-full bg-brand-600 px-6 py-3 text-base font-medium text-white shadow-soft transition-colors hover:bg-brand-700"
            >
              Giriş
            </button>
          </form>
        </div>
      </div>
    );
  }

  // ── Editor ──────────────────────────────────────────────────────────
  return (
    <div className="mx-auto max-w-3xl px-5 py-12">
      <div className="flex items-center justify-between">
        <h1 className="font-display text-2xl font-semibold text-ink">Yeni Yazı</h1>
        <button
          type="button"
          onClick={() => { setAuthed(false); setPassword(""); }}
          className="text-sm font-medium text-muted hover:text-brand"
        >
          Çıkış
        </button>
      </div>

      <form onSubmit={handlePublish} className="mt-6 space-y-5">
        <div className="grid gap-5 sm:grid-cols-2">
          <div>
            <label htmlFor="title" className={label}>Başlık *</label>
            <input id="title" value={title} onChange={(e) => setTitle(e.target.value)} required className={field} placeholder="Kedilerde diş bakımı" />
          </div>
          <div>
            <label htmlFor="slug" className={label}>Slug (URL)</label>
            <input id="slug" value={effectiveSlug} onChange={(e) => { setSlug(e.target.value); setSlugTouched(true); }} className={field} placeholder="kedilerde-dis-bakimi" />
            <p className="mt-1 text-xs text-muted">Yayın adresi: /blog/{effectiveSlug || "…"}</p>
          </div>
          <div>
            <label htmlFor="category" className={label}>Kategori</label>
            <input id="category" value={category} onChange={(e) => setCategory(e.target.value)} className={field} placeholder="Kedi Sağlığı" />
          </div>
          <div>
            <label htmlFor="author" className={label}>Yazar</label>
            <input id="author" value={author} onChange={(e) => setAuthor(e.target.value)} className={field} placeholder="Öykü Yalçın (boş bırakılırsa varsayılan)" />
          </div>
          <div className="sm:col-span-2">
            <label htmlFor="cover" className={label}>Kapak görseli URL (opsiyonel)</label>
            <input id="cover" value={cover} onChange={(e) => setCover(e.target.value)} className={field} placeholder="https://… (boş bırakılırsa varsayılan görsel)" />
          </div>
          <div className="sm:col-span-2">
            <label htmlFor="excerpt" className={label}>Özet</label>
            <textarea id="excerpt" value={excerpt} onChange={(e) => setExcerpt(e.target.value)} rows={2} className={`${field} resize-none`} placeholder="Listede ve aramada görünen kısa özet (≈160 karakter)." />
          </div>
        </div>

        <div>
          <label htmlFor="content" className={label}>İçerik *</label>
          <textarea id="content" value={content} onChange={(e) => setContent(e.target.value)} rows={12} required className={`${field} resize-y font-mono text-sm`} placeholder={"Paragrafları boş satırla ayırın.\n\n## Alt başlık için iki diyez\n\n- Madde işareti için tire\n- İkinci madde"} />
          <p className="mt-1 text-xs text-muted">Biçimlendirme: boş satır = yeni paragraf · “## ” = alt başlık · “- ” = madde.</p>
        </div>

        <div className="grid gap-5 sm:grid-cols-2">
          <div>
            <label htmlFor="tags" className={label}>Etiketler (virgülle)</label>
            <input id="tags" value={tags} onChange={(e) => setTags(e.target.value)} className={field} placeholder="kedi, diş, bakım" />
          </div>
          <div className="flex items-end">
            <label className="inline-flex cursor-pointer items-center gap-2.5 text-sm font-medium text-ink">
              <input type="checkbox" checked={published} onChange={(e) => setPublished(e.target.checked)} className="h-4 w-4 accent-brand-600" />
              Hemen yayınla (kapalıysa taslak)
            </label>
          </div>
        </div>

        <div className="flex items-center gap-3 pt-2">
          <button
            type="submit"
            disabled={status === "sending"}
            className="inline-flex items-center justify-center gap-2 rounded-full bg-brand-600 px-6 py-3 text-base font-medium text-white shadow-soft transition-colors hover:bg-brand-700 disabled:opacity-60"
          >
            {status === "sending" ? (
              <Loader2 className="h-[1.05rem] w-[1.05rem] animate-spin" aria-hidden="true" />
            ) : (
              <Send className="h-[1.05rem] w-[1.05rem]" aria-hidden="true" />
            )}
            Yayınla
          </button>
        </div>

        {status === "ok" && (
          <p className="flex items-start gap-2 rounded-xl border border-brand-200 bg-brand-50 p-3 text-sm text-brand-800 dark:border-brand-700 dark:bg-brand-900/30 dark:text-brand-100" role="status">
            <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0" aria-hidden="true" />
            {message}
          </p>
        )}
        {status === "error" && (
          <p className="rounded-xl border border-red-200 bg-red-50 p-3 text-sm text-red-700 dark:border-red-900/50 dark:bg-red-950/30 dark:text-red-300" role="alert">
            {message}
          </p>
        )}
      </form>
    </div>
  );
}
