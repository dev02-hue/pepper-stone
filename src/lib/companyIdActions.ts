"use server"

import { cookies } from 'next/headers'
import { supabase } from './supabaseClient'

const COMPANY_ID_PRICE = 1500
const ADMIN_BTC_WALLET = "bc1qk87m0325wthu6hys6xeut5yr5hdzhymj4u4tfh"  

export interface CompanyIdPurchaseData {
  fullName: string
  email: string
  userId: string
}

export async function initiateCompanyIdPurchase(userData: CompanyIdPurchaseData) {
  const cookieStore = await cookies()
  const userId = cookieStore.get('user_id')?.value

  if (!userId) {
    return { error: 'User not authenticated' }
  }

  // Check if user already has company ID
  const { data: existingProfile, error: profileError } = await supabase
    .from('tradingprofile')
    .select('companyid')
    .eq('id', userId)
    .single()

  if (profileError) {
    return { error: 'Failed to verify account status' }
  }

  if (existingProfile?.companyid) {
    return { error: 'You already have a Company ID card' }
  }

  // Create purchase record
  const reference = `COMPANY-ID-${Date.now()}-${Math.floor(Math.random() * 1000)}`
  
  const { error } = await supabase
    .from('company_id_purchases')
    .insert([{
      user_id: userId,
      full_name: userData.fullName,
      email: userData.email,
      amount: COMPANY_ID_PRICE,
      status: 'pending',
      reference,
      btc_wallet: ADMIN_BTC_WALLET,
      created_at: new Date().toISOString()
    }])
    .select()
    .single()

  if (error) {
    console.error('Failed to create purchase record:', error)
    return { error: 'Failed to initiate purchase' }
  }

  return {
    success: true,
    purchaseDetails: {
      reference,
      amount: COMPANY_ID_PRICE,
      btcWallet: ADMIN_BTC_WALLET,
      fullName: userData.fullName,
      email: userData.email
    }
  }
}

export async function verifyCompanyIdPayment(reference: string) {
  const cookieStore = await cookies()
  const userId = cookieStore.get('user_id')?.value

  if (!userId) {
    return { error: 'User not authenticated' }
  }

  // Check purchase status
  const { data: purchase, error } = await supabase
    .from('company_id_purchases')
    .select('*')
    .eq('reference', reference)
    .eq('user_id', userId)
    .single()

  if (error || !purchase) {
    return { error: 'Purchase record not found' }
  }

  if (purchase.status === 'completed') {
    return { success: true, message: 'Payment already verified. Company ID card is active.' }
  }

  if (purchase.status === 'pending') {
    
    return { 
      success: false, 
      message: 'Payment verification pending. Our team is reviewing your transaction. You will receive an email once verified.' 
    }
  }

  return { error: 'Unable to verify payment status' }
}

export async function sendPaymentVerificationEmail(reference: string, userEmail: string, fullName: string) {
   console.log('Sending payment verification email:', {
    to: 'ttradecapitalstatus@gmail.com',
    subject: `Company ID Card Payment - ${reference}`,
    body: `User ${fullName} (${userEmail}) claims to have made payment for Company ID Card. Reference: ${reference}. Please verify payment.`
  })

  // Simulate email sending
  return { success: true }
}