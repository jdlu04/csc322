import Link from "next/link";

export default function RootLayout({ children }) {
  return (
    <div>
      <nav className="h-10 bg-accentGreen">
        <Link href="/paid">Home</Link>
        <Link href="/paid/file">Files</Link>
        <Link href="/paid/token">Tokens</Link>
      </nav>
      <main>{children}</main>
    </div>
  );
}
