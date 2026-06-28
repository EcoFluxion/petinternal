"use client";

import { useMemo, useState, type ChangeEvent, type FormEvent } from "react";
import {
  ArrowLeft, CheckCircle2, ImagePlus, Loader2, Lock, Pencil, Plus, Send, Trash2,
} from "lucide-react";
import { PUBLISH_ENDPOINT, SITE_URL } from "@/lib/admin-config";

type Block =
  | { type: "h2"; text: string }
  | { type: "p"; text: string }
  | { type: "ul"; items: string[] }
  | { type: "callout"; text: string };

type PostMeta = { slug: string; title: string; category: string; date: string; dateISO: string; published: boolean };

function slugify(input: string): string {
  const map: Record<string, string> = {
    ç: "c", ğ: "g", ı: "i", İ: "i", ö: "o", ş: "s", ü: "u",
    Ç: "c", Ğ: "g", Ö: "o", Ş: "s", Ü: "u",
  };
  return input.replace(/[çğıİöşüÇĞÖŞÜ]/g, (c) => map[c] ?? c)
    .toLowerCase().trim().replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-").replace(/-+/g, "-").replace(/^-|-$/g, "");
}

function esc(s: string): string {
  return String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}
function blocksToHtml(blocks: Block[] | undefined): string {
  return (blocks ?? []).map((b) => {
    if (b.type === "h2") return `<h2>${esc(b.text)}</h2>`;
    if (b.type === "ul") return `<ul>\n${b.items.map((i) => `  <li>${esc(i)}</li>`).join("\n")}\n</ul>`;
    if (b.type === "callout") return `<blockquote>${esc(b.text)}</blockquote>`;
    return `<p>${esc(b.text)}</p>`;
  }).join("\n\n");
}

function todayISO() {
  return new Date().toISOString().slice(0, 10);
}

const field =
  "w-full rounded-xl border border-hairline bg-paper px-4 py-2.5 text-[0.95rem] text-ink placeholder:text-muted/80 transition-colors focus:border-brand focus:outline-none focus:ring-2 focus:ring-brand/30 disabled:opacity-60";
const label = "mb-1.5 block text-sm font-medium text-ink";

export function AdminEditor() {
  const [password, setPassword] = useState("");
  const [stage, setStage] = useState<"login" | "list" | "editor">("login");
  const [posts, setPosts] = useState<PostMeta[]>([]);
  const [loading, setLoading] = useState(false);
  const [notice, setNotice] = useState<{ type: "ok" | "error"; text: string } | null>(null);

  // editor fields
  const [editingExisting, setEditingExisting] = useState(false);
  const [title, setTitle] = useState("");
  const [slugTouched, setSlugTouched] = useState(false);
  const [slug, setSlug] = useState("");
  const [category, setCategory] = useState("Genel");
  const [cover, setCover] = useState("");
  const [author, setAuthor] = useState("");
  const [excerpt, setExcerpt] = useState("");
  const [content, setContent] = useState("");
  const [tags, setTags] = useState("");
  const [date, setDate] = useState(todayISO());
  const [published, setPublished] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);

  const effectiveSlug = useMemo(
    () => (editingExisting || slugTouched ? slug : slugify(title)),
    [editingExisting, slug, slugTouched, title]
  );

  async function api(payload: Record<string, unknown>) {
    const res = await fetch(PUBLISH_ENDPOINT, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ password, ...payload }),
    });
    if (res.status === 401) {
      setStage("login");
      throw new Error("Şifre hatalı. Tekrar giriş yapın.");
    }
    if (!res.ok) throw new Error((await res.text().catch(() => "")) || `Hata: ${res.status}`);
    return res.json();
  }

  async function loadList() {
    setLoading(true);
    setNotice(null);
    try {
      const data = await api({ action: "list" });
      setPosts(data.posts ?? []);
      setStage("list");
    } catch (e) {
      setNotice({ type: "error", text: e instanceof Error ? e.message : "Liste alınamadı" });
    } finally {
      setLoading(false);
    }
  }

  function startNew() {
    setEditingExisting(false);
    setTitle(""); setSlug(""); setSlugTouched(false); setCategory("Genel");
    setCover(""); setAuthor(""); setExcerpt(""); setContent(""); setTags("");
    setDate(todayISO()); setPublished(true); setNotice(null);
    setStage("editor");
  }

  async function startEdit(s: string) {
    setNotice(null);
    setLoading(true);
    try {
      const data = await api({ action: "get", slug: s });
      const p = data.post;
      setEditingExisting(true);
      setTitle(p.title ?? ""); setSlug(p.slug ?? s); setSlugTouched(true);
      setCategory(p.category ?? "Genel"); setCover(p.image ?? "");
      setAuthor(p.author ?? ""); setExcerpt(p.excerpt ?? "");
      setContent(p.contentHtml ?? blocksToHtml(p.body)); setTags((p.keywords ?? []).join(", "));
      setDate(p.dateISO ?? todayISO()); setPublished(p.published !== false);
      setStage("editor");
    } catch (e) {
      setNotice({ type: "error", text: e instanceof Error ? e.message : "Yazı yüklenemedi" });
    } finally {
      setLoading(false);
    }
  }

  async function remove(s: string) {
    if (!confirm(`“${s}” yazısını silmek istediğinize emin misiniz?`)) return;
    setLoading(true);
    try {
      await api({ action: "delete", slug: s });
      setNotice({ type: "ok", text: "Yazı silindi. Site ~1–2 dk içinde güncellenir." });
      await loadList();
    } catch (e) {
      setNotice({ type: "error", text: e instanceof Error ? e.message : "Silinemedi" });
      setLoading(false);
    }
  }

  async function save(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setSaving(true);
    setNotice(null);
    try {
      await api({
        action: "publish",
        title: title.trim(), slug: effectiveSlug, category: category.trim() || "Genel",
        cover: cover.trim(), author: author.trim(), excerpt: excerpt.trim(),
        html: content, date,
        tags: tags.split(",").map((t) => t.trim()).filter(Boolean),
        published,
      });
      setNotice({ type: "ok", text: `“${title}” kaydedildi. Site ~1–2 dk içinde güncellenir.` });
      await loadList();
    } catch (err) {
      setNotice({ type: "error", text: err instanceof Error ? err.message : "Bir hata oluştu." });
    } finally {
      setSaving(false);
    }
  }

  async function handleUpload(e: ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    setNotice(null);
    try {
      const dataUrl = await new Promise<string>((res, rej) => {
        const r = new FileReader();
        r.onload = () => res(String(r.result));
        r.onerror = () => rej(new Error("Dosya okunamadı"));
        r.readAsDataURL(file);
      });
      const data = await api({ action: "upload", filename: file.name, data: dataUrl });
      setContent((c) => `${c}\n<img src="${data.url}" alt="" />\n`);
      setNotice({ type: "ok", text: `Görsel eklendi (${data.url}). Site ~1–2 dk içinde yayına alır.` });
    } catch (err) {
      setNotice({ type: "error", text: err instanceof Error ? err.message : "Görsel yüklenemedi" });
    } finally {
      setUploading(false);
      e.target.value = "";
    }
  }

  // ── Login ───────────────────────────────────────────────────────────
  if (stage === "login") {
    return (
      <div className="mx-auto flex min-h-[60vh] max-w-sm flex-col justify-center px-5 py-16">
        <div className="rounded-2xl border border-hairline bg-surface p-7 shadow-card">
          <span className="flex h-11 w-11 items-center justify-center rounded-full bg-brand-100 text-brand-700 dark:bg-brand-900/50 dark:text-brand-200">
            <Lock className="h-5 w-5" aria-hidden="true" />
          </span>
          <h1 className="mt-4 font-display text-xl font-semibold text-ink">Yönetim Girişi</h1>
          <p className="mt-1 text-sm text-muted">Blog yazılarını yönetmek için şifrenizi girin.</p>
          <form
            onSubmit={(e) => { e.preventDefault(); if (password.trim()) loadList(); }}
            className="mt-5"
          >
            <label htmlFor="pw" className={label}>Şifre</label>
            <input id="pw" type="password" autoComplete="current-password" value={password}
              onChange={(e) => setPassword(e.target.value)} className={field} placeholder="••••••••" required />
            <button type="submit" disabled={loading}
              className="mt-4 inline-flex w-full items-center justify-center gap-2 rounded-full bg-brand-600 px-6 py-3 text-base font-medium text-white shadow-soft transition-colors hover:bg-brand-700 disabled:opacity-60">
              {loading ? <Loader2 className="h-5 w-5 animate-spin" /> : "Giriş"}
            </button>
            {notice?.type === "error" && (
              <p className="mt-3 text-sm text-red-600 dark:text-red-400">{notice.text}</p>
            )}
          </form>
        </div>
      </div>
    );
  }

  // ── List ────────────────────────────────────────────────────────────
  if (stage === "list") {
    return (
      <div className="mx-auto max-w-4xl px-5 py-12">
        <div className="flex items-center justify-between">
          <h1 className="font-display text-2xl font-semibold text-ink">Blog Yazıları</h1>
          <div className="flex items-center gap-3">
            <button onClick={startNew}
              className="inline-flex items-center gap-2 rounded-full bg-brand-600 px-5 py-2.5 text-sm font-medium text-white shadow-soft transition-colors hover:bg-brand-700">
              <Plus className="h-4 w-4" /> Yeni Yazı
            </button>
            <button onClick={() => { setStage("login"); setPassword(""); }}
              className="text-sm font-medium text-muted hover:text-brand">Çıkış</button>
          </div>
        </div>

        {notice && (
          <p className={"mt-4 rounded-xl border p-3 text-sm " + (notice.type === "ok"
            ? "border-brand-200 bg-brand-50 text-brand-800 dark:border-brand-700 dark:bg-brand-900/30 dark:text-brand-100"
            : "border-red-200 bg-red-50 text-red-700 dark:border-red-900/50 dark:bg-red-950/30 dark:text-red-300")}>
            {notice.text}
          </p>
        )}

        <div className="mt-6 overflow-hidden rounded-2xl border border-hairline bg-surface">
          {loading ? (
            <p className="flex items-center justify-center gap-2 p-8 text-sm text-muted">
              <Loader2 className="h-4 w-4 animate-spin" /> Yükleniyor…
            </p>
          ) : posts.length === 0 ? (
            <p className="p-8 text-center text-sm text-muted">Henüz yazı yok. “Yeni Yazı” ile başlayın.</p>
          ) : (
            <ul className="divide-y divide-hairline">
              {posts.map((p) => (
                <li key={p.slug} className="flex flex-wrap items-center gap-3 p-4">
                  <div className="min-w-0 flex-1">
                    <p className="truncate font-medium text-ink">{p.title}</p>
                    <p className="text-xs text-muted">
                      {p.category} · {p.date}
                      {p.published ? "" : " · Taslak"}
                    </p>
                  </div>
                  <a href={`${SITE_URL}/blog/${p.slug}`} target="_blank" rel="noopener noreferrer"
                    className="text-xs font-medium text-muted hover:text-brand">Görüntüle</a>
                  <button onClick={() => startEdit(p.slug)}
                    className="inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-sm font-medium text-ink ring-1 ring-hairline transition-colors hover:bg-cream">
                    <Pencil className="h-3.5 w-3.5" /> Düzenle
                  </button>
                  <button onClick={() => remove(p.slug)}
                    className="inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-sm font-medium text-red-600 ring-1 ring-red-200 transition-colors hover:bg-red-50 dark:text-red-400 dark:ring-red-900/50 dark:hover:bg-red-950/30">
                    <Trash2 className="h-3.5 w-3.5" /> Sil
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    );
  }

  // ── Editor ──────────────────────────────────────────────────────────
  return (
    <div className="mx-auto max-w-3xl px-5 py-12">
      <button onClick={() => loadList()} className="inline-flex items-center gap-1.5 text-sm font-medium text-muted hover:text-brand">
        <ArrowLeft className="h-4 w-4" /> Yazılara dön
      </button>
      <h1 className="mt-4 font-display text-2xl font-semibold text-ink">
        {editingExisting ? "Yazıyı Düzenle" : "Yeni Yazı"}
      </h1>

      <form onSubmit={save} className="mt-6 space-y-5">
        <div className="grid gap-5 sm:grid-cols-2">
          <div>
            <label htmlFor="title" className={label}>Başlık *</label>
            <input id="title" value={title} onChange={(e) => setTitle(e.target.value)} required className={field} placeholder="Kedilerde diş bakımı" />
          </div>
          <div>
            <label htmlFor="slug" className={label}>Slug (URL)</label>
            <input id="slug" value={effectiveSlug} disabled={editingExisting}
              onChange={(e) => { setSlug(e.target.value); setSlugTouched(true); }} className={field} placeholder="kedilerde-dis-bakimi" />
            <p className="mt-1 text-xs text-muted">/blog/{effectiveSlug || "…"}{editingExisting ? " (düzenlemede değişmez)" : ""}</p>
          </div>
          <div>
            <label htmlFor="category" className={label}>Kategori</label>
            <input id="category" value={category} onChange={(e) => setCategory(e.target.value)} className={field} placeholder="Kedi Sağlığı" />
          </div>
          <div>
            <label htmlFor="date" className={label}>Yayın tarihi</label>
            <input id="date" type="date" value={date} onChange={(e) => setDate(e.target.value)} className={field} />
          </div>
          <div>
            <label htmlFor="author" className={label}>Yazar</label>
            <input id="author" value={author} onChange={(e) => setAuthor(e.target.value)} className={field} placeholder="Öykü Yalçın (boş = varsayılan)" />
          </div>
          <div>
            <label htmlFor="cover" className={label}>Kapak görseli URL</label>
            <input id="cover" value={cover} onChange={(e) => setCover(e.target.value)} className={field} placeholder="https://… (boş = varsayılan)" />
          </div>
          <div className="sm:col-span-2">
            <label htmlFor="excerpt" className={label}>Özet</label>
            <textarea id="excerpt" value={excerpt} onChange={(e) => setExcerpt(e.target.value)} rows={2} className={`${field} resize-none`} placeholder="Listede ve aramada görünen kısa özet (≈160 karakter)." />
          </div>
        </div>

        <div>
          <div className="mb-1.5 flex items-center justify-between gap-3">
            <label htmlFor="content" className="block text-sm font-medium text-ink">
              İçerik (HTML) *
            </label>
            <label className="inline-flex cursor-pointer items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-medium text-brand ring-1 ring-brand-200 transition-colors hover:bg-brand-50 dark:ring-brand-700 dark:hover:bg-brand-900/30">
              {uploading ? (
                <Loader2 className="h-3.5 w-3.5 animate-spin" />
              ) : (
                <ImagePlus className="h-3.5 w-3.5" />
              )}
              Görsel Yükle
              <input type="file" accept="image/*" className="hidden" onChange={handleUpload} disabled={uploading} />
            </label>
          </div>
          <textarea id="content" value={content} onChange={(e) => setContent(e.target.value)} rows={16} required className={`${field} resize-y font-mono text-sm`} placeholder={"<p>Buraya yazınızı yazın.</p>\n\n<h2>Alt başlık</h2>\n<p>Paragraf… <strong>kalın</strong>, <a href=\"https://...\">link</a>.</p>\n\n<ul>\n  <li>Madde</li>\n</ul>"} />
          <p className="mt-1 text-xs text-muted">
            HTML kullanın: &lt;p&gt;paragraf&lt;/p&gt; · &lt;h2&gt;başlık&lt;/h2&gt; · &lt;strong&gt;kalın&lt;/strong&gt; · &lt;a href&gt;link&lt;/a&gt;. Fotoğraf için <strong>Görsel Yükle</strong> → &lt;img&gt; otomatik eklenir.
          </p>
        </div>

        <div className="grid gap-5 sm:grid-cols-2">
          <div>
            <label htmlFor="tags" className={label}>Etiketler (virgülle)</label>
            <input id="tags" value={tags} onChange={(e) => setTags(e.target.value)} className={field} placeholder="kedi, diş, bakım" />
          </div>
          <div className="flex items-end">
            <label className="inline-flex cursor-pointer items-center gap-2.5 text-sm font-medium text-ink">
              <input type="checkbox" checked={published} onChange={(e) => setPublished(e.target.checked)} className="h-4 w-4 accent-brand-600" />
              Yayında (kapalıysa taslak)
            </label>
          </div>
        </div>

        <div className="flex items-center gap-3 pt-2">
          <button type="submit" disabled={saving}
            className="inline-flex items-center justify-center gap-2 rounded-full bg-brand-600 px-6 py-3 text-base font-medium text-white shadow-soft transition-colors hover:bg-brand-700 disabled:opacity-60">
            {saving ? <Loader2 className="h-[1.05rem] w-[1.05rem] animate-spin" /> : <Send className="h-[1.05rem] w-[1.05rem]" />}
            {editingExisting ? "Güncelle" : "Yayınla"}
          </button>
        </div>

        {notice?.type === "ok" && (
          <p className="flex items-start gap-2 rounded-xl border border-brand-200 bg-brand-50 p-3 text-sm text-brand-800 dark:border-brand-700 dark:bg-brand-900/30 dark:text-brand-100" role="status">
            <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0" /> {notice.text}
          </p>
        )}
        {notice?.type === "error" && (
          <p className="rounded-xl border border-red-200 bg-red-50 p-3 text-sm text-red-700 dark:border-red-900/50 dark:bg-red-950/30 dark:text-red-300" role="alert">
            {notice.text}
          </p>
        )}
      </form>
    </div>
  );
}
