"use client";
import { FaChartLine, FaCoins, FaShieldAlt, FaGlobe, FaUserTie, FaFileContract } from 'react-icons/fa';
import { motion } from 'framer-motion';

const ServicesComponent = () => {
  // Animation variants
  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2
      }
    }
  };

  const item = {
    hidden: { opacity: 0, y: 30 },
    show: { opacity: 1, y: 0, transition: { duration: 0.6 } }
  };

  const services = [
    {
      icon: <FaChartLine className="text-[#FD4A36]" size={40} />,
      title: "Wealth Management",
      description: "Comprehensive portfolio management tailored to your financial goals and risk tolerance.",
      features: [
        "Personalized investment strategies",
        "Regular performance reviews",
        "Risk assessment & mitigation",
        "Tax-efficient investing"
      ]
    },
    {
      icon: <FaCoins className="text-[#FD4A36]" size={40} />,
      title: "Cryptocurrency Investments",
      description: "Expert guidance in the dynamic world of digital assets and blockchain technology.",
      features: [
        "Secure crypto portfolio management",
        "ICO/STO analysis",
        "Cold storage solutions",
        "Market trend analysis"
      ]
    },
    {
      icon: <FaShieldAlt className="text-[#FD4A36]" size={40} />,
      title: "Retirement Planning",
      description: "Strategically build your nest egg with our proven retirement solutions.",
      features: [
        "401(k) & IRA management",
        "Annuity strategies",
        "Withdrawal planning",
        "Legacy planning"
      ]
    },
    {
      icon: <FaGlobe className="text-[#FD4A36]" size={40} />,
      title: "Global Market Access",
      description: "Diversify internationally with our exclusive global investment opportunities.",
      features: [
        "Emerging market funds",
        "Foreign exchange strategies",
        "International equity portfolios",
        "Geopolitical risk analysis"
      ]
    },
    {
      icon: <FaUserTie className="text-[#FD4A36]" size={40} />,
      title: "Private Client Services",
      description: "Exclusive solutions for high-net-worth individuals and families.",
      features: [
        "Customized wealth plans",
        "Family office services",
        "Philanthropic strategy",
        "Concierge-level service"
      ]
    },
    {
      icon: <FaFileContract className="text-[#FD4A36]" size={40} />,
      title: "Tax Optimization",
      description: "Legal strategies to minimize tax liabilities and maximize returns.",
      features: [
        "Tax-loss harvesting",
        "Estate tax planning",
        "Charitable giving strategies",
        "Retirement account optimization"
      ]
    }
  ];

  return (
    <section className="py-20 px-4 bg-gray-50">
      <div className="max-w-7xl mx-auto">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Our <span className="text-[#FD4A36]">Investment Services</span>
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Comprehensive financial solutions designed to grow and protect your wealth in any market condition
          </p>
        </motion.div>

        {/* Services Grid */}
        <motion.div
          variants={container}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
        >
          {services.map((service, index) => (
            <motion.div
              key={index}
              variants={item}
              whileHover={{ y: -10 }}
              className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-all duration-300"
            >
              <div className="p-8">
                {/* Service Icon */}
                <div className="mb-6">
                  {service.icon}
                </div>
                
                {/* Service Title & Description */}
                <h3 className="text-2xl font-bold text-gray-900 mb-3">{service.title}</h3>
                <p className="text-gray-600 mb-6">{service.description}</p>
                
                {/* Features List */}
                <ul className="space-y-3">
                  {service.features.map((feature, featureIndex) => (
                    <li key={featureIndex} className="flex items-start">
                      <svg className="h-5 w-5 text-[#FD4A36] mr-2 mt-0.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      <span className="text-gray-700">{feature}</span>
                    </li>
                  ))}
                </ul>
                
                {/* CTA Button */}
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="mt-8 w-full bg-[#FD4A36] text-white font-medium py-3 px-6 rounded-lg hover:bg-[#E53E2B] transition-colors"
                >
                  Learn More
                </motion.button>
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* CTA Section */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ delay: 0.3, duration: 0.6 }}
          viewport={{ once: true }}
          className="mt-20 bg-gradient-to-r from-[#FD4A36] to-[#E53E2B] rounded-xl shadow-xl overflow-hidden"
        >
          <div className="px-8 py-12 md:p-12">
            <div className="md:flex md:items-center md:justify-between">
              <div className="md:w-2/3">
                <h3 className="text-2xl font-bold text-white mb-4">Ready to grow your wealth with confidence?</h3>
                <p className="text-red-100 max-w-2xl">
                  Schedule a free consultation with one of our investment specialists today and take the first step toward achieving your financial goals.
                </p>
              </div>
              <div className="mt-8 md:mt-0">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="w-full md:w-auto bg-white text-[#FD4A36] font-semibold py-3 px-8 rounded-lg hover:bg-gray-100 transition-colors"
                >
                  Get Started
                </motion.button>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default ServicesComponent;