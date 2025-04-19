'use client';

import React, { useState } from 'react';
import { FaArrowRight, FaArrowLeft } from 'react-icons/fa';
import 'animate.css';

import { Inter } from 'next/font/google';

import { motion } from 'framer-motion';


const inter = Inter({
    subsets: ['latin'],
    weight: ['400', '600', '700'], // Regular, Semi-bold, Bold
    display: 'swap',
  });


const services = [
  {
    title: 'Best Consulting',
    description: 'We are an international company having client from different countries around the world.',
    icon: '📊',
  },
  {
    title: 'Marketing growth',
    description: 'Our platform supports all types of cryptocurrency having an easy investment system.',
    icon: '📈',
  },
  {
    title: 'Punctual services',
    description: 'We are very reliable as a huge number of people trust us. We conduct safe and secure services.',
    icon: '🕒',
  },
  {
    title: '24/7 Support',
    description: 'Our team is available round the clock to assist you anytime, anywhere.',
    icon: '💬',
  },
  {
    title: 'Secure Investment',
    description: 'Your investments are protected with industry standard security protocols.',
    icon: '🔒',
  },
  {
    title: 'Global Reach',
    description: 'We operate in multiple countries to bring you unmatched global opportunities.',
    icon: '🌍',
  },
];

const CarouselSection = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
   const [isAnimating, setIsAnimating] = useState(false);

  const getVisibleServices = () => {
    const visible = [];
    for (let i = 0; i < 3; i++) {
      const index = (currentIndex + i) % services.length;
      visible.push(services[index]);
    }
    return visible;
  };

  const visibleServices = getVisibleServices();

  const handleNavigation = (direction: 'next' | 'prev') => {
    if (isAnimating) return;

    setIsAnimating(true);
    // setAnimationClass('animate__fadeOut');

    setTimeout(() => {
      setCurrentIndex((prev) =>
        direction === 'next'
          ? (prev + 1) % services.length
          : (prev - 1 + services.length) % services.length
      );
    //   setAnimationClass('animate__fadeIn');

      setTimeout(() => {
        setIsAnimating(false);
      }, 300);
    }, 300);
  };

  const handleNext = () => handleNavigation('next');
  const handlePrev = () => handleNavigation('prev');

  return (
    <div className={`${inter.className} w-full py-10 px-4 bg-gray-50`}>
            {/* Section Heading */}
    <div className="text-center md:text-left md:px-10 mb-3">
      <div className="flex items-center justify-center md:justify-start gap-2 mb-2">
        <div className="w-1 h-5 bg-[#FD4A36] rounded-sm" />
        <h2 className="text-[#FD4A36] font-semibold text-lg">What We Do</h2>
      </div>
      <h3 className="text-2xl md:text-3xl font-bold text-gray-900 leading-snug">
        Our Business & Financial <br className="hidden md:block" />
        Consulting Services
      </h3>
    </div>

      <div className="flex  mr-10 sm:mr-5 md:mr-0 justify-end mb-4 gap-4">
        <button
          onClick={handlePrev}
          className="text-red-500 hover:scale-110 transition-transform cursor-pointer"
          disabled={isAnimating}
        >
          <FaArrowLeft size={24} />
        </button>
        <button
          onClick={handleNext}
          className="text-red-500 hover:scale-110 transition-transform cursor-pointer"
          disabled={isAnimating}
        >
          <FaArrowRight size={24} />
        </button>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {visibleServices.map((service, index) => (
         <motion.div
         key={`${currentIndex}-${index}`}
         className="group rounded-xl shadow-md p-6 bg-white text-gray-800 relative overflow-hidden transition-all duration-300 cursor-pointer hover:font-bold"
         initial={{ opacity: 0, y: 30 }}
         animate={{ opacity: 1, y: 0 }}
         exit={{ opacity: 0, y: -30 }}
         transition={{ duration: 0.5, ease: 'easeInOut' }}
       >
       

          
            {/* Dot overlay */}
            <div className="absolute inset-0   bg-gray-400 opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-0" />
            <div className="absolute inset-0 z-0 opacity-0 group-hover:opacity-100 bg-[radial-gradient(white_1px,transparent_1px)] [background-size:10px_10px]" />

            <div className="relative z-10">
              <div className="text-4xl mb-4">{service.icon}</div>
              <h3 className="font-bold text-lg mb-2">{service.title}</h3>
              <p className="text-sm">{service.description}</p>
            </div>
            </motion.div>
        ))}
      </div>
    </div>
  );
};

export default CarouselSection;
