'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { FiLock, FiKey, FiArrowLeft, FiLoader, FiCheckCircle } from 'react-icons/fi'
import { FaExclamationCircle } from 'react-icons/fa'
import { resetPasswordWithOTP } from '@/lib/auth'
 

interface ResetPasswordWithOTPFormProps {
  email?: string
  phone?: string
  onBack: () => void
}

export default function ResetPasswordWithOTPForm({ 
  email, 
  phone, 
  onBack
}: ResetPasswordWithOTPFormProps) {
  const [otp, setOtp] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [message, setMessage] = useState<{text: string, type: 'success' | 'error'} | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (newPassword !== confirmPassword) {
      setMessage({ text: 'Passwords do not match', type: 'error' })
      return
    }

    setIsSubmitting(true)
    setMessage(null)

    try {
      const result = await resetPasswordWithOTP({
        email,
        phone,
        otp,
        newPassword
      })

      if (result.error) {
        setMessage({ text: result.error, type: 'error' })
      } else {
        setMessage({ 
          text: result.message || 'Password reset successfully!', 
          type: 'success' 
        })
      }
    } catch (err) {
      console.log(err)
      setMessage({ text: 'An unexpected error occurred', type: 'error' })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="max-w-md mx-auto p-8 bg-white rounded-xl shadow-lg border border-gray-100"
    >
      <motion.div 
        className="mb-6"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
      >
        <button
          onClick={onBack}
          className="flex items-center text-orange-600 hover:text-orange-800 text-sm font-medium"
        >
          <FiArrowLeft className="mr-1" />
          Back to Login
        </button>
      </motion.div>

      <motion.h2 
        className="text-3xl font-bold mb-6 text-center text-black"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.1 }}
      >
        Set New Password
      </motion.h2>
      
      <AnimatePresence>
        {message && (
          <motion.div 
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className={`mb-6 p-4 rounded-lg flex items-start ${message.type === 'success' ? 'bg-green-50 text-green-800' : 'bg-red-50 text-red-800'}`}
          >
            {message.type === 'success' ? (
              <FiCheckCircle className="mt-0.5 mr-3 flex-shrink-0" />
            ) : (
              <FaExclamationCircle className="mt-0.5 mr-3 flex-shrink-0" />
            )}
            <span>{message.text}</span>
          </motion.div>
        )}
      </AnimatePresence>

      <form onSubmit={handleSubmit} className="space-y-6">
        <motion.div
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.3 }}
        >
          <label htmlFor="otp" className="block text-sm font-medium text-gray-700 mb-2">
            Reset Code
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <FiKey className="text-gray-400" />
            </div>
            <input
              id="otp"
              type="text"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              className="w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
              required
              maxLength={6}
              placeholder="Enter 6-digit code"
            />
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.3, delay: 0.1 }}
        >
          <label htmlFor="newPassword" className="block text-sm font-medium text-gray-700 mb-2">
            New Password
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <FiLock className="text-gray-400" />
            </div>
            <input
              id="newPassword"
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              className="w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
              required
              minLength={6}
              placeholder="At least 6 characters"
            />
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.3, delay: 0.2 }}
        >
          <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-2">
            Confirm Password
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <FiLock className="text-gray-400" />
            </div>
            <input
              id="confirmPassword"
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
              required
              minLength={6}
              placeholder="Confirm your password"
            />
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="pt-2"
        >
          <motion.button
            type="submit"
            disabled={isSubmitting}
            className={`w-full py-3 px-4 rounded-lg text-white flex items-center justify-center ${
              isSubmitting ? 'bg-orange-400' : 'bg-orange-600 hover:bg-orange-700'
            } focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2`}
            whileHover={!isSubmitting ? { scale: 1.02 } : {}}
            whileTap={!isSubmitting ? { scale: 0.98 } : {}}
          >
            {isSubmitting ? (
              <>
                <FiLoader className="animate-spin mr-2" />
                Resetting...
              </>
            ) : (
              <>
                Reset Password <FiCheckCircle className="ml-2" />
              </>
            )}
          </motion.button>
        </motion.div>
      </form>
    </motion.div>
  )
}