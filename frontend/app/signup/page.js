"use client";

import Link from "next/link";
import { React, useState } from "react";
import { useRouter } from "next/navigation";
import Dropdown from "@/components/Dropdown";

export default function page() {
  const items = ["Free User", "Paid User", "Super User"];
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [userType, setUserType] = useState(null);
  const router = useRouter();

  const handleSignup = async () => {
    if (!username || !password || !userType) {
      alert("Please fill in all fields");
      return;
    }

    try {
      const response = await fetch("http://127.0.0.1:5000/users", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username,
          password,
          userType,
        }),
      });

      const result = await response.json();

      if (response.ok) {
        if (userType == "Free User") {
          router.push("/free");
        } else if (userType == "Paid User") {
          router.push("/paid");
        }
      } else {
        alert(result.error);
      }
    } catch (error) {
      console.error("Signin error:", error);
      alert("Signin failed. Try again.");
    }

    console.log("Username: ", username);
    console.log("Password: ", password);
    console.log("User Type: ", userType);
  };

  const handleDropdown = (selected) => {
    setUserType(selected);
  };

  return (
    <div className="h-screen">
      <div className="h-3/4 border rounded-2xl bg-white border-boxBorder text-lg flex flex-col items-center justify-center w-full">
        <h1 className="text-4xl font-semibold text-black">Sign Up</h1>
        <div className="h-20 w-5/6">
          <p className="text-textGrey">Username</p>
          <input
            className="border rounded-lg h-12 w-full border-boxBorder text-black"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="Username"
          />
        </div>
        <div className="h-20 w-5/6 my-5">
          <p className="text-textGrey">Password</p>
          <input
            className="border rounded-lg h-12 w-full border-boxBorder text-black"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Password"
            type="password"
          />
        </div>
        <div className="h-48 w-5/6">
          <p className="text-textGrey">User Type</p>
          <Dropdown options={items} onSelect={handleDropdown} />
        </div>
        <button
          className="bg-accentGreen w-3/4 h-14 rounded-4xl"
          onClick={handleSignup}
        >
          <p className="font-semibold">Sign Up</p>
        </button>
      </div>
      <div className="border my-10 rounded-2xl bg-white border-boxBorder text-lg flex items-center justify-center w-full h-20">
        <div className="text-black flex items-center space-x-2 text-lg font-semibold">
          <p>Have an account?</p>
          <Link href="/login" className="underline">
            Login
          </Link>
        </div>
      </div>
    </div>
  );
}
