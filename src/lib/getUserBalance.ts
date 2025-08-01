// lib/getUserBalance.ts
'use server';

import { cookies } from 'next/headers';
import { supabase } from './supabaseClient';
import { redirect } from 'next/navigation';

export async function getUserBalance() {
  try {
    const cookieStore =await cookies();
    const userId = cookieStore.get('user_id')?.value;

    if (!userId) {
      redirect('/login');
      return { error: 'Not authenticated' };
    }

    const { data, error } = await supabase
      .from('tradingprofile')
      .select('balance')
      .eq('id', userId)
      .single();

    if (error) {
      console.error('Balance fetch error:', error);
      return { error: 'Failed to fetch balance' };
    }

    if (!data) {
      return { error: 'Balance not found' };
    }

    return { balance: data.balance };
  } catch (err) {
    console.error('Unexpected error in getUserBalance:', err);
    return { error: 'An unexpected error occurred' };
  }
}