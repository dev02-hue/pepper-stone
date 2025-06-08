"use client";
import { FaFacebook, FaTwitter, FaLinkedin, FaInstagram, FaEnvelope, FaMapMarkerAlt, FaClock } from 'react-icons/fa';
import { motion } from 'framer-motion';

const Footer = () => {
  // Footer links data
  const footerLinks = [
    {
      title: "Company",
      links: [
        { name: "About Us", url: "/about" },
        { name: "Our Team", url: "/contact" },
        { name: "Careers", url: "/services" },
        { name: "Press", url: "/blog" },
        { name: "Blog", url: "/blog" }
      ]
    },
    {
      title: "Services",
      links: [
        { name: "Investment Plans", url: "/plan" },
        { name: "Wealth Management", url: "/plan" },
        { name: "Retirement Planning", url: "/blog" },
        { name: "Tax Strategies", url: "/blog" },
        { name: "Crypto Investments", url: "/blog" }
      ]
    },
    {
      title: "Resources",
      links: [
        { name: "Market Research", url: "/blog" },
        { name: "Investment Calculator", url: "/plan" },
        { name: "Financial Tools", url: "/plan" },
        { name: "Glossary", url: "/blog" },
        { name: "Help Center", url: "/contact" }
      ]
    },
    {
      title: "Legal",
      links: [
        { name: "Terms of Service", url: "/terms" },
        { name: "Privacy Policy", url: "/Privacy" },
        { name: "Risk Disclosure", url: "/Privacy" },
        { name: "Compliance", url: "/Privacy" },
        { name: "Regulatory Info", url: "/terms" }
      ]
    }
  ];

  // Social media links
  const socialLinks = [
    { icon: <FaFacebook size={18} />, url: "https://facebook.com" },
    { icon: <FaTwitter size={18} />, url: "https://twitter.com" },
    { icon: <FaLinkedin size={18} />, url: "https://linkedin.com" },
    { icon: <FaInstagram size={18} />, url: "https://instagram.com" }
  ];

  return (
    <footer className="bg-gray-900 text-white pt-16 pb-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Main Footer Content */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-12">
          {/* Company Info */}
          <div className="lg:col-span-1">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <h3 className="text-2xl font-bold mb-4">
                <span className="text-[#FD4A36]">TTRADE</span>CAPITAL
              </h3>
              <p className="text-gray-400 mb-6">
                Your trusted partner for strategic wealth creation and financial growth since 2015.
              </p>
              
              {/* Contact Info */}
              <div className="space-y-3">
                <div className="flex items-start">
                  <FaMapMarkerAlt className="text-[#FD4A36] mt-1 mr-3 flex-shrink-0" />
                  <span className="text-gray-300">
                    Level 4, 114 William Street<br />
                    Melbourne VIC 3000, Australia
                  </span>
                </div>
                
                <div className="flex items-center">
                  <FaEnvelope className="text-[#FD4A36] mr-3" />
                  <a href="mailto:trade3865@gmail.com" className="text-gray-300 hover:text-white transition-colors">
                  trade3865@gmail.com
                  </a>
                </div>
                <div className="flex items-center">
                  <FaClock className="text-[#FD4A36] mr-3" />
                  <span className="text-gray-300">Always Opem</span>
                </div>
              </div>
            </motion.div>
          </div>

          {/* Footer Links */}
          {footerLinks.map((section, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="lg:col-span-1"
            >
              <h4 className="text-lg font-semibold mb-4 text-white">{section.title}</h4>
              <ul className="space-y-3">
                {section.links.map((link, linkIndex) => (
                  <li key={linkIndex}>
                    <a 
                      href={link.url} 
                      className="text-gray-400 hover:text-[#FD4A36] transition-colors"
                    >
                      {link.name}
                    </a>
                  </li>
                ))}
              </ul>
            </motion.div>
          ))}
        </div>

        {/* Divider */}
        <div className="border-t border-gray-800 my-8"></div>

        {/* Bottom Footer */}
        <div className="flex flex-col md:flex-row justify-between items-center">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            className="mb-6 md:mb-0"
          >
            <p className="text-gray-500 text-sm">
              &copy; {new Date().getFullYear()} Trading Platform. All rights reserved.
            </p>
          </motion.div>

          {/* Social Links */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            className="flex space-x-4"
          >
            {socialLinks.map((social, index) => (
              <motion.a
                key={index}
                href={social.url}
                target="_blank"
                rel="noopener noreferrer"
                whileHover={{ y: -3, color: "#FD4A36" }}
                className="text-gray-400 hover:text-white transition-colors"
              >
                {social.icon}
              </motion.a>
            ))}
          </motion.div>
        </div>

        {/* Regulatory Disclosures */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ delay: 0.3, duration: 0.5 }}
          className="mt-8 text-center"
        >
          <p className="text-gray-600 text-xs">
            Trading Platform is regulated by the Australian Securities and Investments Commission (ASIC) under license #123456789.
          </p>
        </motion.div>
      </div>
    </footer>
  );
};

export default Footer;