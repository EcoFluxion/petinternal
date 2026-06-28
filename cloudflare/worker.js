/**
 * Pet Internal — blog publish Worker.
 * Verifies the admin password and commits a new post JSON to the GitHub repo,
 * which triggers the GitHub Pages rebuild.
 *
 * Required env (set as Worker variables/secrets):
 *   ADMIN_PASSWORD  - the password the vet types at /admin
 *   GITHUB_TOKEN    - fine-grained PAT with "Contents: Read and write" on the repo
 *   GH_REPO         - e.g. "EcoFluxion/petinternal"
 *   GH_BRANCH       - e.g. "main"
 *   ALLOW_ORIGIN    - e.g. "https://www.petinternal.com" (CORS)
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

function toBlocks(text) {
  const lines = String(text).replace(/\r\n/g, "\n").split("\n");
  const blocks = [];
  let para = [], list = [];
  const flushPara = () => { if (para.length) { blocks.push({ type: "p", text: para.join(" ").trim() }); para = []; } };
  const flushList = () => { if (list.length) { blocks.push({ type: "ul", items: list.slice() }); list = []; } };
  for (const raw of lines) {
    const line = raw.trim();
    if (!line) { flushList(); flushPara(); continue; }
    if (line.startsWith("## ")) { flushList(); flushPara(); blocks.push({ type: "h2", text: line.slice(3).trim() }); continue; }
    if (line.startsWith("- ")) { flushPara(); list.push(line.slice(2).trim()); continue; }
    flushList(); para.push(line);
  }
  flushList(); flushPara();
  return blocks;
}

function utf8ToBase64(str) {
  const bytes = new TextEncoder().encode(str);
  let bin = "";
  for (let i = 0; i < bytes.length; i++) bin += String.fromCharCode(bytes[i]);
  return btoa(bin);
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

    const title = (body.title || "").trim();
    const content = body.content || "";
    let slug = slugify(body.slug || title);
    if (!title || !slug || !content.trim()) {
      return json({ error: "Başlık, slug ve içerik zorunludur" }, 400, env);
    }

    const blocks = toBlocks(content);
    const firstPara = (blocks.find((b) => b.type === "p")?.text) || title;
    const excerpt = (body.excerpt || "").trim() || (firstPara.length > 157 ? firstPara.slice(0, 157) + "…" : firstPara);
    const words = content.trim().split(/\s+/).filter(Boolean).length;
    const readTime = Math.max(1, Math.round(words / 200)) + " dk okuma";

    const now = new Date();
    const dateISO = now.toISOString().slice(0, 10);
    const date = new Intl.DateTimeFormat("tr-TR", { day: "numeric", month: "long", year: "numeric" }).format(now);

    const post = {
      slug,
      title,
      category: (body.category || "Genel").trim(),
      image: (body.cover || "").trim() || "/images/about-care.jpg",
      imageAlt: title,
      excerpt,
      readTime,
      date,
      dateISO,
      updatedISO: dateISO,
      keywords: Array.isArray(body.tags) ? body.tags.filter(Boolean) : [],
      intro: excerpt,
      body: blocks,
      faqs: [],
      published: body.published !== false,
    };
    if ((body.author || "").trim()) post.author = body.author.trim();

    const repo = env.GH_REPO;
    const branch = env.GH_BRANCH || "main";
    const path = `lib/posts/${slug}.json`;
    const apiUrl = `https://api.github.com/repos/${repo}/contents/${path}`;
    const ghHeaders = {
      Authorization: `Bearer ${env.GITHUB_TOKEN}`,
      "User-Agent": "petinternal-publish-worker",
      Accept: "application/vnd.github+json",
    };

    // If the file already exists we need its sha to update it.
    let sha;
    const head = await fetch(`${apiUrl}?ref=${branch}`, { headers: ghHeaders });
    if (head.status === 200) sha = (await head.json()).sha;

    const put = await fetch(apiUrl, {
      method: "PUT",
      headers: { ...ghHeaders, "Content-Type": "application/json" },
      body: JSON.stringify({
        message: `Blog: ${title}`,
        content: utf8ToBase64(JSON.stringify(post, null, 2) + "\n"),
        branch,
        ...(sha ? { sha } : {}),
      }),
    });

    if (!put.ok) {
      const err = await put.text().catch(() => "");
      return json({ error: "GitHub'a kaydedilemedi", detail: err.slice(0, 300) }, 502, env);
    }

    return json({ ok: true, slug, path }, 200, env);
  },
};
