'use client'
import { useState } from 'react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { 
  FiHome, 
  FiDollarSign, 
  FiCreditCard, 
  FiUser, 
  FiSettings
} from 'react-icons/fi'
import { FaWallet, FaChevronLeft, FaChevronRight } from 'react-icons/fa'

const Sidebar = () => {
  const [isCollapsed, setIsCollapsed] = useState(false)
  const [activeItem, setActiveItem] = useState('dashboard')
  const balance = 1250.50 // Removed unused setBalance

  const menuItems = [
    { name: 'dashboard', icon: <FiHome size={20} />, label: 'Dashboard' },
    { name: 'deposit', icon: <FiDollarSign size={20} />, label: 'Deposit' },
    { name: 'withdrawal', icon: <FiCreditCard size={20} />, label: 'Withdrawal' },
    { name: 'wallet', icon: <FaWallet size={20} />, label: 'Wallet' },
    { name: 'profile', icon: <FiUser size={20} />, label: 'Profile' },
    { name: 'settings', icon: <FiSettings size={20} />, label: 'Settings' },
  ]

  const toggleSidebar = () => {
    setIsCollapsed(!isCollapsed)
  }

  return (
    <motion.div
      initial={{ width: 250 }}
      animate={{ width: isCollapsed ? 80 : 250 }}
      transition={{ duration: 0.3 }}
      className={`h-screen bg-[#1A1A1A] text-white flex flex-col border-r border-[#2D2D2D]`}
    >
      {/* Balance Display */}
      <motion.div
        initial={{ opacity: 1 }}
        animate={{ opacity: isCollapsed ? 0 : 1 }}
        className="p-4 border-b border-[#2D2D2D]"
      >
        <div className="text-xs text-gray-400 mb-1">Your Balance</div>
        <div className="text-2xl font-bold text-[#FD4A36]">${balance.toFixed(2)}</div>
      </motion.div>

      {/* Menu Items */}
      <div className="flex-1 overflow-y-auto py-4">
        {menuItems.map((item) => (
          <Link href={`/${item.name}`} key={item.name}>
            <motion.div
              whileHover={{ backgroundColor: '#2D2D2D' }}
              whileTap={{ scale: 0.98 }}
              className={`flex items-center px-4 py-3 cursor-pointer ${
                activeItem === item.name ? 'bg-[#2D2D2D] border-l-4 border-[#FD4A36]' : ''
              }`}
              onClick={() => setActiveItem(item.name)}
            >
              <div className="text-gray-300">
                {item.icon}
              </div>
              <motion.span
                initial={{ opacity: 1 }}
                animate={{ opacity: isCollapsed ? 0 : 1 }}
                className={`ml-3 ${isCollapsed ? 'hidden' : 'block'}`}
              >
                {item.label}
              </motion.span>
            </motion.div>
          </Link>
        ))}
      </div>

      {/* Collapse Button */}
      <div 
        className="p-4 border-t border-[#2D2D2D] flex justify-end cursor-pointer"
        onClick={toggleSidebar}
      >
        {isCollapsed ? (
          <FaChevronRight className="text-gray-400" />
        ) : (
          <FaChevronLeft className="text-gray-400" />
        )}
      </div>
    </motion.div>
  )
}

export default Sidebar;