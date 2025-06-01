'use client'
import { useState, useEffect } from 'react'
import Link from 'next/link'
import { motion, useAnimation } from 'framer-motion'
import { 
  FiDollarSign, 
  FiUser, 
  FiSettings,
  FiPieChart,
  FiClock,
  FiEye,
  FiEyeOff
} from 'react-icons/fi'
import { FaBitcoin, FaWallet, FaPlus, FaMinus } from 'react-icons/fa'
import { RiExchangeDollarLine } from 'react-icons/ri'
import { getUserBalance } from '@/lib/getUserBalance'
import { getUserWalletBalances } from '@/lib/getUserWalletBalances'

 
const Sidebar = () => {
  const [isCollapsed, setIsCollapsed] = useState(false)
  const [activeItem, setActiveItem] = useState('dashboard')
  const [showBalance, setShowBalance] = useState(true)
  const [balance, setBalance] = useState<number | null>(null)
  const [btcBalance, setBtcBalance] = useState<number>(0)
  const [loading, setLoading] = useState(true)



  const controls = useAnimation()

  // const balance = 1250.50
 

  // Sample transaction history data
  const transactions = [
    { id: 1, type: 'deposit', amount: 500, currency: 'USD', time: '10:30 AM' },
    { id: 2, type: 'withdrawal', amount: 200, currency: 'USD', time: 'Yesterday' },
    { id: 3, type: 'transfer', amount: 0.005, currency: 'BTC', time: 'Mar 15' }
  ]

  const menuItems = [
    { name: 'dashboard', icon: <FiPieChart size={20} />, label: 'Dashboard' },
    { name: 'deposit', icon: <FiDollarSign size={20} />, label: 'Deposits' },
    { name: 'withdrawal', icon: <RiExchangeDollarLine size={20} />, label: 'Withdrawals' },
    { name: 'wallet', icon: <FaWallet size={20} />, label: 'Wallet' },
    { name: 'history', icon: <FiClock size={20} />, label: 'Transactions' },
    { name: 'profile', icon: <FiUser size={20} />, label: 'Profile' },
    { name: 'setting', icon: <FiSettings size={20} />, label: 'Settings' },
  ]

  useEffect(() => {
    const fetchBalances = async () => {
      try {
        setLoading(true)
        
        // Fetch USD balance
        const usdResponse = await getUserBalance()
        if (usdResponse && typeof usdResponse.balance === 'number') {
          setBalance(usdResponse.balance)
        }
        
        // Fetch wallet balances
        const walletResponse = await getUserWalletBalances()
        if (walletResponse && !walletResponse.error) {
          setBtcBalance(walletResponse.balances?.BTC)
        }
      } catch (error) {
        console.error('Failed to fetch balances:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchBalances()
  }, [])


  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth <= 320) {
        setIsCollapsed(true)
      } else if (window.innerWidth >= 768) {
        setIsCollapsed(false)
      }
    }

    handleResize()
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  useEffect(() => {
    controls.start({
      width: isCollapsed ? 80 : 280,
      transition: { duration: 0.3, ease: "easeInOut" }
    })
  }, [isCollapsed, controls])

  const toggleSidebar = () => {
    setIsCollapsed(!isCollapsed)
  }

  const toggleBalanceVisibility = () => {
    setShowBalance(!showBalance)
  }

  return (
    <motion.div
      animate={controls}
      initial={{ width: 280 }}
      className={`min-h-screen bg-gradient-to-b from-[#0F0F0F] to-[#1A1A1A] text-white flex flex-col border-r border-[#2D2D2D] shadow-xl relative`}
    >
      {/* Premium Collapse Button - Top Right */}
      <motion.div
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        onClick={toggleSidebar}
        className="absolute -right-3 top-4 z-10 bg-[#FD4A36] rounded-full p-2 shadow-lg cursor-pointer border-2 border-[#2D2D2D]"
      >
        {isCollapsed ? (
          <FaPlus className="text-white text-sm" />
        ) : (
          <FaMinus className="text-white text-sm" />
        )}
      </motion.div>

      {/* Premium Balance Display */}
      <motion.div
        initial={{ opacity: 1 }}
        animate={{ opacity: isCollapsed ? 0 : 1 }}
        className="p-5 border-b border-[#2D2D2D] bg-[#0F0F0F]"
      >
        <div className="flex justify-between items-center mb-2">
          <span className="text-xs text-gray-400 font-medium tracking-wider">TOTAL BALANCE</span>
          <div className="flex items-center space-x-2">
            <button 
              onClick={toggleBalanceVisibility}
              className="text-gray-400 hover:text-white transition-colors"
            >
              {showBalance ? <FiEye size={16} /> : <FiEyeOff size={16} />}
            </button>
            <div className="w-6 h-6 rounded-full bg-[#FD4A36] bg-opacity-20 flex items-center justify-center">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M12 1v22M17 5l-5-5-5 5"></path>
              </svg>
            </div>
          </div>
        </div>
        {showBalance ? (
          <>
            <div className="text-3xl font-bold text-white mb-1">
              {balance !== null ? (
                `$${balance.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
              ) : (
                'refresh '
              )}
            </div>
            <div className="flex items-center text-sm text-gray-400">
              <FaBitcoin className="mr-1 text-amber-500" />
              <span>{loading ? '...' : btcBalance.toFixed(8)} BTC</span>
              <span className="mx-2">•</span>
              <span className="text-green-500">↑ 2.4%</span>
            </div>
          </>
        ) : (
          <div className="text-3xl font-bold text-white mb-1">••••••</div>
        )}
      </motion.div>

      {/* Enhanced Menu Items */}
      <div className="flex-1 overflow-y-auto py-4 px-2">
        {menuItems.map((item) => (
          <Link href={`/user/${item.name}`} key={item.name}>
            <motion.div
              whileHover={{ backgroundColor: '#252525' }}
              whileTap={{ scale: 0.98 }}
              className={`flex items-center px-4 py-3 mx-2 rounded-lg cursor-pointer transition-all ${
                activeItem === item.name 
                  ? 'bg-[#FD4A36] bg-opacity-10 border-l-[3px] border-[#FD4A36]' 
                  : 'hover:bg-[#252525]'
              }`}
              onClick={() => setActiveItem(item.name)}
            >
              <div className={`${activeItem === item.name ? 'text-[#FD4A36]' : 'text-gray-300'}`}>
                {item.icon}
              </div>
              <motion.span
                initial={{ opacity: 1 }}
                animate={{ opacity: isCollapsed ? 0 : 1 }}
                className={`ml-3 text-sm font-medium ${
                  isCollapsed ? 'hidden' : 'block'
                } ${
                  activeItem === item.name ? 'text-white' : 'text-gray-400'
                }`}
              >
                {item.label}
              </motion.span>
            </motion.div>
          </Link>
        ))}
      </div>

      {/* Transaction History Section */}
      {!isCollapsed && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="p-4 border-t border-[#2D2D2D]"
        >
          <h3 className="text-xs text-gray-400 font-medium tracking-wider mb-2">RECENT TRANSACTIONS</h3>
          <div className="space-y-3">
            {transactions.map((tx) => (
              <div key={tx.id} className="flex items-center justify-between">
                <div className="flex items-center">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                    tx.type === 'deposit' ? 'bg-green-900 bg-opacity-30 text-green-400' :
                    tx.type === 'withdrawal' ? 'bg-red-900 bg-opacity-30 text-red-400' :
                    'bg-blue-900 bg-opacity-30 text-blue-400'
                  }`}>
                    {tx.type === 'deposit' ? '↓' : tx.type === 'withdrawal' ? '↑' : '⇄'}
                  </div>
                  <div className="ml-3">
                    <p className="text-sm font-medium text-white capitalize">{tx.type}</p>
                    <p className="text-xs text-gray-400">{tx.time}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className={`text-sm font-medium ${
                    tx.type === 'deposit' ? 'text-green-400' :
                    tx.type === 'withdrawal' ? 'text-red-400' :
                    'text-blue-400'
                  }`}>
                    {tx.type === 'deposit' ? '+' : tx.type === 'withdrawal' ? '-' : ''}
                    {tx.amount} {tx.currency}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      )}
    </motion.div>
  )
}

export default Sidebar