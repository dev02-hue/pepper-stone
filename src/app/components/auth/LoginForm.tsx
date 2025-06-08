'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { FcGoogle } from 'react-icons/fc'
import { FaArrowRight } from 'react-icons/fa'
 import Link from 'next/link'
import { signIn } from '@/lib/auth'

const LoginForm = () => {
  const [email, setEmail] = useState('')
  // const [phone, setPhone] = useState('')
  const [password, setPassword] = useState('')
  const [success, setSuccess] = useState(false)

  const [error, setError] = useState<string | null>(null)
  const [status, setStatus] = useState<'idle' | 'loading'>('idle')
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setStatus('loading')
    setError(null)

    try {
      const response = await signIn({ email,  password })

      if (response.error) {
        setError(response.error)
        setStatus('idle')
        return
      }
      setSuccess(true)
      router.push('/user/dashboard')
    } catch (err) {
      console.error('Login error:', err)
      setError('Something went wrong. Please try again.')
    } finally {
      setStatus('idle')
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md bg-white rounded-lg shadow-lg overflow-hidden"
      >
        <div className="p-8">
          <h2 className="text-2xl font-bold text-center text-gray-800 mb-6">
            Login
          </h2>

          {error && (
            <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-md text-sm">
              {error}
            </div>
          )}

{success && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="mb-4 p-3 bg-green-100 text-green-700 rounded-md text-sm"
            >
              Login successful wait a little while we set up your dashboard
            </motion.div>
          )}

          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                Email (optional)
              </label>
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-md"
              />
            </div>

            {/* <div className="mb-4">
              <label htmlFor="phone" className="block text-sm font-medium text-gray-700">
                Phone (optional)
              </label>
              <input
                type="tel"
                id="phone"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-md"
              />
            </div> */}

            <div className="mb-6">
              <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                Password
              </label>
              <input
                type="password"
                id="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-md"
              />
            </div>

            <button
              type="submit"
              disabled={status === 'loading'}
              className={`w-full flex items-center justify-center py-2 px-4 rounded-md text-white font-medium ${
                status === 'loading' ? 'bg-gray-400' : 'bg-[#FD4A36] hover:bg-[#e0412e]'
              }`}
            >
              {status === 'loading' ? 'Signing In...' : <>Sign In <FaArrowRight className="ml-2" /></>}
            </button>
          </form>

          <div className="flex items-center my-6">
            <div className="flex-1 border-t border-gray-300"></div>
            <span className="px-3 text-gray-500">or</span>
            <div className="flex-1 border-t border-gray-300"></div>
          </div>

          <button
            onClick={() => console.log('TODO: Google sign-in')}
            className="w-full flex items-center justify-center py-2 px-4 border border-gray-300 rounded-md bg-white text-gray-700 font-medium hover:bg-gray-50"
          >
            <FcGoogle className="mr-2 text-xl" />
            Sign in with Google
          </button>

          <div className="mt-6 text-center text-sm text-gray-600">
            <Link href="/resetpassword" className="text-[#FD4A36] hover:underline">
              Forgot password?
            </Link>
            <p className="mt-2">
              Don&apos;t have an account?{' '}
              <Link href="/register" className="text-[#FD4A36] hover:underline">
                Sign up
              </Link>
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  )
}

export default LoginForm
