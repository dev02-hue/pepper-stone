'use client'
import { motion } from 'framer-motion'
import { FaPaperPlane, FaArrowLeft, FaCheckCircle } from 'react-icons/fa'
import { useState } from 'react'
import Link from 'next/link'
import axios from 'axios'

const ForgotPasswordForm = () => {
  const [email, setEmail] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [message, setMessage] = useState<{ text: string; type: 'success' | 'error' } | null>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setMessage(null)
    
    try {
      // Replace with your actual API endpoint
      await axios.post('https://pepper-be.onrender.com/auth/forgot-password', { email })
      setIsSubmitted(true)
      setMessage({ text: 'Password reset link sent to your email!', type: 'success' })
    } catch (err) {
        console.error('[Forgot Password] Error:', err)
      setMessage({ 
        text: 'Error sending reset link. Please try again.', 
        type: 'error' 
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center  p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md bg-white rounded-lg shadow-lg overflow-hidden"
      >
        <div className="p-8">
          <Link href="/login" className="flex items-center text-[#FD4A36] mb-4">
            <FaArrowLeft className="mr-2" />
            Back to Login
          </Link>

          <motion.h2 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="text-2xl font-bold text-center text-gray-800 mb-2"
          >
            Forgot Password?
          </motion.h2>
          
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="text-gray-600 text-center mb-6"
          >
            {isSubmitted 
              ? "Check your email for the reset link" 
              : "Enter your email to receive a password reset link"}
          </motion.p>

          {/* Message Display */}
          {message && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className={`mb-4 p-3 rounded-md text-sm ${
                message.type === 'success' 
                  ? 'bg-green-100 text-green-700' 
                  : 'bg-red-100 text-red-700'
              }`}
            >
              {message.type === 'success' && (
                <FaCheckCircle className="inline mr-2" />
              )}
              {message.text}
            </motion.div>
          )}

          {!isSubmitted ? (
            <form onSubmit={handleSubmit}>
              <motion.div
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.4 }}
                className="mb-6"
              >
                <label htmlFor="email" className="block text-gray-700 text-sm font-medium mb-2">
                  Email Address
                </label>
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#FD4A36]"
                  required
                />
              </motion.div>
              
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                type="submit"
                disabled={isLoading}
                className={`w-full flex items-center justify-center py-2 px-4 rounded-md text-white font-medium ${
                  isLoading ? 'bg-gray-400' : 'bg-[#FD4A36] hover:bg-[#e0412e]'
                }`}
              >
                {isLoading ? (
                  'Sending...'
                ) : (
                  <>
                    Send Reset Link <FaPaperPlane className="ml-2" />
                  </>
                )}
              </motion.button>
            </form>
          ) : (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
              className="text-center"
            >
              <motion.div
                animate={{ 
                  scale: [1, 1.1, 1],
                  rotate: [0, 5, -5, 0]
                }}
                transition={{ duration: 0.5 }}
                className="text-5xl text-[#FD4A36] mb-4"
              >
                ✉️
              </motion.div>
              <p className="text-gray-600 mb-6">
                We&apos;ve sent instructions to <span className="font-semibold">{email}</span>. 
                Please check your inbox and follow the link to reset your password.
              </p>
              <button
                onClick={() => {
                  setIsSubmitted(false)
                  setMessage(null)
                }}
                className="text-[#FD4A36] hover:underline"
              >
                Resend email
              </button>
            </motion.div>
          )}

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
            className="mt-6 text-center text-sm text-gray-500"
          >
            Need help? <Link href="/contact" className="text-[#FD4A36] hover:underline">Contact support</Link>
          </motion.div>
        </div>
      </motion.div>
    </div>
  )
}

export default ForgotPasswordForm