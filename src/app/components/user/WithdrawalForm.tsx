'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import { motion, AnimatePresence } from 'framer-motion'
import { FiArrowLeft, FiCheckCircle, FiDollarSign, FiMail, FiCreditCard, FiAlertTriangle, FiExternalLink } from 'react-icons/fi'
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts'
import { CryptoType } from '@/types/crypto'
import { initiateCryptoWithdrawal } from '@/lib/withdrawalaction'

const AMOUNT_OPTIONS = [300, 600, 1200, 1500, 3000, 6000, 10000] as const

// Crypto options with real image paths
const CRYPTO_OPTIONS = [
  { value: 'USDC', label: 'USDC', image: '/usdc.png' },
  { value: 'USDT', label: 'USDT', image: '/usdt.png' },
  { value: 'DOT', label: 'Polkadot', image: '/Polkadot.png' },
  { value: 'XRP', label: 'Ripple', image: '/xrp.png' },
  { value: 'ETH', label: 'Ethereum', image: '/eth.png' },
  { value: 'AVAX', label: 'Avalanche', image: '/avax.png' },
  { value: 'ADA', label: 'Cardano', image: '/Cardano.png' },
  { value: 'SOL', label: 'Solana', image: '/solana.jpeg' },
  { value: 'BTC', label: 'Bitcoin', image: '/download1.png' },
  { value: 'BNB', label: 'BNB', image: '/bnb.png' },
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
  frequency: Math.floor(Math.random() * 100) + 10
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
          if (result.error.includes('company ID card')) {
            setError(result.error)
          } else {
            setError(result.error)
          }
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

  const handleCryptoSelect = (crypto: CryptoType) => {
    setCryptoType(crypto)
  }

  const isCompanyIdError = error.includes('company ID card')

  if (withdrawalDetails) {
    const selectedCrypto = CRYPTO_OPTIONS.find(c => c.value === withdrawalDetails.cryptoType)
    
    return (
      <motion.div
        initial="hidden"
        animate="visible"
        exit="exit"
        variants={containerVariants}
        className="max-w-2xl mx-auto p-6 bg-white rounded-xl shadow-lg"
      >
        <div className="text-center mb-6">
          <FiCheckCircle className="mx-auto text-5xl text-green-500 mb-4" />
          <h2 className="text-2xl font-bold text-gray-800">Withdrawal Request Submitted</h2>
          <p className="text-gray-600 mt-2">Your transaction is being processed</p>
        </div>
        
        <div className="space-y-4 mb-6 p-6 bg-gray-50 rounded-lg border border-gray-200">
          <div className="flex justify-between items-center py-2 border-b border-gray-200">
            <span className="text-sm font-medium text-gray-600">Reference Number</span>
            <span className="font-mono font-medium text-gray-800">{withdrawalDetails.reference}</span>
          </div>
          <div className="flex justify-between items-center py-2 border-b border-gray-200">
            <span className="text-sm font-medium text-gray-600">Cryptocurrency</span>
            <div className="flex items-center gap-2">
              {selectedCrypto && (
                <Image 
                  src={selectedCrypto.image} 
                  alt={withdrawalDetails.cryptoType}
                  width={24}
                  height={24}
                  className="rounded-full"
                />
              )}
              <span className="font-medium text-gray-800">{withdrawalDetails.cryptoType}</span>
            </div>
          </div>
          <div className="flex justify-between items-center py-2 border-b border-gray-200">
            <span className="text-sm font-medium text-gray-600">Amount</span>
            <span className="font-medium text-gray-800">${withdrawalDetails.amount} USD</span>
          </div>
          <div className="flex flex-col py-2">
            <span className="text-sm font-medium text-gray-600 mb-2">Destination Wallet</span>
            <span className="font-mono text-sm text-gray-800 break-all bg-white p-3 rounded border">
              {withdrawalDetails.walletAddress}
            </span>
          </div>
        </div>

        <div className="h-48 mb-6 bg-gray-50 p-4 rounded-lg border border-gray-200">
          <h3 className="text-sm font-medium text-gray-700 mb-3">Withdrawal Statistics</h3>
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData}>
              <XAxis 
                dataKey="amount" 
                tick={{ fontSize: 12 }}
                axisLine={false}
                tickLine={false}
              />
              <YAxis 
                tick={{ fontSize: 12 }}
                axisLine={false}
                tickLine={false}
              />
              <Tooltip 
                formatter={(value) => [`${value} transactions`, 'Frequency']}
                labelFormatter={(label) => `$${label}`}
              />
              <Bar 
                dataKey="frequency" 
                fill="#3b82f6" 
                radius={[4, 4, 0, 0]}
                className="hover:opacity-80 transition-opacity"
              />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <button
          onClick={() => router.push('/user/dashboard')}
          className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg hover:bg-blue-700 transition-all duration-200 flex items-center justify-center gap-2 font-medium"
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
      className="max-w-4xl mx-auto p-6 bg-white rounded-xl shadow-lg"
    >
      <div className="mb-8 text-center">
        <h2 className="text-3xl font-bold text-gray-800 mb-2">Crypto Withdrawal</h2>
        <p className="text-gray-600">Securely withdraw your funds to your preferred cryptocurrency wallet</p>
        
        <div className="flex justify-center mt-8 mb-6">
          <div className="flex items-center">
            {[1, 2, 3].map((stepNumber) => (
              <div key={stepNumber} className="flex items-center">
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center border-2 transition-all duration-300 ${
                    step >= stepNumber 
                      ? 'bg-blue-600 border-blue-600 text-white shadow-lg' 
                      : 'border-gray-300 text-gray-500 bg-white'
                  }`}
                >
                  {stepNumber}
                </div>
                {stepNumber < 3 && (
                  <div 
                    className={`w-16 h-1 transition-all duration-500 ${
                      step > stepNumber ? 'bg-blue-600' : 'bg-gray-300'
                    }`} 
                  />
                )}
              </div>
            ))}
          </div>
        </div>

        <div className="flex justify-center gap-24 mt-2">
          <span className={`text-sm font-medium ${step >= 1 ? 'text-blue-600' : 'text-gray-400'}`}>
            Amount & Email
          </span>
          <span className={`text-sm font-medium ${step >= 2 ? 'text-blue-600' : 'text-gray-400'}`}>
            Crypto & Wallet
          </span>
          <span className={`text-sm font-medium ${step >= 3 ? 'text-blue-600' : 'text-gray-400'}`}>
            Confirmation
          </span>
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
              <div className="space-y-6">
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label htmlFor="email" className="text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
                      <FiMail className="text-blue-500" />
                      Your Email Address
                    </label>
                    <input
                      type="email"
                      id="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                      placeholder="Enter your email address"
                      required
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="amount" className=" text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
                      <FiDollarSign className="text-green-500" />
                      Withdrawal Amount (USD)
                    </label>
                    <input
                      type="number"
                      id="amount"
                      value={amount}
                      onChange={(e) => setAmount(e.target.value)}
                      min="300"
                      step="0.01"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                      placeholder="Enter amount"
                      required
                    />
                    <p className="text-xs text-gray-500 mt-2">Minimum withdrawal: $300 USD</p>
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-3">
                    Quick Select Amount
                  </label>
                  <div className="grid grid-cols-4 gap-3">
                    {AMOUNT_OPTIONS.map((option) => (
                      <button
                        key={option}
                        type="button"
                        onClick={() => setAmount(option.toString())}
                        className={`py-3 px-4 rounded-lg border transition-all duration-200 font-medium ${
                          amount === option.toString() 
                            ? 'bg-blue-600 text-white border-blue-600 shadow-lg' 
                            : 'bg-white text-gray-700 border-gray-300 hover:border-blue-500 hover:shadow-md'
                        }`}
                      >
                        ${option.toLocaleString()}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {step === 2 && (
              <div className="space-y-6">
                <div>
                  <label className=" text-sm font-semibold text-gray-700 mb-4 flex items-center gap-2">
                    <FiCreditCard className="text-purple-500" />
                    Select Cryptocurrency
                  </label>
                  <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
                    {CRYPTO_OPTIONS.map((crypto) => (
                      <button
                        key={crypto.value}
                        type="button"
                        onClick={() => handleCryptoSelect(crypto.value as CryptoType)}
                        className={`p-4 rounded-xl border-2 transition-all duration-200 flex flex-col items-center gap-3 ${
                          cryptoType === crypto.value
                            ? 'border-blue-500 bg-blue-50 shadow-lg scale-105'
                            : 'border-gray-200 bg-white hover:border-gray-300 hover:shadow-md'
                        }`}
                      >
                        <Image 
                          src={crypto.image} 
                          alt={crypto.label}
                          width={48}
                          height={48}
                          className="rounded-full object-cover"
                        />
                        <span className="font-semibold text-gray-800 text-sm">
                          {crypto.label}
                        </span>
                        <span className="text-xs text-gray-500 font-mono">
                          {crypto.value}
                        </span>
                      </button>
                    ))}
                  </div>
                </div>
                
                <div>
                  <label htmlFor="walletAddress" className=" text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
                    <FiCreditCard className="text-orange-500" />
                    Your Wallet Address
                  </label>
                  <input
                    type="text"
                    id="walletAddress"
                    value={walletAddress}
                    onChange={(e) => setWalletAddress(e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 font-mono text-sm"
                    placeholder="Enter your wallet address"
                    required
                  />
                  <p className="text-xs text-gray-500 mt-2 flex items-center gap-1">
                    <FiAlertTriangle className="flex-shrink-0" />
                    Ensure this address is correct for {cryptoType}. Withdrawals cannot be reversed.
                  </p>
                </div>

                {cryptoType && (
                  <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg flex items-center gap-3">
                    {(() => {
                      const selectedCrypto = CRYPTO_OPTIONS.find(c => c.value === cryptoType)
                      return selectedCrypto ? (
                        <Image 
                          src={selectedCrypto.image} 
                          alt={cryptoType}
                          width={32}
                          height={32}
                          className="rounded-full"
                        />
                      ) : null
                    })()}
                    <div>
                      <span className="font-semibold text-blue-800">Selected: </span>
                      <span className="text-blue-700">{cryptoType}</span>
                    </div>
                  </div>
                )}
              </div>
            )}

            {step === 3 && (
              <div className="space-y-6">
                <div className="p-6 bg-blue-50 border border-blue-200 rounded-xl">
                  <h3 className="font-semibold text-blue-800 text-lg mb-4 flex items-center gap-2">
                    <FiCheckCircle className="text-blue-600" />
                    Withdrawal Confirmation
                  </h3>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center py-3 border-b border-blue-200">
                      <span className="text-sm font-medium text-blue-700">Amount:</span>
                      <span className="font-bold text-blue-800 text-lg">${amount} USD</span>
                    </div>
                    <div className="flex justify-between items-center py-3 border-b border-blue-200">
                      <span className="text-sm font-medium text-blue-700">Cryptocurrency:</span>
                      <div className="flex items-center gap-2">
                        {(() => {
                          const selectedCrypto = CRYPTO_OPTIONS.find(c => c.value === cryptoType)
                          return selectedCrypto ? (
                            <Image 
                              src={selectedCrypto.image} 
                              alt={cryptoType}
                              width={24}
                              height={24}
                              className="rounded-full"
                            />
                          ) : null
                        })()}
                        <span className="font-semibold text-blue-800">{cryptoType}</span>
                      </div>
                    </div>
                    <div className="py-3">
                      <span className="text-sm font-medium text-blue-700 block mb-2">Wallet Address:</span>
                      <div className="font-mono text-sm text-blue-800 bg-white p-3 rounded-lg border border-blue-300 break-all">
                        {walletAddress}
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                  <p className="text-sm text-yellow-700 flex items-start gap-2">
                    <FiAlertTriangle className="text-yellow-600 mt-0.5 flex-shrink-0" />
                    By proceeding, you confirm that the wallet address is correct and belongs to you. 
                    The admin will review your withdrawal request and process it shortly. 
                    Withdrawals are typically processed within 24-48 hours.
                  </p>
                </div>
              </div>
            )}
          </motion.div>
        </AnimatePresence>

        {error && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className={`mt-6 p-4 rounded-xl border text-sm flex items-start gap-3 ${
              isCompanyIdError 
                ? 'bg-orange-50 text-orange-800 border-orange-300' 
                : 'bg-red-50 text-red-800 border-red-300'
            }`}
          >
            {isCompanyIdError && <FiAlertTriangle className="text-orange-600 mt-0.5 flex-shrink-0" />}
            <div className="flex-1">
              <div className="font-semibold mb-1">
                {isCompanyIdError ? 'Company ID Required' : 'Withdrawal Error'}
              </div>
              <div>{error}</div>
              {isCompanyIdError && (
                <div className="mt-3">
                  <Link 
                    href="/user/company-id"
                    className="inline-flex items-center gap-2 bg-orange-600 text-white px-4 py-2 rounded-lg hover:bg-orange-700 transition-all duration-200 text-sm font-medium"
                  >
                    Purchase Company ID Card
                    <FiExternalLink className="text-sm" />
                  </Link>
                  <p className="text-xs text-orange-700 mt-2">
                    Email: ttradecapitalstatus@gmail.com
                  </p>
                </div>
              )}
            </div>
          </motion.div>
        )}

        <div className="mt-8 flex justify-between gap-4">
          {step > 1 && (
            <button
              type="button"
              onClick={handleBack}
              className="px-6 py-3 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 hover:border-gray-400 transition-all duration-200 flex items-center gap-2 font-medium"
            >
              <FiArrowLeft /> Back
            </button>
          )}
          <button
            type="submit"
            disabled={isSubmitting}
            className={`px-8 py-3 rounded-lg text-white flex-1 transition-all duration-200 flex items-center justify-center gap-2 font-semibold ${
              isSubmitting 
                ? 'bg-blue-400 cursor-not-allowed' 
                : 'bg-blue-600 hover:bg-blue-700 shadow-lg hover:shadow-xl'
            }`}
          >
            {isSubmitting ? (
              <>
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                Processing Withdrawal...
              </>
            ) : step === 3 ? (
              <>
                <FiCheckCircle className="text-lg" />
                Confirm Withdrawal
              </>
            ) : (
              'Continue to Next Step'
            )}
          </button>
        </div>
      </form>
    </motion.div>
  )
}