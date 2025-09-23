"use client";
import { motion } from 'framer-motion';
import { Inter } from 'next/font/google';
import { FiCheckCircle, FiArrowRight, FiZap } from 'react-icons/fi';

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

const cardVariants = {
  hover: {
    y: -10,
    transition: {
      type: "spring",
      stiffness: 400,
      damping: 10
    }
  }
};

export default function PricingPlans() {
  const plans = [
    {
      title: "Starter",
      percent: "400%",
      duration: "30 Days Term",
      range: "$300 - $999",
      description:
        "With a lower entry point of $500, the potential returns are substantial — up to $18,500 in 30 days.",
      features: ["Capital returned", "24/7 Support", "5% Referral Bonus"],
      colors: "from-blue-500 to-blue-600",
      accent: "bg-blue-100 text-blue-600",
    },
    {
      title: "Professional",
      percent: "500%",
      duration: "32 Days Term",
      range: "$1,000 - $4,999",
      description:
        "Starting with as little as $1,500, you can potentially earn up to $37,500 in just 45 days.",
      features: [
        "Capital returned",
        "Priority Support",
        "7% Referral Bonus",
        "Weekly Insights",
      ],
      colors: "from-purple-500 to-purple-600",
      accent: "bg-purple-100 text-purple-600",
      popular: true,
    },
    {
      title: "Enterprise",
      percent: "550%",
      duration: "35 Days Term",
      range: "$5,000 - $100,000",
      description:
        "With a minimum of $10,000, your returns could reach as high as $550,000 within 60 days.",
      features: [
        "Capital returned",
        "VIP Support",
        "10% Referral Bonus",
        "Dedicated Manager",
        "Custom Strategies",
      ],
      colors: "from-amber-500 to-amber-600",
      accent: "bg-amber-100 text-amber-600",
    },
  ];
  
  return (
    <section className={`${inter.className} py-24 px-6 bg-gradient-to-b from-gray-50 to-white`}>
      <div className="max-w-7xl mx-auto">
        {/* Title Section */}
        <motion.div 
          className="text-center mb-20"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6 }}
        >
          <motion.div 
            className="inline-flex items-center mb-4"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
          >
            <div className="w-8 h-0.5 bg-gradient-to-r from-blue-500 to-blue-600 mr-3"></div>
            <span className="text-blue-500 font-medium text-sm uppercase tracking-wider">
              Investment Plans
            </span>
          </motion.div>
          
          <motion.h1 
            className="text-4xl sm:text-5xl font-bold text-gray-900 mb-6 leading-tight"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3 }}
          >
            Strategic <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-500 to-blue-600">Wealth Growth</span> Plans
          </motion.h1>
          
          <motion.p 
            className="text-lg text-gray-600 max-w-2xl mx-auto"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.4 }}
          >
            Choose the perfect investment strategy tailored to your financial goals and risk appetite.
          </motion.p>
        </motion.div>

        {/* Cards Section */}
        <motion.div 
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={containerVariants}
        >
          {plans.map((plan, idx) => (
            <motion.div
              key={idx}
              variants={itemVariants}
              whileHover="hover"
              className="relative"
            >
              {/* Popular badge */}
              {plan.popular && (
                <motion.div 
                  className="absolute -top-4 left-1/2 transform -translate-x-1/2 flex items-center px-4 py-1 rounded-full bg-gradient-to-r from-purple-500 to-purple-600 text-white text-xs font-bold shadow-lg z-10"
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.5 }}
                >
                  <FiZap className="mr-2" />
                  Most Popular
                </motion.div>
              )}
              
              <motion.div 
                variants={cardVariants}
                className={`h-full bg-white rounded-xl border border-gray-200 shadow-sm hover:shadow-lg overflow-hidden transition-all ${plan.popular ? 'border-purple-300' : ''}`}
              >
                <div className={`h-2 ${plan.accent}`}></div>
                
                <div className="p-8 text-center">
                  <h2 className="text-2xl font-bold text-gray-900 mb-2">{plan.title}</h2>
                  
                  <div className="my-6">
                    <p className="text-5xl font-extrabold text-gray-900 mb-1">
                      {plan.percent}
                    </p>
                    <p className="text-gray-500 text-sm">{plan.duration}</p>
                  </div>
                  
                  <div className={`${plan.accent} rounded-lg py-2 px-4 inline-block text-xs font-semibold mb-6`}>
                    {plan.range} Investment Range
                  </div>
                  
                  <ul className="space-y-3 mb-8 text-left">
                    {plan.features.map((feature, i) => (
                      <li key={i} className="flex items-center">
                        <FiCheckCircle className={`mr-2 ${plan.accent.split(' ')[1]}`} />
                        <span className="text-gray-600">{feature}</span>
                      </li>
                    ))}
                  </ul>
                  
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className={`w-full py-3 rounded-lg font-medium flex items-center justify-center gap-2 ${plan.popular ? 
                      'bg-gradient-to-r from-purple-500 to-purple-600 text-white' : 
                      'bg-gray-900 text-white'}`}
                  >
                    Get Started <FiArrowRight />
                  </motion.button>
                </div>
              </motion.div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}