'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  FiArrowLeft, 
  FiCheck, 
  FiCreditCard, 
  FiUser, 
  FiMail, 
  FiDollarSign,
  FiCopy,
  FiShield,
  FiZap,
  FiClock
 } from 'react-icons/fi'
import { initiateCompanyIdPurchase, verifyCompanyIdPayment, sendPaymentVerificationEmail } from '@/lib/companyIdActions'
import { FaBitcoin, FaRegCheckCircle } from 'react-icons/fa'

type PurchaseStep = 'form' | 'payment' | 'verification'

interface PurchaseDetails {
  reference: string
  amount: number
  btcWallet: string
  fullName: string
  email: string
}

const BENEFITS = [
  {
    icon: FiShield,
    title: 'Secure Verification',
    description: 'Enhanced security and identity verification'
  },
  {
    icon: FiZap,
    title: 'Full Withdrawal Access',
    description: 'Unlock unlimited withdrawal capabilities'
  },
  {
    icon: FiCreditCard,
    title: 'Priority Support',
    description: 'Dedicated customer support team'
  }
]

export default function CompanyIdPurchase() {
  const [step, setStep] = useState<PurchaseStep>('form')
  const [fullName, setFullName] = useState('')
  const [email, setEmail] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [purchaseDetails, setPurchaseDetails] = useState<PurchaseDetails | null>(null)
  const [isVerifying, setIsVerifying] = useState(false)

  const handlePurchaseSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setSuccess('')

    if (!fullName || !email) {
      setError('Please fill in all fields')
      return
    }

    if (!/\S+@\S+\.\S+/.test(email)) {
      setError('Please enter a valid email address')
      return
    }

    setIsSubmitting(true)

    try {
      const result = await initiateCompanyIdPurchase({
        fullName,
        email,
        userId: '' // Will be set in server action
      })

      if (result.error) {
        setError(result.error)
        setIsSubmitting(false)
        return
      }

      if (result.success && result.purchaseDetails) {
        setPurchaseDetails(result.purchaseDetails)
        setStep('payment')
      }
    } catch (err) {
      setError('An unexpected error occurred')
      console.error(err)
    } finally {
      setIsSubmitting(false)
    }
  }

  const handlePaymentVerification = async () => {
    if (!purchaseDetails) return

    setIsVerifying(true)
    setError('')
    setSuccess('')

    try {
      await sendPaymentVerificationEmail(
        purchaseDetails.reference,
        purchaseDetails.email,
        purchaseDetails.fullName
      )

      const verificationResult = await verifyCompanyIdPayment(purchaseDetails.reference)

      if (verificationResult.error) {
        setError(verificationResult.error)
      } else if (verificationResult.success) {
        setSuccess(verificationResult.message || 'Payment verified successfully!')
        setStep('verification')
      } else {
        setSuccess(verificationResult.message || 'Payment verification request received. Our team will review your transaction.')
        setStep('verification')
      }
    } catch (err) {
      setError('Failed to verify payment')
      console.error(err)
    } finally {
      setIsVerifying(false)
    }
  }

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text)
    setSuccess('Copied to clipboard!')
    setTimeout(() => setSuccess(''), 3000)
  }

  const handleBack = () => {
    if (step === 'payment') {
      setStep('form')
    } else if (step === 'verification') {
      setStep('payment')
    }
    setError('')
    setSuccess('')
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        {/* Header Section */}
        <div className="text-center mb-12">
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="flex justify-center mb-6"
          >
            <div className="relative">
              <div className="w-20 h-20 bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl flex items-center justify-center shadow-lg">
                <FiCreditCard className="text-3xl text-white" />
              </div>
              <div className="absolute -top-2 -right-2 w-8 h-8 bg-green-500 rounded-full flex items-center justify-center shadow-lg">
                <FiCheck className="text-white text-sm" />
              </div>
            </div>
          </motion.div>
          
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            TTradeCapital <span className="text-blue-600">ID Card</span>
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Unlock premium features and enhanced withdrawal capabilities with your verified company identification
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Benefits Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl shadow-lg p-6 sticky top-8">
              <h3 className="text-lg font-semibold text-gray-900 mb-6 flex items-center gap-2">
                <FaRegCheckCircle className="text-green-500" />
                Premium Benefits
              </h3>
              
              <div className="space-y-4">
                {BENEFITS.map((benefit, index) => (
                  <motion.div
                    key={benefit.title}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="flex items-start gap-3 p-3 rounded-lg bg-gray-50 hover:bg-blue-50 transition-colors"
                  >
                    <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                      <benefit.icon className="text-blue-600" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-900 text-sm">{benefit.title}</h4>
                      <p className="text-gray-600 text-xs mt-1">{benefit.description}</p>
                    </div>
                  </motion.div>
                ))}
              </div>

              {/* Pricing Card */}
              <div className="mt-8 p-4 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl text-white">
                <div className="text-center">
                  <div className="text-2xl font-bold">$1,500</div>
                  <div className="text-blue-100 text-sm">One-time Payment</div>
                  <div className="w-12 h-0.5 bg-blue-300 mx-auto my-2"></div>
                  <div className="text-xs text-blue-100">
                    Lifetime Access • No Renewal Fees
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-2xl shadow-lg p-8">
              {/* Progress Steps */}
              <div className="mb-8">
                <div className="flex items-center justify-between mb-4">
                  {(['form', 'payment', 'verification'] as PurchaseStep[]).map((stepName, index) => (
                    <div key={stepName} className="flex items-center flex-1">
                      <div className="flex items-center justify-center relative">
                        <div
                          className={`w-12 h-12 rounded-full flex items-center justify-center border-2 transition-all duration-300 ${
                            step === stepName 
                              ? 'bg-blue-600 border-blue-600 text-white shadow-lg scale-110' 
                              : step === 'verification' || (step === 'payment' && index < 2)
                              ? 'bg-green-500 border-green-500 text-white'
                              : 'border-gray-300 text-gray-500 bg-white'
                          }`}
                        >
                          {step === 'verification' || (step === 'payment' && index < 2) ? (
                            <FiCheck className="text-lg" />
                          ) : (
                            index + 1
                          )}
                        </div>
                        {index < 2 && (
                          <div
                            className={`flex-1 h-1 mx-2 transition-all duration-500 ${
                              step === 'payment' && index === 0 ? 'bg-blue-600' :
                              step === 'verification' ? 'bg-green-500' : 'bg-gray-300'
                            }`}
                          />
                        )}
                      </div>
                    </div>
                  ))}
                </div>
                
                <div className="flex justify-between text-sm font-medium text-gray-600">
                  <span className={step === 'form' ? 'text-blue-600' : ''}>Personal Info</span>
                  <span className={step === 'payment' ? 'text-blue-600' : ''}>Payment</span>
                  <span className={step === 'verification' ? 'text-blue-600' : ''}>Confirmation</span>
                </div>
              </div>

              <AnimatePresence mode="wait">
                <motion.div
                  key={step}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.3 }}
                >
                  {step === 'form' && (
                    <form onSubmit={handlePurchaseSubmit} className="space-y-6">
                      <div className="grid md:grid-cols-2 gap-6">
                        <div>
                          <label htmlFor="fullName" className="block text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
                            <FiUser className="text-blue-500" />
                            Full Legal Name
                          </label>
                          <input
                            type="text"
                            id="fullName"
                            value={fullName}
                            onChange={(e) => setFullName(e.target.value)}
                            className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                            placeholder="Enter your full name as on ID"
                            required
                          />
                        </div>

                        <div>
                          <label htmlFor="email" className="block text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
                            <FiMail className="text-blue-500" />
                            Email Address
                          </label>
                          <input
                            type="email"
                            id="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                            placeholder="Enter your email address"
                            required
                          />
                        </div>
                      </div>

                      <button
                        type="submit"
                        disabled={isSubmitting}
                        className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-4 px-6 rounded-xl hover:from-blue-700 hover:to-purple-700 transition-all duration-200 disabled:opacity-50 flex items-center justify-center gap-3 text-lg font-semibold shadow-lg hover:shadow-xl"
                      >
                        {isSubmitting ? (
                          <>
                            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-white"></div>
                            Processing Request...
                          </>
                        ) : (
                          <>
                            <FiDollarSign className="text-xl" />
                            Proceed to Payment - $1,500
                          </>
                        )}
                      </button>
                    </form>
                  )}

                  {step === 'payment' && purchaseDetails && (
                    <div className="space-y-6">
                      <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-6">
                        <div className="flex items-center gap-3 mb-3">
                          <FaBitcoin className="text-yellow-600 text-xl" />
                          <h3 className="font-semibold text-yellow-800 text-lg">Bitcoin Payment Instructions</h3>
                        </div>
                        <p className="text-yellow-700">
                          Send exactly <strong>$1,500 USD</strong> worth of Bitcoin to the address below. 
                          Your Company ID card will be emailed to you after payment verification.
                        </p>
                      </div>

                      <div className="grid gap-4">
                        <div className="p-5 border border-gray-200 rounded-xl bg-gray-50">
                          <label className="block text-sm font-semibold text-gray-700 mb-3">
                            Reference Number
                          </label>
                          <div className="flex items-center justify-between p-3 bg-white rounded-lg border">
                            <code className="text-sm font-mono text-gray-800">{purchaseDetails.reference}</code>
                            <button
                              type="button"
                              onClick={() => copyToClipboard(purchaseDetails.reference)}
                              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                            >
                              <FiCopy className="text-gray-600" />
                            </button>
                          </div>
                        </div>

                        <div className="p-5 border border-gray-200 rounded-xl bg-gray-50">
                          <label className="text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
                            <FaBitcoin className="text-orange-500" />
                            BTC Wallet Address
                          </label>
                          <div className="flex items-center justify-between p-3 bg-white rounded-lg border">
                            <code className="text-sm font-mono break-all mr-3 text-gray-800">
                              {purchaseDetails.btcWallet}
                            </code>
                            <button
                              type="button"
                              onClick={() => copyToClipboard(purchaseDetails.btcWallet)}
                              className="p-2 hover:bg-gray-100 rounded-lg transition-colors flex-shrink-0"
                            >
                              <FiCopy className="text-gray-600" />
                            </button>
                          </div>
                          <p className="text-xs text-gray-500 mt-2">
                            TTradeCapital Card Management Team • Official BTC Wallet
                          </p>
                        </div>

                        <div className="p-5 border border-gray-200 rounded-xl bg-gray-50">
                          <label className="block text-sm font-semibold text-gray-700 mb-3">
                            Payment Amount
                          </label>
                          <div className="p-4 bg-white rounded-lg border text-center">
                            <div className="text-2xl font-bold text-gray-800">$1,500 USD</div>
                            <p className="text-sm text-gray-600 mt-1">Equivalent Bitcoin amount at current rate</p>
                          </div>
                        </div>
                      </div>

                      <div className="bg-blue-50 border border-blue-200 rounded-xl p-6">
                        <h4 className="font-semibold text-blue-800 mb-3 flex items-center gap-2">
                          <FiClock className="text-blue-600" />
                          Next Steps
                        </h4>
                        <ul className="text-sm text-blue-700 space-y-2">
                          <li className="flex items-center gap-2">
                            <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                            Send exactly $1,500 worth of Bitcoin to the address above
                          </li>
                          <li className="flex items-center gap-2">
                            <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                            Wait for blockchain confirmation (typically 10-30 minutes)
                          </li>
                          <li className="flex items-center gap-2">
                            <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                            Click &apos;I Have Made Payment&apos; below
                          </li>
                          <li className="flex items-center gap-2">
                            <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                            We&apos;ll verify and email your Company ID card
                          </li>
                        </ul>
                      </div>

                      <div className="flex gap-4 pt-4">
                        <button
                          type="button"
                          onClick={handleBack}
                          className="px-8 py-4 border-2 border-gray-300 rounded-xl text-gray-700 hover:bg-gray-50 hover:border-gray-400 transition-all duration-200 flex items-center gap-3 font-semibold"
                        >
                          <FiArrowLeft />
                          Back
                        </button>
                        <button
                          onClick={handlePaymentVerification}
                          disabled={isVerifying}
                          className="flex-1 bg-green-600 text-white py-4 px-8 rounded-xl hover:bg-green-700 transition-all duration-200 disabled:bg-green-400 flex items-center justify-center gap-3 font-semibold shadow-lg hover:shadow-xl"
                        >
                          {isVerifying ? (
                            <>
                              <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-white"></div>
                              Verifying Payment...
                            </>
                          ) : (
                            <>
                              <FiCheck className="text-xl" />
                              I Have Made Payment
                            </>
                          )}
                        </button>
                      </div>
                    </div>
                  )}

                  {step === 'verification' && (
                    <div className="text-center space-y-8">
                      <div className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center mx-auto shadow-lg">
                        <FiCheck className="text-4xl text-green-600" />
                      </div>
                      
                      <div>
                        <h3 className="text-3xl font-bold text-gray-900 mb-4">
                          Verification Request Received
                        </h3>
                        <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                          Thank you for your payment! Our team is currently verifying your transaction.
                        </p>
                      </div>

                      <div className="bg-blue-50 border border-blue-200 rounded-2xl p-6 text-left max-w-2xl mx-auto">
                        <h4 className="font-semibold text-blue-800 text-lg mb-4 flex items-center gap-2">
                          <FiClock className="text-blue-600" />
                          What happens next?
                        </h4>
                        <ul className="text-blue-700 space-y-3">
                          <li className="flex items-start gap-3">
                            <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
                            <span>Our team will verify your Bitcoin transaction on the blockchain</span>
                          </li>
                          <li className="flex items-start gap-3">
                            <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
                            <span>Processing typically takes 1-4 business hours during normal business hours</span>
                          </li>
                          <li className="flex items-start gap-3">
                            <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
                            <span>Your Company ID card will be sent to: <strong className="text-blue-800">{purchaseDetails?.email}</strong></span>
                          </li>
                          <li className="flex items-start gap-3">
                            <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
                            <span>You&apos;ll receive email confirmation once your card is activated</span>
                          </li>
                        </ul>
                      </div>

                      {purchaseDetails && (
                        <div className="p-6 border border-gray-200 rounded-2xl bg-gray-50 max-w-md mx-auto">
                          <div className="text-sm font-semibold text-gray-600 mb-2">Reference Number</div>
                          <div className="font-mono text-xl font-bold text-gray-800">{purchaseDetails.reference}</div>
                          <p className="text-xs text-gray-500 mt-2">Keep this for your records</p>
                        </div>
                      )}

                      <button
                        onClick={handleBack}
                        className="px-8 py-4 border-2 border-gray-300 rounded-xl text-gray-700 hover:bg-gray-50 hover:border-gray-400 transition-all duration-200 flex items-center gap-3 font-semibold mx-auto"
                      >
                        <FiArrowLeft />
                        Back to Payment Details
                      </button>
                    </div>
                  )}
                </motion.div>
              </AnimatePresence>

              {/* Error and Success Messages */}
              <AnimatePresence>
                {error && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="mt-6 p-4 bg-red-50 border border-red-200 rounded-xl text-red-700"
                  >
                    <div className="flex items-center gap-2">
                      <FiClock className="text-red-600 flex-shrink-0" />
                      <div>
                        <div className="font-semibold">Attention Required</div>
                        <div>{error}</div>
                      </div>
                    </div>
                  </motion.div>
                )}
                
                {success && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="mt-6 p-4 bg-green-50 border border-green-200 rounded-xl text-green-700"
                  >
                    <div className="flex items-center gap-2">
                      <FiCheck className="text-green-600 flex-shrink-0" />
                      <div>
                        <div className="font-semibold">Success</div>
                        <div>{success}</div>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}