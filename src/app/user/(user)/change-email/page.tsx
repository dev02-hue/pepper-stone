'use client'

import { useState } from 'react'
import { easyChangeEmail } from '@/lib/auth'
import { useRouter } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import { FiMail, FiLock, FiCheckCircle, FiAlertCircle, FiLoader } from 'react-icons/fi'

export default function EasyEmailChangeForm({ currentEmail }: { currentEmail: string }) {
  const [formData, setFormData] = useState({
    newEmail: '',
    currentPassword: ''
  })
  const [isLoading, setIsLoading] = useState(false)
  const [message, setMessage] = useState<{ text: string; type: 'success' | 'error' } | null>(null)
  const router = useRouter()

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setMessage(null)

    try {
      const result = await easyChangeEmail({
        newEmail: formData.newEmail,
        currentPassword: formData.currentPassword
      })

      if (result.error) {
        setMessage({ text: result.error, type: 'error' })
      } else {
        setMessage({ 
          text: result.message || 'Email changed successfully! Please check your new email for verification.', 
          type: 'success' 
        })
        setFormData({
          newEmail: '',
          currentPassword: ''
        })
        router.refresh()
      }
    } catch (err) {
      console.error('Email change error:', err)
      setMessage({ 
        text: 'An unexpected error occurred. Please try again.', 
        type: 'error' 
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="max-w-md mx-auto p-8 bg-white rounded-xl shadow-lg border border-gray-100"
    >
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
          <FiMail className="text-blue-500" />
          Change Email Address
        </h2>
        <p className="text-gray-500 mt-1 text-sm">Update your account&apos;s email address</p>
      </div>
      
      <div className="mb-6 p-4 bg-blue-50 text-blue-800 rounded-lg border border-blue-100">
        <p className="font-medium flex items-center gap-2">
          <FiMail size={16} />
          Current Email:
        </p>
        <p className="mt-1 text-blue-900 font-mono">{currentEmail}</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-5">
        <div>
          <label htmlFor="newEmail" className="block text-sm font-medium text-gray-700 mb-2">
            New Email Address
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <FiMail className="text-gray-400" />
            </div>
            <input
              type="email"
              id="newEmail"
              name="newEmail"
              value={formData.newEmail}
              onChange={handleChange}
              className="w-full pl-10 pr-3 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
              required
              autoComplete="email"
              placeholder="your.new@email.com"
            />
          </div>
        </div>

        <div>
          <label htmlFor="currentPassword" className="block text-sm font-medium text-gray-700 mb-2">
            Current Password
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <FiLock className="text-gray-400" />
            </div>
            <input
              type="password"
              id="currentPassword"
              name="currentPassword"
              value={formData.currentPassword}
              onChange={handleChange}
              className="w-full pl-10 pr-3 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
              required
              autoComplete="current-password"
              placeholder="••••••••"
            />
          </div>
        </div>

        <AnimatePresence>
          {message && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className={`p-4 rounded-lg flex items-start gap-3 ${
                message.type === 'success' 
                  ? 'bg-green-50 text-green-800 border border-green-100' 
                  : 'bg-red-50 text-red-800 border border-red-100'
              }`}
            >
              {message.type === 'success' ? (
                <FiCheckCircle className="flex-shrink-0 mt-0.5 text-green-500" size={18} />
              ) : (
                <FiAlertCircle className="flex-shrink-0 mt-0.5 text-red-500" size={18} />
              )}
              <span className="text-sm">{message.text}</span>
            </motion.div>
          )}
        </AnimatePresence>

        <motion.button
          type="submit"
          disabled={isLoading}
          whileHover={!isLoading ? { scale: 1.02 } : {}}
          whileTap={!isLoading ? { scale: 0.98 } : {}}
          className={`w-full py-3 px-4 rounded-lg text-white font-medium flex items-center justify-center gap-2 ${
            isLoading 
              ? 'bg-blue-400 cursor-not-allowed' 
              : 'bg-blue-600 hover:bg-blue-700'
          } transition-all focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2`}
        >
          {isLoading ? (
            <>
              <FiLoader className="animate-spin" />
              Updating...
            </>
          ) : (
            'Change Email'
          )}
        </motion.button>
      </form>
    </motion.div>
  )
}