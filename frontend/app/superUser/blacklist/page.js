'use client';

import React, { useState, useEffect } from "react";

export default function BlacklistPage() {
  const [reportedWords, setReportedWords] = useState([]);
  const [reportedIds, setReportedIds] = useState([]);
  const [blacklistedWords, setBlacklistedWords] = useState([]);
  const [error, setError] = useState(null);
  const [message, setMessage] = useState("");

  const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;

  useEffect(() => {
    const fetchBlacklistedWords = async () => {
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/blacklist`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (!res.ok && res.status !== 403) throw new Error("Failed to fetch approved blacklist");
        const data = await res.json();
        setBlacklistedWords(data);
      } catch (err) {
        console.error(err);
        setError("Could not load blacklisted words.");
      }
    };

    const fetchReportedWords = async () => {
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/blacklist/pending`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (!res.ok && res.status !== 403) throw new Error("Failed to fetch pending blacklist");
        const data = await res.json();
        setReportedWords(data.map((item) => item.word));
        setReportedIds(data.map((item) => item.id));
      } catch (err) {
        console.error(err);
        setError("Could not load reported words.");
      }
    };

    if (token) {
      fetchBlacklistedWords();
      fetchReportedWords();
    }
  }, [token]);

  const handleApprove = async (id) => {
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/blacklist/approve`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ id }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Approval failed");

      setMessage(data.message);
      window.location.reload();
    } catch (err) {
      console.error(err);
      setError(err.message);
    }
  };

  const handleReject = async (id) => {
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/blacklist/reject`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ id }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Rejection failed");

      setMessage(data.message);
      window.location.reload();
    } catch (err) {
      console.error(err);
      setError(err.message);
    }
  };

  return (
    <div className="w-full px-4 sm:px-8">
      <h1 className="text-2xl font-bold text-gray-800 mb-6">Blacklist Manager</h1>

      {error && <p className="text-red-500 mb-4">{error}</p>}
      {message && <p className="text-green-600 mb-4">{message}</p>}

      {/* Reported Words */}
      <div className="mb-8">
        <h3 className="font-semibold text-gray-700 mb-2">Reported Phrases</h3>
        <div className="border rounded-lg overflow-hidden bg-white">
          <div className="grid grid-cols-3 bg-gray-100 p-3 font-semibold text-gray-700">
            <span>Word</span>
            <span className="text-center">Approve</span>
            <span className="text-center">Reject</span>
          </div>

          {reportedWords.length === 0 ? (
            <div className="px-4 py-3 text-gray-500">No reported phrases.</div>
          ) : (
            reportedWords.map((word, index) => (
              <div
                key={index}
                className="grid grid-cols-3 items-center px-4 py-3 border-t text-gray-700"
              >
                <span>{word}</span>
                <div className="flex justify-center">
                  <button
                    className="text-green-600 font-semibold"
                    onClick={() => handleApprove(reportedIds[index])}
                  >
                    ✅
                  </button>
                </div>
                <div className="flex justify-center">
                  <button
                    className="text-red-600 font-semibold"
                    onClick={() => handleReject(reportedIds[index])}
                  >
                    ❌
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Approved Words */}
      <div>
        <h3 className="font-semibold text-gray-700 mb-2">Blacklisted Words</h3>
        <div className="border rounded-lg p-4 min-h-[100px] bg-white">
          {blacklistedWords.length === 0 ? (
            <p className="text-gray-500">No blacklisted words yet.</p>
          ) : (
            blacklistedWords.map((word, index) => (
              <p key={index} className="font-bold text-gray-700">
                {word}
              </p>
            ))
          )}
        </div>
      </div>
    </div>
  );
}