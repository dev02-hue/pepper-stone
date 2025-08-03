"use client";
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiChevronDown, FiMail, FiMessageSquare } from 'react-icons/fi';

const FAQComponent = () => {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);

  const faqs = [
    {
      question: "What investment solutions does Ttrade Capital provide?",
      answer: "Ttrade Capital offers diversified investment services including algorithmic trading portfolios, crypto asset management, AI-driven wealth building, and institutional-grade market analysis tools. Our platform caters to both active traders and long-term investors.",
      category: "General"
    },
    {
      question: "How do I start trading on Ttrade Capital?",
      answer: "Simply visit our web platform, complete your registration then login, fund your account via multiple payment methods, and you'll gain instant access to our trading dashboard and investment tools.",
      category: "Getting Started"
    },
    {
      question: "What's the minimum deposit to use Ttrade Capital?",
      answer: "Ttrade Capital has tiered access: $300 for Basic tier, $1000 for Pro traders (with advanced charting tools), and $5,000 for Institutional accounts service.",
      category: "Account"
    },
    {
      question: "How secure is my personal and financial information?",
      answer: "We employ bank-grade 256-bit encryption, multi-factor authentication, and regular security audits. Your data is stored in secure, access-controlled environments and we never share your information without your explicit consent.",
      category: "Security"
    },
    {
      question: "What fees can I expect when investing with your firm?",
      answer: "Our fee structure is transparent and competitive. We typically charge an annual management fee ranging from 0.5% to 1.5% of assets under management, depending on the service tier. Some products may have additional performance-based fees.",
      category: "Pricing"
    },
    {
      question: "Can I access my investment portfolio online?",
      answer: "Yes, our secure client portal provides 24/7 access to your portfolio with real-time performance tracking, detailed reports, and document storage. The portal is accessible via web browser and our mobile app.",
      category: "Account"
    },
    {
      question: "What trading tools are available on your platform?",
      answer: "Ttrade Capital provides real-time market scanners, institutional-grade charting with 50+ indicators, backtesting suites, and a social trading hub where users can mirror top-performing investors.",
      category: "Features"
    },
    {
      question: "What makes your investment approach unique?",
      answer: "We combine data-driven quantitative analysis with fundamental research, enhanced by proprietary algorithms. Our focus on tax-efficient strategies and risk-managed portfolios has consistently delivered above-market returns for our clients.",
      category: "Strategy"
    }
  ];

  const categories = [...new Set(faqs.map(faq => faq.category))];
  const [activeCategory, setActiveCategory] = useState<string>('All');

  const toggleFAQ = (index: number) => {
    setActiveIndex(activeIndex === index ? null : index);
  };

  const filteredFaqs = activeCategory === 'All' 
    ? faqs 
    : faqs.filter(faq => faq.category === activeCategory);

  return (
    <section className="py-24 px-4 bg-gradient-to-b from-gray-50 to-white">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <motion.div 
          className="text-center mb-16"
          initial={{ opacity: 0, y: -20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <motion.div 
            className="inline-flex items-center mb-4"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            <div className="w-8 h-0.5 bg-gradient-to-r from-blue-500 to-blue-600 mr-3"></div>
            <span className="text-blue-500 font-medium text-sm uppercase tracking-wider">
              Knowledge Base
            </span>
          </motion.div>
          
          <motion.h2
            className="text-4xl md:text-5xl font-bold text-gray-900 mb-6 leading-tight"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            Answers to <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-500 to-blue-600">Common Questions</span>
          </motion.h2>
          
          <motion.p
            className="text-lg text-gray-600 max-w-2xl mx-auto"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
          >
            Everything you need to know about our investment platform and services.
          </motion.p>
        </motion.div>

        {/* Category Filter */}
        <motion.div
          className="flex flex-wrap justify-center gap-2 mb-12"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
        >
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setActiveCategory('All')}
            className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
              activeCategory === 'All' 
                ? 'bg-blue-500 text-white shadow-md' 
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            All Questions
          </motion.button>
          
          {categories.map((category) => (
            <motion.button
              key={category}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setActiveCategory(category)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                activeCategory === category 
                  ? 'bg-blue-500 text-white shadow-md' 
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {category}
            </motion.button>
          ))}
        </motion.div>

        {/* FAQ Items */}
        <motion.div
          className="space-y-4"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
        >
          {filteredFaqs.map((faq, index) => (
            <motion.div 
              key={index}
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: index * 0.05 }}
              viewport={{ once: true, margin: "-50px" }}
              className="group"
            >
              <button
                onClick={() => toggleFAQ(index)}
                className="w-full flex justify-between items-center p-6 text-left focus:outline-none rounded-xl bg-white border border-gray-200 hover:border-gray-300 shadow-sm hover:shadow-md transition-all"
              >
                <div className="text-left">
                  <div className="text-xs font-medium text-blue-500 mb-1">
                    {faq.category}
                  </div>
                  <h3 className="text-lg md:text-xl font-semibold text-gray-900 group-hover:text-blue-600 transition-colors">
                    {faq.question}
                  </h3>
                </div>
                <motion.div
                  animate={{ rotate: activeIndex === index ? 180 : 0 }}
                  className="ml-4 flex-shrink-0 text-gray-400 group-hover:text-blue-500 transition-colors"
                >
                  <FiChevronDown size={24} />
                </motion.div>
              </button>

              <AnimatePresence>
                {activeIndex === index && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ 
                      height: 'auto',
                      opacity: 1,
                      transition: {
                        height: { duration: 0.3 },
                        opacity: { duration: 0.2, delay: 0.1 }
                      }
                    }}
                    exit={{ 
                      height: 0,
                      opacity: 0,
                      transition: {
                        height: { duration: 0.2 },
                        opacity: { duration: 0.1 }
                      }
                    }}
                    className="overflow-hidden"
                  >
                    <div className="px-6 pb-6 pt-2 text-gray-600 bg-gray-50 rounded-b-xl border-t border-gray-100">
                      {faq.answer}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          ))}
        </motion.div>

        {/* CTA */}
        <motion.div
          className="mt-20 text-center"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
        >
          <motion.div 
            className="inline-block bg-white p-1 rounded-full shadow-lg mb-8"
            whileHover={{ scale: 1.05 }}
          >
            {/* <div className="bg-gradient-to-r from-blue-500 to-blue-600 rounded-full px-6 py-3 text-white font-medium">
              Can't find your answer?
            </div> */}
          </motion.div>
{/*           
          <h3 className="text-2xl font-bold text-gray-900 mb-6">
            We're here to help
          </h3> */}
          
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <motion.button
              whileHover={{ y: -2, boxShadow: "0 4px 12px rgba(0,0,0,0.1)" }}
              whileTap={{ scale: 0.98 }}
              className="flex items-center justify-center gap-2 bg-white border border-gray-200 text-gray-700 font-medium py-3 px-6 rounded-lg hover:bg-gray-50 transition-all"
            >
              <FiMessageSquare /> Live Chat
            </motion.button>
            
            <motion.button
              whileHover={{ y: -2, boxShadow: "0 4px 12px rgba(0,0,0,0.1)" }}
              whileTap={{ scale: 0.98 }}
              className="flex items-center justify-center gap-2 bg-gradient-to-r from-blue-500 to-blue-600 text-white font-medium py-3 px-6 rounded-lg hover:from-blue-600 hover:to-blue-700 transition-all"
            >
              <FiMail /> Email Support
            </motion.button>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default FAQComponent;