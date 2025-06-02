'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import { FiArrowLeft, FiCheckCircle, FiDollarSign, FiMail, FiCreditCard } from 'react-icons/fi'
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts'
import { CryptoType } from '@/types/crypto'
import { initiateCryptoWithdrawal } from '@/lib/withdrawalaction'

const AMOUNT_OPTIONS = [300, 600, 1200, 1500, 3000, 6000, 10000] as const

const CRYPTO_OPTIONS = [
  { value: 'USDC', label: 'USDC', icon: '💲' },
  { value: 'USDT', label: 'USDT', icon: '💲' },
  { value: 'DOT', label: 'Polkadot (DOT)', icon: '🔴' },
  { value: 'XRP', label: 'Ripple (XRP)', icon: '✖️' },
  { value: 'ETH', label: 'Ethereum (ETH)', icon: 'Ξ' },
  { value: 'AVAX', label: 'Avalanche (AVAX)', icon: '❄️' },
  { value: 'ADA', label: 'Cardano (ADA)', icon: '🅰️' },
  { value: 'SOL', label: 'Solana (SOL)', icon: '⚡' },
  { value: 'BTC', label: 'Bitcoin (BTC)', icon: '₿' },
  { value: 'BNB', label: 'Binance Coin (BNB)', icon: '🅱️' },
] as const

type WithdrawalStep = 1 | 2 | 3

interface WithdrawalDetails {
  reference: string
  cryptoType: CryptoType
  walletAddress: string
  amount: number
}

const chartData = AMOUNT_OPTIONS.map(amount => ({
  amount,
  frequency: Math.floor(Math.random() * 100) + 10 // Random data for visualization
}))

const containerVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 0.3 } },
  exit: { opacity: 0 }
}

const stepVariants = {
  enter: { x: 50, opacity: 0 },
  center: { x: 0, opacity: 1 },
  exit: { x: -50, opacity: 0 }
}

export default function WithdrawalForm() {
  const router = useRouter()
  const [step, setStep] = useState<WithdrawalStep>(1)
  const [email, setEmail] = useState('')
  const [amount, setAmount] = useState('')
  const [cryptoType, setCryptoType] = useState<CryptoType | ''>('')
  const [walletAddress, setWalletAddress] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState('')
  const [withdrawalDetails, setWithdrawalDetails] = useState<WithdrawalDetails | null>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    if (step === 1) {
      if (!email || !amount) {
        setError('Please fill all fields')
        return
      }
      if (parseFloat(amount) < 300) {
        setError('Minimum withdrawal is 300')
        return
      }
      setStep(2)
      return
    }

    if (step === 2) {
      if (!cryptoType || !walletAddress) {
        setError('Please select crypto type and enter wallet address')
        return
      }
      setStep(3)
      return
    }

    if (step === 3) {
      setIsSubmitting(true)
      try {
        const result = await initiateCryptoWithdrawal(
          parseFloat(amount),
          email,
          cryptoType as CryptoType,
          walletAddress
        )

        if (result.error) {
          setError(result.error)
          setIsSubmitting(false)
          return
        }

        if (result.success && result.withdrawalDetails) {
          setWithdrawalDetails(result.withdrawalDetails)
        }
      } catch (err) {
        setError('An unexpected error occurred')
        console.error(err)
      } finally {
        setIsSubmitting(false)
      }
    }
  }

  const handleBack = () => {
    if (step > 1) {
      setStep((step - 1) as WithdrawalStep)
      setError('')
    }
  }

  if (withdrawalDetails) {
    return (
      <motion.div
        initial="hidden"
        animate="visible"
        exit="exit"
        variants={containerVariants}
        className="max-w-md mx-auto p-6 bg-white rounded-xl shadow-lg"
      >
        <div className="text-center mb-6">
          <FiCheckCircle className="mx-auto text-5xl text-green-500 mb-4" />
          <h2 className="text-2xl font-bold text-gray-800">Withdrawal Request Submitted</h2>
          <p className="text-gray-600 mt-2">Your transaction is being processed</p>
        </div>
        
        <div className="space-y-4 mb-6 p-4 bg-gray-50 rounded-lg">
          <div className="flex justify-between items-center">
            <span className="text-sm text-gray-500">Reference Number</span>
            <span className="font-medium text-gray-800">{withdrawalDetails.reference}</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-sm text-gray-500">Cryptocurrency</span>
            <span className="font-medium text-gray-800">{withdrawalDetails.cryptoType}</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-sm text-gray-500">Amount</span>
            <span className="font-medium text-gray-800">{withdrawalDetails.amount} USD</span>
          </div>
          <div className="flex flex-col">
            <span className="text-sm text-gray-500">Destination Wallet</span>
            <span className="font-medium text-gray-800 break-all mt-1">{withdrawalDetails.walletAddress}</span>
          </div>
        </div>

        <div className="h-40 mb-6">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData}>
              <XAxis dataKey="amount" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="frequency" fill="#3b82f6" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <button
          onClick={() => router.push('/user/dashboard')}
          className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg hover:bg-blue-700 transition flex items-center justify-center gap-2"
        >
          Back to Dashboard
        </button>
      </motion.div>
    )
  }

  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={containerVariants}
      className="max-w-md mx-auto p-6 bg-white rounded-xl shadow-lg"
    >
      <div className="mb-6 text-center">
        <h2 className="text-2xl font-bold text-gray-800">Crypto Withdrawal</h2>
        <div className="flex justify-center mt-4 mb-6">
          <div className="flex items-center">
            {[1, 2, 3].map((stepNumber) => (
              <div key={stepNumber} className="flex items-center">
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center ${step >= stepNumber ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-600'}`}
                >
                  {stepNumber}
                </div>
                {stepNumber < 3 && (
                  <div className={`w-12 h-1 ${step > stepNumber ? 'bg-blue-600' : 'bg-gray-200'}`} />
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
      
      <form onSubmit={handleSubmit}>
        <AnimatePresence mode="wait">
          <motion.div
            key={step}
            variants={stepVariants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{ type: 'tween', ease: 'easeInOut', duration: 0.3 }}
          >
            {step === 1 && (
              <div className="space-y-5">
                <div>
                  <label htmlFor="email" className="text-sm font-medium text-gray-700 mb-2 flex items-center gap-1">
                    <FiMail className="text-gray-500" />
                    Your Email
                  </label>
                  <input
                    type="email"
                    id="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    required
                  />
                </div>
                
                <div>
                  <label htmlFor="amount" className=" text-sm font-medium text-gray-700 mb-2 flex items-center gap-1">
                    <FiDollarSign className="text-gray-500" />
                    Amount to Withdraw (USD)
                  </label>
                  <input
                    type="number"
                    id="amount"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    min="300"
                    step="0.01"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    required
                  />
                  <p className="text-xs text-gray-500 mt-2">Minimum withdrawal: 300 USD</p>
                  
                  <div className="mt-3 grid grid-cols-3 sm:grid-cols-4 gap-2">
                    {AMOUNT_OPTIONS.map((option) => (
                      <button
                        key={option}
                        type="button"
                        onClick={() => setAmount(option.toString())}
                        className={`py-2 px-3 rounded-md text-sm ${amount === option.toString() ? 'bg-blue-600 text-white' : 'bg-gray-100 hover:bg-gray-200'}`}
                      >
                        ${option}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {step === 2 && (
              <div className="space-y-5">
                <div>
                  <label htmlFor="cryptoType" className="block text-sm font-medium text-gray-700 mb-2">
                    Select Cryptocurrency
                  </label>
                  <select
                    id="cryptoType"
                    value={cryptoType}
                    onChange={(e) => setCryptoType(e.target.value as CryptoType)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none"
                    required
                  >
                    <option value="">Select cryptocurrency</option>
                    {CRYPTO_OPTIONS.map((option) => (
                      <option key={option.value} value={option.value}>
                        {option.icon} {option.label}
                      </option>
                    ))}
                  </select>
                </div>
                
                <div>
                  <label htmlFor="walletAddress" className="text-sm font-medium text-gray-700 mb-2 flex items-center gap-1">
                    <FiCreditCard className="text-gray-500" />
                    Your Wallet Address
                  </label>
                  <input
                    type="text"
                    id="walletAddress"
                    value={walletAddress}
                    onChange={(e) => setWalletAddress(e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    required
                  />
                  <p className="text-xs text-gray-500 mt-2">
                    Ensure this address is correct. Withdrawals cannot be reversed.
                  </p>
                </div>
              </div>
            )}

            {step === 3 && (
              <div className="space-y-5">
                <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                  <h3 className="font-medium text-yellow-800">Withdrawal Confirmation</h3>
                  <div className="mt-3 space-y-3">
                    <div className="flex justify-between">
                      <span className="text-sm text-yellow-700">Amount:</span>
                      <span className="font-medium">{amount} USD</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-yellow-700">Cryptocurrency:</span>
                      <span className="font-medium">{cryptoType}</span>
                    </div>
                    <div className="flex flex-col">
                      <span className="text-sm text-yellow-700">Wallet Address:</span>
                      <span className="font-medium break-all mt-1">{walletAddress}</span>
                    </div>
                  </div>
                </div>
                
                <p className="text-sm text-gray-600">
                  By proceeding, you confirm that the wallet address is correct and belongs to you.
                  The admin will review your withdrawal request and process it shortly.
                </p>
              </div>
            )}
          </motion.div>
        </AnimatePresence>

        {error && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-4 p-3 bg-red-50 text-red-700 rounded-lg text-sm"
          >
            {error}
          </motion.div>
        )}

        <div className="mt-8 flex justify-between gap-4">
          {step > 1 && (
            <button
              type="button"
              onClick={handleBack}
              className="px-5 py-3 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 flex items-center gap-2"
            >
              <FiArrowLeft /> Back
            </button>
          )}
          <button
            type="submit"
            disabled={isSubmitting}
            className={`px-5 py-3 rounded-lg text-white flex-1 ${isSubmitting ? 'bg-blue-400' : 'bg-blue-600 hover:bg-blue-700'} flex items-center justify-center gap-2`}
          >
            {isSubmitting ? (
              <>
                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Processing...
              </>
            ) : step === 3 ? (
              'Confirm Withdrawal'
            ) : (
              'Continue'
            )}
          </button>
        </div>
      </form>
    </motion.div>
  )
}