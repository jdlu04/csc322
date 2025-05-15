"use client";
import Link from "next/link";
import React, { useState } from "react";
import { useRouter } from "next/navigation";

export default function page() {
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async () => {
    if (!username || !password) {
      alert("Please fill in all fields");
      return;
    }

    try {
      const response = await fetch("http://localhost:5000/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username,
          password,
        }),
      });

      const result = await response.json();

      if (response.ok) {
        console.log("Login successful:", result.user);
        
        const token = result.access_token;
        localStorage.setItem("token", token);

        if (result.user.userType === "Free User") {
          router.push("/free");
        } else if (result.user.userType === "Paid User") {
          router.push("/paid");
        }
      } else {
        alert(result.error);
      }
    } catch (error) {
      console.error("Login error:", error);
      alert("Login failed. Try again.");
    }
  };

  return (
    <div className="h-screen">
      <div className="h-3/4 border rounded-2xl bg-white border-boxBorder text-lg flex flex-col items-center justify-center w-full">
        <h1 className="text-4xl font-semibold text-black">Log In</h1>
        <div className="h-20 w-5/6">
          <p className="text-textGrey">Username</p>
          <input
            className="border rounded-lg h-12 w-full border-boxBorder text-black"
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
        </div>
        <div className="h-20 w-5/6 my-5">
          <p className="text-textGrey">Password</p>
          <input
            className="border rounded-lg h-12 w-full border-boxBorder text-black"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            type="password"
          />
        </div>
        <button
          className="bg-accentGreen w-3/4 h-14 rounded-4xl"
          onClick={handleLogin}
        >
          <p className="font-semibold">Sign Up</p>
        </button>
      </div>
      <div className="border my-10 rounded-2xl bg-white border-boxBorder text-lg flex items-center justify-center w-full h-20">
        <div className="text-black flex items-center space-x-2 text-lg font-semibold">
          <p>Have an account?</p>
          <Link href="/signup" className="underline">
            Sign Up
          </Link>
        </div>
      </div>
    </div>
  );
}
