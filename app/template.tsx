"use client";

import { usePathname } from "next/navigation";
import type { ReactNode } from "react";

// Keying the wrapper by pathname forces a fresh DOM node on every navigation,
// so the CSS page-enter animation replays on client-side (Link) navigation too
// — e.g. when opening a blog post from the home page.
export default function Template({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  return (
    <div key={pathname} className="app-page-enter">
      {children}
    </div>
  );
}
