'use client';
import React from "react";
import { Check, X } from "lucide-react";

export default function ApproveOrDeny({ file, onRespond }) {
  return (
    <div className="flex justify-between items-center px-4 py-2 text-black w-full">
      {/* User Email */}
      <div className="w-1/3 truncate">
        <p>{file.user}</p>
      </div>

      {/* File Name */}
      <div className="w-1/3 truncate">
        <p>{file.name}</p>
      </div>

      {/* Actions */}
      <div className="w-1/5 flex justify-between items-center">
        <button
          onClick={() => onRespond(file._id, "accept")}
          className="text-green-600 hover:text-green-800"
          aria-label="Accept Invite"
        >
          <Check className="w-5 h-5" />
        </button>
        <button
          onClick={() => onRespond(file._id, "reject")}
          className="text-red-600 hover:text-red-800"
          aria-label="Reject Invite"
        >
          <X className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
}
