"use client";

import React, { useState, useEffect } from "react";

export default function BlacklistPage() {
  const [reportedWords, setReportedWords] = useState([]);
  const [reportedIds, setReportedIds] = useState([]);
  const [blacklistedWords, setBlacklistedWords] = useState([]);
  const [suggestWord, setSuggestWord] = useState("");
  const [error, setError] = useState(null);
  const [message, setMessage] = useState("");

  const token =
    typeof window !== "undefined" ? localStorage.getItem("token") : null;

  useEffect(() => {
    const fetchBlacklistedWords = async () => {
      try {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/blacklist`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        if (!res.ok && res.status !== 403) {
          throw new Error("Failed to fetch approved blacklist");
        }

        const data = await res.json();
        setBlacklistedWords(data);
      } catch (err) {
        console.error(err);
        setError("Could not load blacklisted words.");
      }
    };

    const fetchReportedWords = async () => {
      try {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/blacklist/pending`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        if (!res.ok && res.status !== 403) {
          throw new Error("Failed to fetch pending blacklist");
        }

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

  const handleSuggest = async () => {
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/blacklist/suggest`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ word: suggestWord }),
        }
      );

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Suggestion failed");

      setMessage(data.message);
      setSuggestWord("");
    } catch (err) {
      console.error(err);
      setError(err.message);
    }
  };

  const handleApprove = async (id) => {
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/blacklist/approve`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ id }),
        }
      );

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
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/blacklist/reject`,
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ id }),
        }
      );

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
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Blacklist Manager</h1>

      {error && <div className="text-red-500 mb-4">{error}</div>}
      {message && <div className="text-green-600 mb-4">{message}</div>}

      {/* Suggest new word */}
      <div className="mb-6">
        <input
          type="text"
          value={suggestWord}
          onChange={(e) => setSuggestWord(e.target.value)}
          className="border p-2 mr-2"
          placeholder="Suggest a word"
        />
        <button
          onClick={handleSuggest}
          className="bg-blue-600 text-white px-4 py-2 rounded"
        >
          Suggest
        </button>
      </div>

      {/* Reported Words */}
      <div className="mb-6">
        <h2 className="text-lg font-semibold">Reported Words</h2>
        <ul className="list-disc list-inside">
          {reportedWords.length === 0 ? (
            <p className="text-gray-500">No reported words.</p>
          ) : (
            reportedWords.map((word, index) => (
              <li key={index}>
                {word}
                <button
                  className="ml-4 text-green-600"
                  onClick={() => handleApprove(reportedIds[index])}
                >
                  Approve
                </button>
                <button
                  className="ml-2 text-red-600"
                  onClick={() => handleReject(reportedIds[index])}
                >
                  Reject
                </button>
              </li>
            ))
          )}
        </ul>
      </div>

      {/* Blacklisted Words */}
      <div>
        <h2 className="text-lg font-semibold">Blacklisted Words</h2>
        <ul className="list-disc list-inside">
          {blacklistedWords.length === 0 ? (
            <p className="text-gray-500">No blacklisted words yet.</p>
          ) : (
            blacklistedWords.map((word, index) => <li key={index}>{word}</li>)
          )}
        </ul>
      </div>
    </div>
  );
}
