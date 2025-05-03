"use client";
import { motion } from "framer-motion";
import { FaTelegramPlane } from "react-icons/fa";

const TelegramFloatButton = () => {
  // Replace with your actual Telegram link
  const telegramLink = "https://t.me/yourusername";
  
  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: 0.5, duration: 0.5 }}
      className="fixed bottom-6 left-6 z-50"
    >
      <motion.a
        href={telegramLink}
        target="_blank"
        rel="noopener noreferrer"
        whileHover={{ scale: 1.1, y: -5 }}
        whileTap={{ scale: 0.95 }}
        className="flex items-center gap-2 bg-gradient-to-br from-blue-500 to-blue-600 text-white px-4 py-3 rounded-full shadow-xl hover:shadow-2xl transition-all duration-300"
      >
        <FaTelegramPlane className="text-xl" />
        <span className="font-medium hidden sm:inline-block">Chat with Us</span>
      </motion.a>
      
      {/* Optional tooltip that appears on hover */}
      <motion.div
        initial={{ opacity: 0 }}
        whileHover={{ opacity: 1 }}
        className="absolute left-full ml-2 px-3 py-2 bg-gray-800 text-white text-sm rounded-md whitespace-nowrap hidden sm:block"
      >
        Message us on Telegram
      </motion.div>
    </motion.div>
  );
};

export default TelegramFloatButton;