import Link from "next/link";

export default function FreeLayout({ children }) {
  return (
    <div>
      <nav className="h-10 bg-greyBG border-b border-textGrey text-black">
        <Link href="/free">Home</Link>
        <Link href="/login">Logout</Link>
      </nav>
      <main>{children}</main>
    </div>
  );
}
