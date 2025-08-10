"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { Requests, useUser } from "../(dashboard)/context";
import axios from "axios";
import { FaCheck, FaTimes } from "react-icons/fa";

export default function FriendRequest() {
  const {
    receivedFriendRequests,
    darkMode,
    user,
    setReceivedFriendRequests,
  } = useUser();

  const router = useRouter();

  useEffect(() => {
    if (!user?.id) return;

    axios
      .get(
        `${process.env.NEXT_PUBLIC_Url}/api/user/getFriendRequestRecievced/${user.id}`,{
          withCredentials: true
        }
      )
      .then((res) => {
        if (res.status === 201) {
          setReceivedFriendRequests([...res.data.receivedFriendReq]);
        }
      })
      .catch(console.error);
  }, [user?.id]);

  const handleAccept = async (requestId: string) => {
    try {
      const res = await axios.post(
        `${process.env.NEXT_PUBLIC_Url}/api/user/acceptRequest`,
        { requestId },{
          withCredentials: true
        }
      );
      if (res.status === 200) {
        const newFriends: Requests[] = receivedFriendRequests.filter(
          (req) => req.id !== requestId
        );
        setReceivedFriendRequests(newFriends);
      }
    } catch (err) {
      console.error("Error accepting friend request:", err);
    }
  };

   const handleDecline = async (requestId: string) => {
    try {
      const res = await axios.post(
        `${process.env.NEXT_PUBLIC_Url}/api/user/declineRequest`,
        { requestId },{withCredentials: true}
      );
      if (res.status === 200) {
        const newFriends: Requests[] = receivedFriendRequests.filter(
          (req) => req.id !== requestId
        );
        setReceivedFriendRequests(newFriends);
      }
    } catch (err) {
      console.error("Error accepting friend request:", err);
    }
  };

  const textMain = darkMode ? "text-white" : "text-gray-900";
  const borderMain = darkMode ? "border-gray-700" : "border-gray-200";

  return (
    <div className={`min-h-screen w-full px-4 py-8  ${textMain}`}>
      <button
        onClick={() => router.back()}
        className="text-sm text-blue-400 hover:underline mb-4"
      >
        ← Back
      </button>

      <h1 className="text-3xl font-bold text-center mb-6">Friend Requests</h1>

      {receivedFriendRequests.length === 0 ? (
        <p className="text-center text-gray-500">No friend requests received.</p>
      ) : (
        <div className="space-y-4 max-w-md mx-auto">
          {receivedFriendRequests.map((req: Requests, index: number) => (
            <div
              key={index}
              className={`border ${borderMain} rounded-xl p-4 flex items-center justify-between`}
            >
              <span>{req.user.name}</span>
              <div className="space-x-2 flex">
                <button
                  onClick={() => handleAccept(req.id)}
                  className="bg-green-600 hover:bg-green-700 text-white p-2 rounded-lg"
                  title="Accept"
                >
                  <FaCheck />
                </button>
                <button
                 onClick={() => handleDecline(req.id)}
                  className="bg-red-600 hover:bg-red-700 text-white p-2 rounded-lg"
                  title="Decline"
                >
                  <FaTimes />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
