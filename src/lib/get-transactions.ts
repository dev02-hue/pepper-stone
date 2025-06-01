// lib/actions/get-transactions.ts
'use server';

import { cookies } from 'next/headers';
import { supabase } from '@/lib/supabaseClient';

export async function getTransactions() {
  // Check if user is logged in
  const userCookies = await cookies();
  const userId = userCookies.get('user_id')?.value;
  if (!userId) return { error: 'Please login first' };

  // Fetch all pending transactions
  const { data, error } = await supabase
    .from('crypto_transactions')
    .select('*')
    .eq('status', 'pending')
    .order('created_at', { ascending: false });

  if (error) return { error: 'Failed to load transactions' };
  
  return { data };
}