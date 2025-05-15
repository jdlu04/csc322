"use client";

import React, { useEffect, useState } from "react";

export default function Page() {
  const [stats, setStats] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [originalText, setOriginalText] = useState("");
  const [correctedText, setCorrectedText] = useState("");

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

        const data = await res.json();
        if (!res.ok) {
          throw new Error(data.error || "Failed to fetch stats");
        }

        setStats(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  const llmCorrection = async () => {
    const username = localStorage.getItem("username");

    if (!username) {
      alert("Username not found in local storage.");
      return;
    }

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/llm-correct`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username, text: originalText }),
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error("Server error response:", errorText);
        alert("Something went wrong. See console for details.");
        return;
      }

      const corrected = await response.text(); // ✅ expecting a plain string
      setCorrectedText(corrected);
      console.log("Corrected Text:", corrected);
    } catch (error) {
      console.error("Correction failed:", error);
      alert("Something went wrong. Please try again.");
    }
  };

  return (
    <div className="w-full min-h-screen bg-[#f9f9f9] px-8 py-6 text-black">
      <h1 className="text-xl font-bold mb-2">Text-it Fix-it</h1>
      <p className="mb-6 max-w-2xl">
        Text-it Fix-it is an LLM-based text checker. Begin by selecting one of
        the two correction options: LLM correction or self correction. Then,
        upload a text file or type the text you wanted to be corrected and hit
        submit once to start the correction process.
      </p>

      {/* Statistics */}
      <div className="border rounded-lg p-4 mb-6 bg-white">
        <h2 className="font-semibold mb-2">Statistics</h2>
        {loading ? (
          <p>Loading...</p>
        ) : error ? (
          <p className="text-red-600">{error}</p>
        ) : stats?.message ? (
          <p>{stats.message}</p>
        ) : (
          <div className="flex flex-wrap gap-6 text-sm">
            <p>
              <span className="font-semibold">Edited Texts:</span>{" "}
              {stats?.correctionsMade ?? 0}
            </p>
            <p>
              <span className="font-semibold">Used Tokens:</span>{" "}
              {stats?.tokensUsed ?? 0}
            </p>
            <p>
              <span className="font-semibold">Corrections:</span>{" "}
              {stats?.correctionsMade ?? 0}
            </p>
            <p>
              <span className="font-semibold">Errors:</span> 0
            </p>
          </div>
        )}
      </div>

      {/* Correction Options */}
      <div className="flex gap-6 mb-4">
        <label className="flex items-center font-semibold">
          <input type="checkbox" checked readOnly className="mr-2" />
          LLM Correction
        </label>
        <label className="flex items-center font-semibold">
          <input type="checkbox" className="mr-2" />
          Self Correction
        </label>
      </div>

      {/* Input Text Box */}
      <div className="border rounded-lg bg-white overflow-hidden mb-6">
        <div className="flex justify-between border-b px-4 py-2 font-semibold text-sm">
          <span>Original</span>
          <span>Available Tokens: {stats?.tokensAvailable ?? 0}</span>
        </div>
        <textarea
          className="w-full h-48 p-4 text-sm outline-none resize-none border-t"
          value={originalText}
          onChange={(e) => setOriginalText(e.target.value)}
          placeholder="Type or paste your text here"
        />
        <div className="flex justify-between text-xs text-gray-600 px-4 py-2 border-t">
          <div className="space-x-2">
            <span className="cursor-pointer hover:underline">+ Blacklisted Words</span>
            <span className="cursor-pointer hover:underline">Upload Text</span>
          </div>
          <span className="cursor-pointer hover:underline">Save Text</span>
        </div>
      </div>

      {/* Submit Button */}
      <div className="flex justify-center mb-6">
        <button
          onClick={llmCorrection}
          className="bg-green-500 hover:bg-green-600 transition px-10 py-2 rounded-full font-semibold text-white"
        >
          Submit
        </button>
      </div>

      {/* Corrected Output */}
      {correctedText && (
        <div className="border rounded-lg bg-white p-4">
          <h2 className="font-semibold text-sm mb-2">Corrected Output</h2>
          <pre className="whitespace-pre-wrap text-sm">{correctedText}</pre>
        </div>
      )}
    </div>
  );
}