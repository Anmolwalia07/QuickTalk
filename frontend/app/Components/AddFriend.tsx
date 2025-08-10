"use client";

import { useState, useEffect, useMemo } from "react";
import { useRouter } from "next/navigation";
import { useUser } from "../(dashboard)/context";
import axios from "axios";
import { FaUserPlus, FaSearch, FaCheck } from "react-icons/fa";
import { FiSend } from "react-icons/fi";

interface Username {
  name: string;
  id: string;
}

interface Requests {
  id: string;
  friend: {
    name: string;
  };
}

export default function AddFriend() {
  const [allUsernames, setAllUsernames] = useState<Username[]>([]);
  const [filteredResults, setFilteredResults] = useState<Username[]>([]);
  const [username, setUsername] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [sentFriendReq, setSentFriendReq] = useState<Requests[] | []>([]);

  const router = useRouter();
  const { darkMode, user, contacts } = useUser();

  const bgMain = darkMode ? "bg-gray-900" : "bg-gray-200";
  const textMain = darkMode ? "text-white" : "text-gray-900";
  const textSecondary = darkMode ? "text-gray-300" : "text-gray-500";
  const borderMain = darkMode ? "border-gray-700" : "border-gray-200";
  const inputBg = darkMode ? "bg-gray-800" : "bg-gray-100";
  const accentColor = darkMode ? "from-blue-600 to-indigo-600" : "from-blue-500 to-indigo-500";

  const contactNames = useMemo(() => contacts.map((contact) => contact.name), [contacts]);
  const sentRequestNames = useMemo(() => sentFriendReq.map((req) => req.friend.name), [sentFriendReq]);

  useEffect(() => {
    if (!user) return;
    setIsLoading(true);
    axios
      .get(`${process.env.NEXT_PUBLIC_Url}/api/user/getSentRequest/${user.id}`, {
        withCredentials: true,
      })
      .then((res) => {
        setSentFriendReq(res.data.sentFriendReq || []);
        setIsLoading(false);
      })
      .catch((err) => {
        console.error("Error fetching sent requests:", err);
        setIsLoading(false);
      });
  }, [user]);

  useEffect(() => {
    if (!user) return;
    setIsLoading(true);
    axios
      .get(`${process.env.NEXT_PUBLIC_Url}/api/user/alluser/name`, {
        withCredentials: true,
      })
      .then((res) => {
        setAllUsernames(res.data.allusers || []);
        setIsLoading(false);
      })
      .catch((err) => {
        console.error("Error fetching usernames:", err);
        setIsLoading(false);
      });
  }, [user]);

  useEffect(() => {
    const results = allUsernames.filter(
      (usr) =>
        usr.name.toLowerCase().includes(username.toLowerCase()) &&
        usr.name !== user.name &&
        !contactNames.includes(usr.name) &&
        !sentRequestNames.includes(usr.name)
    );
    setFilteredResults(results);
  }, [username, allUsernames, contactNames, sentRequestNames, user.name]);

  const defaultFiltered = useMemo(() => {
    return allUsernames
      .filter(
        (usr) =>
          usr.name !== user.name &&
          !contactNames.includes(usr.name) &&
          !sentRequestNames.includes(usr.name)
      )
      .slice(0, 1);
  }, [allUsernames, user.name, contactNames, sentRequestNames]);

  const handleSendRequest = async (friendId: string) => {
    try {
      await axios.post(
        `${process.env.NEXT_PUBLIC_Url}/api/user/addFriend`,
        { userId: user.id, friendId },
        { withCredentials: true }
      );

      const addedUser = allUsernames.find((u) => u.id === friendId);
      if (addedUser) {
        setSentFriendReq((prev) => [
          ...prev,
          { id: friendId, friend: { name: addedUser.name } },
        ]);
      }

      alert(`Friend request sent to ${addedUser?.name || "user"}`);
    } catch (err) {
      console.error("Error sending request:", err);
      alert("Failed to send friend request.");
    }
  };

  const usersToShow = filteredResults.length ? filteredResults : defaultFiltered;

  return (
    <div className={`flex flex-col w-full px-4 py-2`}>
      <div className="flex justify-start">
        <button
          onClick={() => router.push("/dashboard")}
          className="text-sm text-blue-400 hover:underline mb-4"
        >
          ← Back
        </button>
      </div>

      <div
        className={`${bgMain} rounded-3xl shadow p-6 w-full max-w-xl mx-auto transition-all overflow-y-auto scroll-smooth`}
      >
        <div className="flex items-center gap-4 mb-8">
          <div>
            <h2 className={`text-2xl font-bold ${textMain}`}>Add Friends</h2>
            <p className={`text-sm ${textSecondary}`}>
              {filteredResults.length
                ? `${filteredResults.length} results found`
                : "Discover new connections"}
            </p>
          </div>
        </div>

        <div className="relative mb-8">
          <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
            <FaSearch className={`${textSecondary}`} />
          </div>
          <input
            type="text"
            placeholder="Search by name or email"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className={`w-full pl-12 pr-5 py-4 rounded-xl border ${borderMain} ${inputBg} focus:outline-none focus:ring-2 focus:ring-blue-500 ${textMain} placeholder:text-gray-400`}
          />
        </div>

        {isLoading ? (
          <div className="flex flex-col gap-4">
            {[...Array(3)].map((_, idx) => (
              <div
                key={idx}
                className={`animate-pulse rounded-2xl p-6 ${
                  darkMode ? "bg-gray-800" : "bg-gray-100"
                }`}
              >
                <div className="flex justify-between items-center">
                  <div className="space-y-3">
                    <div
                      className={`h-4 w-32 rounded ${
                        darkMode ? "bg-gray-700" : "bg-gray-300"
                      }`}
                    ></div>
                    <div
                      className={`h-3 w-48 rounded ${
                        darkMode ? "bg-gray-700" : "bg-gray-300"
                      }`}
                    ></div>
                  </div>
                  <div
                    className={`h-10 w-24 rounded-xl ${
                      darkMode ? "bg-gray-700" : "bg-gray-300"
                    }`}
                  ></div>
                </div>
              </div>
            ))}
          </div>
        ) : usersToShow.length === 0 ? (
          <div className="flex flex-col items-center py-12 text-center ">
            <div className="mb-4 p-4 bg-indigo-100 dark:bg-indigo-900/30 rounded-full">
              <FaUserPlus className="text-indigo-500 dark:text-indigo-400 text-2xl" />
            </div>
            <h3 className={`text-xl font-semibold mb-2 ${textMain}`}>No users found</h3>
            <p className={`max-w-md ${textSecondary}`}>
              Try searching with a different name or invite people to join the platform.
            </p>
          </div>
        ) : (
          <div className="space-y-2 flex flex-col">
            <h3
              className={`font-medium ${textSecondary} text-sm uppercase tracking-wider`}
            >
              {username ? "Search Results" : "Suggested Friends"}
            </h3>

            {usersToShow.map((usr) => {
              const hasSentRequest = sentRequestNames.includes(usr.name);
              return (
                <div
                  key={usr.id}
                  className={`border ${borderMain} rounded-2xl p-5 flex justify-between items-center transition-all hover:shadow-lg ${
                    darkMode ? "hover:bg-gray-800" : "hover:bg-gray-50"
                  }`}
                >
                  <div className="flex items-center">
                    <div className="mr-4 flex items-center justify-center w-12 h-12 rounded-full bg-gradient-to-r from-blue-500 to-indigo-500 text-white font-bold">
                      {usr.name.charAt(0)}
                    </div>
                    <div className="flex flex-col">
                      <span className={`flex-wrap font-semibold ${textMain}`}>
                        {usr.name}
                      </span>
                    </div>
                  </div>
                  {hasSentRequest ? (
                    <button
                      disabled
                      className={`flex items-center gap-2 bg-green-600 text-white px-4 py-2.5 rounded-xl text-sm transition cursor-default shadow-md`}
                    >
                      <FaCheck className="w-4 h-4" />
                      Sent
                    </button>
                  ) : (
                    <button
                      onClick={() => handleSendRequest(usr.id)}
                      className={`flex items-center gap-2 bg-gradient-to-r ${accentColor} text-white px-4 py-2.5 rounded-xl text-sm transition hover:opacity-90 shadow-md`}
                    >
                      <FiSend className="w-4 h-4" />
                      Add
                    </button>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
