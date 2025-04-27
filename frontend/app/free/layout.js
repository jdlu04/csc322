import Link from "next/link";

export default function FreeLayout({ children }) {
  return (
    <div>
      <nav className="h-10 bg-greyBG border-b border-textGrey">
        <Link href="/paid" className="text-black">
          Home
        </Link>
        {/*logout placeholder*/}
      </nav>
      <main>{children}</main>
    </div>
  );
}
