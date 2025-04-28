import React from "react";

export default function ApproveorDeny() {
  return (
    <div className="h-10 w-full bg-white justify-between inline-flex border-textGrey text-black">
      <div className="w-1/3">
        <p>exampleusersemail@gmail.com</p>
      </div>
      <div className="w-1/3">
        <p>csc322 report</p>
      </div>
      <div className="flex justify-between w-1/5">
        {/*replace with icons in the future*/}
        <p>/</p>
        <p>X</p>
      </div>
    </div>
  );
}
