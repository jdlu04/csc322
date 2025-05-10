import ApproveOrDeny from "@/components/ApproveOrDeny";
import React from "react";

export default function page() {
  return (
    <div className="h-screen w-screen bg-white">
      <p className="text-black">Invitation</p>
      <div className="h-10 w-3/4 border rounded-t-lg bg-white justify-between inline-flex border-textGrey text-black">
        <div className="w-1/3">
          <p>User</p>
        </div>
        <div className="w-1/3">
          <p>Files</p>
        </div>
        <div className="flex justify-between w-1/5">
          <p>Approve</p>
          <p>Deny</p>
        </div>
      </div>
      <div className="border-r border-l border-b rounded-b-lg border-textGrey py-5 w-3/4">
        <ApproveOrDeny />
        <div className="border-b" />
        <ApproveOrDeny />
      </div>
      <p className="text-black">Files</p>
      <div className="h-10 w-3/4 border rounded-t-lg bg-white justify-between inline-flex border-textGrey text-black">
        <div className="w-1/3">
          <p>Text Files</p>
        </div>
        <div className="w-1/3">
          <p>Owners</p>
        </div>
        <div className="w-1/5" />
      </div>
      <div className="border-r border-l border-b rounded-b-lg border-textGrey py-5 w-3/4">
        <ApproveOrDeny />
        <div className="border-b" />
        <ApproveOrDeny />
      </div>
    </div>
  );
}
