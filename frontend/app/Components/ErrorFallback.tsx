"use client"
import { useRouter } from "next/navigation";

export default function ErrorFallback() {
  const router = useRouter();

  return (
    <div className="w-full min-h-screen flex flex-col items-center justify-center space-y-4 px-4">
      <div className="text-red-700 text-2xl text-center">
        Room not found or error creating room.
      </div>
      <button
        onClick={() => router.push('/join-room')}
        className="text-blue-500 hover:underline text-sm"
      >
        ← Go Back
      </button>
    </div>
  );
}