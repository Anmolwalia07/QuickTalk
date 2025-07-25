"use client"
import Link from "next/link";
import { motion } from "framer-motion";
// import {FaComments } from "react-icons/fa";
export default function Header({isHome}:{isHome:boolean}) {
  return (
      <header className="sticky top-0 z-50 bg-white backdrop-blur-sm shadow-sm md:px-2">
        <div className="container mx-auto px-4 py-3 flex justify-between items-center">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex items-center space-x-2"
          >
            <h1 className="text-2xl font-bold bg-clip-text text-transparent bg-blue-600 ">
              QuickTalk
            </h1>
          </motion.div>
          
          {isHome && <nav className="flex items-center space-x-4">
            <Link href="/login">
              <motion.button 
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="px-3 py-2 rounded-lg font-medium text-blue-600 hover:bg-blue-50 transition-all"
              >
                Login
              </motion.button>
            </Link>
            <Link href="/register">
              <motion.button 
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="px-3 py-2 rounded-lg font-medium bg-blue-600 text-white shadow-lg hover:shadow-xl transition-all"
              >
                Register
              </motion.button>
            </Link>
          </nav>}
        </div>
      </header>
  )
}
