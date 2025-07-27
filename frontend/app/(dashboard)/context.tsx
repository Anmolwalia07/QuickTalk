"use client"
import { createContext, useContext, useState } from "react";

export type UserContextType = {
  id: string;
  email: string;
  phone: string;
  createdAt:Date;
  sentMessages: {
    id: string;
    senderId: string;
    receiverId: string;
    message: string;
    createdAt:Date;
  }[];
  receivedMessages: {
    id: string;
    senderId: string;
    receiverId: string;
    message: string;
    createdAt:Date;

  }[];
  friends: {
    friend: {
      id: string;
      email: string;
      phone: string;
      image: string;
      name: string;
    };
  }[];
};


type UserContextValue = {
  userDetails: UserContextType;
  setUserDetails: React.Dispatch<React.SetStateAction<UserContextType>>;
};

export const UserContext = createContext<UserContextValue | null>(null);

export default function ContextProvider({
  user,
  children,
}: {
  user: UserContextType;
  children: React.ReactNode;
}) {
  const [userDetails, setUserDetails] = useState(user);

  return (
    <UserContext.Provider value={{ userDetails, setUserDetails }}>
      {children}
    </UserContext.Provider>
  );
}

export function useUser() {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error("useUser must be used within a ContextProvider");
  }
  return context;
}