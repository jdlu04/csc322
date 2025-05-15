'use client';

import React, { useState, useEffect } from "react";

export default function BlacklistPage() {
  const [hasMounted, setHasMounted] = useState(false);
  const [reportedWords, setReportedWords] = useState([]);
  const [reportedIds, setReportedIds] = useState([]);
  const [blacklistedWords, setBlacklistedWords] = useState([]);
  const [error, setError] = useState(null);
  const [message, setMessage] = useState("");
  const [token, setToken] = useState(null);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const savedToken = localStorage.getItem("token");
      setToken(savedToken);
      setHasMounted(true);
    }
  }, []);

  useEffect(() => {
    if (!token) return;

    const fetchBlacklistedWords = async () => {
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/blacklist`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (!res.ok) {
          if (res.status === 403) {
            setError("You are not authorized to view blacklisted words.");
            return;
          }
          throw new Error("Failed to fetch approved blacklist");
        }

        const data = await res.json();
        if (!Array.isArray(data)) {
          throw new Error("Unexpected data format for blacklist");
        }

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

        if (!res.ok) {
          if (res.status === 403) {
            setError("You are not authorized to view reported phrases.");
            return;
          }
          throw new Error("Failed to fetch pending blacklist");
        }

        const data = await res.json();
        if (!Array.isArray(data)) {
          throw new Error("Unexpected data format for reported words");
        }

        setReportedWords(data.map((item) => item.word));
        setReportedIds(data.map((item) => item.id));
      } catch (err) {
        console.error(err);
        setError("Could not load reported words.");
      }
    };

    fetchBlacklistedWords();
    fetchReportedWords();
  }, [token]);

  // Prevent rendering on server side
  if (!hasMounted) return null;

  // Placeholder functions for approve/reject (implement as needed)
  const handleApprove = (id) => {
    setMessage(`Approved ID: ${id}`);
    // Implement approve logic here
  };

  const handleReject = (id) => {
    setMessage(`Rejected ID: ${id}`);
    // Implement reject logic here
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
                key={reportedIds[index]}
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