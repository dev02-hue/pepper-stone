"use client";
import { FaLock, FaUserShield, FaDatabase, FaShieldAlt } from 'react-icons/fa';
import { motion } from 'framer-motion';

const PrivacyPolicy = () => {
  return (
    <div className="bg-white">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-blue-800 to-blue-600 text-white py-20 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <FaLock className="mx-auto mb-6" size={48} />
            <h1 className="text-4xl font-bold mb-4">Privacy Policy</h1>
            <p className="text-xl opacity-90">
              Effective date: {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
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
              <div className="p-3 bg-blue-100 rounded-lg mr-4 mt-1">
                <FaUserShield className="text-blue-600" size={24} />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-gray-900 mb-4">1. Introduction</h2>
                <p>
                  InvestPro (&quot;we&quot;, &quot;us&quot;, or &quot;our&quot;) is committed to protecting your privacy. This Privacy Policy 
                  explains how we collect, use, disclose, and safeguard your information when you use our services.
                </p>
              </div>
            </div>

            <div className="p-6 bg-blue-50 rounded-lg border-l-4 border-blue-500 mb-8">
              <h3 className="font-semibold text-gray-900 mb-2">Your Privacy Matters</h3>
              <p>
                We adhere to strict data protection standards in compliance with applicable privacy laws 
                and regulations.
              </p>
            </div>
          </div>

          <div className="space-y-16">
            <motion.section
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="scroll-mt-24"
              id="collection"
            >
              <div className="flex items-start mb-6">
                <div className="p-3 bg-purple-100 rounded-lg mr-4 mt-1">
                  <FaDatabase className="text-purple-600" size={24} />
                </div>
                <h2 className="text-2xl font-bold text-gray-900">2. Information We Collect</h2>
              </div>
              <div className="pl-16">
                <p className="mb-6">
                  We collect personal information necessary to provide our services, including:
                </p>
                
                <h3 className="text-xl font-semibold text-gray-900 mb-3">2.1 Personal Information</h3>
                <ul className="list-disc pl-6 mb-6 space-y-2">
                  <li>Contact details (name, email, phone number, address)</li>
                  <li>Identification documents for compliance purposes</li>
                  <li>Financial information (income, net worth, investment objectives)</li>
                </ul>
                
                <h3 className="text-xl font-semibold text-gray-900 mb-3">2.2 Technical Data</h3>
                <ul className="list-disc pl-6 space-y-2">
                  <li>IP address and device information</li>
                  <li>Browser type and version</li>
                  <li>Usage data and analytics</li>
                </ul>
              </div>
            </motion.section>

            <motion.section
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="scroll-mt-24"
              id="use"
            >
              <div className="flex items-start mb-6">
                <div className="p-3 bg-green-100 rounded-lg mr-4 mt-1">
                  <FaShieldAlt className="text-green-600" size={24} />
                </div>
                <h2 className="text-2xl font-bold text-gray-900">3. How We Use Information</h2>
              </div>
              <div className="pl-16">
                <p className="mb-6">
                  We use the collected information for the following purposes:
                </p>
                
                <ul className="list-disc pl-6 mb-6 space-y-2">
                  <li>To provide and maintain our services</li>
                  <li>To comply with legal and regulatory requirements</li>
                  <li>To verify your identity and prevent fraud</li>
                  <li>To communicate with you about your account</li>
                  <li>To improve our products and services</li>
                </ul>
                
                <div className="p-6 bg-green-50 rounded-lg mb-6 border border-green-100">
                  <h3 className="font-semibold text-green-800 mb-2">Legal Basis for Processing</h3>
                  <p className="text-green-700">
                    We process your personal data based on contractual necessity, legal obligations, 
                    legitimate business interests, and with your consent where required.
                  </p>
                </div>
              </div>
            </motion.section>

            <motion.section
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="scroll-mt-24"
              id="protection"
            >
              <div className="flex items-start mb-6">
                <div className="p-3 bg-red-100 rounded-lg mr-4 mt-1">
                  <FaLock className="text-red-600" size={24} />
                </div>
                <h2 className="text-2xl font-bold text-gray-900">4. Data Protection</h2>
              </div>
              <div className="pl-16">
                <p className="mb-6">
                  We implement appropriate technical and organizational measures to protect your personal 
                  information, including:
                </p>
                
                <ul className="list-disc pl-6 mb-6 space-y-2">
                  <li>Encryption of sensitive data in transit and at rest</li>
                  <li>Access controls and authentication mechanisms</li>
                  <li>Regular security audits and testing</li>
                  <li>Employee training on data protection</li>
                </ul>
                
                <h3 className="text-xl font-semibold text-gray-900 mb-3">4.1 Data Retention</h3>
                <p className="mb-6">
                  We retain personal information only as long as necessary to fulfill the purposes for 
                  which it was collected, including for legal, accounting, or reporting requirements.
                </p>
              </div>
            </motion.section>

            <motion.section
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="scroll-mt-24"
              id="rights"
            >
              <div className="flex items-start mb-6">
                <div className="p-3 bg-yellow-100 rounded-lg mr-4 mt-1">
                  <FaUserShield className="text-yellow-600" size={24} />
                </div>
                <h2 className="text-2xl font-bold text-gray-900">5. Your Rights</h2>
              </div>
              <div className="pl-16">
                <p className="mb-6">
                  Depending on your jurisdiction, you may have certain rights regarding your personal data:
                </p>
                
                <ul className="list-disc pl-6 mb-6 space-y-2">
                  <li>Right to access and receive a copy of your personal data</li>
                  <li>Right to rectify inaccurate or incomplete data</li>
                  <li>Right to erasure under certain circumstances</li>
                  <li>Right to restrict or object to processing</li>
                  <li>Right to data portability</li>
                </ul>
                
                <div className="p-6 bg-blue-50 rounded-lg border border-blue-100">
                  <h3 className="font-medium text-gray-900 mb-2">Contact Information</h3>
                  <p className="text-gray-600">
                    To exercise your rights or for any privacy-related inquiries, please contact our 
                    Data Protection Officer at <a href="mailto:dpo@investpro.com" className="text-[#FD4A36] hover:underline">dpo@investpro.com</a>.
                  </p>
                </div>
              </div>
            </motion.section>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default PrivacyPolicy;