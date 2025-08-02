'use client'
import { motion, AnimatePresence } from 'framer-motion'
import { FiArrowRight, FiArrowLeft } from 'react-icons/fi'
import { FaRegLightbulb, FaChartLine, FaUsers } from 'react-icons/fa'
import Link from 'next/link'
import Image from 'next/image'
import { useState } from 'react'

const HeroSection = () => {
  const slides = [
    {
      title: "Strategic Growth Solutions",
      description: "Leverage our innovative financial tools to scale your business with precision and confidence.",
      buttons: [
        { text: "Explore Solutions", href: "/register", icon: <FaRegLightbulb className="mr-2" /> },
        { text: "Get Started", href: "/", icon: <FiArrowRight className="mr-2" /> }
      ],
      image: "/pictures5.jpg",
      color: "bg-gradient-to-r from-blue-600 to-indigo-700"
    },
    {
      title: "Intelligent Investment Management",
      description: "Data-driven investment strategies tailored to your financial objectives and risk profile.",
      buttons: [
        { text: "View Performance", href: "/login", icon: <FaChartLine className="mr-2" /> },
        { text: "Start Investing", href: "/login", icon: <FiArrowRight className="mr-2" /> }
      ],
      image: "/pictures7.jpg",
      color: "bg-gradient-to-r from-emerald-600 to-teal-700"
    },
    {
      title: "Join Our Investor Community",
      description: "Access exclusive opportunities and connect with like-minded investors in our premium network.",
      buttons: [
        { text: "Become a Member", href: "/register", icon: <FaUsers className="mr-2" /> }
      ],
      image: "/pictures9.jpg",
      color: "bg-gradient-to-r from-purple-600 to-violet-700"
    },
  ]

  const [currentSlide, setCurrentSlide] = useState(0)
  const [direction, setDirection] = useState(1) // 1 for forward, -1 for backward

  const nextSlide = () => {
    setDirection(1)
    setCurrentSlide((prev) => (prev + 1) % slides.length)
  }

  const prevSlide = () => {
    setDirection(-1)
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length)
  }

  const slideVariants = {
    enter: (direction: number) => ({
      x: direction > 0 ? 1000 : -1000,
      opacity: 0
    }),
    center: {
      x: 0,
      opacity: 1,
      transition: {
        x: { type: "spring", stiffness: 300, damping: 30 },
        opacity: { duration: 0.4 }
      }
    },
    exit: (direction: number) => ({
      x: direction < 0 ? 1000 : -1000,
      opacity: 0,
      transition: {
        x: { type: "spring", stiffness: 300, damping: 30 },
        opacity: { duration: 0.2 }
      }
    })
  }

  const textVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        delay: 0.3,
        duration: 0.6,
        ease: "easeOut"
      }
    }
  }

  const buttonVariants = {
    hover: {
      scale: 1.05,
      transition: {
        duration: 0.2
      }
    },
    tap: {
      scale: 0.98
    }
  }

  return (
    <section className="relative overflow-hidden min-h-[80vh] flex items-center ">
      {/* Background gradient */}
      <motion.div 
        className={`absolute inset-0 ${slides[currentSlide].color} transition-colors duration-700`}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.7 }}
      />

      {/* Content container */}
      <div className="container mx-auto px-6 z-10">
        <div className="flex flex-col lg:flex-row items-center justify-between gap-12">
          {/* Text content */}
          <div className="lg:w-1/2 space-y-8 text-center lg:text-left">
            <AnimatePresence custom={direction} mode="wait">
              <motion.div
                key={currentSlide}
                custom={direction}
                variants={slideVariants}
                initial="enter"
                animate="center"
                exit="exit"
                className="space-y-8"
              >
                <motion.h1 
                  className="text-4xl md:text-5xl font-bold text-white leading-tight"
                  variants={textVariants}
                  initial="hidden"
                  animate="visible"
                >
                  {slides[currentSlide].title}
                </motion.h1>

                <motion.p 
                  className="text-xl text-white/90 max-w-2xl"
                  variants={textVariants}
                  initial="hidden"
                  animate="visible"
                >
                  {slides[currentSlide].description}
                </motion.p>

                <motion.div 
                  className="flex flex-wrap gap-4 justify-center lg:justify-start"
                  variants={textVariants}
                  initial="hidden"
                  animate="visible"
                >
                  {slides[currentSlide].buttons.map((button, index) => (
                    <motion.div
                      key={index}
                      variants={buttonVariants}
                      whileHover="hover"
                      whileTap="tap"
                    >
                      <Link
                        href={button.href}
                        className={`flex items-center px-6 py-3 rounded-lg ${
                          index === 0 
                            ? 'bg-white text-gray-900 hover:bg-gray-100' 
                            : 'bg-transparent border-2 border-white text-white hover:bg-white/10'
                        } transition-colors font-medium`}
                      >
                        {button.icon}
                        {button.text}
                      </Link>
                    </motion.div>
                  ))}
                </motion.div>
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Image content */}
          <div className="lg:w-1/2 relative">
            <AnimatePresence custom={direction} mode="wait">
              <motion.div
                key={currentSlide}
                custom={direction}
                variants={slideVariants}
                initial="enter"
                animate="center"
                exit="exit"
                className="relative aspect-square w-full max-w-xl mx-auto"
              >
                <Image
                  src={slides[currentSlide].image}
                  alt="Hero visual"
                  fill
                  className="rounded-xl object-cover shadow-2xl"
                  priority
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent rounded-xl" />
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </div>

      {/* Navigation controls */}
      <div className="absolute bottom-8 left-0 right-0 flex justify-center gap-4 z-10">
        {slides.map((_, index) => (
          <button
            key={index}
            onClick={() => {
              setDirection(index > currentSlide ? 1 : -1)
              setCurrentSlide(index)
            }}
            className={`w-3 h-3 rounded-full transition-all ${
              index === currentSlide ? 'bg-white w-6' : 'bg-white/50 hover:bg-white/70'
            }`}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>

      {/* Arrow navigation */}
      <button
        onClick={prevSlide}
        className="absolute left-6 top-1/2 -translate-y-1/2 p-3 rounded-full bg-white/20 hover:bg-white/30 backdrop-blur-sm transition-all z-10"
        aria-label="Previous slide"
      >
        <FiArrowLeft className="text-white text-2xl" />
      </button>
      <button
        onClick={nextSlide}
        className="absolute right-6 top-1/2 -translate-y-1/2 p-3 rounded-full bg-white/20 hover:bg-white/30 backdrop-blur-sm transition-all z-10"
        aria-label="Next slide"
      >
        <FiArrowRight className="text-white text-2xl" />
      </button>

      {/* Decorative elements */}
      <motion.div 
        className="absolute top-0 left-0 w-64 h-64 rounded-full bg-white/5 -translate-x-1/2 -translate-y-1/2"
        animate={{
          scale: [1, 1.2, 1],
          opacity: [0.1, 0.2, 0.1]
        }}
        transition={{
          duration: 8,
          repeat: Infinity,
          ease: "easeInOut"
        }}
      />
      <motion.div 
        className="absolute bottom-0 right-0 w-96 h-96 rounded-full bg-white/5 translate-x-1/2 translate-y-1/2"
        animate={{
          scale: [1, 1.3, 1],
          opacity: [0.05, 0.15, 0.05]
        }}
        transition={{
          duration: 10,
          repeat: Infinity,
          ease: "easeInOut",
          delay: 2
        }}
      />
    </section>
  )
}

export default HeroSection