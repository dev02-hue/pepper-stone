// lib/getUserWalletBalances.ts
'use server';

import { cookies } from 'next/headers';
import { supabase } from './supabaseClient';

export async function getUserWalletBalances() {
  const cookieStore = await cookies();
  const userId = cookieStore.get('user_id')?.value;

  if (!userId) {
    return { error: 'signin' };
  }

  const { data, error } = await supabase
    .from('tradingprofile')
    .select(`
      usdcwallet_balance,
      usdtwallet_balance,
      dotwallet_balance,
      xrpwallet_balance,
      ethwallet_balance,
      avaxwallet_balance,
      adawallet_balance,
      solwallet_balance,
      btcwallet_balance,
      bnbwallet_balance
    `)
    .eq('id', userId)
    .single();

  if (error || !data) {
    return { error: 'Wallet balances not found' };
  }

  return {
    balances: {
      USDC: data.usdcwallet_balance || 0,
      USDT: data.usdtwallet_balance || 0,
      DOT: data.dotwallet_balance || 0,
      XRP: data.xrpwallet_balance || 0,
      ETH: data.ethwallet_balance || 0,
      AVAX: data.avaxwallet_balance || 0,
      ADA: data.adawallet_balance || 0,
      SOL: data.solwallet_balance || 0,
      BTC: data.btcwallet_balance || 0,
      BNB: data.bnbwallet_balance || 0,
    },
  };
}
