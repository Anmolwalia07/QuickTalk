import Link from "next/link";
import { motion } from "framer-motion";
import { FaLock, FaMobileAlt, FaPaperclip, FaRocket } from "react-icons/fa";
export default function Features() {
  return (
      <section className="py-20 px-4 bg-white" id="feature">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-20">
            <motion.h2 
              className="text-3xl md:text-4xl font-bold mb-4"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
            >
              Why <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-700">QuickTalk</span>?
            </motion.h2>
            <motion.p 
              className="text-xl text-gray-600 max-w-2xl mx-auto"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.1 }}
            >
              Experience messaging like never before with our cutting-edge features
            </motion.p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <Feature 
              icon={<FaRocket className="text-2xl" />} 
              title="Real-Time Messaging" 
              desc="Chat instantly with zero lag, powered by WebSockets." 
            />
            <Feature 
              icon={<FaLock className="text-2xl" />} 
              title="Private & Secure" 
              desc="Your conversations are encrypted and secure." 
            />
            <Feature 
              icon={<FaPaperclip className="text-2xl" />} 
              title="Media Sharing" 
              desc="Send files, images, and videos seamlessly." 
            />
            <Feature 
              icon={<FaMobileAlt className="text-2xl" />} 
              title="Cross-Platform" 
              desc="Chat from any device, anytime." 
            />
          </div>
        </div>
      </section>
  )
}

function Feature({ icon, title, desc }:{icon:React.ReactNode,title:string,desc:string}) {
  return (
    <motion.div
      className="flex flex-col items-center text-center p-8 bg-white rounded-2xl shadow-lg border border-gray-100 hover:shadow-xl transition-all"
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.4 }}
      whileHover={{ y: -10 }}
    >
      <div className="w-16 h-16 rounded-full bg-gradient-to-r from-blue-100 to-indigo-100 flex items-center justify-center mb-6">
        <div className="text-blue-600 text-2xl">
          {icon}
        </div>
      </div>
      <h3 className="text-xl font-semibold mb-3">{title}</h3>
      <p className="text-gray-600">{desc}</p>
    </motion.div>
  );
}