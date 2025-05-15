/// Credit @ Yared Pena
'use client';
import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';

export default function Layout({ children }) {
  const pathname = usePathname();
  const router = useRouter();
  const [activeTab, setActiveTab] = useState('manage-users');

  useEffect(() => {
    if (pathname.includes('blacklist')) setActiveTab('blacklist');
    else if (pathname.includes('userDisputes')) setActiveTab('user-disputes');
    else setActiveTab('manage-users');
  }, [pathname]);

  const handleLogout = () => {
    localStorage.removeItem('token');
    router.push('/login');
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      {/* Top Navigation */}
      <div className="flex items-center justify-between border-b pb-4 mb-6">
        {/* Left side: Logo */}
        <div className="text-2xl text-gray-700 font-bold">TIFI</div>

        {/* Right side: Tabs + Logout */}
        <div className="flex items-center space-x-6">
          {/* Tabs */}
          <div className="flex space-x-8">
            <Link href="/superuser/blacklist">
              <div
                className={`cursor-pointer pb-1 ${
                  activeTab === 'blacklist'
                    ? 'text-black font-semibold border-b-2 border-black'
                    : 'text-gray-400'
                }`}
              >
                Blacklist
              </div>
            </Link>
            <Link href="/superuser">
              <div
                className={`cursor-pointer pb-1 ${
                  activeTab === 'manage-users'
                    ? 'text-black font-semibold border-b-2 border-black'
                    : 'text-gray-400'
                }`}
              >
                Manage Users
              </div>
            </Link>
            <Link href="/superuser/userDisputes">
              <div
                className={`cursor-pointer pb-1 ${
                  activeTab === 'user-disputes'
                    ? 'text-black font-semibold border-b-2 border-black'
                    : 'text-gray-400'
                }`}
              >
                User Disputes
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