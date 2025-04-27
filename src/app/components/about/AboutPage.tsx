"use client";
import { FaGlobe, FaBitcoin, FaCogs, FaFileAlt, FaLock, FaWallet, FaBuilding, FaChartLine, FaUsers, FaAward, FaShieldAlt, FaHandshake } from 'react-icons/fa';

import { motion } from 'framer-motion';
import Head from 'next/head';
import Image from 'next/image';

import { Inter } from 'next/font/google';

const inter = Inter({
    subsets: ['latin'],
    weight: ['400', '600', '700'], // Regular, Semi-bold, Bold
    display: 'swap',
  });

const AboutPage = () => {
  // Animation variants
  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 }
  };

  const features = [
    {
      icon: <FaGlobe className="text-blue-500" size={24} />,
      title: "Global Reach",
      description: "International client base across multiple continents with localized support."
    },
    {
      icon: <FaBitcoin className="text-amber-500" size={24} />,
      title: "Crypto Solutions",
      description: "Full cryptocurrency support with secure trading and investment tools."
    },
    {
      icon: <FaCogs className="text-emerald-500" size={24} />,
      title: "Reliable Infrastructure",
      description: "99.9% uptime with enterprise-grade reliability and performance."
    },
    {
      icon: <FaFileAlt className="text-purple-500" size={24} />,
      title: "Certified Compliance",
      description: "Fully licensed and regulated in all operational jurisdictions."
    },
    {
      icon: <FaLock className="text-red-500" size={24} />,
      title: "Bank-Grade Security",
      description: "Military-grade encryption and multi-factor authentication."
    },
    {
      icon: <FaWallet className="text-cyan-500" size={24} />,
      title: "Profit Focused",
      description: "Data-driven investment strategies to maximize your returns."
    }
  ];

  const plans = [
    {
      title: "Bronze Plan",
      percent: "400%",
      duration: "For 24 Hours / 1 Returns",
      range: "Min. $300 Max: $999",
      colors: "from-pink-300 to-yellow-300",
    },
    {
      title: "Silver Plan",
      percent: "500%",
      duration: "For 24 Hours / 1 Returns",
      range: "Min. $1000 Max: $4999",
      colors: "from-indigo-400 to-green-300",
    },
    {
      title: "Gold Plan",
      percent: "550%",
      duration: "For 48 Hours / 1 Returns",
      range: "Min. $5000 Max: $100000",
      colors: "from-yellow-400 to-pink-500",
    }
  ];

  return (
    <>
      <Head>
        <title>About Us | Trading Platform</title>
        <meta name="description" content="Learn about our certified investment services, global reach, and commitment to secure, profitable investments" />
      </Head>

      <div className={`${inter.className} bg-white`}>
        {/* Hero Section */}
        <motion.section 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8 }}
          className="relative bg-gradient-to-r from-blue-900 to-indigo-800 text-black py-20 px-4"
        >
          <div className="max-w-7xl mx-auto">
            <div className="flex flex-col lg:flex-row items-center gap-12">
              <div className="lg:w-1/2">
                <motion.h1 
                  initial={{ y: -20 }}
                  animate={{ y: 0 }}
                  transition={{ duration: 0.5 }}
                  className="text-4xl md:text-5xl font-bold mb-6"
                >
                  Trusted Investment Solutions Since 2015
                </motion.h1>
                <motion.p 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.3, duration: 0.8 }}
                  className="text-xl mb-8"
                >
                  Certified financial experts delivering secure, high-yield investment opportunities to clients worldwide.
                </motion.p>
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="inline-block"
                >
                  
                </motion.div>
              </div>
              <div className="lg:w-1/2 mt-10 lg:mt-0">
                {/* Company Image - Replace with your actual image */}
                <motion.div
                  initial={{ x: 50, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ delay: 0.4, duration: 0.8 }}
                  className="relative rounded-xl overflow-hidden shadow-2xl"
                >
                  <Image 
                    src="/maincertificate.jpg" 
                    width={400}
                    height={400}
                    alt="Our Melbourne headquarters at Level 4, 114 William Street"
                    className="w-full h-auto"
                  />
                  <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-6">
                    <div className="flex items-center">
                      <FaBuilding className="text-white mr-2" size={20} />
                      <span className="text-white font-medium">Level 4, 114 William Street, Melbourne VIC 3000, Australia</span>
                    </div>
                  </div>
                </motion.div>
              </div>
            </div>
          </div>
        </motion.section>

        {/* Company Story */}
        <section className="py-20 px-4">
          <div className="max-w-7xl mx-auto">
            <motion.div 
              variants={container}
              initial="hidden"
              whileInView="show"
              viewport={{ once: true }}
              className="grid md:grid-cols-2 gap-12 items-center"
            >
              <motion.div variants={item}>
                <h2 className="text-3xl font-bold text-gray-900 mb-6">Our Story</h2>
                <p className="text-lg text-gray-600 mb-6">
                  Founded in 1989, we began as a small investment firm with a vision to democratize access to high-yield investment opportunities. Today, we serve thousands of clients across 30+ countries with our secure, regulated investment platforms.
                </p>
                <p className="text-lg text-gray-600 mb-6">
                  Our team of certified financial experts combines decades of market experience with cutting-edge technology to deliver consistent returns while maintaining the highest security standards.
                </p>
                <div className="flex flex-wrap gap-4">
                  <div className="flex items-center bg-blue-50 px-4 py-2 rounded-full">
                    <FaUsers className="text-blue-600 mr-2" />
                    <span className="font-medium">10,000+ Clients</span>
                  </div>
                  <div className="flex items-center bg-emerald-50 px-4 py-2 rounded-full">
                    <FaChartLine className="text-emerald-600 mr-2" />
                    <span className="font-medium">$500M+ Managed</span>
                  </div>
                  <div className="flex items-center bg-purple-50 px-4 py-2 rounded-full">
                    <FaAward className="text-purple-600 mr-2" />
                    <span className="font-medium">5 Industry Awards</span>
                  </div>
                </div>
              </motion.div>
              
              {/* Certificate Display - Replace with your actual certificate image */}
              <motion.div 
                variants={item}
                className="relative"
              >
                <div className="bg-gray-100 p-2 rounded-xl shadow-lg">
                  <Image 
                    src="/maincertificate.jpg" 
                    alt="Investment Certification License" 
                    width={400}
                    height={400}
                    className="w-full h-auto rounded-lg border border-gray-200"
                  />
                </div>
                <div className="absolute -bottom-4 -right-4 bg-white px-4 py-2 rounded-lg shadow-md border border-gray-200 flex items-center">
                  <FaShieldAlt className="text-green-500 mr-2" />
                  <span className="font-medium">Certified & Regulated</span>
                </div>
              </motion.div>
            </motion.div>
          </div>
        </section>

        {/* Key Features */}
        <section className="py-20 px-4 bg-gray-50">
          <div className="max-w-7xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
              className="text-center mb-16"
            >
              <h2 className="text-3xl font-bold text-gray-900 mb-4">Why Choose Us</h2>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                We combine financial expertise with cutting-edge technology to deliver exceptional results
              </p>
            </motion.div>

            <motion.div
              variants={container}
              initial="hidden"
              whileInView="show"
              viewport={{ once: true }}
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
            >
              {features.map((feature, index) => (
                <motion.div
                  key={index}
                  variants={item}
                  whileHover={{ y: -10 }}
                  className="bg-white rounded-xl shadow-sm p-8 hover:shadow-md transition-all"
                >
                  <div className="w-14 h-14 bg-blue-50 rounded-xl flex items-center justify-center mb-6">
                    {feature.icon}
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-3">{feature.title}</h3>
                  <p className="text-gray-600">{feature.description}</p>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </section>

        {/* Investment Plans */}
        <section className="py-20 px-4">
          <div className="max-w-7xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
              className="text-center mb-16"
            >
              <h2 className="text-3xl font-bold text-gray-900 mb-4">Investment Plans</h2>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                Flexible options tailored to meet your financial goals
              </p>
            </motion.div>

            <motion.div
              variants={container}
              initial="hidden"
              whileInView="show"
              viewport={{ once: true }}
              className="grid grid-cols-1 md:grid-cols-3 gap-8"
            >
              {plans.map((plan, index) => (
                <motion.div
                  key={index}
                  variants={item}
                  whileHover={{ scale: 1.03 }}
                  className={`bg-gradient-to-br ${plan.colors} rounded-xl shadow-lg overflow-hidden`}
                >
                  <div className="p-8 text-white">
                    <h3 className="text-2xl font-bold mb-4">{plan.title}</h3>
                    <div className="text-4xl font-bold mb-2">{plan.percent}</div>
                    <div className="mb-6">{plan.duration}</div>
                    <div className="mb-8">{plan.range}</div>
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className="w-full bg-white text-gray-900 font-semibold py-3 rounded-lg"
                    >
                      Get Started
                    </motion.button>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-20 px-4 bg-gradient-to-r from-blue-900 to-indigo-800 text-white">
          <div className="max-w-4xl mx-auto text-center">
            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
            >
              <FaHandshake className="mx-auto mb-6" size={48} />
              <h2 className="text-3xl font-bold mb-6">Ready to Grow Your Wealth?</h2>
              <p className="text-xl mb-8 max-w-2xl mx-auto">
                Join thousands of satisfied investors who trust us with their financial growth.
              </p>
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="inline-block"
              >
                <button className="bg-white text-blue-900 font-semibold px-8 py-4 rounded-lg hover:bg-gray-100 transition-colors text-lg">
                  Start Investing Today
                </button>
              </motion.div>
            </motion.div>
          </div>
        </section>
      </div>
    </>
  );
};

export default AboutPage;