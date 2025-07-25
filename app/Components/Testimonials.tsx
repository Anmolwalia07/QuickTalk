import Link from "next/link";
import { motion } from "framer-motion";
export default function Testimonials() {
  return (
      <section className="py-20 px-4 bg-gradient-to-br from-indigo-50 to-blue-100">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-20">
            <motion.h2 
              className="text-3xl md:text-4xl font-bold mb-4"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              What Our <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-700">Users Say</span>
            </motion.h2>
            <motion.p 
              className="text-xl text-gray-600 max-w-2xl mx-auto"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
            >
              Join thousands of satisfied users who love our platform
            </motion.p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Testimonial 
              name="Alex Johnson" 
              role="Product Manager"
              quote="QuickTalk has revolutionized how our team communicates. The speed and reliability are unmatched!" 
            />
            <Testimonial 
              name="Sarah Williams" 
              role="Freelance Designer"
              quote="The beautiful UI and smooth animations make chatting a delightful experience every time." 
            />
            <Testimonial 
              name="Michael Chen" 
              role="Software Engineer"
              quote="As a developer, I appreciate the robust security features while still maintaining simplicity." 
            />
          </div>
        </div>
      </section>
  )
}



function Testimonial({ name, role, quote }:{name:string, role:string, quote:string}) {
  return (
    <motion.div 
      className="bg-white p-8 rounded-2xl shadow-lg"
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.4 }}
    >
      <div className="flex items-center mb-6">
        <div className="bg-gradient-to-r from-blue-500 to-indigo-600 w-12 h-12 rounded-full flex items-center justify-center text-white font-bold">
          {name.charAt(0)}
        </div>
        <div className="ml-4">
          <h4 className="font-bold text-lg">{name}</h4>
          <p className="text-gray-600">{role}</p>
        </div>
      </div>
      <p className="text-gray-600 italic">"{quote}"</p>
      <div className="flex mt-6">
        {[...Array(5)].map((_, i) => (
          <svg key={i} className="w-5 h-5 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
          </svg>
        ))}
      </div>
    </motion.div>
  );
}