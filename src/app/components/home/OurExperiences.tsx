"use client";
import React from "react";
import { Inter } from 'next/font/google';
import { motion } from 'framer-motion';
import { FaArrowRight } from "react-icons/fa";
 
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
  hidden: { y: 20, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: {
      duration: 0.5,
      ease: "easeOut"
    }
  }
};

const OurExperiences = () => {
  return (
    <section className={`${inter.className} py-20 bg-gradient-to-b from-gray-50 to-white`}>
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <motion.div 
          className="grid md:grid-cols-2 gap-12 items-center"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={containerVariants}
        >
          {/* Left side */}
          <motion.div variants={itemVariants}>
            <div className="flex items-center mb-6">
              {/* Animated accent line */}
              <motion.div 
                className="w-1 h-8 bg-gradient-to-b from-red-500 to-red-600 mr-3 rounded-full"
                initial={{ scaleY: 0 }}
                animate={{ scaleY: 1 }}
                transition={{ duration: 0.8, delay: 0.2 }}
              />
              <p className="text-red-500 font-semibold tracking-wider text-sm uppercase">
                Our Experiences
              </p>
            </div>
            
            <motion.h2 
              className="text-4xl md:text-5xl font-bold text-gray-900 leading-tight mb-6"
              variants={itemVariants}
            >
              We&apos;ve Completed <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-500 to-red-600">Hundreds</span> of Innovative Projects
            </motion.h2>
            
            <motion.div 
              className="flex items-center group cursor-pointer"
              whileHover={{ x: 5 }}
              transition={{ type: "spring", stiffness: 300 }}
              variants={itemVariants}
            >
              <span className="text-red-600 font-medium mr-2">Explore our portfolio</span>
              <FaArrowRight className="h-5 w-5 text-red-600 transition-transform group-hover:translate-x-1" />
            </motion.div>
          </motion.div>

          {/* Right side */}
          <motion.div 
            className="space-y-6"
            variants={itemVariants}
          >
            <p className="text-gray-600 text-lg leading-relaxed">
              We transform businesses through cutting-edge technology solutions, delivering measurable results and exceptional user experiences.
            </p>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="p-6 bg-white rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
                <h3 className="text-2xl font-bold text-gray-900 mb-2">250+</h3>
                <p className="text-gray-500">Projects Completed</p>
              </div>
              <div className="p-6 bg-white rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
                <h3 className="text-2xl font-bold text-gray-900 mb-2">98%</h3>
                <p className="text-gray-500">Client Satisfaction</p>
              </div>
            </div>
            
            <button className="px-6 py-3 bg-gradient-to-r from-red-500 to-red-600 text-white rounded-lg font-medium hover:shadow-lg transition-all hover:scale-[1.02] active:scale-95">
              Our Case Studies
            </button>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};

export default OurExperiences;