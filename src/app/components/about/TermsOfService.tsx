"use client";
import { FaFileContract, FaBalanceScale, FaGavel, FaExclamationTriangle } from 'react-icons/fa';
import { motion } from 'framer-motion';

const TermsOfService = () => {
  return (
    <div className="bg-white">
      <section className="bg-gradient-to-r from-[#FD4A36] to-[#E53E2B] text-white py-20 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <FaFileContract className="mx-auto mb-6" size={48} />
            <h1 className="text-4xl font-bold mb-4">Terms of Service</h1>
            <p className="text-xl opacity-90">
              Last updated: {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
            </p>
          </motion.div>
        </div>
      </section>

      {/* Main Content */}
      <div className="max-w-4xl mx-auto py-16 px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.6 }}
          className="prose-lg text-gray-700"
        >
          <div className="mb-16">
            <div className="flex items-start mb-8">
              <div className="p-3 bg-red-100 rounded-lg mr-4 mt-1">
                <FaBalanceScale className="text-[#FD4A36]" size={24} />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-gray-900 mb-4">1. Agreement to Terms</h2>
                <p>
                  By accessing or using the services provided by InvestPro (&quot;Company&quot;, &quot;we&quot;, &quot;us&quot;, or &quot;our&quot;), 
                  you agree to be bound by these Terms of Service. If you do not agree to all the terms and 
                  conditions, you may not access or use our services.
                </p>
              </div>
            </div>

            <div className="p-6 bg-gray-50 rounded-lg border-l-4 border-[#FD4A36] mb-8">
              <h3 className="font-semibold text-gray-900 mb-2">Important Notice</h3>
              <p>
                These terms contain important information about your legal rights, remedies, and obligations. 
                Please read them carefully before using our services.
              </p>
            </div>
          </div>

          <div className="space-y-16">
            <motion.section
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="scroll-mt-24"
              id="services"
            >
              <div className="flex items-start mb-6">
                <div className="p-3 bg-blue-100 rounded-lg mr-4 mt-1">
                  <FaFileContract className="text-blue-600" size={24} />
                </div>
                <h2 className="text-2xl font-bold text-gray-900">2. Investment Services</h2>
              </div>
              <div className="pl-16">
                <p className="mb-6">
                  We provide various investment services including but not limited to portfolio management, 
                  cryptocurrency investments, retirement planning, and wealth management advisory.
                </p>
                
                <h3 className="text-xl font-semibold text-gray-900 mb-3">2.1 Service Limitations</h3>
                <ul className="list-disc pl-6 mb-6 space-y-2">
                  <li>Services are available only to qualified investors in permitted jurisdictions</li>
                  <li>Minimum investment amounts may apply to certain products</li>
                  <li>We reserve the right to refuse service at our discretion</li>
                </ul>
              </div>
            </motion.section>

            <motion.section
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="scroll-mt-24"
              id="obligations"
            >
              <div className="flex items-start mb-6">
                <div className="p-3 bg-purple-100 rounded-lg mr-4 mt-1">
                  <FaGavel className="text-purple-600" size={24} />
                </div>
                <h2 className="text-2xl font-bold text-gray-900">3. Client Obligations</h2>
              </div>
              <div className="pl-16">
                <p className="mb-6">
                  As a client, you agree to provide accurate and complete information, maintain the 
                  confidentiality of your account credentials, and comply with all applicable laws.
                </p>
                
                <h3 className="text-xl font-semibold text-gray-900 mb-3">3.1 Prohibited Activities</h3>
                <ul className="list-disc pl-6 mb-6 space-y-2">
                  <li>Unauthorized access or use of our systems</li>
                  <li>Market manipulation or abusive trading practices</li>
                  <li>Providing false or misleading information</li>
                  <li>Violation of any applicable laws or regulations</li>
                </ul>
              </div>
            </motion.section>

            <motion.section
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="scroll-mt-24"
              id="risk"
            >
              <div className="flex items-start mb-6">
                <div className="p-3 bg-amber-100 rounded-lg mr-4 mt-1">
                  <FaExclamationTriangle className="text-amber-600" size={24} />
                </div>
                <h2 className="text-2xl font-bold text-gray-900">4. Risk Disclosure</h2>
              </div>
              <div className="pl-16">
                <div className="p-6 bg-red-50 rounded-lg mb-6 border border-red-100">
                  <h3 className="font-semibold text-red-800 mb-2">Important Risk Notice</h3>
                  <p className="text-red-700">
                    All investments involve risk, including the possible loss of principal. The value of 
                    investments may fluctuate, and investors may not recover the full amount invested.
                  </p>
                </div>
                
                <h3 className="text-xl font-semibold text-gray-900 mb-3">4.1 Specific Risks</h3>
                <ul className="list-disc pl-6 mb-6 space-y-2">
                  <li>Market volatility and economic conditions</li>
                  <li>Cryptocurrency price fluctuations</li>
                  <li>Regulatory changes affecting investments</li>
                  <li>Liquidity risks for certain products</li>
                </ul>
              </div>
            </motion.section>

            <motion.section
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="scroll-mt-24"
              id="termination"
            >
              <div className="flex items-start mb-6">
                <div className="p-3 bg-gray-100 rounded-lg mr-4 mt-1">
                  <FaFileContract className="text-gray-600" size={24} />
                </div>
                <h2 className="text-2xl font-bold text-gray-900">5. Termination</h2>
              </div>
              <div className="pl-16">
                <p className="mb-6">
                  We reserve the right to terminate or suspend access to our services immediately, 
                  without prior notice or liability, for any violation of these terms or for any 
                  other reason at our sole discretion.
                </p>
              </div>
            </motion.section>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default TermsOfService;