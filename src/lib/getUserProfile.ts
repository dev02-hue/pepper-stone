// lib/getUserProfile.ts
"use server"

import { cookies } from 'next/headers';
import { supabase } from './supabaseClient';

export async function getUserProfile() {
  const cookieStore =await cookies();
  const userId = cookieStore.get('user_id')?.value;

  if (!userId) {
    return { error: 'signin' };
  }

  const { data: profile, error } = await supabase
    .from('tradingprofile')
    .select(`
      first_name,
      last_name,
      email,
      phone_number,
      balance,
      referral_code,
      referral_level,
      auth_email,
      created_at,
      updated_at
    `)
    .eq('id', userId)
    .single();

  if (error || !profile) {
    return { error: 'Profile not found' };
  }

  return { profile };
}
