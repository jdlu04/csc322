'use client';
import React, { useState } from "react";

export default function Page() {
  const [balance, setBalance] = useState(null);
  const [error, setError] = useState(null);

  const handleClick = async (token) => {
    const access_token = localStorage.getItem("token");

    // make sure your token is a valid number (shouldn't since the numbers are buttons)
    if (typeof token !== 'number' || isNaN(token)) {
      setError("Invalid token amount.");
      return;
    }

    /// from their hit our api call
    try {
      const response = await fetch("http://127.0.0.1:5000/api/tokens/award", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${access_token}`
        },
        body: JSON.stringify({ amount: token }),
      });

      const result = await response.json();

      if (response.ok) {
        //console.log("Added:", token);
        //console.log("New Balance:", result.new_balance);
        setBalance(result.new_balance);
        setError(null);
      } else {
        setError(result.error || "Something went wrong");
        setBalance(null);
      }
    } catch (error) {
      setError("Server error");
      console.error(error);
    }
  };

  return (
    <div className="bg-greyBG w-screen h-screen text-black p-4">
      <h1 className="text-xl mb-4">Purchase Tokens</h1>

      <p>Available Tokens: {balance !== null ? balance : "Unknown"}</p>
      {error && <p className="text-red-600">Error: {error}</p>}

      <div className="h-10 w-1/2 border-l border-r border-t rounded-t-lg bg-white justify-between inline-flex px-4">
        <p>Price</p>
        <p>Tokens</p>
      </div>
      <div className="h-80 w-1/2 border rounded-b-lg bg-white p-4 space-y-4">
        <div className="inline-flex justify-between w-full">
          <p>$1</p>
          <button className="bg-accentGreen px-4 py-2" onClick={() => handleClick(10)}>10</button>
        </div>
        <div className="inline-flex justify-between w-full">
          <p>$5</p>
          <button className="bg-accentGreen px-4 py-2" onClick={() => handleClick(50)}>50</button>
        </div>
        <div className="inline-flex justify-between w-full">
          <p>$10</p>
          <button className="bg-accentGreen px-4 py-2" onClick={() => handleClick(150)}>150</button>
        </div>
        <div className="inline-flex justify-between w-full">
          <p>$15</p>
          <button className="bg-accentGreen px-4 py-2" onClick={() => handleClick(250)}>250</button>
        </div>
        <div className="inline-flex justify-between w-full">
          <p>$20</p>
          <button className="bg-accentGreen px-4 py-2" onClick={() => handleClick(500)}>500</button>
        </div>
      </div>
    </div>
  );
}