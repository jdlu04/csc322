import React, { useState } from "react";

function Dropdown({ options, onSelect }) {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedValue, setSelectedValue] = useState(null);

  const toggleDropdown = () => {
    setIsOpen(!isOpen);
  };

  const handleOptionClick = (option) => {
    setSelectedValue(option);
    onSelect(option);
    setIsOpen(false);
  };

  return (
    <div className="text-black w-full">
      <button
        onClick={toggleDropdown}
        className="border rounded-lg h-12 w-full border-boxBorder text-left"
      >
        {selectedValue || "Select an option"}
      </button>
      {isOpen && (
        <ul className="border-l border-r border-boxBorder rounded">
          {options.map((option) => (
            <li className="border-b border-boxBorder"key={option} onClick={() => handleOptionClick(option)}>
              {option}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default Dropdown;
