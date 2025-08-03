"use client";
import { motion } from 'framer-motion';
import { FiSend, FiUser, FiPieChart, FiDollarSign } from 'react-icons/fi';
import { Inter } from 'next/font/google';

const inter = Inter({
  subsets: ['latin'],
  weight: ['400', '600', '700'],
  display: 'swap',
});

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.2,
      delayChildren: 0.3
    }
  }
};

const itemVariants = {
  hidden: { y: 30, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: {
      duration: 0.6,
      ease: "easeOut"
    }
  }
};

const stepVariants = {
  hover: {
    y: -10,
    transition: {
      type: "spring",
      stiffness: 400,
      damping: 10
    }
  }
};

export default function GetProfit() {
  const steps = [
    { icon: <FiSend size={24} />, label: "Make Plan", color: "from-purple-500 to-purple-600" },
    { icon: <FiUser size={24} />, label: "Create Account", color: "from-blue-500 to-blue-600" },
    { icon: <FiPieChart size={24} />, label: "Choose Plan", color: "from-emerald-500 to-emerald-600" },
    { icon: <FiDollarSign size={24} />, label: "Get Profit", color: "from-amber-500 to-amber-600" }
  ];

  return (
    <section className={`${inter.className} relative overflow-hidden`}>
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-purple-900 via-indigo-800 to-orange-600 opacity-95"></div>
      
      {/* Animated background elements */}
      <motion.div 
        className="absolute inset-0 opacity-10"
        animate={{
          backgroundPosition: ['0% 0%', '100% 100%'],
        }}
        transition={{
          duration: 20,
          repeat: Infinity,
          repeatType: "reverse",
          ease: "linear"
        }}
        style={{
          backgroundImage: 'radial-gradient(circle at 30% 50%, rgba(255,255,255,0.8) 0%, transparent 20%)'
        }}
      />
      
      <div className="relative max-w-7xl mx-auto px-6 py-24 sm:py-32 lg:px-8">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={containerVariants}
          className="relative z-10"
        >
          {/* Heading Section */}
          <motion.div 
            variants={itemVariants}
            className="max-w-3xl mb-16"
          >
            <motion.div 
              className="flex items-center mb-4"
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
            >
              <div className="w-8 h-0.5 bg-gradient-to-r from-amber-400 to-amber-600 mr-3"></div>
              <span className="text-amber-400 font-medium text-sm uppercase tracking-wider">
                Profit Strategy
              </span>
            </motion.div>
            
            <motion.h1 
              className="text-4xl sm:text-5xl md:text-6xl font-bold text-white leading-tight mb-6"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.3 }}
            >
              We <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 to-amber-600">optimize</span> your capital for maximum returns
            </motion.h1>
            
            <motion.p 
              className="text-lg text-gray-200 max-w-2xl"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.4 }}
            >
              Our systematic approach ensures your investments work harder while maintaining security and transparency.
            </motion.p>
          </motion.div>

          {/* Steps Grid */}
          <motion.div 
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6"
            variants={containerVariants}
          >
            {steps.map((step, idx) => (
              <motion.div
                key={idx}
                variants={itemVariants}
                whileHover="hover"
                className="group"
              >
                <motion.div 
                  variants={stepVariants}
                  className="h-full bg-white bg-opacity-10 backdrop-blur-sm rounded-xl border border-white border-opacity-20 p-8 flex flex-col items-center text-center hover:bg-opacity-20 transition-all"
                >
                  <div className={`w-16 h-16 rounded-full mb-6 flex items-center justify-center text-white bg-gradient-to-br ${step.color} shadow-lg`}>
                    {step.icon}
                  </div>
                  <h3 className="text-xl font-semibold text-white mb-2">{step.label}</h3>
                  <p className="text-gray-200 text-sm">
                    {idx === 0 && "Strategic investment planning"}
                    {idx === 1 && "Quick registration process"}
                    {idx === 2 && "Customized portfolio options"}
                    {idx === 3 && "Regular profit distribution"}
                  </p>
                  <div className="mt-6 w-8 h-0.5 bg-gradient-to-r from-transparent via-white to-transparent group-hover:via-amber-400 transition-all"></div>
                </motion.div>
              </motion.div>
            ))}
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}