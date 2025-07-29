"use client";
import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { FaSearch, FaComments } from "react-icons/fa";
import { Contact, useUser } from "../(dashboard)/context";
import {useRouter} from "next/navigation"
import axios from "axios";


const Sidebar = () => {
  const [searchTerm, setSearchTerm] = useState("");
    const router = useRouter();
   const handleContactSelect = (contact: Contact) => {
    router.push(`/dashboard/${contact.id}`);
  };

  const darkMode=useUser().darkMode;

  const setContacts=useUser().setContacts
 

  const userId=useUser().user.id

   useEffect(() => {
        const fetchContacts = () => {
          axios
            .get(`${process.env.NEXT_PUBLIC_Url}/api/user/getContacts/${userId}`)
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
  
        const interval = setInterval(() => {
          fetchContacts();
        }, 1000); 
  
        return () => clearInterval(interval); 
      }, []);

    const {setUser,user}=useUser();

    
     useEffect(()=>{
      axios
        .get(`${process.env.NEXT_PUBLIC_Url}/api/user/details/${user.email}`)
        .then((res) => {
          if (res.status === 200) {
            setUser({...res.data.user});
          }
        })
        .catch(console.error);
     },[])
  
   const contacts: Contact[] = useUser().contacts

  const filteredContacts = contacts.filter((contact) =>
    contact.name.toLowerCase().includes(searchTerm.toLowerCase())
  );
  return (
    <div className={`w-full   h-full flex flex-col py-4 ${darkMode ? 'bg-gray-800 text-white' : 'bg-white text-gray-900'} sm:rounded-xl`}>
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
              onClick={() => router.push("create-room")}
              className={`flex-1 rounded-lg text-sm font-medium transition-colors ${
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
        </div>

      </div>

      <div className="flex-1 overflow-y-auto space-y-1">
        {filteredContacts.length > 0 ? (
          filteredContacts.map((contact) => (
            <motion.div
              key={contact.id}
              className={`flex items-center p-3 cursor-pointer ${
                darkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-100'
              }`}
              onClick={() =>  handleContactSelect(contact)}
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
                <div className="flex justify-between">
                  <p className={`text-sm truncate ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>{contact.lastMessage}</p>
                  {contact.unread > 0 && (
                    <span className="bg-blue-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
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
