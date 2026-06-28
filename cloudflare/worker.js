/**
 * Pet Internal — blog publish Worker.
 * Verifies the admin password and manages post JSON files in the GitHub repo
 * (publish / update / list / get / delete), which triggers the Pages rebuild.
 *
 * Required env (Worker variables/secrets):
 *   ADMIN_PASSWORD, GITHUB_TOKEN, GH_REPO (e.g. "EcoFluxion/petinternal"),
 *   GH_BRANCH (e.g. "main"), ALLOW_ORIGIN (e.g. "https://www.petinternal.com")
 */

const SLUG_MAP = {
  ç: "c", ğ: "g", ı: "i", İ: "i", ö: "o", ş: "s", ü: "u",
  Ç: "c", Ğ: "g", Ö: "o", Ş: "s", Ü: "u",
};

function slugify(s) {
  return String(s)
    .replace(/[çğıİöşüÇĞÖŞÜ]/g, (c) => SLUG_MAP[c] ?? c)
    .toLowerCase().trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-").replace(/-+/g, "-").replace(/^-|-$/g, "");
}

function utf8ToBase64(str) {
  const bytes = new TextEncoder().encode(str);
  let bin = "";
  for (let i = 0; i < bytes.length; i++) bin += String.fromCharCode(bytes[i]);
  return btoa(bin);
}
function base64ToUtf8(b64) {
  const bin = atob(String(b64).replace(/\n/g, ""));
  const bytes = new Uint8Array(bin.length);
  for (let i = 0; i < bin.length; i++) bytes[i] = bin.charCodeAt(i);
  return new TextDecoder().decode(bytes);
}

function cors(env) {
  return {
    "Access-Control-Allow-Origin": env.ALLOW_ORIGIN || "*",
    "Access-Control-Allow-Methods": "POST, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type",
  };
}
function json(data, status, env) {
  return new Response(JSON.stringify(data), {
    status,
    headers: { "Content-Type": "application/json", ...cors(env) },
  });
}

export default {
  async fetch(request, env) {
    if (request.method === "OPTIONS") return new Response(null, { headers: cors(env) });
    if (request.method !== "POST") return json({ error: "Method not allowed" }, 405, env);

    let body;
    try { body = await request.json(); } catch { return json({ error: "Geçersiz istek" }, 400, env); }

    if (!body.password || body.password !== env.ADMIN_PASSWORD) {
      return json({ error: "Şifre hatalı" }, 401, env);
    }

    const repo = env.GH_REPO;
    const branch = env.GH_BRANCH || "main";
    const ghHeaders = {
      Authorization: `Bearer ${env.GITHUB_TOKEN}`,
      "User-Agent": "petinternal-publish-worker",
      Accept: "application/vnd.github+json",
    };
    const contentsUrl = (path) => `https://api.github.com/repos/${repo}/contents/${path}`;

    async function getFile(path) {
      const r = await fetch(`${contentsUrl(path)}?ref=${branch}`, { headers: ghHeaders });
      if (r.status !== 200) return null;
      const d = await r.json();
      return { json: JSON.parse(base64ToUtf8(d.content)), sha: d.sha };
    }

    async function getSha(path) {
      const r = await fetch(`${contentsUrl(path)}?ref=${branch}`, { headers: ghHeaders });
      if (r.status !== 200) return null;
      return (await r.json()).sha;
    }

    const action = body.action || "publish";

    // ── LIST ────────────────────────────────────────────────────────
    if (action === "list") {
      const r = await fetch(`${contentsUrl("lib/posts")}?ref=${branch}`, { headers: ghHeaders });
      if (!r.ok) return json({ error: "Liste alınamadı" }, 502, env);
      const items = (await r.json()).filter((i) => i.name.endsWith(".json"));
      const posts = [];
      for (const it of items) {
        try {
          const f = await fetch(it.url, { headers: ghHeaders });
          const d = await f.json();
          const p = JSON.parse(base64ToUtf8(d.content));
          posts.push({
            slug: p.slug, title: p.title, category: p.category,
            date: p.date, dateISO: p.dateISO, published: p.published !== false,
          });
        } catch { /* skip bad file */ }
      }
      posts.sort((a, b) => (a.dateISO < b.dateISO ? 1 : -1));
      return json({ ok: true, posts }, 200, env);
    }

    // ── GET (for editing) ───────────────────────────────────────────
    if (action === "get") {
      const slug = slugify(body.slug || "");
      const f = await getFile(`lib/posts/${slug}.json`);
      if (!f) return json({ error: "Yazı bulunamadı" }, 404, env);
      return json({ ok: true, post: f.json }, 200, env);
    }

    // ── DELETE ──────────────────────────────────────────────────────
    if (action === "delete") {
      const slug = slugify(body.slug || "");
      const path = `lib/posts/${slug}.json`;
      const existing = await getFile(path);
      if (!existing) return json({ error: "Yazı bulunamadı" }, 404, env);
      const del = await fetch(contentsUrl(path), {
        method: "DELETE",
        headers: { ...ghHeaders, "Content-Type": "application/json" },
        body: JSON.stringify({ message: `Blog sil: ${slug}`, sha: existing.sha, branch }),
      });
      if (!del.ok) return json({ error: "Silinemedi" }, 502, env);
      return json({ ok: true, slug }, 200, env);
    }

    // ── UPLOAD IMAGE ────────────────────────────────────────────────
    if (action === "upload") {
      const raw = body.data || "";
      const b64 = raw.includes(",") ? raw.slice(raw.indexOf(",") + 1) : raw;
      if (!b64) return json({ error: "Dosya yok" }, 400, env);
      const safe = (body.filename || "gorsel")
        .toLowerCase().replace(/[^a-z0-9.]+/g, "-").replace(/^-+|-+$/g, "") || "gorsel";
      const name = `${Date.now()}-${safe}`;
      const path = `public/blog-images/${name}`;
      const put = await fetch(contentsUrl(path), {
        method: "PUT",
        headers: { ...ghHeaders, "Content-Type": "application/json" },
        body: JSON.stringify({ message: `Görsel: ${name}`, content: b64, branch }),
      });
      if (!put.ok) {
        const err = await put.text().catch(() => "");
        return json({ error: "Görsel yüklenemedi", detail: err.slice(0, 300) }, 502, env);
      }
      return json({ ok: true, url: `/blog-images/${name}` }, 200, env);
    }

    // ── DELETE IMAGE ────────────────────────────────────────────────
    if (action === "deleteImage") {
      const name = String(body.url || "").replace(/^\/+/, "").replace(/^blog-images\//, "");
      if (!name) return json({ error: "URL yok" }, 400, env);
      const path = `public/blog-images/${name}`;
      const sha = await getSha(path);
      if (!sha) return json({ error: "Görsel bulunamadı" }, 404, env);
      const del = await fetch(contentsUrl(path), {
        method: "DELETE",
        headers: { ...ghHeaders, "Content-Type": "application/json" },
        body: JSON.stringify({ message: `Görsel sil: ${name}`, sha, branch }),
      });
      if (!del.ok) return json({ error: "Görsel silinemedi" }, 502, env);
      return json({ ok: true }, 200, env);
    }

    // ── PUBLISH / UPDATE ────────────────────────────────────────────
    const title = (body.title || "").trim();
    const html = (body.html || "").trim();
    const slug = slugify(body.slug || title);
    if (!title || !slug || !html) {
      return json({ error: "Başlık, slug ve içerik zorunludur" }, 400, env);
    }

    const path = `lib/posts/${slug}.json`;
    const existing = await getFile(path); // null if new

    const plain = html.replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim();
    const excerpt = (body.excerpt || "").trim() || (plain.length > 157 ? plain.slice(0, 157) + "…" : plain);
    const words = plain.split(/\s+/).filter(Boolean).length;
    const readTime = Math.max(1, Math.round(words / 200)) + " dk okuma";

    const today = new Date().toISOString().slice(0, 10);
    const dateISO = /^\d{4}-\d{2}-\d{2}$/.test(body.date || "") ? body.date : (existing?.json.dateISO || today);
    const date = new Intl.DateTimeFormat("tr-TR", { day: "numeric", month: "long", year: "numeric" })
      .format(new Date(dateISO + "T12:00:00Z"));

    const post = {
      slug,
      title,
      category: (body.category || "Genel").trim(),
      image: (body.cover || "").trim() || existing?.json.image || "/images/about-care.jpg",
      imageAlt: title,
      excerpt,
      readTime,
      date,
      dateISO,
      updatedISO: today,
      keywords: Array.isArray(body.tags) ? body.tags.filter(Boolean) : [],
      intro: excerpt,
      contentHtml: html,
      faqs: existing?.json.faqs || [], // preserve FAQs when editing
      published: body.published !== false,
    };
    if ((body.author || "").trim()) post.author = body.author.trim();

    const put = await fetch(contentsUrl(path), {
      method: "PUT",
      headers: { ...ghHeaders, "Content-Type": "application/json" },
      body: JSON.stringify({
        message: `${existing ? "Blog güncelle" : "Blog"}: ${title}`,
        content: utf8ToBase64(JSON.stringify(post, null, 2) + "\n"),
        branch,
        ...(existing ? { sha: existing.sha } : {}),
      }),
    });
    if (!put.ok) {
      const err = await put.text().catch(() => "");
      return json({ error: "GitHub'a kaydedilemedi", detail: err.slice(0, 300) }, 502, env);
    }
    return json({ ok: true, slug, updated: !!existing }, 200, env);
  },
};
