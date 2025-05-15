'use client';

import React, { useEffect, useState } from "react";
import { CheckCircle, XCircle } from "lucide-react";

export default function UserDisputes() {
  const [correctionRejections, setCorrectionRejections] = useState([]);
  const [collaboratorComplaints, setCollaboratorComplaints] = useState([]);
  const [error, setError] = useState(null);
  const [message, setMessage] = useState("");

  const fetchUsers = async () => {
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/users`);
      if (!res.ok) throw new Error("Failed to fetch users.");
      const users = await res.json();

      setCorrectionRejections(
        users.filter(user => user.correctionRejection?.status === "pending")
      );
      setCollaboratorComplaints(
        users.filter(user => user.collaboratorComplaint?.status === "pending")
      );
    } catch (err) {
      console.error(err);
      setError(err.message);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleDecision = async (userId, field, action) => {
    const newStatus = action === "approve" ? "approved" : "denied";
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/users/${userId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ [field]: { status: newStatus } }),
      });

      if (!res.ok) throw new Error(`Failed to ${action} dispute`);
      setMessage(`Dispute ${action}d`);

      // Update UI
      if (field === "correctionRejection") {
        setCorrectionRejections(prev => prev.filter(u => u._id !== userId));
      } else {
        setCollaboratorComplaints(prev => prev.filter(u => u._id !== userId));
      }
    } catch (err) {
      console.error(err);
      setError(err.message);
    }
  };

  return (
    <div className="w-full px-4 sm:px-8">
      <h1 className="text-2xl font-bold text-gray-800 mb-6">User Disputes</h1>

      {error && <p className="text-red-500 mb-4">{error}</p>}
      {message && <p className="text-green-600 mb-4">{message}</p>}

      <div className="mb-10">
        <h3 className="font-semibold text-gray-700 mb-2">LLM Correction Rejections</h3>
        <div className="border rounded-lg overflow-hidden bg-white">
          <div className="grid grid-cols-3 bg-gray-100 p-3 font-semibold text-gray-700">
            <span>User</span>
            <span className="text-center">Approve</span>
            <span className="text-center">Deny</span>
          </div>

          {correctionRejections.length === 0 ? (
            <div className="px-4 py-3 text-gray-500">No pending correction rejections.</div>
          ) : (
            correctionRejections.map((user) => (
              <div
                key={user._id}
                className="grid grid-cols-3 items-center px-4 py-3 border-t text-gray-700"
              >
                <span>{user.username}</span>
                <div className="flex justify-center">
                  <button
                    className="text-green-600"
                    onClick={() => handleDecision(user._id, "correctionRejection", "approve")}
                  >
                    <CheckCircle />
                  </button>
                </div>
                <div className="flex justify-center">
                  <button
                    className="text-red-600"
                    onClick={() => handleDecision(user._id, "correctionRejection", "deny")}
                  >
                    <XCircle />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      <div className="mb-10">
        <h3 className="font-semibold text-gray-700 mb-2">Collaborator Complaints</h3>
        <div className="border rounded-lg overflow-hidden bg-white">
          <div className="grid grid-cols-3 bg-gray-100 p-3 font-semibold text-gray-700">
            <span>User</span>
            <span className="text-center">Approve</span>
            <span className="text-center">Deny</span>
          </div>

          {collaboratorComplaints.length === 0 ? (
            <div className="px-4 py-3 text-gray-500">No pending collaborator complaints.</div>
          ) : (
            collaboratorComplaints.map((user) => (
              <div
                key={user._id}
                className="grid grid-cols-3 items-center px-4 py-3 border-t text-gray-700"
              >
                <span>{user.username}</span>
                <div className="flex justify-center">
                  <button
                    className="text-green-600"
                    onClick={() => handleDecision(user._id, "collaboratorComplaint", "approve")}
                  >
                    <CheckCircle />
                  </button>
                </div>
                <div className="flex justify-center">
                  <button
                    className="text-red-600"
                    onClick={() => handleDecision(user._id, "collaboratorComplaint", "deny")}
                  >
                    <XCircle />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
