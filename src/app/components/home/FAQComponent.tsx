"use client";
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const FAQComponent = () => {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);

  const faqs = [
    {
      question: "What investment solutions does Ttrade Capital provide?",
  answer: "Ttrade Capital offers diversified investment services including algorithmic trading portfolios, crypto asset management, AI-driven wealth building, and institutional-grade market analysis tools. Our platform caters to both active traders and long-term investors."
},
  {
      question: "How do I start trading on Ttrade Capital?",
  answer: "Simply  visit our web platform, complete your registration then login, fund your account via multiple payment methods, and you'll gain instant access to our trading dashboard and investment tools."
    },
    {
      question: "What's the minimum deposit to use Ttrade Capital?",
  answer: "Ttrade Capital has tiered access: $300 for Basic tier, $1000 for Pro traders (with advanced charting tools), and $5,000 for Institutional accounts service."
    },
    {
      question: "How secure is my personal and financial information?",
      answer: "We employ bank-grade 256-bit encryption, multi-factor authentication, and regular security audits. Your data is stored in secure, access-controlled environments and we never share your information without your explicit consent."
    },
    {
      question: "What fees can I expect when investing with your firm?",
      answer: "Our fee structure is transparent and competitive. We typically charge an annual management fee ranging from 0.5% to 1.5% of assets under management, depending on the service tier. Some products may have additional performance-based fees."
    },
    {
      question: "Can I access my investment portfolio online?",
      answer: "Yes, our secure client portal provides 24/7 access to your portfolio with real-time performance tracking, detailed reports, and document storage. The portal is accessible via web browser and our mobile app."
    },
    {
       question: "What trading tools are available on your platform?",
  answer: "Ttrade Capital provides real-time market scanners, institutional-grade charting with 50+ indicators, backtesting suites, and a social trading hub where users can mirror top-performing investors."
    },
    {
      question: "What makes your investment approach unique?",
      answer: "We combine data-driven quantitative analysis with fundamental research, enhanced by proprietary algorithms. Our focus on tax-efficient strategies and risk-managed portfolios has consistently delivered above-market returns for our clients."
    }
  ];

  const toggleFAQ = (index: number) => {
    setActiveIndex(activeIndex === index ? null : index);
  };
  

  return (
    <section className="py-20 px-4 bg-white">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-16">
          <motion.h2 
            initial={{ opacity: 0, y: -20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-3xl md:text-4xl font-bold text-gray-900 mb-4"
          >
            Frequently Asked <span className="text-[#FD4A36]">Questions</span>
          </motion.h2>
          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ delay: 0.3, duration: 0.6 }}
            className="text-xl text-gray-600"
          >
            Find answers to common questions about our investment services
          </motion.p>
        </div>

        {/* FAQ Items */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.6 }}
          className="space-y-4"
        >
          {faqs.map((faq, index) => (
            <div 
              key={index}
              className="border border-gray-200 rounded-xl overflow-hidden"
            >
              <button
                onClick={() => toggleFAQ(index)}
                className="w-full flex justify-between items-center p-6 text-left focus:outline-none"
              >
                <h3 className="text-lg md:text-xl font-semibold text-gray-900">
                  {faq.question}
                </h3>
                <motion.div
                  animate={{ rotate: activeIndex === index ? 45 : 0 }}
                  transition={{ duration: 0.3 }}
                  className="ml-4 flex-shrink-0"
                >
                  <div className="w-8 h-8 rounded-full bg-[#FD4A36] flex items-center justify-center">
                    <svg 
                      className="w-4 h-4 text-white" 
                      viewBox="0 0 24 24" 
                      fill="none" 
                      stroke="currentColor"
                    >
                      <path 
                        strokeLinecap="round" 
                        strokeLinejoin="round" 
                        strokeWidth={3} 
                        d={activeIndex === index ? "M6 18L18 6M6 6l12 12" : "M12 6v12M6 12h12"}
                      />
                    </svg>
                  </div>
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
                    <div className="px-6 pb-6 pt-2 text-gray-600">
                      {faq.answer}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ))}
        </motion.div>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.6 }}
          className="mt-16 text-center"
        >
          <p className="text-lg text-gray-600 mb-6">
            Still have questions? Our team is ready to help.
          </p>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="bg-[#FD4A36] text-white font-medium py-3 px-8 rounded-lg hover:bg-[#E53E2B] transition-colors"
          >
            Contact Support
          </motion.button>
        </motion.div>
      </div>
    </section>
  );
};

export default FAQComponent;