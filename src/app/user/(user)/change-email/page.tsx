'use client'

import { useState } from 'react'
import { easyChangeEmail } from '@/lib/auth'
import { useRouter } from 'next/navigation'

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
        // Clear form on success
        setFormData({
          newEmail: '',
          currentPassword: ''
        })
        // Refresh auth state
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
    <div className="max-w-md mx-auto p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-4">Change Email Address</h2>
      
      <div className="mb-4 p-3 bg-blue-50 text-blue-800 rounded">
        <p className="font-medium">Current Email:</p>
        <p>{currentEmail}</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="newEmail" className="block text-sm font-medium text-gray-700 mb-1">
            New Email Address
          </label>
          <input
            type="email"
            id="newEmail"
            name="newEmail"
            value={formData.newEmail}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
            autoComplete="email"
          />
        </div>

        <div>
          <label htmlFor="currentPassword" className="block text-sm font-medium text-gray-700 mb-1">
            Current Password
          </label>
          <input
            type="password"
            id="currentPassword"
            name="currentPassword"
            value={formData.currentPassword}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
            autoComplete="current-password"
          />
        </div>

        {message && (
          <div className={`p-3 rounded-md ${message.type === 'success' 
            ? 'bg-green-50 text-green-800' 
            : 'bg-red-50 text-red-800'}`}>
            {message.text}
          </div>
        )}

        <button
          type="submit"
          disabled={isLoading}
          className={`w-full py-2 px-4 rounded-md text-white font-medium ${
            isLoading 
              ? 'bg-blue-400 cursor-not-allowed' 
              : 'bg-blue-600 hover:bg-blue-700'
          } transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2`}
        >
          {isLoading ? 'Updating...' : 'Change Email'}
        </button>
      </form>
    </div>
  )
}