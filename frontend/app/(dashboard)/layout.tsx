"use client";
import { useEffect, useState } from "react";
import {  FaCog, FaSignOutAlt, FaAlignJustify } from "react-icons/fa";
import { signOut, useSession } from "next-auth/react";
import { redirect } from "next/navigation";
import Loading from "../Components/LoadingForUi";
import { FaX } from "react-icons/fa6";
import axios from "axios";
import {Contact, UserData, UserProvider} from "./context";
import Theme from "../Components/Theme";



export default function Layout({ children }: { children: React.ReactNode }) {
  const { status, data } = useSession();
  const [showMenu, setShowMenu] = useState(false);
  const [user, setUser] = useState<UserData >();
  const [contacts, setContacts] = useState<Contact[] | []>();
  const [darkMode, setDarkMode] = useState<boolean>(true);

  useEffect(() => {
    const saved = localStorage.getItem("dark");
    if (saved !== null) {
      setDarkMode(saved === "true");
    }

    if (data?.user?.email) {
      axios
        .get(`${process.env.NEXT_PUBLIC_Url}/api/user/details/${data.user.email}`)
        .then((res) => {
          if (res.status === 200) {
            setUser({...res.data.user});
            if(res.data.contacts){
              setContacts([...res.data.contacts])
            }else{
              setContacts([])
            }
          }
        })
        .catch(console.error);
    }
  }, [data]);

  useEffect(() => {
    localStorage.setItem("dark", String(darkMode));
  }, [darkMode]);

  const handleLogout = async () => {
    await signOut({ callbackUrl: "/" });
  };

 


  if (status === "loading" || !user || !contacts) {
    return <Loading />;
  }

  if (status === "unauthenticated") {
    redirect("/login");
  }
  return (
    <UserProvider  user={user} contact={contacts} dark={darkMode}>
      <div className={`h-screen flex flex-col ${darkMode ? "bg-gray-900 text-white" : "bg-gray-100 text-black"}`}>
      <header
    className={`p-2 pl-5 md:pl-12 font-semibold text-xl ${
      darkMode ? "bg-gray-900" : "bg-gray-100"
    } flex justify-between items-center`}
  >
    QuickTalk

    <div className="relative sm:hidden mr-5">
      <button
        onClick={() => setShowMenu((prev) => !prev)}
        className="text-xl hover:cursor-pointer"
        title="Menu"
      >
        {!showMenu ? <FaAlignJustify className="text-sm"/>:<FaX className="text-sm"/>} 
      </button>

      {showMenu && (
  <div
    className={`absolute right-0 mt-2 w-30 text-sm z-10 rounded-lg shadow-lg flex flex-col p-1 ${
      darkMode ? "bg-gray-800 text-white" : "bg-white text-black"
    }`}
  >
      <Theme darkMode={darkMode} setDarkMode={setDarkMode}/>
    <button
      onClick={() => console.log("Settings clicked")}
      title="Settings"
      className="flex items-center gap-2 hover:bg-gray-700 px-3 py-2 rounded transition"
    >
      <FaCog className="" />
      <span>Settings</span>
    </button>

    <button
      onClick={handleLogout}
      title="Logout"
      className="flex items-center gap-2 hover:bg-gray-700 text-red-400 hover:text-red-300 px-3 py-2 rounded transition"
    >
      <FaSignOutAlt className="" />
      <span>Logout</span>
    </button>
  </div>
)}

    </div>
    </header>
      <div className="flex flex-1 overflow-hidden">
        <div className={`hidden sm:flex w-9 flex-col  justify-end items-center space-y-6 ${darkMode ? "bg-gray-900" : "bg-gray-100"}`}>
          <div className="mb-5 text-lg">
           <Theme darkMode={darkMode} setDarkMode={setDarkMode}/>
          <button
            onClick={() => console.log("Settings clicked")}
            title="Settings"
            className="flex items-center gap-2  px-3 py-2 rounded transition"
          >
            <FaCog className="" />
          </button>

          <button
            onClick={handleLogout}
            title="Logout"
            className="flex items-center gap-2  text-red-400 hover:text-red-300 px-3 py-2 rounded transition"
          >
            <FaSignOutAlt className="" />
          </button>
          </div>
        </div>

        <div className={`flex flex-1 ${darkMode ? "bg-gray-800" : "bg-white"} rounded-xl`}>
            {children}
        </div>
        <div className={`hidden sm:flex w-6 flex-col justify-end items-center space-y-6 ${darkMode ? "bg-gray-900" : "bg-gray-100"}`}>
        </div>
      </div>

      <footer className={`hidden sm:flex p-2 font-semibold text-xl ${darkMode ? "bg-gray-900" : "bg-gray-100"}`}>
      </footer>
    </div>
    </UserProvider>
  );
}
