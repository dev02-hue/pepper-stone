'use server'
import { CryptoType } from '@/types/crypto';

import { supabase } from '@/lib/supabaseClient'
import { cookies } from 'next/headers'
import { sendDepositEmailToAdmin } from './email'
 
// Define supported cryptocurrencies with their wallet addresses
const CRYPTO_WALLETS = {
  USDC: '0x...', // Replace with actual wallet addresses
  USDT: '0x...',
  DOT: '0x...',
  XRP: 'r...',
  ETH: '0x...',
  AVAX: 'X-...',
  ADA: 'addr...',
  SOL: '...',
  BTC: 'bc1...',
  BNB: 'bnb...'
}

export async function initiateCryptoDeposit(
  amount: number,
  userEmail: string,
  cryptoType: CryptoType
) {
  console.log('initiateCryptoDeposit called with:', { amount, userEmail, cryptoType })

  const cookieStore = await cookies()
  const userId = cookieStore.get('user_id')?.value
  console.log('Retrieved user ID from cookie:', userId)

  if (!userId) {
    console.log('User not authenticated')
    return { error: 'User not authenticated' }
  }

  if (amount < 300) {
    console.log('Amount too low:', amount)
    return { error: 'Minimum deposit is 300' }
  }

  const reference = `CRYPTO-DEP-${Date.now()}-${Math.floor(Math.random() * 1000)}`
  console.log('Generated reference:', reference)

  // Insert transaction with 'pending' status
  const { data: transaction, error } = await supabase
    .from('crypto_transactions')
    .insert([{
      user_id: userId,
      type: 'deposit',
      crypto_type: cryptoType,
      amount,
      status: 'pending',
      reference,
      user_email: userEmail,
      wallet_address: CRYPTO_WALLETS[cryptoType]
    }])
    .select()
    .single()

  if (error) {
    console.error('Crypto deposit initiation failed:', error)
    return { error: 'Failed to initiate deposit' }
  }

  console.log('Crypto transaction record inserted successfully')

  // Notify admin
  await sendDepositEmailToAdmin({
    userEmail,
    amount,
    reference,
    userId,
    cryptoType,
    transactionId: transaction.id
  })

  return {
    success: true,
    paymentDetails: {
      cryptoType,
      walletAddress: CRYPTO_WALLETS[cryptoType],
      amount,
      reference,
      transactionId: transaction.id
    }
  }
}

export async function approveCryptoDeposit(transactionId: string) {
    // 1. Fetch the transaction first
    const { data: transaction, error: fetchError } = await supabase
      .from('crypto_transactions')
      .select('*')
      .eq('id', transactionId)
      .single();
  
    if (fetchError || !transaction) {
      console.error('Transaction fetch failed:', fetchError);
      return { error: 'Transaction not found' };
    }
  
    // 2. Check if already processed
    if (transaction.status !== 'pending') {
      return { 
        error: 'Transaction already processed',
        currentStatus: transaction.status 
      };
    }
  
    // 3. Update transaction status
    const { error: updateError } = await supabase
      .from('crypto_transactions')
      .update({ 
        status: 'completed', 
        processed_at: new Date().toISOString() 
      })
      .eq('id', transactionId);
  
    if (updateError) {
      console.error('Status update failed:', updateError);
      return { error: 'Failed to approve transaction' };
    }
  
    // 4. Update user's balance
    const { error: balanceError } = await supabase.rpc('increment_crypto_balance', {
      user_id: transaction.user_id,
      crypto_type: transaction.crypto_type,
      amount: transaction.amount
    });
  
    if (balanceError) {
      console.error('Balance update failed:', balanceError);
      
      // Revert transaction status if balance update fails
      await supabase
        .from('crypto_transactions')
        .update({ status: 'pending' })
        .eq('id', transactionId);
  
      return { error: 'Approval failed during balance update' };
    }
  
    return { 
      success: true,
      transactionId,
      newBalance: transaction.amount // You might want to fetch actual new balance
    };
  }
  
  export async function rejectCryptoDeposit(transactionId: string) {
    // 1. Verify transaction exists and is pending
    const { data: transaction, error: fetchError } = await supabase
      .from('crypto_transactions')
      .select('status')
      .eq('id', transactionId)
      .single();
  
    if (fetchError) {
      console.error('Transaction fetch failed:', fetchError);
      return { error: 'Transaction not found' };
    }
  
    if (transaction.status !== 'pending') {
      return { 
        error: 'Transaction already processed',
        currentStatus: transaction.status 
      };
    }
  
    // 2. Update status to rejected
    const { error: updateError } = await supabase
      .from('crypto_transactions')
      .update({ 
        status: 'rejected',
        processed_at: new Date().toISOString() 
      })
      .eq('id', transactionId);
  
    if (updateError) {
      console.error('Rejection failed:', updateError);
      return { error: 'Failed to reject transaction' };
    }
  
    return { 
      success: true,
      transactionId
    };
  }