"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useUser } from "../(dashboard)/context"; // assuming you store darkMode in context

export default function JoinRoom() {
  const [roomCode, setRoomCode] = useState("");
  const router = useRouter();
  const { darkMode } = useUser();

  // Theme classes
  const bgMain = darkMode ? "bg-gray-900" : "bg-white";
  const textMain = darkMode ? "text-white" : "text-gray-900";
  const borderMain = darkMode ? "border-gray-700" : "border-gray-200";

  const handleJoin = () => {
    if (roomCode.trim()) {
      router.push(`/join-room/${roomCode.trim().toUpperCase()}`);
    }
  };

  return (
    <div
      className={`flex flex-col items-center justify-center min-h-screen w-full  px-4`}
    >
      <div className={`${bgMain} rounded-2xl shadow-lg p-8 w-full max-w-md`}>
        <button
          onClick={() => router.push('/dashboard')}
          className="text-sm text-blue-400 hover:underline mb-4"
        >
          ← Back
        </button>

        <h1 className={`text-3xl font-bold text-center mb-6 ${textMain}`}>
          Join a Room
        </h1>

        <input
          type="text"
          placeholder="Enter Room Code"
          value={roomCode}
          onChange={(e) => setRoomCode(e.target.value)}
          className={`w-full px-4 py-3 rounded-lg border ${borderMain} focus:outline-none focus:ring-2 focus:ring-blue-500 mb-4 ${textMain}`}
        />

        <button
          onClick={handleJoin}
          className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-3 rounded-xl transition"
        >
          Join Room
        </button>

        <p
          className={`text-center mt-4 text-sm ${
            darkMode ? "text-gray-400" : "text-gray-600"
          }`}
        >
          Don’t have a code?{" "}
          <span
            onClick={() => router.push("/create-room")}
            className="text-blue-400 hover:underline cursor-pointer"
          >
            Create one here
          </span>
        </p>
      </div>
    </div>
  );
}
