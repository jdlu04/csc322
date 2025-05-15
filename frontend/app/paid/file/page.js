'use client';

import ApproveOrDeny from "@/components/ApproveOrDeny";
import React, { useEffect, useState } from "react";

export default function FilesPage() {
  const [invites, setInvites] = useState([]);
  const [sharedFiles, setSharedFiles] = useState([]);

  useEffect(() => {
    // Temporary mock data — replace with real fetch
    setInvites([
      { _id: "file1", user: "liujudy04@gmail.com", name: "E.g. File Name" },
      { _id: "file2", user: "example@gmail.com", name: "File 2.0" },
    ]);
    setSharedFiles([
      { _id: "file3", name: "CSC 322 Project", owner: "liujudy04@gmail.com" },
      { _id: "file4", name: "Email Draft", owner: "example@gmail.com" },
    ]);
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

      // Remove from invite list if successful
      if (res.ok) {
        setInvites((prev) => prev.filter((file) => file._id !== fileId));
      }
    } catch (error) {
      console.error("Failed to respond to invite:", error);
    }
  };

  return (
    <div className="min-h-screen w-full bg-white p-8">
      <h1 className="text-2xl font-bold text-black mb-6">Files</h1>

      {/* Invitations Section */}
      <p className="text-black font-semibold mb-2">Invitations</p>
      <div className="w-3/4 border rounded-t-lg bg-white inline-flex justify-between px-4 py-2 border-textGrey text-black font-medium">
        <div className="w-1/3">User</div>
        <div className="w-1/3">File</div>
        <div className="w-1/5 flex justify-between">
          <span>Accept</span>
          <span>Deny</span>
        </div>
      </div>
      <div className="border rounded-b-lg border-textGrey w-3/4">
        {invites.map((file, idx) => (
          <React.Fragment key={file._id}>
            <ApproveOrDeny file={file} onRespond={handleInviteResponse} />
            {idx < invites.length - 1 && <div className="border-b" />}
          </React.Fragment>
        ))}
      </div>

      {/* Shared Files Section */}
      <p className="text-black font-semibold mt-10 mb-2">Files</p>
      <div className="w-3/4 border rounded-t-lg bg-white inline-flex justify-between px-4 py-2 border-textGrey text-black font-medium">
        <div className="w-1/3">Text File</div>
        <div className="w-1/3">Owner</div>
        <div className="w-1/5" />
      </div>
      <div className="border rounded-b-lg border-textGrey w-3/4">
        {sharedFiles.map((file, idx) => (
          <div key={file._id} className="flex justify-between items-center px-4 py-2 text-black">
            <div className="w-1/3">{file.name}</div>
            <div className="w-1/3">{file.owner}</div>
            <div className="w-1/5 flex justify-end">
              <span className="text-xl cursor-pointer">👥</span>
            </div>
            {idx < sharedFiles.length - 1 && <div className="border-b w-full" />}
          </div>
        ))}
      </div>
    </div>
  );
}