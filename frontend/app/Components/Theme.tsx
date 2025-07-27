"use client"
import { FaMoon, FaSun } from "react-icons/fa"
import { useUser } from "../(dashboard)/context"

export default function Theme({darkMode,setDarkMode}:{darkMode:boolean,setDarkMode:(darkMode:boolean)=>void}) {

    const ctx=useUser().setDarkMode
  return (
     <button
        onClick={() => {
          ctx(!darkMode)
          setDarkMode(!darkMode)}}
          title="Toggle Dark Mode"
          className="flex items-center gap-2 px-3 py-2 rounded transition"
          >
          {darkMode ? (
          <FaSun className="" />
          ) : (
          <FaMoon className="" />
          )}
    </button>
  )
}
