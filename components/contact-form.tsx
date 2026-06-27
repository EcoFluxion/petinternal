"use client";

import { useState, type FormEvent } from "react";
import { Send } from "lucide-react";
import { site } from "@/lib/site";

const fieldBase =
  "w-full rounded-xl border border-hairline bg-paper px-4 py-3 text-[0.95rem] text-ink placeholder:text-muted transition-colors duration-200 ease-gentle focus:border-brand focus:outline-none focus:ring-2 focus:ring-brand/30";

export function ContactForm() {
  const [sent, setSent] = useState(false);

  function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const data = new FormData(e.currentTarget);
    const ad = String(data.get("ad") ?? "");
    const tel = String(data.get("telefon") ?? "");
    const tur = String(data.get("tur") ?? "");
    const mesaj = String(data.get("mesaj") ?? "");
    const subject = `Randevu talebi — ${ad || "Pet Internal"}`;
    const body = [
      `Ad: ${ad}`,
      `Telefon: ${tel}`,
      `Hayvan türü: ${tur}`,
      "",
      mesaj,
    ].join("\n");
    // No backend: open the visitor's mail client pre-filled (TODO: wire to API/CRM)
    window.location.href = `mailto:${site.email}?subject=${encodeURIComponent(
      subject
    )}&body=${encodeURIComponent(body)}`;
    setSent(true);
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="rounded-2xl border border-hairline bg-surface p-6 shadow-soft sm:p-8"
      aria-label="Randevu ve iletişim formu"
    >
      <h3 className="font-display text-xl font-semibold text-ink">
        Randevu talebi gönderin
      </h3>
      <p className="mt-1.5 text-sm text-muted">
        Formu doldurun, en kısa sürede size geri dönelim.
      </p>

      <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div className="sm:col-span-1">
          <label htmlFor="ad" className="mb-1.5 block text-sm font-medium text-ink">
            Ad Soyad
          </label>
          <input id="ad" name="ad" type="text" required autoComplete="name" placeholder="Adınız" className={fieldBase} />
        </div>
        <div className="sm:col-span-1">
          <label htmlFor="telefon" className="mb-1.5 block text-sm font-medium text-ink">
            Telefon
          </label>
          <input id="telefon" name="telefon" type="tel" required autoComplete="tel" placeholder="05xx xxx xx xx" className={fieldBase} />
        </div>
        <div className="sm:col-span-2">
          <label htmlFor="tur" className="mb-1.5 block text-sm font-medium text-ink">
            Hayvan türü
          </label>
          <select id="tur" name="tur" defaultValue="Kedi" className={fieldBase}>
            <option>Kedi</option>
            <option>Köpek</option>
            <option>Kuş</option>
            <option>Kemirgen / Tavşan</option>
            <option>Diğer</option>
          </select>
        </div>
        <div className="sm:col-span-2">
          <label htmlFor="mesaj" className="mb-1.5 block text-sm font-medium text-ink">
            Mesajınız
          </label>
          <textarea id="mesaj" name="mesaj" rows={4} placeholder="Dostunuzun durumu ve uygun olduğunuz saatler…" className={`${fieldBase} resize-none`} />
        </div>
      </div>

      <button
        type="submit"
        className="mt-6 inline-flex w-full items-center justify-center gap-2 rounded-full bg-brand-600 px-6 py-3 text-base font-medium text-white shadow-soft transition-colors duration-200 ease-gentle hover:bg-brand-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand focus-visible:ring-offset-2 focus-visible:ring-offset-surface"
      >
        <Send className="h-[1.05rem] w-[1.05rem]" aria-hidden="true" />
        Randevu Talebi Gönder
      </button>

      <p className="mt-3 text-center text-xs text-muted">
        Form, talebinizi e-posta uygulamanız üzerinden iletir.
      </p>
      <p className="mt-1 text-center text-xs font-medium text-brand" aria-live="polite">
        {sent
          ? "E-posta uygulamanız açıldı — talebinizi göndererek tamamlayabilirsiniz."
          : ""}
      </p>
    </form>
  );
}
