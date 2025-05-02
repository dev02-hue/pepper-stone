'use client'
import { motion } from 'framer-motion'
import { FaArrowRight, FaUser, FaEnvelope, FaLock, FaTicketAlt } from 'react-icons/fa'
import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useAppDispatch, useAppSelector } from '@/redux/hooks'
import { registerUser, resetRegisterStatus } from '@/redux/authSlice'
import { useRouter } from 'next/navigation'

const RegisterForm = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    referralCode: ''
  })
  const [passwordError, setPasswordError] = useState('')
  const dispatch = useAppDispatch()
  const router = useRouter()
  
  const { registerStatus, registerError } = useAppSelector((state) => state.auth)

  useEffect(() => {
    return () => {
      dispatch(resetRegisterStatus())
    }
  }, [dispatch])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))

    // Validate password in real-time
    if (name === 'password') {
      if (value.length < 8) {
        setPasswordError('Password must be at least 8 characters')
      } else if (!/[A-Z]/.test(value)) {
        setPasswordError('Password must contain at least one uppercase letter')
      } else if (!/[0-9]/.test(value)) {
        setPasswordError('Password must contain at least one number')
      } else {
        setPasswordError('')
      }
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (passwordError) return
    
    dispatch(registerUser({
      name: formData.name,
      email: formData.email,
      password: formData.password,
      referralCode: formData.referralCode || undefined
    }))
  }

  // Redirect on successful registration
  useEffect(() => {
    if (registerStatus === 'succeeded') {
      router.push('/dashboard')
    }
  }, [registerStatus, router])

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md bg-white rounded-lg shadow-lg overflow-hidden"
      >
        <div className="p-8">
          <motion.h2 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="text-2xl font-bold text-center text-gray-800 mb-6"
          >
            Create Your Account
          </motion.h2>

          {registerError && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="mb-4 p-3 bg-red-100 text-red-700 rounded-md text-sm"
            >
              {registerError}
            </motion.div>
          )}

          {registerStatus === 'succeeded' && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="mb-4 p-3 bg-green-100 text-green-700 rounded-md text-sm"
            >
              Registration successful! Redirecting...
            </motion.div>
          )}
          
          <form onSubmit={handleSubmit}>
            {/* Name Field */}
            <motion.div
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
              className="mb-4"
            >
              <label htmlFor="name" className="block text-gray-700 text-sm font-medium mb-2">
                Full Name
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FaUser className="text-gray-400" />
                </div>
                <input
                  id="name"
                  name="name"
                  type="text"
                  value={formData.name}
                  onChange={handleChange}
                  className="w-full pl-10 px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#FD4A36]"
                  required
                />
              </div>
            </motion.div>

            {/* Email Field */}
            <motion.div
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.35 }}
              className="mb-4"
            >
              <label htmlFor="email" className="block text-gray-700 text-sm font-medium mb-2">
                Email Address
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FaEnvelope className="text-gray-400" />
                </div>
                <input
                  id="email"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full pl-10 px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#FD4A36]"
                  required
                />
              </div>
            </motion.div>

            {/* Password Field */}
            <motion.div
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4 }}
              className="mb-4"
            >
              <label htmlFor="password" className="block text-gray-700 text-sm font-medium mb-2">
                Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FaLock className="text-gray-400" />
                </div>
                <input
                  id="password"
                  name="password"
                  type="password"
                  value={formData.password}
                  onChange={handleChange}
                  className="w-full pl-10 px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#FD4A36]"
                  required
                />
              </div>
              {passwordError && (
                <p className="mt-1 text-xs text-red-500">{passwordError}</p>
              )}
            </motion.div>

            {/* Referral Code Field */}
            <motion.div
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.45 }}
              className="mb-6"
            >
              <label htmlFor="referralCode" className="block text-gray-700 text-sm font-medium mb-2">
                Referral Code (Optional)
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FaTicketAlt className="text-gray-400" />
                </div>
                <input
                  id="referralCode"
                  name="referralCode"
                  type="text"
                  value={formData.referralCode}
                  onChange={handleChange}
                  className="w-full pl-10 px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#FD4A36]"
                  placeholder="Enter if you have one"
                />
              </div>
            </motion.div>
            
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              type="submit"
              disabled={registerStatus === 'loading' || passwordError !== ''}
              className={`w-full flex items-center justify-center py-2 px-4 rounded-md text-white font-medium ${
                registerStatus === 'loading' || passwordError ? 'bg-gray-400' : 'bg-[#FD4A36] hover:bg-[#e0412e]'
              }`}
            >
              {registerStatus === 'loading' ? (
                'Creating Account...'
              ) : (
                <>
                  Register <FaArrowRight className="ml-2" />
                </>
              )}
            </motion.button>
          </form>
          
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
            className="mt-6 text-center"
          >
            <p className="text-sm text-gray-600">
              Already have an account?{' '}
              <Link href="/login" className="text-[#FD4A36] hover:underline">
                Sign in
              </Link>
            </p>
            <p className="mt-2 text-xs text-gray-500">
              By registering, you agree to our Terms of Service and Privacy Policy
            </p>
          </motion.div>
        </div>
      </motion.div>
    </div>
  )
}

export default RegisterForm