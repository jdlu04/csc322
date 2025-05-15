import { React, useState } from "react";

export default function CorrectionTextBox({ value, onTextChange }) {
  return (
    <div className="h-1/2 w-screen pb-10 text-textGrey inline-flex">
      <div className="w-1/2">
        <div className="h-10 w-11/12 border-l border-r border-t rounded-t-lg bg-white justify-between inline-flex">
          <p>Textbox</p>
          <p>Available Tokens:</p>
        </div>
        <div className="w-11/12 h-full border rounded-b-lg bg-white">
          <textarea
            className="resize-none w-full h-11/12"
            value={value || ""}
            onChange={(e) => onTextChange(e.target.value)}
          />

          <div className="w-full inline-flex">
            <button className="text-textGrey">blacklist</button>
            <p> | </p>
            <button className="text-textGrey">upload text</button>
          </div>
        </div>
      </div>

      <div className= "w-1/2">
        <div className="h-10 w-11/12 border-l border-r border-t rounded-t-lg bg-white">
          <p>Correction</p>
        </div>
        <div className="w-11/12 h-full border rounded-b-lg bg-white">
          <div className="resize-none w-full h-80" />
        </div>
      </div>
    </div>
  );
}
