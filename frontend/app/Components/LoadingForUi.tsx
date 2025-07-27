import { useEffect, useState } from "react";

export default function Loading() {
  const [darkMode, setDarkMode] = useState(false);
  const [mounted, setMounted] = useState(false); // To delay rendering

  useEffect(() => {
    const saved = localStorage.getItem("dark");
    if (saved !== null) {
      setDarkMode(saved === "true");
    }
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return (
    <div
      className={`flex items-center absolute w-full z-50 justify-center h-screen ${
        darkMode ? "bg-gray-900" : "bg-[#ffffffb3]"
      }`}
    >
      <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-blue-500"></div>
      <span className="ml-4 text-blue-700 font-medium">Loading...</span>
    </div>
  );
}
