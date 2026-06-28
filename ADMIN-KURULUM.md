# /admin — Blog Yayınlama Kurulumu (tek seferlik)

Vet (Öykü) `https://www.petinternal.com/admin` adresinden **şifreyle** giriş yapıp
blog yazısı yayınlayabilir. Yazı kaydedilince site otomatik yeniden derlenir ve
**~1–2 dakika** içinde yayına girer.

Statik site kendi başına şifre kontrol edemediği için küçük, **ücretsiz** bir
Cloudflare Worker bunu yapar. Tek seferlik kurulum:

## 1) GitHub erişim anahtarı (token)
1. GitHub → Settings → Developer settings → **Fine-grained tokens** → *Generate new token*.
2. **Repository access:** Only select repositories → `EcoFluxion/petinternal`.
3. **Permissions → Repository permissions → Contents: Read and write**.
4. Token'ı oluştur ve **kopyala** (bir daha gösterilmez).

## 2) Worker'ı oluştur
**Kolay yol (Dashboard):**
1. Cloudflare → **Workers & Pages** → *Create* → *Create Worker* → bir isim ver
   (örn. `petinternal-publish`) → Deploy.
2. *Edit code* → `cloudflare/worker.js` dosyasının tüm içeriğini yapıştır → Deploy.

**Alternatif (terminal):** `cd cloudflare && npx wrangler deploy`

## 3) Worker ayarları (Settings → Variables)
Şunları ekle:
| Ad | Tür | Değer |
|---|---|---|
| `ADMIN_PASSWORD` | Secret | Vet'in gireceği şifre (kendin belirle) |
| `GITHUB_TOKEN` | Secret | 1. adımdaki token |
| `GH_REPO` | Text | `EcoFluxion/petinternal` |
| `GH_BRANCH` | Text | `main` |
| `ALLOW_ORIGIN` | Text | `https://www.petinternal.com` |

## 4) Worker URL'sini siteye bağla
1. Worker'ın adresini kopyala (örn. `https://petinternal-publish.<hesap>.workers.dev`).
2. `lib/admin-config.ts` içindeki `PUBLISH_ENDPOINT` değerini bu adresle değiştir.
3. Commit + push et (site yeniden derlenir).

## Kullanım
1. `https://www.petinternal.com/admin` → şifreyi gir.
2. Başlık, içerik vb. doldur → **Yayınla**.
3. ~1–2 dakika sonra yazı `https://www.petinternal.com/blog/<slug>` adresinde yayında.

İçerik biçimlendirme: boş satır = yeni paragraf · `## ` = alt başlık · `- ` = madde.

> Güvenlik: Şifre ve GitHub token yalnızca Worker'da (sunucu tarafında) tutulur;
> sitenin koduna asla yazılmaz. `/admin` sayfası arama motorlarına kapalıdır.
