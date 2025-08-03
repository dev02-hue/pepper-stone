'use client';
import { motion, useAnimation, useInView } from 'framer-motion';
import { useEffect, useRef } from 'react';
import Image from 'next/image';

interface StatCardProps {
  label: string;
  value: number;
  suffix?: string;
  duration?: number;
  icon: string;
  color: string;
}

const StatCard = ({ label, value , duration = 1.5 , color }: StatCardProps) => {
  const controls = useAnimation();
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "0px 0px -100px 0px" });

  useEffect(() => {
    if (isInView) {
      controls.start({
        opacity: 1,
        y: 0,
        transition: { duration: 0.6, type: 'spring' }
      });
    }
  }, [isInView, controls]);

  const formatNumber = (num: number) => {
    if (num >= 1000000000) {
      return `$${(num / 1000000000).toFixed(1)}B`;
    }
    if (num >= 1000000) {
      return `$${(num / 1000000).toFixed(1)}M`;
    }
    return `$${num.toLocaleString()}`;
  };

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 50 }}
      animate={controls}
      className={`relative overflow-hidden p-8 rounded-2xl backdrop-blur-sm bg-white/80 border border-gray-200 shadow-lg hover:shadow-xl transition-all ${color}`}
      whileHover={{ y: -5 }}
    >
      <div className="absolute -right-6 -bottom-6 opacity-10">
        <div className="w-24 h-24 relative">
          <Image 
            src="/premium_photo-1661761077411-d50cba031848.avif"
            alt=""
            width={96}
            height={96}
          />
        </div>
      </div>
      
      <div className="relative z-10">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 relative">
            <Image 
              src="/premium_photo-1661761077411-d50cba031848.avif"
              alt=""
              width={40}
              height={40}
            />
          </div>
          <motion.p 
            className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-gray-900 to-gray-700"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: duration * 0.8 }}
          >
            {formatNumber(value)}
          </motion.p>
        </div>
        <motion.p 
          className="text-lg font-medium text-gray-600"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: duration * 0.9 }}
        >
          {label}
        </motion.p>
      </div>
    </motion.div>
  );
};

const StatisticsSection = () => {
  return (
    <section className="w-full py-20 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      {/* Background pattern */}
      <div className="absolute inset-0 opacity-5">
        <Image
          src="/premium_photo-1661761077411-d50cba031848.avif"
          alt=""
          fill
          className="object-cover"
        />
      </div>
      
      <div className="max-w-7xl mx-auto relative">
        {/* Section header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true, margin: "0px 0px -100px 0px" }}
          className="text-center mb-16"
        >
          <motion.span 
            className="inline-block px-4 py-1 rounded-full bg-blue-100 text-blue-600 text-sm font-medium mb-4"
            initial={{ scale: 0.9 }}
            whileInView={{ scale: 1 }}
            transition={{ delay: 0.2 }}
          >
            By The Numbers
          </motion.span>
          <motion.h2
            className="text-3xl md:text-4xl font-bold text-gray-900 mb-4"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
          >
            Our Global Impact
          </motion.h2>
          <motion.p
            className="text-lg text-gray-600 max-w-2xl mx-auto"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
          >
            Trusted by investors worldwide to grow and protect their wealth
          </motion.p>
        </motion.div>

        {/* Stats grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          <StatCard 
            label="Assets Under Management" 
            value={5200000000} 
            icon="/icons/wallet.svg"
            color="bg-gradient-to-br from-blue-50 to-blue-100"
          />
          <StatCard 
            label="Annual Returns" 
            value={15.8} 
            suffix="%"
            icon="/icons/graph-up.svg"
            color="bg-gradient-to-br from-green-50 to-green-100"
          />
          <StatCard 
            label="Global Investors" 
            value={125000} 
            icon="/icons/users.svg"
            color="bg-gradient-to-br from-purple-50 to-purple-100"
          />
        </div>

        {/* Trust indicators */}
        <motion.div
          className="flex flex-wrap justify-center gap-6 mt-16"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
        >
          {[
            { name: "Forbes", logo: "/logos/forbes.svg" },
            { name: "Bloomberg", logo: "/logos/bloomberg.svg" },
            { name: "Financial Times", logo: "/logos/financial-times.svg" },
          ].map((company) => (
            <div key={company.name} className="bg-white p-4 rounded-lg shadow-sm border border-gray-200 opacity-80 hover:opacity-100 transition-opacity">
              <div className="w-32 h-10 relative">
                <Image
                  src="/premium_photo-1661761077411-d50cba031848.avif"
                  alt={company.name}
                  fill
                  className="object-contain"
                />
              </div>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

export default StatisticsSection;