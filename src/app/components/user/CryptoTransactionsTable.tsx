'use client'

import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { 
  FiArrowUp, 
  FiArrowDown, 
  FiCheckCircle, 
  FiXCircle, 
  FiClock, 
  FiDollarSign,
  FiChevronDown,
  FiChevronUp
} from 'react-icons/fi'
import { FaBitcoin, FaEthereum } from 'react-icons/fa'
import { SiRipple, SiPolkadot, SiSolana, SiBinance } from 'react-icons/si'
import { format } from 'date-fns'
import { getCryptoTransactions } from '@/lib/getCryptoTransactions'

// Modern color palette
const COLORS = {
  primary: 'bg-indigo-600 text-white',
  secondary: 'bg-purple-100 text-purple-800',
  success: 'bg-emerald-100 text-emerald-800',
  warning: 'bg-amber-100 text-amber-800',
  danger: 'bg-rose-100 text-rose-800',
  info: 'bg-sky-100 text-sky-800',
  dark: 'bg-gray-900 text-white',
  light: 'bg-gray-50 text-gray-800',
}

const CryptoIcon = ({ cryptoType, size = 'md' }: { cryptoType: string, size?: 'sm' | 'md' | 'lg' }) => {
  const sizeClasses = {
    sm: 'text-base',
    md: 'text-xl',
    lg: 'text-2xl'
  }
  
  const icons: Record<string, React.ReactNode> = {
    BTC: <FaBitcoin className="text-orange-500" />,
    ETH: <FaEthereum className="text-indigo-400" />,
    XRP: <SiRipple className="text-sky-500" />,
    DOT: <SiPolkadot className="text-pink-600" />,
    SOL: <SiSolana className="text-green-500" />,
    BNB: <SiBinance className="text-yellow-500" />,
    USDT: <FiDollarSign className="text-emerald-600" />,
    USDC: <FiDollarSign className="text-blue-600" />,
  }

  return <div className={`${sizeClasses[size]}`}>{icons[cryptoType] || cryptoType}</div>
}

const StatusPill = ({ status }: { status: string }) => {
  const statusConfig: Record<string, { icon: React.ReactNode; classes: string }> = {
    completed: {
      icon: <FiCheckCircle className="mr-1" />,
      classes: `${COLORS.success}`,
    },
    failed: {
      icon: <FiXCircle className="mr-1" />,
      classes: `${COLORS.danger}`,
    },
    pending: {
      icon: <FiClock className="mr-1" />,
      classes: `${COLORS.warning}`,
    },
  }

  const config = statusConfig[status.toLowerCase()] || statusConfig.pending

  return (
    <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${config.classes}`}>
      {config.icon}
      <span className="ml-1 capitalize">{status}</span>
    </span>
  )
}

const TransactionDirection = ({ type }: { type: string }) => {
  return (
    <div className={`flex items-center justify-center rounded-full w-8 h-8 ${
      type === 'withdrawal' ? 'bg-rose-100 text-rose-600' : 'bg-emerald-100 text-emerald-600'
    }`}>
      {type === 'withdrawal' ? (
        <FiArrowUp className="text-sm" />
      ) : (
        <FiArrowDown className="text-sm" />
      )}
    </div>
  )
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const TransactionCard = ({ transaction, isOpen, toggleOpen }: { transaction: any, isOpen: boolean, toggleOpen: () => void }) => {
  return (
    <motion.div 
      className={`border border-gray-200 rounded-xl overflow-hidden mb-3 ${isOpen ? 'shadow-md' : ''}`}
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.2 }}
    >
      <div 
        className={`p-4 flex items-center justify-between cursor-pointer ${isOpen ? 'bg-gray-50' : ''}`}
        onClick={toggleOpen}
      >
        <div className="flex items-center space-x-3">
          <TransactionDirection type={transaction.type} />
          <div>
            <div className="font-medium text-gray-900 capitalize">{transaction.type}</div>
            <div className="text-xs text-gray-500">
              {format(new Date(transaction.created_at), 'MMM dd, yyyy')}
            </div>
          </div>
        </div>
        <div className="flex items-center space-x-2">
          <div className={`font-semibold ${
            transaction.type === 'withdrawal' ? 'text-rose-600' : 'text-emerald-600'
          }`}>
            {transaction.type === 'withdrawal' ? '-' : '+'}{transaction.amount}
          </div>
          <div className="text-gray-400">
            {isOpen ? <FiChevronUp /> : <FiChevronDown />}
          </div>
        </div>
      </div>
      
      {isOpen && (
        <motion.div 
          className="px-4 pb-4 pt-2 border-t border-gray-200"
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          exit={{ opacity: 0, height: 0 }}
          transition={{ duration: 0.2 }}
        >
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <div className="text-gray-500 mb-1">Crypto</div>
              <div className="flex items-center">
                <CryptoIcon cryptoType={transaction.crypto_type} size="sm" />
                <span className="ml-2 font-medium">{transaction.crypto_type}</span>
              </div>
            </div>
            <div>
              <div className="text-gray-500 mb-1">Status</div>
              <StatusPill status={transaction.status} />
            </div>
            <div>
              <div className="text-gray-500 mb-1">Reference</div>
              <div className="font-mono text-xs truncate">{transaction.reference}</div>
            </div>
            <div>
              <div className="text-gray-500 mb-1">Time</div>
              <div>{format(new Date(transaction.created_at), 'HH:mm:ss')}</div>
            </div>
          </div>
        </motion.div>
      )}
    </motion.div>
  )
}

export default function CryptoTransactionsTable() {
  interface Transaction {
    type: string
    crypto_type: string
    amount: number
    status: string
    reference: string
    created_at: string
  }

  const [transactions, setTransactions] = useState<Transaction[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [expandedCards, setExpandedCards] = useState<Record<string, boolean>>({})

  useEffect(() => {
    const fetchTransactions = async () => {
      try {
        const { transactions, error } = await getCryptoTransactions()
        
        if (error) {
          setError(error)
        } else {
          setTransactions(transactions || [])
          // Initialize all cards as collapsed
          const initialExpandedState: Record<string, boolean> = {}
          transactions?.forEach(tx => {
            initialExpandedState[tx.reference] = false
          })
          setExpandedCards(initialExpandedState)
        }
      } catch (err) {
        console.log(err)
        setError('Failed to fetch transactions')
      } finally {
        setLoading(false)
      }
    }

    fetchTransactions()
  }, [])

  const toggleCard = (reference: string) => {
    setExpandedCards(prev => ({
      ...prev,
      [reference]: !prev[reference]
    }))
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="p-4 bg-rose-50 text-rose-600 rounded-lg text-center">
        {error}
      </div>
    )
  }

  if (!transactions || transactions.length === 0) {
    return (
      <div className="p-4 bg-gray-50 text-gray-500 rounded-lg text-center">
        No transactions found
      </div>
    )
  }

  return (
    <div className="max-w-4xl mx-auto">
      {/* Mobile/Tablet View - Accordion Cards */}
      <div className="lg:hidden space-y-2">
        {transactions.map((tx) => (
          <TransactionCard 
            key={tx.reference}
            transaction={tx}
            isOpen={expandedCards[tx.reference] || false}
            toggleOpen={() => toggleCard(tx.reference)}
          />
        ))}
      </div>

      {/* Desktop View - Compact Table */}
      <div className="hidden lg:block">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3 }}
          className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden"
        >
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Transaction
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Amount
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Crypto
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Date
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {transactions.map((tx) => (
                  <motion.tr
                    key={tx.reference}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.3 }}
                    className="hover:bg-gray-50"
                  >
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <TransactionDirection type={tx.type} />
                        <div className="ml-3">
                          <div className="font-medium capitalize">{tx.type}</div>
                          <div className="text-xs text-gray-500 font-mono truncate w-32">{tx.reference}</div>
                        </div>
                      </div>
                    </td>
                    <td className={`px-6 py-4 whitespace-nowrap font-medium ${
                      tx.type === 'withdrawal' ? 'text-rose-600' : 'text-emerald-600'
                    }`}>
                      {tx.type === 'withdrawal' ? '-' : '+'}{tx.amount}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <CryptoIcon cryptoType={tx.crypto_type} size="sm" />
                        <span className="ml-2">{tx.crypto_type}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <StatusPill status={tx.status} />
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {format(new Date(tx.created_at), 'MMM dd, yyyy HH:mm')}
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        </motion.div>
      </div>
    </div>
  )
}