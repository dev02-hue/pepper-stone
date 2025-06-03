'use server';

import { supabase } from '@/lib/supabaseClient';
import { cookies } from 'next/headers';
import { CryptoType } from '@/types/crypto';

const getUserIdFromCookies = async (): Promise<string | null> => {
  const cookieStore = await cookies();
  return cookieStore.get('user_id')?.value ?? null;
};

const getWalletField = (cryptoType: CryptoType): string => {
  return `${cryptoType.toLowerCase()}wallet_address`;
};

export async function createOrUpdateWallet(cryptoType: CryptoType, walletAddress: string) {
  const userId = await getUserIdFromCookies();
  if (!userId) {
    return { error: 'User not authenticated' };
  }

  const walletField = getWalletField(cryptoType);

  const { error } = await supabase
    .from('tradingprofile')
    .update({ [walletField]: walletAddress })
    .eq('id', userId);

  if (error) {
    console.error('Failed to create/update wallet:', error);
    return { error: 'Database update failed' };
  }

  return { success: true, cryptoType, walletAddress };
}

export async function deleteWallet(cryptoType: CryptoType) {
  const userId = await getUserIdFromCookies();
  if (!userId) {
    return { error: 'User not authenticated' };
  }

  const walletField = getWalletField(cryptoType);

  const { error } = await supabase
    .from('tradingprofile')
    .update({ [walletField]: null })
    .eq('id', userId);

  if (error) {
    console.error('Failed to delete wallet:', error);
    return { error: 'Database update failed' };
  }

  return { success: true, cryptoType };
}

export async function getWallets() {
  const userId = await getUserIdFromCookies();
  if (!userId) {
    return { error: 'User not authenticated' };
  }

  const { data: profile, error } = await supabase
    .from('tradingprofile')
    .select('*')
    .eq('id', userId)
    .single();

  if (error || !profile) {
    console.error('Failed to fetch trading profile:', error);
    return { error: 'User profile not found' };
  }

  // Return only wallet address fields
  const walletAddresses: Record<string, string | null> = {};
  Object.entries(profile).forEach(([key, value]) => {
    if (key.endsWith('wallet_address')) {
      walletAddresses[key] = value as string | null;
    }
  });

  return { success: true, wallets: walletAddresses };
}
