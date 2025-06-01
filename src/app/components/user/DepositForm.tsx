'use client'

import { initiateCryptoDeposit } from '@/lib/depositActions'
import { useState } from 'react'
import { CryptoType, CRYPTO_OPTIONS } from '@/types/crypto'

const AMOUNT_OPTIONS = [300, 600, 1200, 1500, 3000, 6000, 10000] as const

interface PaymentDetails {
  amount: number
  cryptoType: CryptoType
  walletAddress: string
  reference: string
  transactionId: string
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

  const handleAmountSelect = (selectedAmount: number) => {
    setAmount(selectedAmount)
    setCustomAmount('')
  }

  const handleCustomAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    if (value === '' || /^\d+$/.test(value)) {
      setCustomAmount(value)
      setAmount(value ? parseInt(value) : null)
    }
  }

  const handleProceed = () => {
    if (!amount) {
      setError('Please select or enter an amount')
      return
    }
    setStep(2)
  }

  const handleCryptoSelect = async () => {
    if (!cryptoType) {
      setError('Please select a cryptocurrency')
      return
    }
    if (!amount) {
      setError('Amount is required')
      return
    }
    
    setIsLoading(true)
    setError('')
    
    try {
      const result = await initiateCryptoDeposit(amount, email, cryptoType)
      
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

  return (
    <div className="max-w-md mx-auto bg-white rounded-lg shadow-md p-6">
      <h2 className="text-2xl font-bold text-center mb-6">Deposit Cryptocurrency</h2>
      
      {step === 1 && (
        <div className="space-y-6">
          <div>
            <h3 className="text-lg font-medium mb-3">Select Amount</h3>
            <div className="grid grid-cols-3 gap-3">
              {AMOUNT_OPTIONS.map((option) => (
                <button
                  key={option}
                  onClick={() => handleAmountSelect(option)}
                  className={`py-2 px-4 rounded-md border ${
                    amount === option ? 'bg-blue-500 text-white' : 'bg-gray-100 hover:bg-gray-200'
                  }`}
                >
                  {option}
                </button>
              ))}
            </div>
            <div className="mt-4">
              <label className="block text-sm font-medium mb-1">Or enter custom amount:</label>
              <input
                type="text"
                value={customAmount}
                onChange={handleCustomAmountChange}
                className="w-full p-2 border rounded-md"
                placeholder="Enter amount"
              />
            </div>
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-1">Email for confirmation:</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full p-2 border rounded-md"
              placeholder="your@email.com"
              required
            />
          </div>
          
          {error && <p className="text-red-500 text-sm">{error}</p>}
          
          <button
            onClick={handleProceed}
            className="w-full bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 transition"
          >
            Proceed to Payment
          </button>
        </div>
      )}
      
      {step === 2 && (
        <div className="space-y-6">
          <h3 className="text-lg font-medium mb-3">Select Cryptocurrency</h3>
          
          <div className="grid grid-cols-2 gap-3">
            {CRYPTO_OPTIONS.map((crypto) => (
              <button
                key={crypto.value}
                onClick={() => setCryptoType(crypto.value)}
                className={`py-3 px-4 rounded-md border flex items-center ${
                  cryptoType === crypto.value ? 'bg-blue-500 text-white' : 'bg-gray-100 hover:bg-gray-200'
                }`}
              >
                <span>{crypto.label}</span>
              </button>
            ))}
          </div>
          
          {error && <p className="text-red-500 text-sm">{error}</p>}
          
          <div className="flex space-x-3">
            <button
              onClick={() => setStep(1)}
              className="flex-1 bg-gray-200 text-gray-800 py-2 px-4 rounded-md hover:bg-gray-300 transition"
            >
              Back
            </button>
            <button
              onClick={handleCryptoSelect}
              disabled={isLoading}
              className="flex-1 bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 transition disabled:opacity-50"
            >
              {isLoading ? 'Processing...' : 'Continue'}
            </button>
          </div>
        </div>
      )}
      
      {step === 3 && paymentDetails && (
        <div className="space-y-6">
          <h3 className="text-lg font-medium mb-3">Deposit Instructions</h3>
          
          <div className="bg-gray-50 p-4 rounded-md">
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="font-medium">Amount:</span>
                <span>{paymentDetails.amount} {paymentDetails.cryptoType}</span>
              </div>
              <div className="flex justify-between">
                <span className="font-medium">Wallet Address:</span>
                <span className="break-all text-right">{paymentDetails.walletAddress}</span>
              </div>
              <div className="flex justify-between">
                <span className="font-medium">Reference:</span>
                <span>{paymentDetails.reference}</span>
              </div>
            </div>
            
            <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded-md">
              <p className="text-sm text-yellow-800">
                <strong>Important:</strong> Send exactly {paymentDetails.amount} {paymentDetails.cryptoType} to the address above. 
                Transactions with different amounts may not be credited.
              </p>
            </div>
          </div>
          
          <button
            onClick={() => {
              alert('Your deposit is being processed. You will receive a confirmation email once approved.')
            }}
            className="w-full bg-green-500 text-white py-2 px-4 rounded-md hover:bg-green-600 transition"
          >
            I Have Made the Payment
          </button>
        </div>
      )}
    </div>
  )
}