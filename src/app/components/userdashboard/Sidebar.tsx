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
import { FaBitcoin, FaWallet, FaPlus, FaMinus, FaMoneyCheckAlt, FaChartLine } from 'react-icons/fa'
import { RiExchangeDollarLine } from 'react-icons/ri'
import { getUserBalance } from '@/lib/getUserBalance'
import { getUserWalletBalances } from '@/lib/getUserWalletBalances'

const BottomBar = () => {
  const [isExpanded, setIsExpanded] = useState(false)
  const [activeItem, setActiveItem] = useState('dashboard')
  const [showBalance, setShowBalance] = useState(true)
  const [balance, setBalance] = useState<number | null>(null)
  const [btcBalance, setBtcBalance] = useState<number>(0)
  const [loading, setLoading] = useState(true)

  const controls = useAnimation()

  const transactions = [
    { id: 1, type: 'deposit', amount: 500, currency: 'USD', time: '10:30 AM' },
    { id: 2, type: 'withdrawal', amount: 200, currency: 'USD', time: 'Yesterday' },
    { id: 3, type: 'transfer', amount: 0.005, currency: 'BTC', time: 'Mar 15' }
  ]

  const menuItems = [
    { name: 'dashboard', icon: <FiPieChart className="text-inherit" />, label: 'Dashboard' },
    { name: 'deposit', icon: <FiDollarSign className="text-inherit" />, label: 'Deposit' },
    { name: 'loan', icon: <FaMoneyCheckAlt className="text-inherit" />, label: 'Loan Service' },
    { name: 'investment', icon: <FaChartLine className="text-inherit" />, label: 'Invest Capital' },
    { name: 'withdrawal', icon: <RiExchangeDollarLine className="text-inherit" />, label: 'Withdraw' },
    { name: 'wallet', icon: <FaWallet className="text-inherit" />, label: 'Wallet' },
    { name: 'history', icon: <FiClock className="text-inherit" />, label: 'History' },
    { name: 'profile', icon: <FiUser className="text-inherit" />, label: 'Profile' },
    { name: 'setting', icon: <FiSettings className="text-inherit" />, label: 'Settings' },
  ]

  useEffect(() => {
    const fetchBalances = async () => {
      try {
        setLoading(true)
        
        const usdResponse = await getUserBalance()
        if (usdResponse && typeof usdResponse.balance === 'number') {
          setBalance(usdResponse.balance)
        }
        
        const walletResponse = await getUserWalletBalances()
        if (walletResponse && !walletResponse.error) {
          setBtcBalance(walletResponse.balances?.BTC || 0)
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
    controls.start({
      height: isExpanded ? 300 : 72,
      transition: { duration: 0.3, ease: "easeInOut" }
    })
  }, [isExpanded, controls])

  const toggleBar = () => {
    setIsExpanded(!isExpanded)
  }

  const toggleBalanceVisibility = () => {
    setShowBalance(!showBalance)
  }

  return (
    <motion.div
      animate={controls}
      initial={{ height: 72 }}
      className="fixed bottom-0 left-0 right-0 bg-gradient-to-t from-[#0F0F0F] to-[#1A1A1A] text-white border-t border-[#2D2D2D] shadow-xl z-50 overflow-hidden"
    >
      {/* Collapse/Expand Button */}
      <motion.div
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        onClick={toggleBar}
        className="absolute top-2 right-3 z-10 bg-[#FD4A36] rounded-full p-1.5 shadow-lg cursor-pointer border-2 border-[#2D2D2D] sm:p-2"
      >
        {isExpanded ? (
          <FaMinus className="text-white text-xs sm:text-sm" />
        ) : (
          <FaPlus className="text-white text-xs sm:text-sm" />
        )}
      </motion.div>

      {/* Main Navigation - All 7 items */}
      <div className="flex justify-between items-center h-16 px-1 overflow-x-auto no-scrollbar">
        {menuItems.map((item) => (
          <Link 
            href={`/user/${item.name}`} 
            key={item.name} 
            className="flex-shrink-0 min-w-[60px] xs:min-w-[70px] sm:min-w-[80px]"
          >
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className={`flex flex-col items-center p-1 rounded-lg cursor-pointer mx-0.5 ${
                activeItem === item.name 
                  ? 'text-[#FD4A36]' 
                  : 'text-gray-400'
              }`}
              onClick={() => setActiveItem(item.name)}
            >
              <div className="text-lg xs:text-xl sm:text-[22px]">
                {item.icon}
              </div>
              <span className="text-[9px] xs:text-[10px] sm:text-xs mt-0.5 text-center line-clamp-1">
                {item.label}
              </span>
            </motion.div>
          </Link>
        ))}
      </div>

      {/* Expanded Content */}
      {isExpanded && (
        <div className="px-3 pb-3 sm:px-4 sm:pb-4">
          {/* Balance Display */}
          <div className="mb-3 p-3 rounded-lg bg-[#0F0F0F]">
            <div className="flex justify-between items-center mb-2">
              <span className="text-xs text-gray-400 font-medium">TOTAL BALANCE</span>
              <button 
                onClick={toggleBalanceVisibility}
                className="text-gray-400 hover:text-white transition-colors"
              >
                {showBalance ? <FiEye size={14} /> : <FiEyeOff size={14} />}
              </button>
            </div>
            {showBalance ? (
              <>
                <div className="text-lg sm:text-xl font-bold text-white mb-1 truncate">
                  {balance !== null ? (
                    `$${balance.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
                  ) : (
                    'Loading...'
                  )}
                </div>
                <div className="flex items-center text-xs text-gray-400">
                  <FaBitcoin className="mr-1 text-amber-500" />
                  <span>{loading ? '...' : btcBalance.toFixed(8)} BTC</span>
                  <span className="mx-2">•</span>
                  <span className="text-green-500">↑ 2.4%</span>
                </div>
              </>
            ) : (
              <div className="text-lg sm:text-xl font-bold text-white">••••••</div>
            )}
          </div>

          {/* Transactions */}
          <div className="mb-3">
            <h3 className="text-xs text-gray-400 font-medium mb-2">RECENT TRANSACTIONS</h3>
            <div className="space-y-2">
              {transactions.map((tx) => (
                <div key={tx.id} className="flex items-center justify-between py-1">
                  <div className="flex items-center">
                    <div className={`w-6 h-6 rounded-full flex items-center justify-center ${
                      tx.type === 'deposit' ? 'bg-green-900 bg-opacity-30 text-green-400' :
                      tx.type === 'withdrawal' ? 'bg-red-900 bg-opacity-30 text-red-400' :
                      'bg-blue-900 bg-opacity-30 text-blue-400'
                    }`}>
                      {tx.type === 'deposit' ? '↓' : tx.type === 'withdrawal' ? '↑' : '⇄'}
                    </div>
                    <div className="ml-2">
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
          </div>
        </div>
      )}

      {/* Custom scrollbar hide */}
      <style jsx>{`
        .no-scrollbar::-webkit-scrollbar {
          display: none;
        }
        .no-scrollbar {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style>
    </motion.div>
  )
}

export default BottomBar