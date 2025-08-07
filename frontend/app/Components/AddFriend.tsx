"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useUser } from "../(dashboard)/context"; // adjust path if needed

export default function AddFriend() {
  const [username, setUsername] = useState("");
  const router = useRouter();
  const { darkMode } = useUser();

  const bgMain = darkMode ? "bg-gray-900" : "bg-white";
  const textMain = darkMode ? "text-white" : "text-gray-900";
  const borderMain = darkMode ? "border-gray-700" : "border-gray-200";

  const handleAddFriend = () => {
    if (username.trim()) {
      console.log("Adding friend:", username.trim());
      alert(`Friend request sent to ${username.trim()}`);
      setUsername("");
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen w-full px-4">
      <div className={`${bgMain} rounded-2xl shadow-lg p-8 w-full max-w-md`}>
        {/* Back Button */}
        <button
          onClick={() => router.back()}
          className="text-sm text-blue-400 hover:underline mb-4"
        >
          ← Back
        </button>

        <h1 className={`text-3xl font-bold text-center mb-6 ${textMain}`}>
          Add a Friend
        </h1>

        <input
          type="text"
          placeholder="Enter Friend's Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          className={`w-full px-4 py-3 rounded-lg border ${borderMain} focus:outline-none focus:ring-2 focus:ring-blue-500 mb-4 ${textMain}`}
        />

        <button
          onClick={handleAddFriend}
          className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-3 rounded-xl transition"
        >
          Add Friend
        </button>
      </div>
    </div>
  );
}
