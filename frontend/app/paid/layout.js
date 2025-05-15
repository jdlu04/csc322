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
    <div className="min-h-screen bg-[#f9f9f9]">
      <nav className="bg-[#A3C585] px-6 py-3 flex items-center justify-between">
        {/* Left: App Title */}
        <div className="text-white font-bold text-lg">TIFI</div>

        {/* Right: Navigation and Logout */}
        <div className="flex items-center space-x-6 text-white font-medium">
          {/* Navigation Links */}
          <div className="flex space-x-6">
            <Link href="/paid" className="hover:underline">Home</Link>
            <Link href="/paid/file" className="hover:underline">Files</Link>
            <Link href="/paid/token" className="hover:underline">Tokens</Link>
          </div>

          {/* Divider */}
          <div className="w-px h-6 bg-white"></div>

          {/* Logout Button */}
          <button
            onClick={handleLogout}
            className="hover:underline"
          >
            Log out
          </button>
        </div>
      </nav>

      <main className="p-6">
        {children}
      </main>
    </div>
  );
}