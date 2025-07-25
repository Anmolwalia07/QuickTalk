import Link from "next/link";
import { motion } from "framer-motion";
import { FaComments, FaHeart, FaPaperclip, FaRocket, FaUserFriends } from "react-icons/fa";

export default function Hero() {
  return (
    <section className="relative pt-16 pb-28 px-4">
      <div className="container mx-auto max-w-6xl">
        <div className="flex flex-col md:flex-row items-center justify-between gap-12">
          <motion.div 
            className="flex-1"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <motion.h2
              className="text-4xl md:text-6xl font-bold mb-6 leading-tight"
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
            >
              Connect <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-700">Instantly</span> with QuickTalk
            </motion.h2>
            
            <motion.p 
              className="text-xl text-gray-600 mb-8 max-w-xl"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              Experience lightning-fast messaging with end-to-end encryption. Join thousands of users chatting in real-time.
            </motion.p>
            
            <motion.div 
              className="flex flex-wrap gap-4"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              <Link href="/chat">
                <motion.button 
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="px-8 py-4 rounded-xl font-bold bg-gradient-to-r from-blue-500 to-indigo-600 text-white shadow-lg hover:shadow-xl transition-all flex items-center gap-2"
                >
                  <FaComments /> Start Chatting Now
                </motion.button>
              </Link>
              <Link href="/features">
                <motion.button 
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="px-8 py-4 rounded-xl font-bold bg-white text-blue-600 border border-blue-200 shadow hover:shadow-md transition-all"
                >
                  Learn More
                </motion.button>
              </Link>
            </motion.div>
            
            <motion.div 
              className="mt-12 flex flex-wrap gap-6"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
            >
              <div className="flex items-center gap-3">
                <div className="bg-white p-2 rounded-full shadow">
                  <FaUserFriends className="text-indigo-600 text-xl" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-gray-800">50K+</p>
                  <p className="text-gray-600">Active Users</p>
                </div>
              </div>
              
              <div className="flex items-center gap-3">
                <div className="bg-white p-2 rounded-full shadow">
                  <FaHeart className="text-pink-500 text-xl" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-gray-800">99%</p>
                  <p className="text-gray-600">Satisfaction</p>
                </div>
              </div>
            </motion.div>
          </motion.div>
          
          <motion.div 
            className="flex-1 flex justify-center"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <div className="relative max-w-md">
              <div className="absolute -top-10 -left-10 w-32 h-32 bg-blue-200 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-blob"></div>
              <div className="absolute -bottom-10 -right-10 w-32 h-32 bg-indigo-200 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-blob animation-delay-2000"></div>
              <div className="absolute top-0 right-0 w-32 h-32 bg-purple-200 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-blob animation-delay-4000"></div>
              
              <div className="relative bg-white rounded-2xl shadow-2xl p-6 border border-gray-100">
                <div className="flex justify-between items-center mb-4">
                  <div className="flex items-center space-x-2">
                    <div className="w-3 h-3 bg-red-400 rounded-full"></div>
                    <div className="w-3 h-3 bg-yellow-400 rounded-full"></div>
                    <div className="w-3 h-3 bg-green-400 rounded-full"></div>
                  </div>
                  <div className="text-sm font-medium text-gray-500">QuickTalk Chat</div>
                  <div className="w-6"></div>
                </div>
                
                <div className="space-y-4">
                  <div className="flex justify-start">
                    <div className="bg-gray-100 rounded-2xl rounded-bl-none px-4 py-3 max-w-xs">
                      <p className="text-gray-800">Hey! How are you doing today? 😊</p>
                      <p className="text-xs text-gray-500 mt-1">10:24 AM</p>
                    </div>
                  </div>
                  
                  <div className="flex justify-end">
                    <div className="bg-gradient-to-r from-blue-500 to-indigo-600 text-white rounded-2xl rounded-br-none px-4 py-3 max-w-xs">
                      <p>I&apos;m great! Just finished the new QuickTalk UI design</p>
                      <p className="text-xs text-blue-100 mt-1">10:25 AM</p>
                    </div>
                  </div>
                  
                  <div className="flex justify-start">
                    <div className="bg-gray-100 rounded-2xl rounded-bl-none px-4 py-3 max-w-xs">
                      <p>That&apos;s awesome! Can&apos;t wait to see it!</p>
                      <p className="text-xs text-gray-500 mt-1">10:25 AM</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center mt-8">
                    <div className="flex-1 bg-gray-100 rounded-full px-4 py-2 flex items-center">
                      <input 
                        type="text" 
                        placeholder="Type a message..." 
                        readOnly
                        className="bg-transparent border-0 focus:outline-none w-full"
                      />
                      <button className="text-gray-400 hover:text-blue-500">
                        <FaPaperclip className="transform rotate-45" />
                      </button>
                    </div>
                    <button className="ml-2 w-12 h-12 rounded-full bg-gradient-to-r from-blue-500 to-indigo-600 flex items-center justify-center text-white shadow hover:shadow-md transition-all">
                      <FaRocket className="text-lg" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
