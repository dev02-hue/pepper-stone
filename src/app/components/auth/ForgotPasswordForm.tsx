'use client'

import { sendPasswordResetOTP } from '@/lib/auth'
import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { FiMail, FiPhone, FiArrowRight, FiLoader } from 'react-icons/fi'
import { FaExclamationCircle, FaCheckCircle } from 'react-icons/fa'

interface ForgotPasswordFormProps {
  onSuccess: (email?: string, phone?: string) => void
}

export default function ForgotPasswordForm({ onSuccess }: ForgotPasswordFormProps) {
  const [email, setEmail] = useState('')
  const [phone, setPhone] = useState('')
  const [message, setMessage] = useState<{text: string, type: 'success' | 'error'} | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [showPhone, setShowPhone] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    setMessage(null)

    try {
      const result = await sendPasswordResetOTP({
        email: showPhone ? undefined : email,
        phone: showPhone ? phone : undefined
      })

      if (result.error) {
        setMessage({ text: result.error, type: 'error' })
      } else {
        setMessage({ 
          text: result.message || 'Reset code sent successfully', 
          type: 'success' 
        })
        onSuccess(showPhone ? undefined : email, showPhone ? phone : undefined)
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
      <motion.h2 
        className="text-3xl font-bold mb-8 text-center text-black"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.1 }}
      >
        Reset Password
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
              <FaCheckCircle className="mt-0.5 mr-3 flex-shrink-0" />
            ) : (
              <FaExclamationCircle className="mt-0.5 mr-3 flex-shrink-0" />
            )}
            <span>{message.text}</span>
          </motion.div>
        )}
      </AnimatePresence>

      <form onSubmit={handleSubmit} className="space-y-6">
        <motion.div
          key={showPhone ? 'phone' : 'email'}
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.3 }}
        >
          {!showPhone ? (
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                Email Address
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FiMail className="text-gray-400" />
                </div>
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                  required
                  placeholder="your@email.com"
                />
              </div>
            </div>
          ) : (
            <div>
              <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-2">
                Phone Number
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FiPhone className="text-gray-400" />
                </div>
                <input
                  id="phone"
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                  required
                  placeholder="+1 (123) 456-7890"
                />
              </div>
            </div>
          )}
        </motion.div>

        <motion.button
          type="button"
          onClick={() => setShowPhone(!showPhone)}
          className="text-sm text-orange-600 hover:text-orange-800 flex items-center"
          whileHover={{ x: 2 }}
        >
          {showPhone ? (
            <>
              <FiMail className="mr-1" /> Use email instead
            </>
          ) : (
            <>
              <FiPhone className="mr-1" /> Use phone instead
            </>
          )}
        </motion.button>

        <motion.button
          type="submit"
          disabled={isSubmitting}
          className={`w-full py-3 px-4 rounded-lg text-white flex items-center justify-center ${isSubmitting ? 'bg-orange-400' : 'bg-orange-600 hover:bg-orange-700'} focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2`}
          whileHover={!isSubmitting ? { scale: 1.02 } : {}}
          whileTap={!isSubmitting ? { scale: 0.98 } : {}}
        >
          {isSubmitting ? (
            <>
              <FiLoader className="animate-spin mr-2" />
              Sending...
            </>
          ) : (
            <>
              Send Reset Code <FiArrowRight className="ml-2" />
            </>
          )}
        </motion.button>
      </form>
    </motion.div>
  )
}