"use client";
import React, { useEffect, useState } from "react";

export default function Page() {
  const [balance, setBalance] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchTokens = async () => {
      const access_token = localStorage.getItem("token");
      if (!access_token) {
        setError("Not logged in");
        return;
      }
      try {
        const response = await fetch("http://localhost:5000/api/tokens", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${access_token}`,
          },
        });
        const result = await response.json();
        
        if (response.ok) {
          setBalance(result.tokens);
        } else {
          alert(result.error);
        }
      } catch (error) {
        console.error(error);
      }
    };
    fetchTokens();
  },[]);

  const handleClick = async (token) => {

    const access_token = localStorage.getItem("token");
    // make sure your token is a valid number (shouldn't since the numbers are buttons)
    if (typeof token !== "number" || isNaN(token)) {
      setError("Invalid token amount.");
      return;
    }

    /// from their hit our api call
    try {
      const response = await fetch("http://127.0.0.1:5000/api/tokens/award", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${access_token}`,
        },
        body: JSON.stringify({ amount: token }),
      });

      const result = await response.json();

      if (response.ok) {
        console.log("Added:", token);
        console.log("New Balance:", result.new_balance);
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
    <div className="bg-greyBG w-screen h-screen">
      <div className="text-black flex flex-col items-center justify-center py-10">
        <div className="w-1/2">
          <h1 className="font-extrabold text-3xl">Purchase Tokens </h1>
          <p className="p-2 font-semibold text-textGrey">Available Tokens: {balance}</p>
          {error && <p className="text-red-600">Error: {error}</p>}
          <div className="flex flex-col items-center justify-center w-full">
            <div className="h-10 w-full border-l border-r border-t rounded-t-lg bg-white justify-between inline-flex border-boxBorder">
              <p className="px-12 py-2 font-bold">Price</p>
              <p className="px-21 py-2 font-bold">Tokens</p>
            </div>
            <div className="h-62 w-full border rounded-b-lg bg-white border-boxBorder pl-14 font-bold pr-14">
              <div className="inline-flex justify-between w-full border-b border-boxBorder py-2">
                <p className="pt-1 text-textGrey">$1</p>
                <button
                  className="bg-accentGreen w-28 h-8 rounded-lg  text-greyBG"
                  onClick={() => handleClick(1)}
                >
                  1
                </button>
              </div>
              <div className="inline-flex justify-between w-full border-b border-boxBorder py-2">
                <p className="pt-1 text-textGrey">$5</p>
                <button
                  className="bg-accentGreen w-28 h-8 rounded-lg text-greyBG"
                  onClick={() => handleClick(25)}
                >
                  25
                </button>
              </div>
              <div className="inline-flex justify-between w-full border-b border-boxBorder py-2">
                <p className="pt-1 text-textGrey">$10</p>
                <button
                  className="bg-accentGreen w-28 h-8 rounded-lg  text-greyBG"
                  onClick={() => handleClick(50)}
                >
                  50
                </button>
              </div>
              <div className="inline-flex justify-between w-full border-b border-boxBorder py-2">
                <p className="pt-1 text-textGrey">$15</p>
                <button
                  className="bg-accentGreen w-28 h-8 rounded-lg  text-greyBG"
                  onClick={() => handleClick(100)}
                >
                  100
                </button>
              </div>
              <div className="inline-flex justify-between w-full py-2">
                <p className="pt-1 text-textGrey">$20</p>
                <button
                  className="bg-accentGreen w-28 h-8 rounded-lg text-greyBG"
                  onClick={() => handleClick(200)}
                >
                  200
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
