// components/FloatingModal.tsx
'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  RiTelegramLine, 
  RiWhatsappLine, 
  RiCloseLine,
  RiMessage2Line,
  RiGroupLine,
  RiUserStarLine
} from 'react-icons/ri';

const FloatingModal = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);

  // Show modal after a delay
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(true);
    }, 3000);

    return () => clearTimeout(timer);
  }, []);

  const contactOptions = [
    {
      id: 1,
      title: 'Join Telegram Group',
      description: 'Get step-by-step guides for withdrawals & trading',
      icon: RiGroupLine,
      link: 'https://t.me/+-FDujXhMmdQxNTFk',
      color: 'bg-blue-500 hover:bg-blue-600'
    },
    {
      id: 2,
      title: 'Message Admin on Telegram',
      description: 'Direct message to company admin',
      icon: RiUserStarLine,
      link: 'https://t.me/TTradecapitalCEO',
      color: 'bg-blue-600 hover:bg-blue-700'
    },
    {
      id: 3,
      title: 'Chat on WhatsApp',
      description: 'Text our manager directly',
      icon: RiWhatsappLine,
      link: 'https://wa.me/qr/4PM5PGIK3MOQO1',
      color: 'bg-green-500 hover:bg-green-600'
    },
    {
      id: 4,
      title: 'Call/Text WhatsApp',
      description: '+1 (260) 310-4886',
      icon: RiMessage2Line,
      link: 'tel:+12603104886',
      color: 'bg-green-600 hover:bg-green-700'
    }
  ];

  const handleClose = () => {
    setIsVisible(false);
  };

  const handleMinimize = () => {
    setIsMinimized(!isMinimized);
  };

  const handleOptionClick = (link: string) => {
    window.open(link, '_blank', 'noopener,noreferrer');
  };

  if (!isVisible) return null;

  return (
    <AnimatePresence>
      <motion.div
        className="fixed bottom-6 right-6 z-50"
        initial={{ opacity: 0, scale: 0.8, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.8, y: 20 }}
        transition={{ duration: 0.3, type: 'spring' }}
      >
        {isMinimized ? (
          // Minimized state - Floating button
          <motion.button
            onClick={handleMinimize}
            className="bg-gradient-to-r from-purple-600 to-blue-600 text-white p-4 rounded-full shadow-2xl hover:shadow-purple-500/25 transition-all duration-300 group"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <RiTelegramLine className="w-6 h-6 group-hover:scale-110 transition-transform" />
            <motion.div
              className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full animate-pulse"
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2 }}
            />
          </motion.button>
        ) : (
          // Expanded state - Modal
          <motion.div
            className="bg-gray-900 border border-gray-700 rounded-2xl shadow-2xl w-80 overflow-hidden"
            layout
          >
            {/* Header */}
            <div className="bg-gradient-to-r from-purple-600 to-blue-600 p-4 relative">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <RiTelegramLine className="w-5 h-5 text-white" />
                  <h3 className="text-white font-semibold text-sm">
                    Support & Guidance
                  </h3>
                </div>
                <div className="flex items-center space-x-1">
                  <button
                    onClick={handleMinimize}
                    className="text-white/80 hover:text-white transition-colors p-1"
                  >
                    <span className="text-xs">_</span>
                  </button>
                  <button
                    onClick={handleClose}
                    className="text-white/80 hover:text-white transition-colors p-1"
                  >
                    <RiCloseLine className="w-4 h-4" />
                  </button>
                </div>
              </div>
              
              {/* Important Message */}
              <motion.div
                className="mt-2 bg-black/20 rounded-lg p-2"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.2 }}
              >
                <p className="text-white/90 text-xs font-medium">
                  💫 Join our Telegram for easy withdrawal & trading guides!
                </p>
              </motion.div>
            </div>

            {/* Body */}
            <div className="p-4 bg-gray-800/50">
              <div className="space-y-3">
                {contactOptions.map((option, index) => (
                  <motion.button
                    key={option.id}
                    onClick={() => handleOptionClick(option.link)}
                    className={`w-full flex items-center space-x-3 p-3 rounded-xl text-white transition-all duration-200 hover:scale-[1.02] ${option.color} shadow-lg hover:shadow-xl`}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <option.icon className="w-5 h-5 flex-shrink-0" />
                    <div className="text-left flex-1">
                      <div className="font-semibold text-sm">
                        {option.title}
                      </div>
                      <div className="text-xs opacity-90">
                        {option.description}
                      </div>
                    </div>
                  </motion.button>
                ))}
              </div>

              {/* Footer Note */}
              <motion.div
                className="mt-4 p-3 bg-yellow-500/10 border border-yellow-500/20 rounded-lg"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5 }}
              >
                <p className="text-yellow-400 text-xs text-center font-medium">
                  ⚡ Required for seamless trading & withdrawals
                </p>
              </motion.div>
            </div>
          </motion.div>
        )}
      </motion.div>
    </AnimatePresence>
  );
};

export default FloatingModal;