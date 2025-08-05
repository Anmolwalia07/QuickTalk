"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useUser } from "../(dashboard)/context";
import axios from "axios";
import Loading from "./LoadingForUi";

export default function CreateRoom() {
  const [roomCode, setRoomCode] = useState("");
  const [joinCode, setJoinCode] = useState("");
  const [loading, setLoading] = useState(false);

  const [cooldown, setCooldown] = useState<number>(0); 
  const router = useRouter();
  const { darkMode ,user} = useUser();

  const bgMain = darkMode ? "bg-gray-900" : "bg-white";
  const textMain = darkMode ? "text-white" : "text-gray-900";
  const borderMain = darkMode ? "border-gray-700" : "border-gray-200";

  useEffect(() => {
    const lastCreated = localStorage.getItem("lastRoomCreated");
    if (lastCreated) {
      const elapsed = Math.floor((Date.now() - parseInt(lastCreated)) / 1000);
      if (elapsed < 600) {
        setCooldown(600 - elapsed);
      }
    }
  }, []);

  useEffect(() => {
    if (cooldown > 0) {
      const timer = setInterval(() => {
        setCooldown((prev) => (prev > 0 ? prev - 1 : 0));
      }, 1000);
      return () => clearInterval(timer);
    }
  }, [cooldown]);

  const generateRoom = async() => {
    if (cooldown > 0) return;

    const code = Math.random().toString(36).substring(2, 8).toUpperCase();
    setRoomCode(code);
    setLoading(true)
    const response=await axios.post(`${process.env.NEXT_PUBLIC_Url}/api/room/create`,{
      roomId:code,
      userId:user.id
    })
    if(response.status===200){
      setLoading(false)
       localStorage.setItem("lastRoomCreated", Date.now().toString());
      setCooldown(600);

    }
    setLoading(false)
  };

  const handleJoin = () => {
    if (joinCode.trim()) {
      router.push(`/join-room/${joinCode.trim().toUpperCase()}`);
    }
  };

  return (
    <>
    {loading && <Loading/>}
    <div className={`flex flex-col items-center justify-center w-full px-4`}>
      <div className={`${bgMain} rounded-2xl shadow p-8 w-full max-w-md`}>
        <button
          onClick={() => router.back()}
          className="text-sm text-blue-400 hover:underline mb-4"
        >
          ← Back
        </button>

        <h1 className={`text-3xl font-bold text-center mb-6 ${textMain}`}>
          Create a Room
        </h1>

        <button
          onClick={generateRoom}
          disabled={cooldown > 0}
          className={`w-full ${
            cooldown > 0
              ? "bg-gray-500 cursor-not-allowed"
              : "bg-blue-600 hover:bg-blue-700"
          } text-white font-semibold py-3 rounded-xl transition`}
        >
          {cooldown > 0
            ? `Wait ${Math.floor(cooldown / 60)}:${
                (cooldown % 60).toString().padStart(2, "0")
              }`
            : "Generate Room"}
        </button>

        {roomCode && (
          <div className="mt-6 text-center">
            <p className="text-gray-400 mb-2">Your Room Code:</p>
            <p
              className={`text-2xl font-mono px-4 py-2 rounded-lg inline-block ${
                darkMode ? "bg-gray-700 text-white" : "bg-gray-200 text-gray-900"
              }`}
            >
              {roomCode}
            </p>
          </div>
        )}

        <div className="flex items-center my-6">
          <div
            className={`flex-1 h-px ${
              darkMode ? "bg-gray-600" : "bg-gray-300"
            }`}
          ></div>
          <span className="px-4 text-gray-400">OR</span>
          <div
            className={`flex-1 h-px ${
              darkMode ? "bg-gray-600" : "bg-gray-300"
            }`}
          ></div>
        </div>

        <div>
          <p className="text-center text-gray-400 mb-3">
            Already have a code?
            <span
              className="text-blue-400 hover:cursor-pointer"
              onClick={() => {
                router.push("/join-room");
              }}
            >
              Join Room
            </span>
          </p>
          <div className="flex gap-2">
            <input
              type="text"
              placeholder="Enter Room Code"
              value={joinCode}
              onKeyDown={(e) => e.key === "Enter" && handleJoin()}
              onChange={(e) => setJoinCode(e.target.value)}
              className={`flex-1 px-4 py-2 rounded-lg border ${borderMain} focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                darkMode ? "bg-gray-700 text-white" : "bg-white text-gray-900"
              }`}
            />
            <button
              onClick={handleJoin}
              className="bg-green-600 hover:bg-green-700 px-4 py-2 rounded-lg font-semibold text-white"
            >
              Join
            </button>
          </div>
        </div>
      </div>
    </div>
    </>
  );
}
