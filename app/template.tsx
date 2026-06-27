// Re-mounts on every route navigation, so the page-enter animation replays
// on each page change (mevzuatbot-style page transition).
export default function Template({ children }: { children: React.ReactNode }) {
  return <div className="app-page-enter">{children}</div>;
}
