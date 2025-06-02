'use client'

import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { FiArrowUp, FiArrowDown, FiCheckCircle, FiXCircle, FiClock, FiDollarSign } from 'react-icons/fi'
import { FaBitcoin, FaEthereum } from 'react-icons/fa'
import { SiRipple, SiPolkadot, SiSolana, SiBinance } from 'react-icons/si'
import { format } from 'date-fns'
import { getCryptoTransactions } from '@/lib/getCryptoTransactions'
  
const CryptoIcon = ({ cryptoType }: { cryptoType: string }) => {
  const icons: Record<string, React.ReactNode> = {
    BTC: <FaBitcoin className="text-orange-500" />,
    ETH: <FaEthereum className="text-purple-500" />,
    XRP: <SiRipple className="text-blue-500" />,
    DOT: <SiPolkadot className="text-pink-500" />,
    SOL: <SiSolana className="text-green-500" />,
    BNB: <SiBinance className="text-yellow-500" />,
    USDT: <FiDollarSign className="text-emerald-500" />,
    USDC: <FiDollarSign className="text-blue-400" />,
  }

  return <div className="text-xl">{icons[cryptoType] || cryptoType}</div>
}

const StatusBadge = ({ status }: { status: string }) => {
  const statusConfig: Record<string, { icon: React.ReactNode; color: string }> = {
    completed: {
      icon: <FiCheckCircle />,
      color: 'bg-green-100 text-green-800',
    },
    failed: {
      icon: <FiXCircle />,
      color: 'bg-red-100 text-red-800',
    },
    pending: {
      icon: <FiClock />,
      color: 'bg-yellow-100 text-yellow-800',
    },
  }

  const config = statusConfig[status.toLowerCase()] || statusConfig.pending

  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${config.color}`}>
      {config.icon}
      <span className="ml-1 capitalize">{status}</span>
    </span>
  )
}

const TransactionTypeIcon = ({ type }: { type: string }) => {
  return (
    <div className="flex items-center">
      {type === 'withdrawal' ? (
        <FiArrowUp className="text-red-500" />
      ) : (
        <FiArrowDown className="text-green-500" />
      )}
      <span className="ml-1 capitalize">{type}</span>
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
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="p-4 text-red-500 bg-red-50 rounded-lg">
        Error: {error}
      </div>
    )
  }

  if (!transactions || transactions.length === 0) {
    return (
      <div className="p-4 text-gray-500 bg-gray-50 rounded-lg text-center">
        No transactions found
      </div>
    )
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="overflow-hidden shadow ring-1 ring-black ring-opacity-5 rounded-lg"
    >
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Type
            </th>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Crypto
            </th>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Amount
            </th>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Status
            </th>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Reference
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
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
              className="hover:bg-gray-50"
            >
              <td className="px-6 py-4 whitespace-nowrap">
                <TransactionTypeIcon type={tx.type} />
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="flex items-center">
                  <CryptoIcon cryptoType={tx.crypto_type} />
                  <span className="ml-2">{tx.crypto_type}</span>
                </div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                {tx.amount}
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <StatusBadge status={tx.status} />
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {tx.reference}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {format(new Date(tx.created_at), 'MMM dd, yyyy HH:mm')}
              </td>
            </motion.tr>
          ))}
        </tbody>
      </table>
    </motion.div>
  )
}