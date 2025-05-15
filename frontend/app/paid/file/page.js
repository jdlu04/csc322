'use client';

import React, { useEffect, useState } from "react";
import { jwtDecode } from "jwt-decode";
import ApproveOrDeny from "@/components/ApproveOrDeny";
import { Users } from "lucide-react";

export default function FilesPage() {
  const [invites, setInvites] = useState([]);
  const [sharedFiles, setSharedFiles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentUserId, setCurrentUserId] = useState(null);

  useEffect(() => {
    const fetchFiles = async () => {
      const token = localStorage.getItem("token");
      if (!token) {
        setError("You must be logged in to view files.");
        return;
      }

      try {
        const decoded = jwtDecode(token);
        const userId = decoded.sub || decoded.identity;
        setCurrentUserId(userId);

        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/files`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!res.ok) {
          throw new Error("Failed to fetch files.");
        }

        const data = await res.json();

        const inviteList = data.filter(file =>
          file.pending_invites?.includes(userId)
        ).map(file => ({
          _id: file._id,
          name: file.file_name,
          user: file.owner_username || "Unknown", // ✅ using username instead of email
        }));

        const sharedList = data.filter(file =>
          file.owner_id === userId || file.collaborators?.includes(userId)
        ).map(file => ({
          _id: file._id,
          name: file.file_name,
          owner: file.owner_username || "Unknown", // ✅ using username instead of email
        }));

        setInvites(inviteList);
        setSharedFiles(sharedList);
      } catch (err) {
        console.error("Error fetching files:", err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchFiles();
  }, []);

  const handleInviteResponse = async (fileId, response) => {
    const token = localStorage.getItem("token");

    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/files/inviteResponse`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ file_id: fileId, response }),
      });

      const data = await res.json();
      console.log("Invite response:", data);

      if (res.ok) {
        setInvites((prev) => prev.filter((file) => file._id !== fileId));
      }
    } catch (error) {
      console.error("Failed to respond to invite:", error);
    }
  };

  return (
    <div className="min-h-screen w-full bg-white px-8 py-6 text-black">
      <h1 className="text-2xl font-bold mb-6">Files</h1>

      {loading ? (
        <p className="text-gray-500">Loading files...</p>
      ) : error ? (
        <p className="text-red-600">{error}</p>
      ) : (
        <>
          {/* Invitations Section */}
          <SectionHeader title="Invitations" />
          <div className="w-3/4 rounded-lg border border-gray-300 mb-10">
            <div className="flex justify-between px-4 py-2 bg-gray-100 rounded-t-lg font-semibold text-sm">
              <div className="w-1/3">User</div>
              <div className="w-1/3">File</div>
              <div className="w-1/5 flex justify-between">
                <span>Accept</span>
                <span>Deny</span>
              </div>
            </div>
            {invites.length === 0 ? (
              <div className="px-4 py-4 text-sm text-gray-500">No pending invitations.</div>
            ) : (
              <div className="divide-y divide-gray-200">
                {invites.map((file) => (
                  <ApproveOrDeny key={file._id} file={file} onRespond={handleInviteResponse} />
                ))}
              </div>
            )}
          </div>

          {/* Shared Files Section */}
          <SectionHeader title="Files" />
          <div className="w-3/4 rounded-lg border border-gray-300">
            <div className="flex justify-between px-4 py-2 bg-gray-100 rounded-t-lg font-semibold text-sm">
              <div className="w-1/3">Text File</div>
              <div className="w-1/3">Owner</div>
              <div className="w-1/5" />
            </div>
            {sharedFiles.length === 0 ? (
              <div className="px-4 py-4 text-sm text-gray-500">No shared files found.</div>
            ) : (
              <div className="divide-y divide-gray-200">
                {sharedFiles.map((file) => (
                  <div
                    key={file._id}
                    className="flex justify-between items-center px-4 py-2 text-sm hover:bg-gray-50 transition"
                  >
                    <div className="w-1/3">{file.name}</div>
                    <div className="w-1/3">{file.owner}</div>
                    <div className="w-1/5 flex justify-end">
                      <Users className="w-5 h-5 text-gray-600 cursor-pointer hover:text-black" />
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
}

function SectionHeader({ title }) {
  return <h2 className="text-lg font-semibold mb-2">{title}</h2>;
}
