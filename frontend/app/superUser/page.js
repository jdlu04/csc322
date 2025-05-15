"use client";

import React, { useState, useRef, useEffect } from "react";

export default function BlacklistPage() {
  const [activeTab, setActiveTab] = useState("blacklist");
  const [reportedWords, setReportedWords] = useState(["Buttercup", "Smiski"]);
  const [blacklistedWords, setBlacklistedWords] = useState([
    "A string of disgusting words",
  ]);

  const image = "data:image/jpeg;base64,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";

  const [openMenuIndex, setOpenMenuIndex] = useState(null);
  const menuRefs = useRef([]);

  const handleApprove = (word) => {
    setReportedWords((prev) => prev.filter((w) => w !== word));
    setBlacklistedWords((prev) => [...prev, word]);
  };

  const handleDeny = (word) => {
    setReportedWords((prev) => prev.filter((w) => w !== word));
  };

  const handleAction = (action, user) => {
    console.log(`${action} clicked for ${user}`);
  };

  const toggleMenu = (index) => {
    setOpenMenuIndex(openMenuIndex === index ? null : index);
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (!menuRefs.current.some((ref) => ref?.contains(event.target))) {
        setOpenMenuIndex(null);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      {/* Top Navigation */}
      <div className="flex items-center justify-between border-b pb-4 mb-6">
        <div className="text-2xl text-gray-700 font-bold">TIFI</div>
        <div className="flex space-x-8">
          <div
            className={`cursor-pointer pb-1 ${
              activeTab === "blacklist"
                ? "text-black font-semibold border-b-2 border-black"
                : "text-gray-400"
            }`}
            onClick={() => setActiveTab("blacklist")}
          >
            Blacklist
          </div>
          <div
            className={`cursor-pointer pb-1 ${
              activeTab === "manage-users"
                ? "text-black font-semibold border-b-2 border-black"
                : "text-gray-400"
            }`}
            onClick={() => setActiveTab("manage-users")}
          >
            Manage Users
          </div>
          <div
            className={`cursor-pointer pb-1 ${
              activeTab === "user-disputes"
                ? "text-black font-semibold border-b-2 border-black"
                : "text-gray-400"
            }`}
            onClick={() => setActiveTab("user-disputes")}
          >
            User Disputes
          </div>
        </div>
        <button className="text-black font-semibold">Log out</button>
      </div>

      {/* Main Content */}
      <div className="max-w-4xl mx-auto bg-white p-6 rounded-lg shadow">
        {activeTab === "blacklist" && (
          <>
            <h2 className="text-2xl font-bold text-gray-700 mb-6">Blacklisted Words</h2>

            <div className="mb-8">
              <h3 className="font-semibold text-gray-700 mb-2">Reported phrases</h3>
              <div className="border rounded-lg overflow-hidden">
                <div className="grid grid-cols-4 bg-gray-100 p-3 font-semibold text-left">
                  <span className="text-gray-700">Words</span>
                  <span></span>
                  <span className="text-center text-gray-700">Approve</span>
                  <span className="text-center text-gray-700">Deny</span>
                </div>

                {reportedWords.map((word, idx) => (
                  <div
                    key={idx}
                    className="grid grid-cols-4 items-center px-4 py-3 border-t"
                  >
                    <span className="text-gray-700">{word}</span>
                    <span></span>
                    <div className="flex justify-center">
                      <img
                        src={image}
                        alt="Approve"
                        className="h-6 w-6 inline-block cursor-pointer"
                        onClick={() => handleApprove(word)}
                      />
                    </div>
                    <div className="flex justify-center">
                      <span
                        className="text-red-600 text-3xl cursor-pointer"
                        onClick={() => handleDeny(word)}
                      >
                        ❌
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <h3 className="font-semibold text-gray-700 mb-2">Blacklisted Words</h3>
              <div className="border rounded-lg p-4 min-h-[100px] bg-gray-100">
                {blacklistedWords.map((word, i) => (
                  <p key={i} className="font-bold text-gray-700">
                    {word}
                  </p>
                ))}
              </div>
            </div>
          </>
        )}

        {activeTab === "manage-users" && (
          <>
            <h2 className="text-2xl font-bold text-gray-700 mb-6">Manage Users</h2>

            <div className="mb-8">
              <h3 className="text-gray-600 font-semibold mb-2">User Requests</h3>
              <div className="border rounded-lg overflow-hidden">
                <div className="grid grid-cols-4 bg-gray-100 p-3 font-semibold text-left">
                  <span className="text-gray-700">User</span>
                  <span></span>
                  <span className="text-center text-gray-700">Approve</span>
                  <span className="text-center text-gray-700">Deny</span>
                </div>

                {["requestedUser@gmail.com", "smiskiLover@gmail.com"].map((email, idx) => (
                  <div key={idx} className="grid grid-cols-4 items-center px-4 py-3 border-t">
                    <span className="text-gray-700">{email}</span>
                    <span></span>
                    <div className="flex justify-center">
                      <img src={image} alt="Approve" className="h-6 w-6 inline-block cursor-pointer" />
                    </div>
                    <div className="flex justify-center">
                      <span className="text-red-600 text-3xl cursor-pointer">❌</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <h3 className="text-gray-600 font-semibold mb-2">Existing Users</h3>
              <div className="border rounded-lg relative overflow-visible">
                <div className="grid grid-cols-2 bg-gray-100 p-3 font-semibold">
                  <span className="text-gray-700">User</span>
                  <span></span>
                </div>

                {["existingUser1@gmail.com", "existingUser2@gmail.com"].map((email, index) => (
                  <div key={index} className="grid grid-cols-2 items-center px-4 py-3 border-t relative">
                    <span className="text-gray-700">{email}</span>
                    <div className="text-right pr-6 relative" ref={(el) => (menuRefs.current[index] = el)}>
                      <button
                        onClick={() => toggleMenu(index)}
                        className="text-xl font-bold text-gray-700"
                      >
                        ⋯
                      </button>
                      {openMenuIndex === index && (
                        <div className="absolute right-6 mt-2 bg-white border text-gray-700 rounded shadow z-10">
                          {["Suspend", "Fine", "Terminate"].map((action) => (
                            <button
                              key={action}
                              className="block w-full text-left px-4 py-2 hover:bg-gray-100"
                              onClick={() => handleAction(action, email)}
                            >
                              {action}
                            </button>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </>
        )}

        {activeTab === "user-disputes" && (
          <>
            <h2 className="text-2xl text-gray-700 font-bold mb-6">User Disputes</h2>
            <h3 className="text-gray-600 font-semibold mb-2">LLM Correction Rejections</h3>
            <div className="border rounded-lg overflow-hidden">
              <div className="grid grid-cols-4 bg-gray-100 p-3 text-gray-700 font-semibold text-left">
                <span>User</span>
                <span>Subject</span>
                <span className="text-center text-gray-700">Approve</span>
                <span className="text-center text-gray-700">Deny</span>
              </div>
              {["guest@gmail.com"].map((user, idx) => (
                <div key={idx} className="grid grid-cols-4 items-center px-4 py-3 border-t">
                  <span className="text-gray-700">{user}</span>
                  <span className="text-gray-800 font-semibold">WRONG!!</span>
                  <div className="flex justify-center">
                    <img src={image} alt="Approve" className="h-6 w-6 inline-block cursor-pointer" />
                  </div>
                  <div className="flex justify-center">
                    <span className="text-red-600 text-3xl cursor-pointer">❌</span>
                  </div>
                </div>
              ))}
              {["guestUser@gmail.com"].map((user, idx) => (
                <div key={idx} className="grid grid-cols-4 items-center px-4 py-3 border-t">
                  <span className="text-gray-700">{user}</span>
                  <span className="text-gray-800 font-semibold">Incorrect Syntax</span>
                  <div className="flex justify-center">
                    <img src={image} alt="Approve" className="h-6 w-6 inline-block cursor-pointer" />
                  </div>
                  <div className="flex justify-center">
                    <span className="text-red-600 text-3xl cursor-pointer">❌</span>
                  </div>
                </div>
              ))}
            </div>
            {/* Collaborator Complaints */}
  <div class="mt-8">
    <h3 class="text-gray-600 font-semibold mb-2">Collaborator Complaints</h3>
    <div class="border rounded-lg overflow-hidden">
      {/* Header */}
      <div class="grid grid-cols-2 bg-gray-100 p-3 font-semibold">
        <span class="text-gray-700">User</span>
        <span class="text-left text-gray-700">Subject</span>
      </div>

      {/* Entry 1 */}
      <div class="grid grid-cols-2 px-4 py-3 border-t items-center">
        <span class="text-gray-700">existingUser1@gmail.com</span>
        <span class="text-left text-gray-700">Deleted my text</span>
      </div>

      {/* Entry 2 */}
      <div class="grid grid-cols-2 px-4 py-3 border-t items-center">
        <span class="text-gray-700">existingUser2@gmail.com</span>
        <span class="text-left text-gray-700">Inappropriate addition</span>
      </div>
    </div>
  </div>
          </>
        )}
        
        

        
      </div>
    </div>
    
  );
}