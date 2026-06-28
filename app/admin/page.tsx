import type { Metadata } from "next";
import { AdminEditor } from "@/components/admin-editor";

export const metadata: Metadata = {
  title: "Yönetim",
  robots: { index: false, follow: false },
};

export default function AdminPage() {
  return (
    <main id="main" className="bg-paper">
      <AdminEditor />
    </main>
  );
}
