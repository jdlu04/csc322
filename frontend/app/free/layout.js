'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';

export default function FreeLayout({ children }) {
  const pathname = usePathname();
  const router = useRouter();
  const [activeTab, setActiveTab] = useState('home');

  useEffect(() => {
    if (pathname === '/free') setActiveTab('home');
    else setActiveTab('');
  }, [pathname]);

  const handleLogout = () => {
    localStorage.removeItem('token');
    router.push('/login');
  };

  return (
    <div className="min-h-screen bg-greyBG p-6">
      {/* Top Navigation */}
      <div className="flex items-center justify-between border-b border-textGrey pb-4 mb-6 text-black">
        {/* Left side: Brand or Logo */}
        <div className="text-2xl font-bold">TIFI</div>

        {/* Right side: Tabs + Logout */}
        <div className="flex items-center space-x-6">
          {/* Tabs */}
          <div className="flex space-x-8 text-sm font-semibold">
            <Link href="/free">
              <div
                className={`cursor-pointer pb-1 ${
                  activeTab === 'home'
                    ? 'text-black border-b-2 border-black'
                    : 'text-gray-400 hover:text-black'
                }`}
              >
                Home
              </div>
            </Link>
          </div>

          {/* Divider */}
          <div className="text-gray-300">|</div>

          {/* Logout Button */}
          <button
            onClick={handleLogout}
            className="text-black font-semibold hover:underline"
          >
            Log out
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-6xl mx-auto bg-white p-6 rounded-lg shadow">
        {children}
      </div>
    </div>
  );
}