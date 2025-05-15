'use client';
import React from "react";
import Link from "next/link";
import { useRouter } from 'next/navigation';

export default function Layout({ children }) {
  const router = useRouter();

  const handleLogout = () => {
    localStorage.removeItem("token");
    router.push("/login");
  };

  return (
    <div>
      <nav className="h-10 bg-accentGreen flex items-center space-x-4 px-4 text-white">
        <Link href="/superuser">Manage Users</Link>
        <Link href="/superuser/blacklist">Blacklist</Link>
        <Link href="/superuser/userDisputes">User Disputes</Link>

        <button onClick={handleLogout} className="ml-auto text-white px-4 py-2 rounded">
          Logout
        </button>
      </nav>
      <main>{children}</main>
    </div>
  );
}
