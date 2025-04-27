"use client";

import React, { useState } from "react";

export default function CorrectionCheckbox() {
  const [isSelfChecked, setSelfChecked] = useState(false);
  const [isLLMChecked, setLLMChecked] = useState(false);

  const handleLLMChecked = () => {
    setLLMChecked(!isLLMChecked);
    setSelfChecked(false);
  };

  const handleSelfChecked = () => {
    setSelfChecked(!isSelfChecked);
    setLLMChecked(false);
  };

  return (
    <div className="flex items-center">
      <input
        type="checkbox"
        checked={isLLMChecked}
        onChange={handleLLMChecked}
      />
      <p className="text-black">LLM Correction</p>
      <input
        type="checkbox"
        checked={isSelfChecked}
        onChange={handleSelfChecked}
      />
      <p className="text-black">Self Correction</p>
    </div>
  );
}
