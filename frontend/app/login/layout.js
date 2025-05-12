import Link from "next/link";

export default function LoginLayout({ children }) {
  return (
    <div className="bg-greyBG w-screen h-screen">
      <main className="h-screen w-1/2 px-20 py-10">{children}</main>
    </div>
  );
}

