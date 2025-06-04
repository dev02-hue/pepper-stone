'use server'

import { supabase } from '@/lib/supabaseClient'
import { cookies } from 'next/headers'
import { v4 as uuidv4 } from 'uuid'

type SignInInput = {
    email?: string
    phone?: string
    password: string
  }
 
  
  export async function signUp({
    email,
    phone,
    password,
    firstName,
    lastName,
    referredCode,
  }: {
    email?: string
    phone?: string
    password: string
    firstName: string
    lastName: string
    referredCode?: string
  }) {
    // 1. Validate input
    if (!email && !phone) return { error: 'Email or phone is required' }
    if (password.length < 8) return { error: 'Password must be at least 8 characters long' }
  
    // 2. Generate auth email (required by Supabase)
    const authEmail = email || `${uuidv4().split('-')[0]}_${phone}@temp.domain`
  
    // 3. Create user in Supabase Auth
    const { data, error } = await supabase.auth.signUp({
      email: authEmail,
      password,
      options: {
        data: {
          first_name: firstName,
          last_name: lastName,
        },
      },
    })
  
    if (error || !data?.user) {
      return { error: error?.message || 'Signup failed' }
    }
  
    const userId = data.user.id
    const referralCode = uuidv4().split('-')[0] + userId.slice(0, 4)
  
    // 4. Initialize referral tracking
    let referredByUserId: string | null = null
    let referralLevel = 0
  
    // 5. Process referral
    if (referredCode) {
      const { data: referrerProfile, error: referralError } = await supabase
        .from('tradingprofile')
        .select('id, referral_level')
        .eq('referral_code', referredCode)
        .single()
  
      if (!referralError && referrerProfile?.id) {
        referredByUserId = referrerProfile.id
  
        if (referredByUserId === userId) {
          await supabase.auth.admin.deleteUser(userId)
          return { error: 'Cannot refer yourself' }
        }
  
        referralLevel = (referrerProfile.referral_level || 0) + 1
      }
    }
  
    // 6. Insert user profile
    const now = new Date().toISOString()
    const { error: profileError } = await supabase.from('tradingprofile').insert([{
      id: userId,
      first_name: firstName,
      last_name: lastName,
      email: email || null,
      phone_number: phone || null,
      balance: 10,
      referral_code: referralCode,
      referred_by: referredByUserId,
      referral_level: referralLevel,
      is_phone_user: !email,
      auth_email: authEmail,
      created_at: now,
      updated_at: now,
    }])
  
    if (profileError) {
      await supabase.auth.admin.deleteUser(userId)
      return { error: 'Failed to create profile: ' + profileError.message }
    }
  
    // 7. Create referral records
    if (referredByUserId) {
      const { error: level1Error } = await supabase.from('referrals').insert([{
        referrer_id: referredByUserId,
        referee_id: userId,
        level: 1,
        created_at: now,
      }])
  
      if (level1Error) console.error('Level 1 referral creation failed:', level1Error)
  
      const { data: indirectReferrer, error: indirectError } = await supabase
        .from('referrals')
        .select('referrer_id')
        .eq('referee_id', referredByUserId)
        .single()
  
      if (!indirectError && indirectReferrer?.referrer_id) {
        const { error: level2Error } = await supabase.from('referrals').insert([{
          referrer_id: indirectReferrer.referrer_id,
          referee_id: userId,
          level: 2,
          created_at: now,
        }])
        if (level2Error) console.error('Level 2 referral creation failed:', level2Error)
      }
    }
  
    // 8. Return final result
    return {
      user: data.user,
      session: data.session,
      referralCode,
      referredBy: referredByUserId,
      message: 'Signup successful',
    }
  }
  

export async function signIn({ email, phone, password }: SignInInput) {
    // Validate input
    if (!email && !phone) return { error: 'Email or phone is required' }
    if (!password) return { error: 'Password is required' }
  
    try {
      let authEmail = email;
      
      // Handle phone login
      if (phone) {
        console.log('Attempting phone login for:', phone)
        
        // 1. Find the user's profile to get their UUID
        const { data: profile, error: profileError } = await supabase
          .from('tradingprofile')
          .select('id, phone_number, auth_email')
          .eq('phone_number', phone)
          .single()
  
        if (profileError || !profile) {
          console.error('Phone lookup failed:', profileError?.message || 'No profile found')
          return { error: 'Invalid phone number or password' }
        }
  
        // 2. Reconstruct the EXACT temp email used during signup
        // Matches your signup format: `${uuidv4().split('-')[0]}_${phone}@temp.domain`
        authEmail = profile.auth_email
        if (!authEmail) {
          return { error: 'Phone-based login not supported for this user' }
        }
        console.log('Reconstructed email for phone login:', authEmail)
      }
  
      // 3. Attempt authentication
      console.log('Attempting auth with email:', authEmail)
      const { data, error } = await supabase.auth.signInWithPassword({
        email: authEmail!,
        password
      })
  
      if (error) {
        console.error('Authentication failed:', error.message)
        return { error: 'Invalid credentials' }
      }
  
      // 4. Handle session
      const sessionToken = data.session?.access_token
      const refreshToken = data.session?.refresh_token
      const userId = data.user?.id
  
      if (!sessionToken || !refreshToken || !userId) {
        console.error('Incomplete session data')
        return { error: 'Failed to create session' }
      }
  
      // 5. Set cookies
      const cookieStore =await cookies()
      const oneYear = 31536000 // 1 year in seconds
  
      cookieStore.set('sb-access-token', sessionToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        maxAge: oneYear,
        path: '/',
        sameSite: 'lax',
      })
  
      cookieStore.set('sb-refresh-token', refreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        maxAge: oneYear,
        path: '/',
        sameSite: 'lax',
      })
  
      cookieStore.set('user_id', userId, {
        httpOnly: false,
        secure: process.env.NODE_ENV === 'production',
        maxAge: oneYear,
        path: '/',
        sameSite: 'lax',
      })
  
      console.log('Login successful for user:', userId)
      return {
        user: data.user,
        session: data.session,
        message: 'Login successful'
      }
  
    } catch (err) {
      console.error('Unexpected login error:', err)
      return { error: 'An unexpected error occurred' }
    }
  }


  // Add this to your auth.ts file (server-side)

export async function changeEmail({
  userId,
  newEmail,
}: {
  userId: string
  newEmail: string
}) {
  // 1. Validate input
  if (!newEmail || !newEmail.includes('@')) {
    return { error: 'Valid email is required' }
  }

  try {
    // 2. Get the current email from tradingprofile
    const { data: profile, error: profileError } = await supabase
      .from('tradingprofile')
      .select('email, auth_email')
      .eq('id', userId)
      .single()

    if (profileError || !profile) {
      return { error: 'User profile not found' }
    }

    const currentEmail = profile.email

    // 3. Check if the new email is different
    if (currentEmail === newEmail) {
      return { error: 'New email must be different from current email' }
    }

    // 4. Check if email is already in use by another user
    const { data: existingUser, error: emailCheckError } = await supabase
      .from('tradingprofile')
      .select('id')
      .eq('email', newEmail)
      .neq('id', userId)
      .single()

    if (emailCheckError && emailCheckError.code !== 'PGRST116') { // Ignore "no rows found" error
      return { error: 'Error checking email availability' }
    }

    if (existingUser) {
      return { error: 'Email is already in use by another account' }
    }

    // 5. Update email in auth.users table (if using email auth)
    if (profile.auth_email && profile.auth_email.includes('@')) {
      const { error: authError } = await supabase.auth.admin.updateUserById(userId, {
        email: newEmail,
      })

      if (authError) {
        return { error: 'Failed to update authentication email' }
      }
    }

    // 6. Update email in tradingprofile
    const { error: updateError } = await supabase
      .from('tradingprofile')
      .update({ email: newEmail, updated_at: new Date().toISOString() })
      .eq('id', userId)

    if (updateError) {
      return { error: 'Failed to update profile email' }
    }

    return { success: true, message: 'Email updated successfully' }
  } catch (err) {
    console.error('Error changing email:', err)
    return { error: 'An unexpected error occurred' }
  }
}