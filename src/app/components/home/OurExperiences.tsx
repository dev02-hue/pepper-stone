import React from "react";
import { Inter } from 'next/font/google';

const inter = Inter({
    subsets: ['latin'],
    weight: ['400', '600', '700'], // Regular, Semi-bold, Bold
    display: 'swap',
  });

const OurExperiences = () => {
  return (
    <section className={`${inter.className} py-16 bg-white`}>
      <div className="max-w-7xl mx-auto px-4 grid md:grid-cols-2 gap-10 items-center">
        {/* Left side */}
        <div>
          <div className="flex items-center mb-4">
            {/* Vertical line */}
            <div className="w-1 h-6 bg-red-500 mr-2"></div>
            <p className="text-red-500 font-semibold">Our Experiences</p>
          </div>
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 leading-snug">
            We’ve Done Lot’s Of <br /> Awesome Projects
          </h2>
        </div>

        {/* Right side */}
        <div className="text-gray-600 text-lg leading-relaxed">
          Improve efficiency, provide a better customer experience with modern
          technology services available around the world. Our skilled staff,
          combined with decades of experience.
        </div>
      </div>
    </section>
  );
};

export default OurExperiences;
