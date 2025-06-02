"use server"
import { supabase } from '@/lib/supabaseClient'
import { cookies } from 'next/headers'

export async function getCryptoTransactions() {
  // Get user ID from cookies
  const cookieStore = await cookies()
  const userId = cookieStore.get('user_id')?.value

  if (!userId) {
    return { error: 'User not authenticated', transactions: null }
  }

  // Fetch transactions from Supabase
  const { data: transactions, error } = await supabase
    .from('crypto_transactions')
    .select('type, crypto_type, amount, status, reference,created_at')
    .eq('user_id', userId)
    .order('created_at', { ascending: false })

  if (error) {
    console.error('Error fetching crypto transactions:', error)
    return { error: 'Failed to fetch transactions', transactions: null }
  }

  return {
    error: null,
    transactions: transactions || []
  }
}