"use client";
import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { FaSearch, FaComments } from "react-icons/fa";
import { Contact, useUser } from "../(dashboard)/context";
import { useRouter } from "next/navigation";
import axios from "axios";
import { IoMdNotifications } from "react-icons/io";
import { IoMdNotificationsOutline } from "react-icons/io";


const Sidebar = () => {
  const { darkMode, setContacts, user, setUser, contacts ,setReceivedFriendRequests,receivedFriendRequests} = useUser();
  const [searchTerm, setSearchTerm] = useState("");
  const router = useRouter();

  const handleContactSelect = (contact: Contact) => {
    router.push(`/dashboard/${contact.id}`);
  };

  useEffect(() => {
    if (!user?.id) return;

    const fetchContacts = () => {
      axios
        .get(`${process.env.NEXT_PUBLIC_Url}/api/user/getContacts/${user.id}`)
        .then((res) => {
          if (res.status === 200) {
            setContacts(res.data.contacts);
          }
        })
        .catch((err) => {
          console.error("Failed to fetch contacts:", err);
        });
    };

    fetchContacts();
    const interval = setInterval(fetchContacts, 100000);

    return () => clearInterval(interval);
  }, [user?.id, setContacts]);

  useEffect(() => {
    if (!user?.email) return;

    axios
      .get(`${process.env.NEXT_PUBLIC_Url}/api/user/details/${user.email}`)
      .then((res) => {
        if (res.status === 200) {
          setUser({ ...res.data.user });
        }
      })
      .catch(console.error);
  }, [user?.email, setUser]);


   useEffect(() => {
    if (!user?.email) return;
    axios
      .get(`${process.env.NEXT_PUBLIC_Url}/api/user/getFriendRequestRecievced/${user.id}`)
      .then((res) => {
        if (res.status === 201) {
          console.log(res.data)
          setReceivedFriendRequests([...res.data.receivedFriendReq]);
        }
      })
      .catch(console.error);
  }, []);

  const filteredContacts = contacts.filter((contact) =>
    contact.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className={`w-full h-full flex flex-col py-4 ${darkMode ? 'bg-gray-800 text-white' : 'bg-white text-gray-900'} sm:rounded-xl`}>
      <div className="p-4">
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <FaSearch className="text-gray-400" />
          </div>
          <input
            type="text"
            placeholder="Search contacts..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className={`w-full pl-10 pr-3 py-2 rounded-xl focus:outline-none border focus:ring-2 focus:border-0 focus:ring-blue-500 ${
              darkMode ? 'bg-gray-800 border-gray-700 text-white' : 'border-gray-300'
            }`}
          />
        </div>
        <div className="px-4 mt-3 flex flex-col gap-2">
          <div className="flex gap-3">
            <button
              onClick={() => router.push("/create-room")}
              className={`flex-1 py-2 rounded-lg text-sm font-medium transition-colors ${
                darkMode
                  ? "bg-blue-600 hover:bg-blue-700 text-white"
                  : "bg-blue-100 hover:bg-blue-200 text-blue-800"
              }`}
            >
              Create Room
            </button>
            <button
              onClick={() => router.push("/join-room")}
              className={`flex-1 py-2 rounded-lg text-sm font-medium transition-colors ${
                darkMode
                  ? "bg-green-600 hover:bg-green-700 text-white"
                  : "bg-green-100 hover:bg-green-200 text-green-800"
              }`}
            >
              Join Room
            </button>
          </div>
          <div className="flex gap-3 items-center">
          <button
            onClick={() => router.push("/add-friend")}
            className={`w-full py-2 rounded-lg text-sm font-medium transition-colors ${
              darkMode
                ? "bg-purple-600 hover:bg-purple-700 text-white"
                : "bg-purple-100 hover:bg-purple-200 text-purple-800"
            }`}
          >
            Add Friend
          </button>
          <button
          onClick={()=>{
            router.push("/friend-request")
          }}
              className=" h-fit w-fit rounded-full relative hover:cursor-pointer"
              title="friend request"
            >
              
              {darkMode ? <IoMdNotifications className="text-2xl"/>:<IoMdNotificationsOutline className="text-2xl"/>}
              {receivedFriendRequests.length>0 && <span className="absolute top-[-15%] left-4 p-1 bg-red-500 rounded-full"></span>}
            </button>
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto space-y-1 px-1">
        {filteredContacts.length > 0 ? (
          filteredContacts.map((contact) => (
            <motion.div
              key={contact.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.2 }}
              className={`flex items-center p-3 rounded-lg cursor-pointer ${
                darkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-100'
              }`}
              onClick={() => handleContactSelect(contact)}
            >
              <div className="relative">
                <div className={`${darkMode ? 'bg-gray-600' : 'bg-gray-200'} rounded-xl w-12 h-12 flex items-center justify-center`}>
                  <span className="font-medium">{contact.name.charAt(0)}</span>
                </div>
                {contact.online && (
                  <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-white"></div>
                )}
              </div>
              <div className="ml-3 flex-1 min-w-0">
                <div className="flex justify-between items-baseline">
                  <h4 className="font-medium truncate">{contact.name}</h4>
                  <span className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>{contact.time}</span>
                </div>
                <div className="flex justify-between items-center">
                  <p className={`text-sm truncate ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>{contact.lastMessage}</p>
                  {contact.unread > 0 && (
                    <span className="ml-2 bg-blue-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                      {contact.unread}
                    </span>
                  )}
                </div>
              </div>
            </motion.div>
          ))
        ) : (
          <div className="text-center py-10">
            <div className="flex justify-center mb-4">
              <FaComments className="text-gray-400 text-3xl" />
            </div>
            <p className={darkMode ? 'text-gray-400' : 'text-gray-500'}>No contacts found</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Sidebar;
