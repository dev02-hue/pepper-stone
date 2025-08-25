'use server'
import { CryptoType } from '@/types/crypto';
import nodemailer from 'nodemailer';
import { supabase } from '@/lib/supabaseClient'
import { cookies } from 'next/headers'
import { sendDepositEmailToAdmin } from './email'
 
// Define supported cryptocurrencies with their wallet addresses
const CRYPTO_WALLETS = {
  USDC: '0xBD08A48A21bA27CD4F1f48967dfd18F2Ca0E63Cc', // Replace with actual wallet addresses
  USDT: 'TKXT3i9ZhVSPKaV6djLu21JWZetPeDHXR5',
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

  // Helper function to fetch with retry logic
  async function fetchWithRetry(url: string, options = {}, retries = 3, delay = 1000): Promise<Response> {
    try {
      const controller = new AbortController();
      const timeout = setTimeout(() => controller.abort(), 5000); // 5 second timeout
      
      const response = await fetch(url, {
        ...options,
        signal: controller.signal
      });
      
      clearTimeout(timeout);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return response;
    } catch (error) {
      if (retries > 0) {
        console.log(`[RETRY] Attempts remaining: ${retries} for URL: ${url}`);
        await new Promise(res => setTimeout(res, delay));
        return fetchWithRetry(url, options, retries - 1, delay * 1.5); // exponential backoff
      }
      throw error;
    }
  }

  try {
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

    // 3. Convert USD amount to crypto amount
    const coinGeckoId = CRYPTO_TO_COINGECKO_ID[cryptoType];
    console.log('[7] CoinGecko ID:', coinGeckoId, 'for crypto:', cryptoType);
    
    if (!coinGeckoId) {
      console.error('[ERROR] Unsupported crypto type for conversion:', cryptoType);
      return { error: 'Unsupported crypto type for conversion' };
    }

    // Fetch current price with retry logic
    console.log('[8] Fetching price from CoinGecko for:', coinGeckoId);
    const apiUrl = `https://api.coingecko.com/api/v3/simple/price?ids=${coinGeckoId}&vs_currencies=usd`;
    console.log('[9] CoinGecko API URL:', apiUrl);
    
    let priceData;
    try {
      const response = await fetchWithRetry(apiUrl);
      priceData = await response.json();
      console.log('[10] CoinGecko API response:', JSON.stringify(priceData, null, 2));
    } catch (fetchError) {
      console.error('[ERROR] Failed to fetch price data:', fetchError);
      return { error: 'Failed to fetch cryptocurrency price after multiple attempts' };
    }
    
    const usdPrice = priceData[coinGeckoId]?.usd;
    if (!usdPrice) {
      console.error('[ERROR] Invalid price data for:', coinGeckoId, 'Response:', priceData);
      return { error: 'Invalid cryptocurrency price data received' };
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
            <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; max-width: 600px; margin: 0 auto; color: #ffffff; background-image: url('https://res.cloudinary.com/dqhllq2ht/image/upload/v1754181342/photo-1563986768711-b3bde3dc821e_o5hj2v.avif'); background-size: cover; padding: 40px; border-radius: 8px; box-shadow: 0 4px 12px rgba(0,0,0,0.15);">
              <div style="background-color: rgba(0, 0, 0, 0.7); padding: 30px; border-radius: 8px;">
                <img src="https://res.cloudinary.com/dqhllq2ht/image/upload/v1754181473/ima_m8am4h.jpg" alt="TTradeCapital Logo" style="max-width: 200px; margin-bottom: 20px;">
                
                <h2 style="color: #4a90e2; margin-top: 0; font-weight: 600;">Deposit Successfully Processed</h2>
                
                <p style="line-height: 1.6;">Dear Valued Investor,</p>
                
                <p style="line-height: 1.6;">We are pleased to inform you that your recent cryptocurrency deposit has been successfully processed and credited to your TTradeCapital investment account. Below are the details of your transaction:</p>
                
                <div style="background-color: rgba(74, 144, 226, 0.1); padding: 15px; border-left: 4px solid #4a90e2; margin: 20px 0;">
                  <p style="margin: 5px 0; font-weight: 500;">Amount Received: <span style="color: #4a90e2;">${cryptoAmount.toFixed(6)} ${cryptoType}</span></p>
                  <p style="margin: 5px 0; font-weight: 500;">USD Equivalent: <span style="color: #4a90e2;">$${transaction.amount.toFixed(2)}</span></p>
                  <p style="margin: 5px 0; font-weight: 500;">Transaction ID: <span style="color: #4a90e2;">${transactionUuid}</span></p>
                  <p style="margin: 5px 0; font-weight: 500;">Processing Date: <span style="color: #4a90e2;">${new Date().toLocaleString()}</span></p>
                </div>
                
                <p style="line-height: 1.6;">Your funds are now actively working for you according to your selected investment strategy. Our advanced algorithms have already begun optimizing your portfolio for maximum returns while maintaining risk parameters appropriate for your investor profile.</p>
                
                <p style="line-height: 1.6;">You may now monitor your investment performance through your personalized dashboard, where you'll find real-time analytics, performance metrics, and detailed reports on your portfolio's activity.</p>
                
                <p style="line-height: 1.6;">Should you have any questions about your investment or wish to adjust your strategy, our dedicated client support team is available 24/7 to assist you.</p>
                
                <p style="line-height: 1.6;">Thank you for choosing TTradeCapital as your trusted investment partner. We appreciate the opportunity to help you achieve your financial goals through innovative cryptocurrency investment solutions.</p>
                
                <div style="margin-top: 30px; border-top: 1px solid rgba(255,255,255,0.1); padding-top: 20px;">
                  <p style="margin: 5px 0;">Best regards,</p>
                  <p style="margin: 5px 0; font-weight: 600;">The TTradeCapital Investment Team</p>
                  <p style="margin: 5px 0; font-size: 12px; color: rgba(255,255,255,0.6);">Digital Asset Management Division</p>
                </div>
                
                <p style="font-size: 11px; color: rgba(255,255,255,0.5); margin-top: 30px; line-height: 1.5;">
                  This message and any attachments are confidential and intended solely for the use of the individual to whom they are addressed. 
                  If you have received this email in error, please notify us immediately and delete it from your system. 
                  TTradeCapital does not accept liability for any unauthorized transactions or changes made to your account.
                </p>
              </div>
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
    console.error('[ERROR] Unexpected error during approval:', error);
    return { error: 'Unexpected error during transaction approval' };
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