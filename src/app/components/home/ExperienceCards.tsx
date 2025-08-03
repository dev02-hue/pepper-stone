"use client";
import { motion } from 'framer-motion';
import { 
  FiGlobe, 
  FiTrendingUp, 
  FiServer, 
  FiShield, 
  FiDollarSign, 
  FiFileText 
} from 'react-icons/fi';

const ExperienceCards = () => {
  const features = [
    {
      icon: <FiGlobe className="text-blue-500" size={24} />,
      title: "Global Reach",
      description: "International client base across multiple continents with localized support.",
      accentColor: "from-blue-400 to-blue-500"
    },
    {
      icon: <FiTrendingUp className="text-amber-500" size={24} />,
      title: "Crypto Solutions",
      description: "Full cryptocurrency support with secure trading and investment tools.",
      accentColor: "from-amber-400 to-amber-500"
    },
    {
      icon: <FiServer className="text-emerald-500" size={24} />,
      title: "Reliable Infrastructure",
      description: "99.9% uptime with enterprise-grade reliability and performance.",
      accentColor: "from-emerald-400 to-emerald-500"
    },
    {
      icon: <FiFileText className="text-purple-500" size={24} />,
      title: "Certified Compliance",
      description: "Fully licensed and regulated in all operational jurisdictions.",
      accentColor: "from-purple-400 to-purple-500"
    },
    {
      icon: <FiShield className="text-red-500" size={24} />,
      title: "Bank-Grade Security",
      description: "Military-grade encryption and multi-factor authentication.",
      accentColor: "from-red-400 to-red-500"
    },
    {
      icon: <FiDollarSign className="text-cyan-500" size={24} />,
      title: "Profit Focused",
      description: "Data-driven investment strategies to maximize your returns.",
      accentColor: "from-cyan-400 to-cyan-500"
    }
  ];

  const container = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.3
      }
    }
  };

  const item = {
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

  return (
    <section className="py-20 px-4 bg-gradient-to-b from-gray-50 to-white">
      <div className="max-w-7xl mx-auto">
        <motion.div 
          className="text-center mb-16"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6 }}
        >
          <div className="inline-flex items-center mb-4">
            <motion.div 
              className="w-8 h-0.5 bg-gradient-to-r from-transparent to-blue-500 mr-3"
              initial={{ scaleX: 0 }}
              whileInView={{ scaleX: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.2 }}
            />
            <span className="text-blue-500 font-medium text-sm uppercase tracking-wider">
              Why Choose Us
            </span>
          </div>
          <h2 className="text-4xl font-bold text-gray-900 mb-4 leading-tight">
            Our <span className="bg-gradient-to-r from-blue-500 to-blue-600 text-transparent bg-clip-text">Competitive</span> Advantages
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Trusted by thousands of clients worldwide for our exceptional service and results.
          </p>
        </motion.div>

        <motion.div 
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
          variants={container}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
        >
          {features.map((feature, index) => (
            <motion.div 
              key={index}
              variants={item}
              whileHover={{ y: -5 }}
              className="group relative"
            >
              <div className="absolute inset-0 bg-gradient-to-br rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                style={{
                  backgroundImage: `linear-gradient(to bottom right, ${feature.accentColor})`
                }}
              />
              
              <div className="relative h-full bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden group-hover:shadow-lg transition-all duration-300">
                <div className="p-8">
                  <div className={`w-14 h-14 mb-6 rounded-lg bg-gradient-to-br ${feature.accentColor} flex items-center justify-center text-white`}>
                    {feature.icon}
                  </div>
                  
                  <h3 className="text-xl font-semibold text-gray-900 mb-3">{feature.title}</h3>
                  <p className="text-gray-600 mb-6">{feature.description}</p>
                  
                  <div className="flex items-center text-sm font-medium text-blue-500 group-hover:text-blue-600 transition-colors">
                    Learn more
                    <svg 
                      className="ml-2 w-4 h-4 transition-transform group-hover:translate-x-1" 
                      fill="none" 
                      stroke="currentColor" 
                      viewBox="0 0 24 24" 
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                    </svg>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

export default ExperienceCards;