'use client';

import React, { useEffect, useState } from 'react';

export default function SuperUserMainPage() {
  const [userRequests, setUserRequests] = useState([]);
  const [users, setUsers] = useState([]);
  const [message, setMessage] = useState("");
  const [error, setError] = useState(null);

  const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;

  useEffect(() => {
    if (!token) return;

    const fetchUserRequests = async () => {
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/users/requests`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (!res.ok) throw new Error("Failed to fetch user requests");
        const data = await res.json();
        setUserRequests(data);
      } catch (err) {
        setError(err.message);
      }
    };

    const fetchUsers = async () => {
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/users`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (!res.ok) throw new Error("Failed to fetch users");
        const data = await res.json();
        setUsers(data.map(user => ({ ...user, expanded: false })));
      } catch (err) {
        setError(err.message);
      }
    };

    fetchUserRequests();
    fetchUsers();
  }, [token]);

  const handleApproveRequest = async (id) => {
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/users/requests/approve`, {
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
      setError(err.message);
    }
  };

  const handleRejectRequest = async (id) => {
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/users/requests/reject`, {
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
      setError(err.message);
    }
  };

  const toggleUserDetails = (index) => {
    setUsers(prev =>
      prev.map((user, i) =>
        i === index ? { ...user, expanded: !user.expanded } : user
      )
    );
  };

  return (
    <div className="w-full px-4 sm:px-8">
      <h1 className="text-2xl font-bold text-gray-800 mb-6">User Management</h1>

      {error && <p className="text-red-500 mb-4">{error}</p>}
      {message && <p className="text-green-600 mb-4">{message}</p>}

      {/* User Requests */}
      <div className="mb-8">
        <h3 className="font-semibold text-gray-700 mb-2">User Requests</h3>
        <div className="border rounded-lg overflow-hidden bg-white">
          <div className="grid grid-cols-3 bg-gray-100 p-3 font-semibold text-gray-700">
            <span>Username</span>
            <span className="text-center">Approve</span>
            <span className="text-center">Reject</span>
          </div>

          {userRequests.length === 0 ? (
            <div className="px-4 py-3 text-gray-500">No user requests.</div>
          ) : (
            userRequests.map((user) => (
              <div
                key={user.id}
                className="grid grid-cols-3 items-center px-4 py-3 border-t text-gray-700"
              >
                <span>{user.username}</span>
                <div className="flex justify-center">
                  <button
                    className="text-green-600 font-semibold"
                    onClick={() => handleApproveRequest(user.id)}
                  >
                    ✅
                  </button>
                </div>
                <div className="flex justify-center">
                  <button
                    className="text-red-600 font-semibold"
                    onClick={() => handleRejectRequest(user.id)}
                  >
                    ❌
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Existing Users */}
      <div>
        <h3 className="font-semibold text-gray-700 mb-2">Existing Users</h3>
        <div className="border rounded-lg p-4 min-h-[100px] bg-white">
          {users.length === 0 ? (
            <p className="text-gray-500">No users found.</p>
          ) : (
            <div className="space-y-4">
              {users.map((user, index) => (
                <div key={user._id} className="border-b pb-2">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-800 font-medium">
                      {user.username}
                    </span>
                    <button
                      className="text-blue-500 hover:underline text-sm"
                      onClick={() => toggleUserDetails(index)}
                    >
                      {user.expanded ? "Hide" : "More"}
                    </button>
                  </div>
                  {user.expanded && (
                    <div className="text-sm text-gray-600 mt-2 space-y-1">
                      <p><span className="font-semibold">Username:</span> {user.username}</p>
                      <p><span className="font-semibold">Email:</span> {user.email}</p>
                      <p><span className="font-semibold">Role:</span> {user.role || "N/A"}</p>
                      <p><span className="font-semibold">Tokens:</span> {user.tokens ?? 0}</p>
                      <p><span className="font-semibold">ID:</span> {user._id}</p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}