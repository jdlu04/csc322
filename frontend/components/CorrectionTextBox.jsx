import { React, useState } from "react";

export default function CorrectionTextBox({ value, onTextChange }) {
  return (
    <div className="h-screen w-screen pb-10 text-textGrey">
      <div className="h-10 w-5/12 border-l border-r border-t rounded-t-lg bg-white justify-between inline-flex">
        <p>Textbox</p>
        <p>Available Tokens:</p>
      </div>
      <div className="w-1/2 h-1/2 border rounded-b-lg bg-white">
        <textarea
          className="resize-none w-full h-11/12"
          value={value || ""}
          onChange={(e) => onTextChange(e.target.value)}
        />

        <div className="w-1/2 inline-flex">
          <button className="text-textGrey">blacklist</button>
          <p> | </p>
          <button className="text-textGrey">upload text</button>
        </div>
      </div>
    </div>
  );
}
