'use client';
import React, { useState } from 'react';
import { FiArrowRight, FiArrowLeft } from 'react-icons/fi';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';

const services = [
  {
    title: 'Strategic Consulting',
    description: 'Data-driven business strategies tailored to your unique goals and market position.',
    icon: '/image2.webp',
    color: 'bg-blue-100 text-blue-600'
  },
  {
    title: 'Market Expansion',
    description: 'Global growth solutions with localized strategies for international success.',
    icon: '/image11.avif',
    color: 'bg-purple-100 text-purple-600'
  },
  {
    title: 'Financial Optimization',
    description: 'Comprehensive financial analysis to maximize profitability and efficiency.',
    icon: '/photo-1542744173-05336fcc7ad4.avif',
    color: 'bg-green-100 text-green-600'
  },
  {
    title: 'Digital Transformation',
    description: 'Cutting-edge technology integration to future-proof your business operations.',
    icon: '/premium_photo-1668473367234-fe8a1decd456.avif',
    color: 'bg-orange-100 text-orange-600'
  },
  {
    title: 'Risk Management',
    description: 'Proactive identification and mitigation of financial and operational risks.',
    icon: '/premium_photo-1679086008313-f67b823e0467.avif',
    color: 'bg-red-100 text-red-600'
  },
  {
    title: 'Investment Advisory',
    description: 'Expert guidance on portfolio diversification and wealth growth strategies.',
    icon: '/premium_photo-1682309799578-6e685bacd4e1.avif',
    color: 'bg-indigo-100 text-indigo-600'
  },
];

const ServiceCard = ({ service, active }: { service: typeof services[0], active: boolean }) => {
  return (
    <motion.div
      className={`relative rounded-2xl overflow-hidden h-full ${active ? 'shadow-xl' : 'shadow-md'}`}
      whileHover={{ y: -10 }}
      transition={{ type: 'spring', stiffness: 300 }}
    >
      <div className="absolute inset-0 bg-gradient-to-br from-white to-gray-50" />
      <div className="relative z-10 p-8 h-full flex flex-col">
        <div className={`w-16 h-16  rounded-2xl  mb-6`}>
          <div className="w-full h-[100%] ">
            <Image 
              src={service.icon}
              alt={service.title}
              width={120}
              height={120}
            />
          </div>
        </div>
        <h3 className={`text-xl font-bold mb-3 ${active ? 'text-gray-900' : 'text-gray-700'}`}>
          {service.title}
        </h3>
        <p className="text-gray-600 mb-6">{service.description}</p>
        <motion.button
          whileHover={{ x: 5 }}
          className={`mt-auto flex items-center text-sm font-medium ${
            active ? 'text-blue-600' : 'text-gray-500'
          }`}
        >
          Learn more
          <FiArrowRight className="ml-2" />
        </motion.button>
      </div>
    </motion.div>
  );
};

const CarouselSection = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [direction, setDirection] = useState(0); // 1 for next, -1 for prev

  const visibleServices = [];
  for (let i = 0; i < 3; i++) {
    const index = (currentIndex + i) % services.length;
    visibleServices.push(services[index]);
  }

  const handleNavigation = (dir: 'next' | 'prev') => {
    setDirection(dir === 'next' ? 1 : -1);
    setCurrentIndex((prev) => 
      dir === 'next' 
        ? (prev + 1) % services.length 
        : (prev - 1 + services.length) % services.length
    );
  };

  const variants = {
    enter: (direction: number) => ({
      x: direction > 0 ? 100 : -100,
      opacity: 0
    }),
    center: {
      x: 0,
      opacity: 1,
      transition: {
        x: { type: 'spring', stiffness: 300, damping: 30 },
        opacity: { duration: 0.2 }
      }
    },
    exit: (direction: number) => ({
      x: direction < 0 ? 100 : -100,
      opacity: 0,
      transition: {
        x: { type: 'spring', stiffness: 300, damping: 30 },
        opacity: { duration: 0.2 }
      }
    })
  };

  return (
    <section className="w-full py-16 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-gray-50 to-white">
      <div className="max-w-7xl mx-auto">
        {/* Section Header */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-12"
        >
          <div className="inline-flex items-center px-3 py-1 rounded-full bg-red-50 text-red-600 text-sm font-medium mb-4">
            Our Services
          </div>
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Comprehensive Financial Solutions
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Tailored services designed to drive growth and maximize your financial potential
          </p>
        </motion.div>

        {/* Carousel */}
        <div className="relative">
          {/* Navigation Arrows */}
          <div className="flex justify-between absolute top-1/2 left-0 right-0 z-10 px-4">
            <button
              onClick={() => handleNavigation('prev')}
              className="bg-white shadow-lg rounded-full p-3 text-gray-700 hover:text-blue-600 transition-colors transform -translate-y-1/2"
              aria-label="Previous service"
            >
              <FiArrowLeft className="h-5 w-5" />
            </button>
            <button
              onClick={() => handleNavigation('next')}
              className="bg-white shadow-lg rounded-full p-3 text-gray-700 hover:text-blue-600 transition-colors transform -translate-y-1/2"
              aria-label="Next service"
            >
              <FiArrowRight className="h-5 w-5" />
            </button>
          </div>

          {/* Services Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 relative">
            <AnimatePresence custom={direction} initial={false}>
              {visibleServices.map((service, index) => (
                <motion.div
                  key={`${currentIndex}-${index}`}
                  custom={direction}
                  variants={variants}
                  initial="enter"
                  animate="center"
                  exit="exit"
                  className="h-full"
                >
                  <ServiceCard 
                    service={service} 
                    active={index === 1} 
                  />
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        </div>

        {/* Dots Indicator */}
        <div className="flex justify-center mt-8 space-x-2">
          {services.map((_, index) => (
            <button
              key={index}
              onClick={() => {
                setDirection(index > currentIndex ? 1 : -1);
                setCurrentIndex(index);
              }}
              className={`w-3 h-3 rounded-full transition-all ${
                index === currentIndex ? 'bg-blue-600 w-6' : 'bg-gray-300'
              }`}
              aria-label={`Go to service ${index + 1}`}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default CarouselSection;