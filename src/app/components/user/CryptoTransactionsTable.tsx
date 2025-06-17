'use client'

import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { FiArrowUp, FiArrowDown, FiCheckCircle, FiXCircle, FiClock, FiDollarSign } from 'react-icons/fi'
import { FaBitcoin, FaEthereum } from 'react-icons/fa'
import { SiRipple, SiPolkadot, SiSolana, SiBinance } from 'react-icons/si'
import { format } from 'date-fns'
import { getCryptoTransactions } from '@/lib/getCryptoTransactions'

// Define your color palette as constants for easy maintenance
const COLORS = {
  navy: 'bg-[#1E3A8A] text-[#1E40AF] border-[#1E3A8A]', // Brighter navy blue
  gold: 'bg-[#FCD34D] text-[#B45309] border-[#FCD34D]', // Softer gold
  lightGray: 'bg-[#F9FAFB] text-[#4B5563] border-[#E5E7EB]', // Lighter background
  peach: 'bg-[#FEE2E2] text-[#991B1B] border-[#FEE2E2]', // More visible peach
  success: 'bg-[#D1FAE5] text-[#065F46] border-[#D1FAE5]', // For completed status
}

const CryptoIcon = ({ cryptoType }: { cryptoType: string }) => {
  const icons: Record<string, React.ReactNode> = {
    BTC: <FaBitcoin className="text-[#F7931A]" />,
    ETH: <FaEthereum className="text-[#627EEA]" />,
    XRP: <SiRipple className="text-[#00A0E9]" />,
    DOT: <SiPolkadot className="text-[#E6007A]" />,
    SOL: <SiSolana className="text-[#00FFA3]" />,
    BNB: <SiBinance className="text-[#F3BA2F]" />,
    USDT: <FiDollarSign className="text-[#26A17B]" />,
    USDC: <FiDollarSign className="text-[#2775CA]" />,
  }

  return <div className="text-lg sm:text-xl">{icons[cryptoType] || cryptoType}</div>
}

const StatusBadge = ({ status }: { status: string }) => {
  const statusConfig: Record<string, { icon: React.ReactNode; classes: string }> = {
    completed: {
      icon: <FiCheckCircle className="text-xs sm:text-sm" />,
      classes: `${COLORS.peach} ${COLORS.navy}`, // Peach bg with navy text
    },
    failed: {
      icon: <FiXCircle className="text-xs sm:text-sm" />,
      classes: 'bg-red-100 text-red-800', // Keeping red for errors
    },
    pending: {
      icon: <FiClock className="text-xs sm:text-sm" />,
      classes: `${COLORS.gold.replace('text', 'bg')} text-[#0A2463]`, // Gold bg with navy text
    },
  }

  const config = statusConfig[status.toLowerCase()] || statusConfig.pending

  return (
    <span className={`inline-flex items-center px-2 py-0.5 sm:px-2.5 sm:py-0.5 rounded-full text-xs font-medium ${config.classes}`}>
      {config.icon}
      <span className="ml-1 capitalize hidden sm:inline">{status}</span>
    </span>
  )
}

const TransactionTypeIcon = ({ type }: { type: string }) => {
  return (
    <div className="flex items-center text-sm sm:text-base">
      {type === 'withdrawal' ? (
        <FiArrowUp className="text-red-500" />
      ) : (
        <FiArrowDown className="text-green-500" />
      )}
      <span className="ml-1 capitalize hidden sm:inline">{type}</span>
    </div>
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

  useEffect(() => {
    const fetchTransactions = async () => {
      try {
        const { transactions, error } = await getCryptoTransactions()
        
        if (error) {
          setError(error)
        } else {
          setTransactions(transactions || [])
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

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className={`animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 ${COLORS.navy.replace('text', 'border')}`}></div>
      </div>
    )
  }

  if (error) {
    return (
      <div className={`p-4 text-red-500 ${COLORS.lightGray} rounded-lg`}>
        Error: {error}
      </div>
    )
  }

  if (!transactions || transactions.length === 0) {
    return (
      <div className={`p-4 ${COLORS.lightGray} rounded-lg text-center`}>
        No transactions found
      </div>
    )
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className={`overflow-x-auto shadow ring-1 ${COLORS.lightGray.replace('bg', 'ring')} rounded-lg`}
    >
      <div className="min-w-[320px]">
        {/* Mobile view - Card layout */}
        <div className="sm:hidden space-y-4 p-4">
          {transactions.map((tx) => (
            <motion.div
              key={tx.reference}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
              className={`border ${COLORS.lightGray.replace('bg', 'border')} rounded-lg p-4 hover:${COLORS.lightGray}`}
            >
              <div className="flex justify-between items-start">
                <div className="flex items-center space-x-2">
                  <CryptoIcon cryptoType={tx.crypto_type} />
                  <div>
                    <div className="font-medium">{tx.crypto_type}</div>
                    <div className="text-sm text-gray-500">
                      {format(new Date(tx.created_at), 'MMM dd, HH:mm')}
                    </div>
                  </div>
                </div>
                <StatusBadge status={tx.status} />
              </div>
              
              <div className="mt-3 flex justify-between items-center">
                <div>
                  <TransactionTypeIcon type={tx.type} />
                  <div className="text-xs text-gray-500 mt-1 truncate max-w-[120px]">
                    Ref: {tx.reference}
                  </div>
                </div>
                <div className={`text-lg font-semibold ${COLORS.navy}`}>
                  {tx.amount}
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Desktop view - Table layout */}
        <table className="hidden sm:table min-w-full divide-y divide-gray-200">
          <thead className={COLORS.lightGray}>
            <tr>
              <th scope="col" className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Type
              </th>
              <th scope="col" className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Crypto
              </th>
              <th scope="col" className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Amount
              </th>
              <th scope="col" className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Status
              </th>
              <th scope="col" className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Reference
              </th>
              <th scope="col" className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Date
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {transactions.map((tx) => (
              <motion.tr
                key={tx.reference}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
                className={`hover:${COLORS.lightGray}`}
              >
                <td className="px-3 py-4 whitespace-nowrap">
                  <TransactionTypeIcon type={tx.type} />
                </td>
                <td className="px-3 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <CryptoIcon cryptoType={tx.crypto_type} />
                    <span className="ml-2">{tx.crypto_type}</span>
                  </div>
                </td>
                <td className={`px-3 py-4 whitespace-nowrap text-sm ${COLORS.navy} font-medium`}>
                  {tx.amount}
                </td>
                <td className="px-3 py-4 whitespace-nowrap">
                  <StatusBadge status={tx.status} />
                </td>
                <td className="px-3 py-4 whitespace-nowrap text-sm text-gray-500 truncate max-w-[120px]">
                  {tx.reference}
                </td>
                <td className="px-3 py-4 whitespace-nowrap text-sm text-gray-500">
                  {format(new Date(tx.created_at), 'MMM dd, yyyy HH:mm')}
                </td>
              </motion.tr>
            ))}
          </tbody>
        </table>
      </div>
    </motion.div>
  )
}