// lib/getUserBalance.ts
'use server';

import { cookies } from 'next/headers';
import { supabase } from './supabaseClient';

export async function getUserBalance() {
  const cookieStore =await cookies();  
  const userId = cookieStore.get('user_id')?.value;

  if (!userId) {
    return { error: 'signin' };
  }

  const { data, error } = await supabase
    .from('tradingprofile')
    .select('balance')
    .eq('id', userId)
    .single();

  if (error || !data) {
    return { error: 'Balance not found' };
  }

  return { balance: data.balance };
}
