import React from "react";

export default function page() {
  return (
    <div className="bg-greyBG w-screen h-screen text-black">
      <h1>Purchase Tokens</h1>
      <div>
        <p>Available Tokens: </p>
        <div className="h-10 w-1/2 border-l border-r border-t rounded-t-lg bg-white justify-between inline-flex">
          <p>Price</p>
          <p>Tokens</p>
        </div>
        <div className="h-80 w-1/2 border rounded-b-lg bg-white">
          <div className="inline-flex justify-between w-full">
            <p>$1</p>
            <button className="bg-accentGreen"> 
              10
            </button>
          </div>
          <div className="inline-flex justify-between w-full">
            <p>$5</p>
            <button className="bg-accentGreen"> 
              50
            </button>
          </div>
          <div className="inline-flex justify-between w-full">
            <p>$10</p>
            <button className="bg-accentGreen"> 
              150
            </button>
          </div>
          <div className="inline-flex justify-between w-full">
            <p>$15</p>
            <button className="bg-accentGreen"> 
              250
            </button>
          </div>
          <div className="inline-flex justify-between w-full">
            <p>$20</p>
            <button className="bg-accentGreen"> 
              500
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
