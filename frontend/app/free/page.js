'use client';

import React, { useEffect, useState } from "react";

export default function Page() {
  const [stats, setStats] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      const token = localStorage.getItem("token");
      if (!token) {
        setError("You must be logged in to view statistics.");
        setLoading(false);
        return;
      }

      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/stats`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!res.ok) {
          setError(res.status === 401 ? "Unauthorized. Please log in." : "Failed to fetch user statistics.");
          setLoading(false);
          return;
        }

        const data = await res.json();
        setStats(data);
      } catch (err) {
        console.error(err);
        setError("An error occurred while fetching statistics.");
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  return (
    <main className="p-6 text-black">
      <h1 className="text-xl font-bold mb-2">Text-it Fix-it</h1>
      <p className="mb-4">
        Text-it Fix-it is an LLM-based text checker. Begin by selecting one of the two correction options:
        LLM correction or self correction. Then, upload a text file or type the text you wanted to be corrected and hit submit once to start the correction process.
      </p>

      {loading && <p className="text-gray-500 mb-4">Loading user statistics...</p>}
      {error && <p className="text-red-600 mb-4">{error}</p>}

      <div className="flex space-x-4 mb-4">
        <label className="flex items-center space-x-2 font-semibold">
          <input type="checkbox" checked readOnly />
          <span>LLM Correction</span>
        </label>
        <label className="flex items-center space-x-2 font-semibold">
          <input type="checkbox" />
          <span>Self Correction</span>
        </label>
      </div>

      <div className="border rounded-md overflow-hidden mb-4">
        <div className="flex justify-between border-b px-4 py-2 font-medium text-sm">
          <span>Text box</span>
          <span>Available Tokens: {stats?.tokensAvailable ?? 0}</span>
        </div>
        <textarea
          className="w-full h-48 p-4 text-sm border-t outline-none resize-none"
          placeholder="Type or upload text..."
        />
        <div className="flex justify-start text-sm text-gray-600 px-4 py-2 border-t space-x-4">
          <span className="cursor-pointer hover:underline">+ Blacklisted Words</span>
          <span className="cursor-pointer hover:underline">Upload Text</span>
        </div>
      </div>

      <div className="flex justify-center">
        <button className="bg-black text-white px-8 py-2 rounded-full text-lg">
          Submit
        </button>
      </div>
    </main>
  );
}