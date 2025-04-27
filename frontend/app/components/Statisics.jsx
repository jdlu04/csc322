import React from "react";

export default function Statisics() {
  return (
    <div className="h-20 w-3/4 mb-5 text-textGrey">
      <div className="h-10 w-full border-l border-r border-t rounded-t-lg bg-white">
        <p>Statistics</p>
      </div>
      <div className="h-14 w-full border rounded-b-lg bg-white inline-flex">
        <p> Edited Texts: </p>
        <p className="px-10"> Used Tokens: </p>
        <p> Corrections: </p>
      </div>
      
    </div>
  );
}
