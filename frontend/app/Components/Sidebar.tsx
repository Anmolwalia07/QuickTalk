"use client";
import React, { useState } from "react";
import { motion } from "framer-motion";
import { FaSearch, FaPlus, FaComments } from "react-icons/fa";

interface Contact {
  id: number;
  name: string;
  lastMessage: string;
  time: string;
  unread: number;
  online: boolean;
}

interface SidebarProps {
  onContactSelect: (contact: Contact) => void;
  darkMode: boolean;
}

const Sidebar: React.FC<SidebarProps> = ({ onContactSelect, darkMode }) => {
  const [searchTerm, setSearchTerm] = useState("");

  const contacts: Contact[] = [
    { id: 1, name: "Alex Johnson", lastMessage: "See you tomorrow!", time: "10:30 AM", unread: 0, online: true },
    { id: 2, name: "Sarah Williams", lastMessage: "Thanks for the help!", time: "9:15 AM", unread: 3, online: false },
    { id: 3, name: "Michael Chen", lastMessage: "Did you see the new design?", time: "Yesterday", unread: 0, online: true },
    { id: 4, name: "Emma Thompson", lastMessage: "Meeting at 3pm", time: "Yesterday", unread: 0, online: true },
    { id: 5, name: "David Miller", lastMessage: "Check this out...", time: "Wednesday", unread: 0, online: false },
    { id: 6, name: "Jennifer Lopez", lastMessage: "Party this weekend?", time: "Tuesday", unread: 1, online: true },
    { id: 7, name: "Robert Garcia", lastMessage: "Project update", time: "Monday", unread: 0, online: false },
    { id: 8, name: "Jennifer Lopez", lastMessage: "Party this weekend?", time: "Tuesday", unread: 1, online: true },
  ];

  const filteredContacts = contacts.filter((contact) =>
    contact.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className={`w-full lg:w-1/4  h-full flex flex-col py-4 ${darkMode ? 'bg-gray-800 text-white' : 'bg-white text-gray-900'} sm:rounded-xl`}>
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
      </div>


      <div className="flex-1 overflow-y-auto space-y-1">
        {filteredContacts.length > 0 ? (
          filteredContacts.map((contact) => (
            <motion.div
              key={contact.id}
              className={`flex items-center p-3 cursor-pointer ${
                darkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-100'
              }`}
              onClick={() =>  onContactSelect(contact)}
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
