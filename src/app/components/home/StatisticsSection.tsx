// components/StatisticsSection.tsx
"use client";
import { motion, useAnimation, useInView } from 'framer-motion';
import { useEffect, useRef, useState } from 'react';
import { Inter } from 'next/font/google';

const inter = Inter({
    subsets: ['latin'],
    weight: ['400', '600', '700'], // Regular, Semi-bold, Bold
    display: 'swap',
  });

interface StatCardProps {
  label: string;
  value: number;
  suffix?: string;
  duration?: number;
}

const StatCard = ({ label, value, suffix = '', duration = 2 }: StatCardProps) => {
  const controls = useAnimation();
  const ref = useRef(null);
  const isInView = useInView(ref);
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (isInView) {
      controls.start('visible');
      let start = 0;
      const increment = value / (duration * 60); // Roughly 60fps
      const counter = setInterval(() => {
        start += increment;
        if (start >= value) {
          setCount(value);
          clearInterval(counter);
        } else {
          setCount(parseFloat(start.toFixed(2)));
        }
      }, 1000 / 60);
    }
  }, [isInView, value, duration, controls]);

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 50 }}
      animate={controls}
      variants={{
        visible: { opacity: 1, y: 0, transition: { duration: 0.6 } },
      }}
      className={`${inter.className} flex flex-col items-center text-center px-4 py-6 bg-white rounded-xl shadow-md`}
    >
      <p className="text-4xl font-extrabold text-red-500">
        {count.toLocaleString(undefined, { maximumFractionDigits: 1 })}
        {suffix}
      </p>
      <p className="text-sm mt-2 font-medium text-gray-700">{label}</p>
    </motion.div>
  );
};

const StatisticsSection = () => {
  return (
    <section className="w-full bg-gray-100 py-16 px-4 md:px-16 text-center">
      <motion.h2
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="text-4xl font-bold text-red-500 uppercase tracking-wide"
      >
        Our Statistics
      </motion.h2>

      <motion.h3
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.2 }}
        className="text-xl font-base text-gray-800 my-4"
      >
        Take a look at our statistics so far
      </motion.h3>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-12 max-w-5xl mx-auto">
        <StatCard label="Total Deposits" value={5} suffix="B" />
        <StatCard label="Total Investment" value={2.5} suffix="B" />
        <StatCard label="Total Withdrawals" value={4.5} suffix="B" />
      </div>
    </section>
  );
};

export default StatisticsSection;
