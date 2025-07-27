"use client";
import React, { createContext, useContext, useState } from "react";

export interface Message {
  id: string;
  message: string;
  createdAt: Date;
  senderId: string;
  receiverId: string;
}

export interface Contact {
  id: string;
  name: string;
  lastMessage: string;
  time: string;
  unread: number;
  online: boolean;
}

export interface UserData {
  id: string;
  name: string;
  email: string;
  phone: string;
  image: string;
  bio: string;
  isOnline: boolean;
  sentMessages: Message[];
  receivedMessages: Message[];
}

export interface UserContextType {
  user: UserData;
  contacts: Contact[];
  setUser: (user: UserData) => void;
  setContacts: (contacts: Contact[]) => void;
  darkMode:boolean;
  setDarkMode:(darkMode:boolean)=>void;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export const UserProvider = ({ user, children ,contact,dark}: { user: UserData; children: React.ReactNode ;contact:Contact[],dark:boolean}) => {
  const [userState, setUserState] = useState<UserData>(user);
  const [contacts, setContacts] = useState<Contact[]>(contact);
  const [darkMode, setDarkMode] = useState<boolean>(dark);
  
  return (
    <UserContext.Provider
      value={{
        user: userState,
        contacts,
        setUser: setUserState,
        setContacts,
        darkMode,
        setDarkMode,
      }}
    >
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => {
  const context = useContext(UserContext);
  if (!context) throw new Error("useUserContext must be used within UserProvider");
  return context;
};
