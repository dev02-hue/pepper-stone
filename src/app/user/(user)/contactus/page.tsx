"use client";
import { motion } from "framer-motion";
import { ChangeEvent, FormEvent, useState } from "react";
import { FiMail, FiSend, FiMessageSquare, FiCheckCircle } from "react-icons/fi";
import { FaTelegramPlane } from "react-icons/fa";

interface FormData {
    name: string;
    email: string;
    subject: string;
    message: string;
  }

const ContactPage = () => {
  const [formData, setFormData] = useState<FormData>({
    name: "",
    email: "",
    subject: "",
    message: ""
  });
  const [isSubmitted, setIsSubmitted] = useState<boolean>(false);

  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    window.location.href = `mailto:trade3865@gmail.com?subject=${encodeURIComponent(formData.subject)}&body=${encodeURIComponent(`Name: ${formData.name}\nEmail: ${formData.email}\n\nMessage: ${formData.message}`)}`;
    setIsSubmitted(true);
    setTimeout(() => setIsSubmitted(false), 5000);
    setFormData({ name: "", email: "", subject: "", message: "" });
  };


  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="max-w-4xl mx-auto px-4 py-12"
    >
      <div className="text-center mb-12">
        <motion.h1 
          initial={{ y: -20 }}
          animate={{ y: 0 }}
          className="text-3xl md:text-4xl font-bold text-gray-800 mb-4"
        >
          Contact Ttrade Capital
        </motion.h1>
        <p className="text-gray-600 max-w-2xl mx-auto">
          Have questions about our platform or services? Reach out to our team through any of these channels.
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-8">
        {/* Email Form */}
        <motion.div 
          whileHover={{ y: -5 }}
          className="bg-white rounded-xl shadow-lg p-6 border border-gray-100"
        >
          <div className="flex items-center mb-4">
            <FiMail className="text-blue-500 text-2xl mr-3" />
            <h2 className="text-xl font-semibold text-gray-800">Email Us</h2>
          </div>
          
          {isSubmitted ? (
            <motion.div
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              className="bg-green-50 text-green-700 p-4 rounded-lg flex items-center"
            >
              <FiCheckCircle className="mr-2 text-xl" />
              Message sent! We&apos;ll respond within 24 hours.
            </motion.div>
          ) : (
            <form onSubmit={handleSubmit}>
              <div className="mb-4">
                <label className="block text-gray-700 mb-2">Your Name</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              
              <div className="mb-4">
                <label className="block text-gray-700 mb-2">Email Address</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              
              <div className="mb-4">
                <label className="block text-gray-700 mb-2">Subject</label>
                <input
                  type="text"
                  name="subject"
                  value={formData.subject}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              
              <div className="mb-6">
                <label className="block text-gray-700 mb-2">Message</label>
                <textarea
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  required
                  rows={4}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                ></textarea>
              </div>
              
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                type="submit"
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-4 rounded-lg flex items-center justify-center"
              >
                <FiSend className="mr-2" />
                Send Message
              </motion.button>
            </form>
          )}
        </motion.div>

        {/* Telegram & Other Contact Methods */}
        <div className="space-y-6">
          <motion.a
            whileHover={{ x: 5 }}
            href="https://t.me/+XC85N1qPygEzNDc0"  
            target="_blank"
            rel="noopener noreferrer"
            className="block bg-white rounded-xl shadow-lg p-6 border border-gray-100 hover:border-blue-300 transition-all"
          >
            <div className="flex items-center">
              <div className="bg-blue-100 p-3 rounded-full mr-4">
                <FaTelegramPlane className="text-blue-600 text-2xl" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-800">Message us on Telegram</h3>
                <p className="text-gray-600 text-sm">Get instant support via our Telegram bot</p>
              </div>
            </div>
          </motion.a>

          <motion.div 
            whileHover={{ x: 5 }}
            className="bg-white rounded-xl shadow-lg p-6 border border-gray-100"
          >
            <div className="flex items-center">
              <div className="bg-green-100 p-3 rounded-full mr-4">
                <FiMessageSquare className="text-green-600 text-2xl" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-800">Live Chat</h3>
                <p className="text-gray-600 text-sm">Available 24/7 in your account dashboard</p>
              </div>
            </div>
          </motion.div>

          <motion.div 
            whileHover={{ x: 5 }}
            className="bg-white rounded-xl shadow-lg p-6 border border-gray-100"
          >
             
          </motion.div>
        </div>
      </div>

      {/* Office Location */}
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
        className="mt-16 bg-gray-50 rounded-xl p-6 text-center"
      >
        <h3 className="font-medium text-gray-700 mb-2">Our Headquarters</h3>
        <p className="text-gray-600">Level 4, 114 William Street, Melbourne VIC 3000, Australia</p>
      </motion.div>
    </motion.div>
  );
};

export default ContactPage;