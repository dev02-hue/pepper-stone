'use client'
import { useState, useEffect, useRef } from 'react'
import Link from 'next/link'
import { motion, useAnimation, PanInfo } from 'framer-motion'
import { 
  FiDollarSign, 
  FiUser, 
  FiSettings,
  FiPieChart,
  FiClock,
  FiEye,
  FiEyeOff,
  FiChevronLeft,
  FiChevronRight
} from 'react-icons/fi'
import { FaBitcoin, FaWallet, FaPlus, FaMinus, FaMoneyCheckAlt, FaChartLine } from 'react-icons/fa'
import { RiExchangeDollarLine } from 'react-icons/ri'
import { getUserBalance } from '@/lib/getUserBalance'
import { getUserWalletBalances } from '@/lib/getUserWalletBalances'

interface MenuItem {
  name: string
  icon: React.ReactNode
  label: string
}

interface Transaction {
  id: number
  type: 'deposit' | 'withdrawal' | 'transfer'
  amount: number
  currency: string
  time: string
}

const BottomBar = () => {
  const [isExpanded, setIsExpanded] = useState(false)
  const [activeItem, setActiveItem] = useState('dashboard')
  const [showBalance, setShowBalance] = useState(true)
  const [balance, setBalance] = useState<number | null>(null)
  const [btcBalance, setBtcBalance] = useState<number>(0)
  const [loading, setLoading] = useState(true)
  const [showSwipeHint, setShowSwipeHint] = useState(true)
  const scrollContainerRef = useRef<HTMLDivElement>(null)

  const controls = useAnimation()

  const transactions: Transaction[] = [
    { id: 1, type: 'deposit', amount: 500, currency: 'USD', time: '10:30 AM' },
    { id: 2, type: 'withdrawal', amount: 200, currency: 'USD', time: 'Yesterday' },
    { id: 3, type: 'transfer', amount: 0.005, currency: 'BTC', time: 'Mar 15' }
  ]

  const menuItems: MenuItem[] = [
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

  // Fetch balances on component mount
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

  // Auto-hide swipe hint after first interaction
  useEffect(() => {
    const handleFirstInteraction = () => {
      setShowSwipeHint(false)
    }

    document.addEventListener('touchstart', handleFirstInteraction, { once: true })
    document.addEventListener('mousedown', handleFirstInteraction, { once: true })

    return () => {
      document.removeEventListener('touchstart', handleFirstInteraction)
      document.removeEventListener('mousedown', handleFirstInteraction)
    }
  }, [])

  // Animation controls
  useEffect(() => {
    controls.start({
      height: isExpanded ? 300 : 72,
      transition: { duration: 0.3, ease: "easeInOut" }
    })
  }, [isExpanded, controls])

  const toggleBar = () => {
    setIsExpanded(!isExpanded)
  }

  const toggleBalanceVisibility = (e: React.MouseEvent) => {
    e.stopPropagation()
    setShowBalance(!showBalance)
  }

  const handleDrag = (event: MouseEvent | TouchEvent | PointerEvent, info: PanInfo) => {
    if (info.offset.x < -50) {
      scrollContainerRef.current?.scrollBy({ left: 200, behavior: 'smooth' })
    } else if (info.offset.x > 50) {
      scrollContainerRef.current?.scrollBy({ left: -200, behavior: 'smooth' })
    }
  }

  const scrollToItem = (direction: 'left' | 'right') => {
    const scrollAmount = direction === 'right' ? 200 : -200
    scrollContainerRef.current?.scrollBy({ left: scrollAmount, behavior: 'smooth' })
  }

  return (
    <motion.div
      animate={controls}
      initial={{ height: 72 }}
      className="fixed bottom-0 left-0 right-0 bg-gradient-to-t from-[#0A0A0A] to-[#1A1A1A] text-white border-t border-gray-800 shadow-2xl z-50 overflow-hidden backdrop-blur-sm"
    >
      {/* Swipe Indicator */}
      {showSwipeHint && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 10 }}
          className="absolute top-2 left-1/2 transform -translate-x-1/2 flex items-center space-x-1 bg-black/50 px-3 py-1 rounded-full border border-gray-700"
        >
          <FiChevronLeft className="text-[#FD4A36] text-xs" />
          <span className="text-xs text-gray-300">Swipe to navigate</span>
          <FiChevronRight className="text-[#FD4A36] text-xs" />
        </motion.div>
      )}

      {/* Expand/Collapse Button */}
      <motion.div
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        onClick={toggleBar}
        className="absolute top-3 right-4 z-10 bg-gradient-to-r from-[#FD4A36] to-[#FF6B46] rounded-full p-2 shadow-lg cursor-pointer border border-orange-500/20 hover:shadow-orange-500/10 transition-all duration-200"
      >
        {isExpanded ? (
          <FaMinus className="text-white text-sm" />
        ) : (
          <FaPlus className="text-white text-sm" />
        )}
      </motion.div>

      {/* Navigation Scroll Container */}
      <div className="relative flex items-center">
        {/* Scroll Left Button */}
        <button
          onClick={() => scrollToItem('left')}
          className="absolute left-2 z-20 bg-black/50 hover:bg-black/70 rounded-full p-1.5 transition-all duration-200 border border-gray-700/50"
        >
          <FiChevronLeft className="text-gray-400 hover:text-white text-sm" />
        </button>

        {/* Main Navigation */}
        <motion.div
          ref={scrollContainerRef}
          drag="x"
          dragConstraints={{ left: -200, right: 200 }}
          dragElastic={0.1}
          onDragEnd={handleDrag}
          className="flex justify-start items-center h-16 px-8 overflow-x-auto no-scrollbar scroll-smooth flex-1"
        >
          {menuItems.map((item) => (
            <Link 
              href={`/user/${item.name}`} 
              key={item.name} 
              className="flex-shrink-0 min-w-[70px] mx-1"
            >
              <motion.div
                whileHover={{ scale: 1.05, y: -2 }}
                whileTap={{ scale: 0.95 }}
                className={`flex flex-col items-center p-2 rounded-xl cursor-pointer transition-all duration-200 border ${
                  activeItem === item.name 
                    ? 'bg-gradient-to-b from-[#FD4A36]/20 to-[#FD4A36]/10 text-[#FD4A36] border-[#FD4A36]/30 shadow-lg shadow-[#FD4A36]/10' 
                    : 'text-gray-400 border-transparent hover:border-gray-600 hover:bg-gray-800/30'
                }`}
                onClick={() => setActiveItem(item.name)}
              >
                <div className="text-lg mb-1">
                  {item.icon}
                </div>
                <span className="text-[10px] font-medium text-center line-clamp-1 leading-tight">
                  {item.label}
                </span>
              </motion.div>
            </Link>
          ))}
        </motion.div>

        {/* Scroll Right Button */}
        <button
          onClick={() => scrollToItem('right')}
          className="absolute right-2 z-20 bg-black/50 hover:bg-black/70 rounded-full p-1.5 transition-all duration-200 border border-gray-700/50"
        >
          <FiChevronRight className="text-gray-400 hover:text-white text-sm" />
        </button>
      </div>

      {/* Expanded Content */}
      {isExpanded && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="px-4 pb-4 border-t border-gray-800 pt-3 bg-gradient-to-b from-gray-900/50 to-transparent"
        >
          {/* Balance Display */}
          <div className="mb-4 p-4 rounded-xl bg-gradient-to-r from-gray-900 to-gray-800 border border-gray-700 shadow-lg">
            <div className="flex justify-between items-center mb-3">
              <span className="text-xs font-semibold text-gray-400 tracking-wider">TOTAL BALANCE</span>
              <button 
                onClick={toggleBalanceVisibility}
                className="text-gray-400 hover:text-white transition-colors duration-200 p-1 rounded-lg hover:bg-gray-700/50"
              >
                {showBalance ? <FiEye size={16} /> : <FiEyeOff size={16} />}
              </button>
            </div>
            {showBalance ? (
              <>
                <div className="text-xl font-bold text-white mb-2 truncate bg-gradient-to-r from-white to-gray-300 bg-clip-text ">
                  {balance !== null ? (
                    `$${balance.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
                  ) : (
                    <div className="h-6 bg-gray-700 rounded animate-pulse"></div>
                  )}
                </div>
                <div className="flex items-center text-sm text-gray-400">
                  <FaBitcoin className="mr-2 text-amber-500" />
                  <span>{loading ? '...' : btcBalance.toFixed(8)} BTC</span>
                  <span className="mx-3 text-gray-600">•</span>
                  <span className="text-green-400 font-medium flex items-center">
                    <FiChevronUp className="mr-1" />
                    ↑ 2.4%
                  </span>
                </div>
              </>
            ) : (
              <div className="text-xl font-bold text-white tracking-widest">••••••••</div>
            )}
          </div>

          {/* Recent Transactions */}
          <div>
            <div className="flex justify-between items-center mb-3">
              <h3 className="text-xs font-semibold text-gray-400 tracking-wider">RECENT TRANSACTIONS</h3>
              <span className="text-[10px] text-gray-500 bg-gray-800 px-2 py-1 rounded-full">
                {transactions.length} items
              </span>
            </div>
            <div className="space-y-3">
              {transactions.map((tx) => (
                <motion.div 
                  key={tx.id} 
                  whileHover={{ scale: 1.02 }}
                  className="flex items-center justify-between p-3 rounded-lg bg-gray-800/50 border border-gray-700/50 hover:border-gray-600 transition-all duration-200"
                >
                  <div className="flex items-center">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                      tx.type === 'deposit' ? 'bg-green-500/20 text-green-400 border border-green-500/30' :
                      tx.type === 'withdrawal' ? 'bg-red-500/20 text-red-400 border border-red-500/30' :
                      'bg-blue-500/20 text-blue-400 border border-blue-500/30'
                    }`}>
                      {tx.type === 'deposit' ? '↓' : tx.type === 'withdrawal' ? '↑' : '⇄'}
                    </div>
                    <div className="ml-3">
                      <p className="text-sm font-semibold text-white capitalize">{tx.type}</p>
                      <p className="text-xs text-gray-400">{tx.time}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className={`text-sm font-bold ${
                      tx.type === 'deposit' ? 'text-green-400' :
                      tx.type === 'withdrawal' ? 'text-red-400' :
                      'text-blue-400'
                    }`}>
                      {tx.type === 'deposit' ? '+' : tx.type === 'withdrawal' ? '-' : ''}
                      {tx.amount} {tx.currency}
                    </p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </motion.div>
      )}

      {/* Custom Styles */}
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

// Helper component for chevron up icon
const FiChevronUp = ({ className }: { className?: string }) => (
  <svg className={className} stroke="currentColor" fill="none" strokeWidth="2" viewBox="0 0 24 24" strokeLinecap="round" strokeLinejoin="round" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg">
    <polyline points="18 15 12 9 6 15"></polyline>
  </svg>
)

export default BottomBar