'use client';
import React from "react";
import Link from "next/link";
import { useRouter } from 'next/navigation'; 

export default function Layout({ children }) {
  const router = useRouter(); 

  /// removing the JWT token from local storage 
  /// redirecting to login page
  const handleLogout = () => {
    localStorage.removeItem("token");
    router.push("/login");  
  };

  return (
    <div>
      <nav className="h-10 bg-accentGreen">
        <Link href="/paid">Home</Link>
        <Link href="/paid/file">Files</Link>
        <Link href="/paid/token">Tokens</Link>


        <button onClick={handleLogout} className=" text-white px-4 py-2 rounded">
          Logout
        </button>
      </nav>
      <main>{children}</main>
    </div>
  );
}
