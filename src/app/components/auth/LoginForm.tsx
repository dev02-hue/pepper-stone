// src/components/LoginForm.tsx
'use client'
import { motion } from 'framer-motion'
import { FcGoogle } from 'react-icons/fc'
import { FaArrowRight } from 'react-icons/fa'
import { useState } from 'react'
import { signIn } from 'next-auth/react'
import Link from 'next/link'
import { useAppDispatch, useAppSelector } from '@/redux/hooks'
import { loginUser } from '@/redux/authSlice'
import { useRouter } from 'next/navigation'

const LoginForm = () => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const dispatch = useAppDispatch()
  const { status, error } = useAppSelector((state) => state.auth)
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    console.log('[LoginForm] Submitting login with:', { email, password })
  
    try {
      const result = await dispatch(loginUser({ email, password }))
      console.log('[LoginForm] Dispatch result:', result)
  
      if (loginUser.fulfilled.match(result)) {
        console.log('[LoginForm] Login successful:', result.payload)
  
        // Store user data in localStorage
        localStorage.setItem('user', JSON.stringify(result.payload.user))
        router.push('/user/dashboard')
      } else {
        console.warn('[LoginForm] Login failed:', result)
      }
    } catch (err) {
      console.error('[LoginForm] Unexpected error during login:', err)
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
          <motion.h2 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="text-2xl font-bold text-center text-gray-800 mb-6"
          >
            Welcome Back
          </motion.h2>

          {error && (
            <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-md text-sm">
              {error}
            </div>
          )}
          
          <form onSubmit={handleSubmit}>
            <motion.div
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
              className="mb-4"
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
            
            <motion.div
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4 }}
              className="mb-6"
            >
              <label htmlFor="password" className="block text-gray-700 text-sm font-medium mb-2">
                Password
              </label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#FD4A36]"
                required
              />
            </motion.div>
            
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              type="submit"
              disabled={status === 'loading'}
              className={`w-full flex items-center justify-center py-2 px-4 rounded-md text-white font-medium ${
                status === 'loading' ? 'bg-gray-400' : 'bg-[#FD4A36] hover:bg-[#e0412e]'
              }`}
            >
              {status === 'loading' ? (
                'Signing In...'
              ) : (
                <>
                  Sign In <FaArrowRight className="ml-2" />
                </>
              )}
            </motion.button>
          </form>
          
          <div className="flex items-center my-6">
            <div className="flex-1 border-t border-gray-300"></div>
            <span className="px-3 text-gray-500">or</span>
            <div className="flex-1 border-t border-gray-300"></div>
          </div>
          
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => signIn('google')}
            className="w-full flex items-center justify-center py-2 px-4 border border-gray-300 rounded-md bg-white text-gray-700 font-medium hover:bg-gray-50"
          >
            <FcGoogle className="mr-2 text-xl" />
            Sign in with Google
          </motion.button>
          
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
            className="mt-6 text-center"
          >
            <Link href="/resetpassword" className="text-sm text-[#FD4A36] hover:underline">
              Forgot password?
            </Link>
            <p className="mt-2 text-sm text-gray-600">
              Don&apos;t have an account?{' '}
              <Link href="/signup" className="text-[#FD4A36] hover:underline">
                Sign up
              </Link>
            </p>
          </motion.div>
        </div>
      </motion.div>
    </div>
  )
}

export default LoginForm