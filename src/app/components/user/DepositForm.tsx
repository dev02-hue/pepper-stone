'use client'

import { initiateCryptoDeposit } from '@/lib/depositActions'
import { useState, useEffect } from 'react'
import { CryptoType, CRYPTO_OPTIONS } from '@/types/crypto'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  FaBitcoin, 
  FaEthereum, 
  FaMoneyBillWave, 
  FaWallet, 
  FaClipboard, 
  FaCheck,
  FaArrowLeft,
  FaCoins,
  FaSpinner
} from 'react-icons/fa'
import { SiLitecoin, SiTether } from 'react-icons/si'
import { getUserBalance } from '@/lib/getUserBalance'

const AMOUNT_OPTIONS = [300, 600, 1200, 1500, 3000, 6000, 10000, 20000, 30000] as const

interface PaymentDetails {
  amount: number
  cryptoType: CryptoType
  walletAddress: string
  reference: string
  transactionId: string
}

const cryptoIcons = {
  BTC: <FaBitcoin className="text-orange-500" size={20} />,
  ETH: <FaEthereum className="text-purple-500" size={20} />,
  USDT: <SiTether className="text-emerald-500" size={20} />,
  USDC: <SiLitecoin className="text-gray-500" size={20} />,
  DOT: <FaCoins className="text-pink-500" size={20} />,
  XRP: <FaCoins className="text-blue-400" size={20} />,
  AVAX: <FaCoins className="text-red-500" size={20} />,
  ADA: <FaCoins className="text-blue-600" size={20} />,
  SOL: <FaCoins className="text-teal-500" size={20} />,
  BNB: <FaCoins className="text-yellow-400" size={20} />
};

// Responsive grid configuration
const getGridConfig = (screenWidth: number) => {
  if (screenWidth < 320) return { cols: 2, gap: 2 }
  if (screenWidth < 480) return { cols: 3, gap: 2 }
  if (screenWidth < 640) return { cols: 3, gap: 3 }
  return { cols: 3, gap: 3 }
}

const getCryptoGridConfig = (screenWidth: number) => {
  if (screenWidth < 320) return { cols: 1, gap: 2 }
  if (screenWidth < 480) return { cols: 2, gap: 2 }
  return { cols: 2, gap: 3 }
}

export default function DepositForm() {
  const [step, setStep] = useState(1)
  const [amount, setAmount] = useState<number | null>(null)
  const [customAmount, setCustomAmount] = useState('')
  const [email, setEmail] = useState('')
  const [cryptoType, setCryptoType] = useState<CryptoType | null>(null)
  const [paymentDetails, setPaymentDetails] = useState<PaymentDetails | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')
  const [copiedField, setCopiedField] = useState<string | null>(null)
  const [balance, setBalance] = useState<number | null>(null)
  const [balanceLoading, setBalanceLoading] = useState(true)
  const [screenWidth, setScreenWidth] = useState(250)

  // Handle window resize
  useEffect(() => {
    const handleResize = () => {
      setScreenWidth(window.innerWidth)
    }

    // Set initial width
    handleResize()

    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  // Fetch user balance on component mount
  useEffect(() => {
    const fetchBalance = async () => {
      try {
        const result = await getUserBalance()
        if (result.error) {
          console.error(result.error)
        } else if (result.balance !== undefined) {
          setBalance(result.balance)
        }
      } catch (err) {
        console.error('Failed to fetch balance:', err)
      } finally {
        setBalanceLoading(false)
      }
    }
    
    fetchBalance()
  }, [])

  const copyToClipboard = (text: string, field: string) => {
    navigator.clipboard.writeText(text)
    setCopiedField(field)
    setTimeout(() => setCopiedField(null), 2000)
  }

  const handleAmountSelect = (selectedAmount: number) => {
    setAmount(selectedAmount)
    setCustomAmount('')
    setError('')
  }

  const handleCustomAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    if (value === '' || /^\d+$/.test(value)) {
      setCustomAmount(value)
      setAmount(value ? parseInt(value) : null)
    }
    setError('')
  }

  const handleProceed = () => {
    if (!amount) {
      setError('Please select or enter an amount')
      return
    }
    if (!email) {
      setError('Please enter your email')
      return
    }
    setStep(2)
    setError('')
  }

  const handleCryptoSelect = async () => {
    if (!cryptoType) {
      setError('Please select a cryptocurrency')
      return
    }
    
    setIsLoading(true)
    setError('')
    
    try {
      const result = await initiateCryptoDeposit(amount!, email, cryptoType)
      
      if (result.error) {
        setError(result.error)
      } else if (result.paymentDetails) {
        setPaymentDetails({
          amount: result.paymentDetails.amount,
          cryptoType: result.paymentDetails.cryptoType,
          walletAddress: result.paymentDetails.walletAddress,
          reference: result.paymentDetails.reference,
          transactionId: result.paymentDetails.transactionId
        })
        setStep(3)
      } else {
        setError('Payment details are missing')
      }
    } catch (err) {
      console.error(err)
      setError('An unexpected error occurred')
    } finally {
      setIsLoading(false)
    }
  }

  const resetForm = () => {
    setStep(1)
    setAmount(null)
    setCustomAmount('')
    setCryptoType(null)
    setPaymentDetails(null)
    setError('')
  }

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: {
        when: "beforeChildren",
        staggerChildren: 0.1
      }
    }
  }

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1
    }
  }

  // Get responsive configurations
  const gridConfig = getGridConfig(screenWidth)
  const cryptoGridConfig = getCryptoGridConfig(screenWidth)

  return (
    <div className="w-full max-w-md mx-auto bg-white rounded-xl shadow-lg overflow-hidden p-3 sm:p-4 md:p-6">
      {/* Header Section */}
      <div className="flex flex-col xs:flex-row xs:items-center xs:justify-between gap-2 mb-4 sm:mb-6">
        <div className="flex items-center justify-center xs:justify-start">
          <FaCoins className="text-yellow-500 text-2xl sm:text-3xl mr-2" />
          <h2 className="text-xl sm:text-2xl font-bold text-center xs:text-left">
            Deposit Cryptocurrency
          </h2>
        </div>
        {!balanceLoading && (
          <div className="bg-blue-50 px-2 sm:px-3 py-1 rounded-full text-xs sm:text-sm font-medium text-center">
            Balance: ${balance?.toLocaleString() || '0'}
          </div>
        )}
      </div>
      
      {/* Progress Bar */}
      <div className="relative h-1.5 sm:h-2 bg-gray-200 rounded-full mb-4 sm:mb-6">
        <motion.div 
          className="absolute top-0 left-0 h-full bg-blue-500 rounded-full"
          initial={{ width: `${(step-1)*50}%` }}
          animate={{ width: `${(step-1)*50}%` }}
          transition={{ duration: 0.5 }}
        />
      </div>
      
      <AnimatePresence mode="wait">
        {/* Step 1: Amount Selection */}
        {step === 1 && (
          <motion.div
            key="step1"
            initial={{ x: -50, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: 50, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="space-y-4 sm:space-y-6"
          >
            <div>
              <h3 className="text-base sm:text-lg font-medium mb-2 sm:mb-3 flex items-center justify-center sm:justify-start">
                <FaMoneyBillWave className="mr-2 text-blue-500" />
                Select Amount
              </h3>
              <motion.div 
                className={`grid grid-cols-${gridConfig.cols} gap-${gridConfig.gap}`}
                variants={containerVariants}
                initial="hidden"
                animate="visible"
              >
                {AMOUNT_OPTIONS.map((option) => (
                  <motion.button
                    key={option}
                    onClick={() => handleAmountSelect(option)}
                    className={`py-2 px-2 sm:px-4 rounded-md border flex items-center justify-center transition-colors text-xs sm:text-sm ${
                      amount === option 
                        ? 'bg-blue-500 text-white border-blue-500' 
                        : 'bg-gray-50 hover:bg-gray-100 border-gray-200'
                    }`}
                    variants={itemVariants}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    ${option.toLocaleString()}
                  </motion.button>
                ))}
              </motion.div>
              
              {/* Custom Amount Input */}
              <div className="mt-3 sm:mt-4">
                <label className="block text-xs sm:text-sm font-medium mb-1 text-center sm:text-left">
                  Or enter custom amount:
                </label>
                <motion.div whileHover={{ scale: 1.01 }}>
                  <input
                    type="text"
                    value={customAmount}
                    onChange={handleCustomAmountChange}
                    className="w-full p-2 sm:p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm sm:text-base"
                    placeholder="Enter amount"
                  />
                </motion.div>
              </div>
            </div>
            
            {/* Email Input */}
            <motion.div variants={itemVariants}>
              <label className="block text-xs sm:text-sm font-medium mb-1 text-center sm:text-left">
                Email for confirmation:
              </label>
              <motion.div whileHover={{ scale: 1.01 }}>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full p-2 sm:p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm sm:text-base"
                  placeholder="your@email.com"
                  required
                />
              </motion.div>
            </motion.div>
            
            {/* Error Message */}
            {error && (
              <motion.p 
                className="text-red-500 text-xs sm:text-sm p-2 bg-red-50 rounded-md text-center"
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
              >
                {error}
              </motion.p>
            )}
            
            {/* Proceed Button */}
            <motion.button
              onClick={handleProceed}
              className="w-full bg-blue-500 text-white py-2 sm:py-3 px-4 rounded-md hover:bg-blue-600 transition-colors flex items-center justify-center text-sm sm:text-base disabled:opacity-50"
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.98 }}
              disabled={!amount || !email}
            >
              Proceed to Payment
              <FaWallet className="ml-2" size={14} />
            </motion.button>
          </motion.div>
        )}
        
        {/* Step 2: Cryptocurrency Selection */}
        {step === 2 && (
          <motion.div
            key="step2"
            initial={{ x: -50, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: 50, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="space-y-4 sm:space-y-6"
          >
            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2">
              <h3 className="text-base sm:text-lg font-medium flex items-center justify-center sm:justify-start">
                {cryptoIcons[cryptoType || 'BTC']}
                <span className="ml-2">Select Cryptocurrency</span>
              </h3>
              <div className="text-xs sm:text-sm font-medium text-center sm:text-right">
                Amount: ${amount?.toLocaleString()}
              </div>
            </div>
            
            <motion.div 
              className={`grid grid-cols-${cryptoGridConfig.cols} gap-${cryptoGridConfig.gap}`}
              variants={containerVariants}
              initial="hidden"
              animate="visible"
            >
              {CRYPTO_OPTIONS.map((crypto) => (
                <motion.button
                  key={crypto.value}
                  onClick={() => setCryptoType(crypto.value)}
                  className={`py-2 sm:py-3 px-2 sm:px-4 rounded-md border flex items-center justify-center space-x-1 sm:space-x-2 transition-colors text-xs sm:text-sm ${
                    cryptoType === crypto.value 
                      ? 'bg-blue-500 text-white border-blue-500' 
                      : 'bg-gray-50 hover:bg-gray-100 border-gray-200'
                  }`}
                  variants={itemVariants}
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                >
                  {cryptoIcons[crypto.value]}
                  <span className="truncate">{crypto.label}</span>
                </motion.button>
              ))}
            </motion.div>
            
            {error && (
              <motion.p 
                className="text-red-500 text-xs sm:text-sm p-2 bg-red-50 rounded-md text-center"
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
              >
                {error}
              </motion.p>
            )}
            
            {/* Navigation Buttons */}
            <div className="flex flex-col xs:flex-row gap-2 sm:gap-3">
              <motion.button
                onClick={() => setStep(1)}
                className="flex-1 bg-gray-200 text-gray-800 py-2 px-4 rounded-md hover:bg-gray-300 transition-colors flex items-center justify-center text-sm sm:text-base"
                whileHover={{ scale: 1.01 }}
                whileTap={{ scale: 0.98 }}
              >
                <FaArrowLeft className="mr-2" size={12} />
                Back
              </motion.button>
              <motion.button
                onClick={handleCryptoSelect}
                disabled={isLoading || !cryptoType}
                className="flex-1 bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 transition-colors disabled:opacity-50 flex items-center justify-center text-sm sm:text-base"
                whileHover={{ scale: isLoading ? 1 : 1.01 }}
                whileTap={{ scale: isLoading ? 1 : 0.98 }}
              >
                {isLoading ? (
                  <>
                    <FaSpinner className="animate-spin mr-2" size={14} />
                    Processing...
                  </>
                ) : (
                  'Continue'
                )}
              </motion.button>
            </div>
          </motion.div>
        )}
        
        {/* Step 3: Payment Instructions */}
        {step === 3 && paymentDetails && (
          <motion.div
            key="step3"
            initial={{ x: -50, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: 50, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="space-y-4 sm:space-y-6"
          >
            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2">
              <h3 className="text-base sm:text-lg font-medium flex items-center justify-center sm:justify-start">
                <FaWallet className="mr-2 text-blue-500" />
                Deposit Instructions
              </h3>
              <div className="text-xs sm:text-sm font-medium text-center sm:text-right">
               $ {paymentDetails.amount} worth {paymentDetails.cryptoType}
              </div>
            </div>
            
            <motion.div 
              className="bg-gray-50 p-3 sm:p-4 rounded-md border border-gray-200"
              initial={{ scale: 0.95 }}
              animate={{ scale: 1 }}
            >
              <div className="space-y-3 sm:space-y-4">
                <div className="flex justify-between items-center">
                  <span className="font-medium text-sm sm:text-base">Status:</span>
                  <span className="px-2 py-1 bg-yellow-100 text-yellow-800 text-xs font-semibold rounded-full">
                    Pending
                  </span>
                </div>
                
                {/* Wallet Address */}
                <div>
                  <div className="flex justify-between items-center mb-1">
                    <span className="font-medium text-sm sm:text-base">Wallet Address:</span>
                    <motion.button
                      onClick={() => copyToClipboard(paymentDetails.walletAddress, 'wallet')}
                      className="text-blue-500 hover:text-blue-700 flex items-center text-xs sm:text-sm"
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      {copiedField === 'wallet' ? (
                        <>
                          <FaCheck className="mr-1 text-green-500" size={12} />
                          Copied!
                        </>
                      ) : (
                        <>
                          <FaClipboard className="mr-1" size={12} />
                          Copy
                        </>
                      )}
                    </motion.button>
                  </div>
                  <div className="p-2 bg-white rounded-md border border-gray-300 break-all font-mono text-xs sm:text-sm leading-tight">
                    {paymentDetails.walletAddress}
                  </div>
                </div>
                
                {/* Reference */}
                <div>
                  <div className="flex justify-between items-center mb-1">
                    <span className="font-medium text-sm sm:text-base">Reference:</span>
                    <motion.button
                      onClick={() => copyToClipboard(paymentDetails.reference, 'reference')}
                      className="text-blue-500 hover:text-blue-700 flex items-center text-xs sm:text-sm"
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      {copiedField === 'reference' ? (
                        <>
                          <FaCheck className="mr-1 text-green-500" size={12} />
                          Copied!
                        </>
                      ) : (
                        <>
                          <FaClipboard className="mr-1" size={12} />
                          Copy
                        </>
                      )}
                    </motion.button>
                  </div>
                  <div className="p-2 bg-white rounded-md border border-gray-300 font-mono text-xs sm:text-sm">
                    {paymentDetails.reference}
                  </div>
                </div>
              </div>
              
              {/* Important Notice */}
              <motion.div 
                className="mt-3 sm:mt-4 p-2 sm:p-3 bg-yellow-50 border border-yellow-200 rounded-md"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3 }}
              >
                <p className="text-xs sm:text-sm text-yellow-800 leading-relaxed">
                  <strong>Important:</strong> Send exactly {paymentDetails.amount} worth {paymentDetails.cryptoType} to the address above. 
                  Transactions with different amounts may not be credited.
                </p>
              </motion.div>
            </motion.div>
            
            {/* Confirmation Button */}
            <motion.button
              onClick={() => {
                alert('Your deposit is being processed. You will receive a confirmation email once approved.')
                resetForm()
              }}
              className="w-full bg-green-500 text-white py-2 sm:py-3 px-4 rounded-md hover:bg-green-600 transition-colors flex items-center justify-center text-sm sm:text-base"
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.98 }}
            >
              I Have Made the Payment
            </motion.button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}