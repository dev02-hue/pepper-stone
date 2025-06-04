'use client'

import { useState } from 'react'
import { supabase } from '@/lib/supabaseClient'

export default function ChangeEmailForm() {
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setMessage('')
    setError('')
    console.log('🔧 Submitting email update:', email)

    try {
      // Get current user info
      const userResult = await supabase.auth.getUser()
      const userId = userResult.data?.user?.id

      console.log('👤 Supabase user:', userResult.data?.user)

      if (!userId) {
        setError('User not found in session')
        console.error('⛔ User not found in session')
        setLoading(false)
        return
      }

      // 1. Update Auth email
      const { error: updateError } = await supabase.auth.updateUser({
        email,
      })

      if (updateError) {
        console.error('⛔ Auth email update failed:', updateError.message)
        setError('Failed to update email: ' + updateError.message)
        setLoading(false)
        return
      }
      console.log('✅ Email updated in auth successfully')

      // 2. Update profile email
      const { error: profileError } = await supabase
        .from('tradingprofile')
        .update({ email })
        .eq('id', userId)

      if (profileError) {
        console.error('⚠️ Email updated in auth but failed in profile:', profileError.message)
        setError('Failed to update email in profile: ' + profileError.message)
        setLoading(false)
        return
      }

      console.log('✅ Email updated in tradingprofile table')
      setMessage('Email updated successfully')
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : 'Unknown error occurred'
      console.error('⛔ Unexpected error:', errorMessage)
      setError('Unexpected error: ' + errorMessage)
    }

    setLoading(false)
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="max-w-md mx-auto p-4 bg-white rounded-xl shadow-md mt-10"
    >
      <h2 className="text-xl font-bold mb-4 text-center">Change Email</h2>
      <input
        type="email"
        placeholder="Enter new email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        required
      />
      <button
        type="submit"
        disabled={loading}
        className="mt-4 w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition"
      >
        {loading ? 'Updating...' : 'Update Email'}
      </button>

      {message && <p className="text-green-600 mt-3 text-center">{message}</p>}
      {error && <p className="text-red-600 mt-3 text-center">{error}</p>}
    </form>
  )
}
