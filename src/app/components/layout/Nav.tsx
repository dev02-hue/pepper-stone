'use client'
import { useState, useEffect } from "react"
import Link from "next/link"
import { motion, AnimatePresence } from "framer-motion"
import { FiMenu, FiX, FiChevronDown, FiChevronUp } from "react-icons/fi"
import { RiExchangeFill } from "react-icons/ri"
import { Poppins } from 'next/font/google'

const poppins = Poppins({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
})

export const Nav = () => {
  const [menuOpen, setMenuOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const [hoveredLink, setHoveredLink] = useState<string | null>(null)
  const [mobileSubmenu, setMobileSubmenu] = useState<string | null>(null)

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const navLinks = [
    { href: "/", label: "Home" },
    { 
      href: "/services", 
      label: "Services",
      submenu: [
        { href: "/services", label: "Investment Solutions" },
        { href: "/services", label: "Wealth Management" },
        { href: "/services", label: "Retirement Planning" }
      ]
    },
    { href: "/about", label: "About Us" },
    { href: "/blog", label: "Market Research" },
    { href: "/contact", label: "Contact" },
  ]

  const authLinks = [
    { href: "/login", label: "Investor Login" },
    { href: "/register", label: "Register", isPrimary: true },
  ]

  const itemVariants = {
    closed: { opacity: 0, y: -20 },
    open: { opacity: 1, y: 0 }
  }

  const menuVariants = {
    closed: { 
      height: 0,
      transition: {
        staggerChildren: 0.05,
        staggerDirection: -1,
        when: "afterChildren"
      }
    },
    open: { 
      height: "auto",
      transition: {
        staggerChildren: 0.1,
        staggerDirection: 1
      }
    }
  }

  return (
    <header className={`${poppins.className}  w-full z-50`}>
      {/* Top info bar */}
      <motion.div 
        className="bg-gray-900 text-gray-300 text-sm flex justify-between items-center px-6 py-2"
        initial={{ y: -40 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="flex items-center space-x-4">
          <span className="flex items-center">
            <RiExchangeFill className="mr-2 text-blue-400" />
            Level 4, 114 William Street, Melbourne VIC 3000
          </span>
          
        </div>
        
        <div className="hidden md:flex items-center space-x-4">
          <span className="text-gray-500">|</span>
          <a href="mailto:trade3865@gmail.com" className="hover:text-blue-400 transition-colors">
            trade3865@gmail.com
          </a>
        </div>
      </motion.div>

      {/* Main navigation */}
      <motion.nav 
        className={`bg-white shadow-sm transition-all duration-300 ${scrolled ? 'py-2 shadow-lg' : 'py-4'}`}
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.2 }}
      >
        <div className="container mx-auto px-6 flex justify-between items-center">
          {/* Logo */}
          <motion.div 
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="relative"
          >
            <Link href="/" className="flex items-center">
              <span className="bg-gradient-to-r from-blue-600 to-blue-800 text-white font-bold text-xl px-6 py-3 rounded-lg shadow-md">
                TTRADECAPITAL
              </span>
            </Link>
          </motion.div>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center space-x-8">
            <ul className="flex space-x-8">
              {navLinks.map((link) => (
                <li 
                  key={link.href}
                  className="relative"
                  onMouseEnter={() => setHoveredLink(link.href)}
                  onMouseLeave={() => setHoveredLink(null)}
                >
                  <Link
                    href={link.href}
                    className={`flex items-center px-2 py-1 font-medium transition-colors ${
                      hoveredLink === link.href ? 'text-blue-600' : 'text-gray-700 hover:text-blue-500'
                    }`}
                  >
                    {link.label}
                    {link.submenu && (
                      <span className="ml-1">
                        {hoveredLink === link.href ? <FiChevronUp /> : <FiChevronDown />}
                      </span>
                    )}
                  </Link>

                  {/* Desktop Submenu */}
                  {link.submenu && hoveredLink === link.href && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 10 }}
                      className="absolute left-0 top-full mt-2 w-56 bg-white rounded-lg shadow-xl border border-gray-100 z-50"
                    >
                      {link.submenu.map((subItem) => (
                        <Link
                          key={subItem.href}
                          href={subItem.href}
                          className="block px-4 py-3 text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition-colors border-b border-gray-100 last:border-b-0"
                        >
                          {subItem.label}
                        </Link>
                      ))}
                    </motion.div>
                  )}
                </li>
              ))}
            </ul>

            <div className="flex items-center space-x-4 ml-6">
              {authLinks.map((link) => (
                <motion.div
                  key={link.href}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Link
                    href={link.href}
                    className={`px-5 py-2 rounded-lg font-medium transition-all ${
                      link.isPrimary 
                        ? 'bg-gradient-to-r from-blue-600 to-blue-800 text-white shadow-md hover:shadow-lg'
                        : 'text-gray-700 hover:text-blue-600'
                    }`}
                  >
                    {link.label}
                  </Link>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Mobile menu button */}
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="lg:hidden p-2 rounded-lg text-gray-700 hover:bg-gray-100 focus:outline-none"
            aria-label="Toggle menu"
          >
            {menuOpen ? (
              <FiX className="text-2xl" />
            ) : (
              <FiMenu className="text-2xl" />
            )}
          </button>
        </div>

        {/* Mobile Menu */}
        <AnimatePresence>
          {menuOpen && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="lg:hidden overflow-hidden"
            >
              <motion.ul 
                variants={menuVariants}
                initial="closed"
                animate="open"
                exit="closed"
                className="px-6 py-4 space-y-4"
              >
                {navLinks.map((link) => (
                  <motion.li 
                    key={link.href}
                    variants={itemVariants}
                  >
                    <div className="flex flex-col">
                      <div 
                        className="flex items-center justify-between py-2"
                        onClick={() => setMobileSubmenu(mobileSubmenu === link.href ? null : link.href)}
                      >
                        <Link
                          href={link.href}
                          className="text-gray-700 font-medium text-lg"
                          onClick={() => !link.submenu && setMenuOpen(false)}
                        >
                          {link.label}
                        </Link>
                        {link.submenu && (
                          <span className="text-gray-500">
                            {mobileSubmenu === link.href ? <FiChevronUp /> : <FiChevronDown />}
                          </span>
                        )}
                      </div>

                      {/* Mobile Submenu */}
                      {link.submenu && mobileSubmenu === link.href && (
                        <motion.div
                          initial={{ height: 0 }}
                          animate={{ height: 'auto' }}
                          exit={{ height: 0 }}
                          className="pl-4 overflow-hidden"
                        >
                          {link.submenu.map((subItem) => (
                            <Link
                              key={subItem.href}
                              href={subItem.href}
                              className="block py-2 text-gray-600 hover:text-blue-600"
                              onClick={() => setMenuOpen(false)}
                            >
                              {subItem.label}
                            </Link>
                          ))}
                        </motion.div>
                      )}
                    </div>
                  </motion.li>
                ))}

                {authLinks.map((link) => (
                  <motion.li 
                    key={link.href}
                    variants={itemVariants}
                    className="pt-2 border-t border-gray-200"
                  >
                    <Link
                      href={link.href}
                      className={`block w-full py-3 px-4 rounded-lg text-center font-medium ${
                        link.isPrimary
                          ? 'bg-gradient-to-r from-blue-600 to-blue-800 text-white shadow-md'
                          : 'text-gray-700 border border-gray-300'
                      }`}
                      onClick={() => setMenuOpen(false)}
                    >
                      {link.label}
                    </Link>
                  </motion.li>
                ))}
              </motion.ul>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.nav>
    </header>
  )
}