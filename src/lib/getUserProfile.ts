// lib/userProfileActions.ts
"use server"

import { cookies } from 'next/headers';
import { supabase } from './supabaseClient';

// Get single user profile
export async function getUserProfile() {
  const cookieStore = await cookies();
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
      usdcwallet_balance,
      usdtwallet_balance,
      dotwallet_balance,
      xrpwallet_balance,
      ethwallet_balance,
      avaxwallet_balance,
      adawallet_balance,
      solwallet_balance,
      btcwallet_balance,
      bnbwallet_balance,
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

// Get all users (admin functionality)
export async function getAllUsers() {
  const cookieStore = await cookies();
  const userId = cookieStore.get('user_id')?.value;

  if (!userId) {
    return { error: 'signin' };
  }

  // Add admin check here if needed
  // const { data: adminCheck } = await supabase...

  const { data: users, error } = await supabase
    .from('tradingprofile')
    .select(`
      id,
      first_name,
      last_name,
      email,
      phone_number,
      balance,
      usdcwallet_balance,
      usdtwallet_balance,
      dotwallet_balance,
      xrpwallet_balance,
      ethwallet_balance,
      avaxwallet_balance,
      adawallet_balance,
      solwallet_balance,
      btcwallet_balance,
      bnbwallet_balance,
      referral_code,
      referral_level,
      auth_email,
      created_at,
      updated_at
    `)
    .order('created_at', { ascending: false });

  if (error) {
    return { error: error.message };
  }

  return { users };
}

// Update user wallet balances
export async function updateUserBalances(
  userId: string,
  updates: {
    balance?: number;
    usdcwallet_balance?: number;
    usdtwallet_balance?: number;
    dotwallet_balance?: number;
    xrpwallet_balance?: number;
    ethwallet_balance?: number;
    avaxwallet_balance?: number;
    adawallet_balance?: number;
    solwallet_balance?: number;
    btcwallet_balance?: number;
    bnbwallet_balance?: number;
  }
) {
  const cookieStore = await cookies();
  const currentUserId = cookieStore.get('user_id')?.value;

  if (!currentUserId) {
    return { error: 'signin' };
  }

  // Add admin check or ownership check here if needed
  // const { data: adminCheck } = await supabase...

  const { data, error } = await supabase
    .from('tradingprofile')
    .update({
      ...updates,
      updated_at: new Date().toISOString()
    })
    .eq('id', userId)
    .select();

  if (error) {
    return { error: error.message };
  }

  return { success: true, user: data[0] };
}

// Delete user
export async function deleteUser(userId: string) {
  const cookieStore = await cookies();
  const currentUserId = cookieStore.get('user_id')?.value;

  if (!currentUserId) {
    return { error: 'signin' };
  }

  // Add admin check here if needed
  // const { data: adminCheck } = await supabase...

  // First check if user exists
  const { data: user, error: userError } = await supabase
    .from('tradingprofile')
    .select('id')
    .eq('id', userId)
    .single();

  if (userError || !user) {
    return { error: 'User not found' };
  }

  const { error } = await supabase
    .from('tradingprofile')
    .delete()
    .eq('id', userId);

  if (error) {
    return { error: error.message };
  }

  return { success: true };
}