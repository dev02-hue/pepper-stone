'use server'
import { CryptoType } from '@/types/crypto';
import nodemailer from 'nodemailer';
import { supabase } from '@/lib/supabaseClient'
import { cookies } from 'next/headers'
import { sendDepositEmailToAdmin } from './email'
 
// Define supported cryptocurrencies with their wallet addresses
const CRYPTO_WALLETS = {
  USDC: '0xBD08A48A21bA27CD4F1f48967dfd18F2Ca0E63Cc', // Replace with actual wallet addresses
  USDT: '0x68A26867e2f9727A0035001B5C875a43A7beDAF1',
  DOT: '0x...',
  XRP: 'rNCmBcJ15jnxpsb1or1zsLsetXTiPKoGpF',
  ETH: '0x199b0B3f216948a9BDef4aC3B8152497006f6db0',
  AVAX: 'X-...',
  ADA: 'addr...',
  SOL: '0xBD08A48A21bA27CD4F1f48967dfd18F2Ca0E63Cc',
  BTC: 'bc1qem2t673xk0e5m0dsfcae8uflxk5xs8l7c05jkx',
  BNB: '0x199b0B3f216948a9BDef4aC3B8152497006f6db0'
}
// joker btc
// bc1qqzczapj35lyk5x2r4q54x5wpzjxcch07xlfqs2
// eth
// 0xBD08A48A21-A27CD4F1f48967dfd18F2Ca0E63Cc
// bnb
// 0xBD08A48A21bA27CD4F1f48967dfd18F2Ca0E63Cc
// usdt 
// TBpZLpmHPDUDCFgsyHNNQwbaDdxZEs18FT

// chidera btc
// bc1qem2t673xk0e5m0dsfcae8uflxk5xs8l7c05jkx
// chidera eth

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





export async function approveCryptoDeposit(transactionUuid: string) {
  console.log('[1] Approving transaction with UUID:', transactionUuid);

  const CRYPTO_TO_PROFILE_COLUMN: Record<string, string> = {
    USDC: 'usdcwallet_balance',
    USDT: 'usdtwallet_balance',
    DOT: 'dotwallet_balance',
    XRP: 'xrpwallet_balance',
    ETH: 'ethwallet_balance',
    AVAX: 'avaxwallet_balance',
    ADA: 'adawallet_balance',
    SOL: 'solwallet_balance',
    BTC: 'btcwallet_balance',
    BNB: 'bnbwallet_balance',
  };

  const CRYPTO_TO_COINGECKO_ID: Record<string, string> = {
    USDC: 'usd-coin',
    USDT: 'tether',
    DOT: 'polkadot',
    XRP: 'ripple',
    ETH: 'ethereum',
    AVAX: 'avalanche-2',
    ADA: 'cardano',
    SOL: 'solana',
    BTC: 'bitcoin',
    BNB: 'binancecoin',
  };

  // 1. Fetch transaction
  console.log('[2] Fetching transaction from database...');
  const { data: transaction, error: fetchError } = await supabase
    .from('crypto_transactions')
    .select('*')
    .eq('id', transactionUuid)
    .single();

  if (fetchError || !transaction) {
    console.error('[ERROR] Transaction fetch failed:', fetchError);
    return { error: 'Transaction not found' };
  }

  console.log('[3] Transaction found:', {
    id: transaction.id,
    crypto_type: transaction.crypto_type,
    amount: transaction.amount,
    status: transaction.status
  });

  if (transaction.status !== 'pending') {
    console.log('[WARNING] Transaction already processed with status:', transaction.status);
    return {
      error: 'Transaction already processed',
      currentStatus: transaction.status,
    };
  }

  const cryptoType = transaction.crypto_type;
  console.log('[4] Processing crypto type:', cryptoType);

  const walletColumn = CRYPTO_TO_PROFILE_COLUMN[cryptoType];
  if (!walletColumn) {
    console.error('[ERROR] Unsupported crypto type:', cryptoType);
    return { error: 'Unsupported crypto type' };
  }
  console.log('[5] Wallet column:', walletColumn);

  // 2. Fetch user's trading profile
  console.log('[6] Fetching trading profile for user:', transaction.user_id);
  const { data: profile, error: profileError } = await supabase
    .from('tradingprofile')
    .select('*')
    .eq('id', transaction.user_id)
    .single();

  if (profileError || !profile) {
    console.error('[ERROR] Trading profile not found:', profileError);
    return { error: 'User trading profile not found' };
  }

  try {
    // 3. Convert USD amount to crypto amount
    const coinGeckoId = CRYPTO_TO_COINGECKO_ID[cryptoType];
    console.log('[7] CoinGecko ID:', coinGeckoId, 'for crypto:', cryptoType);
    
    if (!coinGeckoId) {
      console.error('[ERROR] Unsupported crypto type for conversion:', cryptoType);
      return { error: 'Unsupported crypto type for conversion' };
    }

    // Fetch current price
    console.log('[8] Fetching price from CoinGecko for:', coinGeckoId);
    const apiUrl = `https://api.coingecko.com/api/v3/simple/price?ids=${coinGeckoId}&vs_currencies=usd`;
    console.log('[9] CoinGecko API URL:', apiUrl);
    
    const response = await fetch(apiUrl);
    const priceData = await response.json();
    console.log('[10] CoinGecko API response:', JSON.stringify(priceData, null, 2));
    
    const usdPrice = priceData[coinGeckoId]?.usd ?? priceData.tether?.usd;
    if (!usdPrice) {
      console.error('[ERROR] Failed to fetch price data for:', coinGeckoId, 'Response:', priceData);
      return { error: 'Failed to fetch cryptocurrency price' };
    }

    console.log('[11] Current price:', usdPrice, 'USD for', cryptoType);
    const cryptoAmount = transaction.amount / usdPrice;
    console.log('[12] Conversion:', {
      usdAmount: transaction.amount,
      cryptoAmount: cryptoAmount,
      rate: `1 ${cryptoType} = ${usdPrice} USD`
    });

    // 4. Update both balances
    const currentUsdBalance = profile.balance || 0;
    const currentCryptoBalance = profile[walletColumn] || 0;
    
    const newUsdBalance = currentUsdBalance + transaction.amount;
    const newCryptoBalance = currentCryptoBalance + cryptoAmount;

    console.log('[13] Balance updates:', {
      currentUsdBalance,
      newUsdBalance,
      currentCryptoBalance,
      newCryptoBalance
    });

    // Update both balances in a single transaction
    console.log('[14] Updating balances in database...');
    const { error: updateBalanceError } = await supabase
      .from('tradingprofile')
      .update({ 
        balance: newUsdBalance,
        [walletColumn]: newCryptoBalance
      })
      .eq('id', transaction.user_id);

    if (updateBalanceError) {
      console.error('[ERROR] Failed to update balances:', updateBalanceError);
      return { error: 'Balance update failed' };
    }

    // 5. Mark transaction as completed with both amounts
    console.log('[15] Marking transaction as completed...');
    const { error: updateTransactionError } = await supabase
      .from('crypto_transactions')
      .update({
        status: 'completed',
        processed_at: new Date().toISOString(),
        crypto_amount: cryptoAmount,
        amount: transaction.amount
      })
      .eq('id', transactionUuid);

    if (updateTransactionError) {
      console.error('[ERROR] Failed to update transaction:', updateTransactionError);
      
      // Rollback balance updates
      console.log('[16] Attempting balance rollback...');
      await supabase
        .from('tradingprofile')
        .update({ 
          balance: currentUsdBalance,
          [walletColumn]: currentCryptoBalance
        })
        .eq('id', transaction.user_id);

      return { error: 'Transaction update failed after balance update' };
    }

    // 6. Send email notification to user
    console.log('[17] Preparing to send approval email...');
    try {
      const { data: userProfile } = await supabase
        .from('tradingprofile')
        .select('email')
        .eq('id', transaction.user_id)
        .single();

      if (userProfile?.email) {
        const transporter = nodemailer.createTransport({
          service: 'gmail',
          auth: {
            user: process.env.EMAIL_USERNAME,
            pass: process.env.EMAIL_PASSWORD,
          },
        });

        const mailOptions = {
          from: `TTradeCapital <${process.env.EMAIL_USERNAME}>`,
          to: userProfile.email,
          subject: `Deposit Confirmation - ${cryptoAmount.toFixed(6)} ${cryptoType}`,
          html: `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
              <h2 style="color: #2a52be;">Deposit Successfully Processed</h2>
              <p>Dear Valued Client,</p>
              
              <p>We're pleased to confirm that your deposit of <strong>${cryptoAmount.toFixed(6)} ${cryptoType}</strong> 
              (equivalent to $${transaction.amount.toFixed(2)}) has been successfully credited to your TTradeCapital wallet.</p>
              
              <p>Your investment will now begin growing according to your selected portfolio strategy. 
              You can monitor your investment performance directly in your dashboard.</p>
              
              <p>Thank you for trusting TTradeCapital with your investment.</p>
              
              <p style="margin-top: 30px;">Best regards,<br>
              The TTradeCapital Team</p>
              
              <p style="font-size: 12px; color: #666; margin-top: 30px;">
                This is an automated message. Please do not reply directly to this email.
              </p>
            </div>
          `,
        };

        await transporter.sendMail(mailOptions);
        console.log('[18] Approval email sent successfully');
      }
    } catch (emailError) {
      console.error('[WARNING] Failed to send approval email:', emailError);
      // Continue with the approval even if email fails
    }

    console.log('[SUCCESS] Transaction approved and balances updated successfully.');
    return {
      success: true,
      transactionId: transactionUuid,
      userId: transaction.user_id,
      newUsdBalance,
      newCryptoBalance,
      cryptoAmount,
      usdAmount: transaction.amount
    };

  } catch (error) {
    console.error('[ERROR] During conversion:', error);
    return { error: 'Failed to process cryptocurrency conversion' };
  }
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