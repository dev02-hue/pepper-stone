"use client";
import React, { useState } from 'react';
import { FaArrowRightLong, FaArrowLeftLong } from "react-icons/fa6";
import Link from 'next/link';
import 'animate.css';
import Image from 'next/image';
import { Inter } from 'next/font/google';

const inter = Inter({
    subsets: ['latin'],
    weight: ['400', '600', '700'], // Regular, Semi-bold, Bold
    display: 'swap',
  });

const HeroSection: React.FC = () => {
  const slides = [
    {
      title: "We provide solutions to grow your business",
      description: "Discover innovative strategies and tools to expand your business and reach new markets efficiently.",
      buttons: [
        { text: "Learn More", href: "/about" },
        { text: "Get Started", href: "/login" }
      ],
      image: "/pictures5.jpg",
    },
    {
      title: "Your Trusted Investment Partner",
      description: "Professional investment management with proven results and personalized financial strategies.",
      buttons: [
        { text: "View Services", href: "/services" },
        { text: "Start Planning", href: "/plan" }
      ],
      image: "/pictures7.jpg",
    },
    {
      title: "Join Thousands of Smart Investors",
      description: "Become part of our growing community and access exclusive investment opportunities.",
      buttons: [
        { text: "Register Now", href: "/register" }
      ],
      image: "/pictures9.jpg",
    },
  ];

  const [currentSlide, setCurrentSlide] = useState(0);
  const [animation, setAnimation] = useState('animate__fadeIn');

  const nextSlide = () => {
    setAnimation('animate__fadeOut');
    setTimeout(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
      setAnimation('animate__fadeIn');
    }, 500);
  };

  const prevSlide = () => {
    setAnimation('animate__fadeOut');
    setTimeout(() => {
      setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
      setAnimation('animate__fadeIn');
    }, 500);
  };

  return (
    <section className={`${inter.className} overflow-x-hidden flex flex-col md:flex-row justify-between items-center py-12 px-6 bg-white relative`}>
      <div className="md:w-1/2 text-center md:text-left animate__animated animate__faster md:p-10">
        <h1 className={`text-4xl font-bold text-black animate__animated animate__faster ${animation}`}>
          {slides[currentSlide].title}
        </h1>
        <p className={`mt-4 text-gray-600 text-lg animate__animated animate__faster ${animation}`}>
          {slides[currentSlide].description}
        </p>
        <div className="mt-6 flex flex-col sm:flex-row gap-4 sm:gap-0">
          {slides[currentSlide].buttons.map((button, index) => (
            <Link
              key={index}
              href={button.href}
              className={`bg-[#FD4A36] text-white px-6 py-3 rounded-lg hover:bg-white hover:text-[#FD4A36] border border-[#FD4A36] transition-all animate__animated animate__faster ${animation} text-center sm:mr-4`}
            >
              {button.text}
            </Link>
          ))}
        </div>
      </div>

      <div className={`md:w-1/2 mt-8 md:mt-0 relative animate__animated animate__faster ${animation}`}>
        <Image
          src={slides[currentSlide].image}
          alt="Hero"
          layout="responsive"
          width={1000}
          height={800}
          objectFit="cover"
          className="rounded-lg shadow-lg"
        />
      </div>

      <div className="absolute bottom-6 md:bottom-0 flex justify-evenly w-full px-6">
  <button
    onClick={prevSlide}
    className="p-1 bg-[#FCE9E7] border-1 border-[#FD4A36] rounded-full shadow-md transition-all cursor-pointer"
    aria-label="Previous slide"
  >
    <FaArrowLeftLong className="text-2xl text-[#FD4A36] hover:text-orange-700" />
  </button>
  <button
    onClick={nextSlide}
    className="p-1 bg-[#FD4A36] rounded-full shadow-md transition-all cursor-pointer"
    aria-label="Next slide"
  >
    <FaArrowRightLong className="text-2xl text-white hover:text-gray-300" />
  </button>
</div>
    </section>
  );
};

export default HeroSection;