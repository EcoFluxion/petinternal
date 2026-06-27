import { WhatsAppIcon } from "@/components/icons";
import { site } from "@/lib/site";

/** Persistent floating WhatsApp contact button (WhatsApp brand green). */
export function WhatsAppFab() {
  return (
    <a
      href={site.whatsapp}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="WhatsApp'tan yazın"
      className="fixed bottom-5 right-5 z-40 inline-flex h-14 w-14 items-center justify-center rounded-full bg-[#25D366] text-white shadow-lift transition-transform duration-200 ease-gentle hover:scale-105 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#25D366] focus-visible:ring-offset-2 focus-visible:ring-offset-paper"
    >
      <WhatsAppIcon className="h-7 w-7" />
    </a>
  );
}
