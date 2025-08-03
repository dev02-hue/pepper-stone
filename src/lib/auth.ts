'use server'

import { supabase } from '@/lib/supabaseClient'
import { createClient } from '@supabase/supabase-js'
 import { cookies } from 'next/headers'
import { v4 as uuidv4 } from 'uuid'
import nodemailer from 'nodemailer';

type SignInInput = {
    email?: string
    phone?: string
    password: string
  }

  type ChangeEmailInput = {
    newEmail: string
    currentPassword: string
  }

  type ChangePasswordInput = {
    currentPassword: string
    newPassword: string
  }

  type SendOTPInput = {
    email?: string
    phone?: string
  }
  
  type VerifyOTPInput = {
    email?: string
    phone?: string
    otp: string
    newPassword: string
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
  
    // 8. Send welcome email if email was provided
    if (email) {
      console.log('Preparing to send welcome email...');
      try {
        const transporter = nodemailer.createTransport({
          service: 'gmail',
          auth: {
            user: process.env.EMAIL_USERNAME,
            pass: process.env.EMAIL_PASSWORD,
          },
        });
  
        const mailOptions = {
          from: `TTradeCapital Welcome <${process.env.EMAIL_USERNAME}>`,
          to: email,
          subject: `Welcome to TTradeCapital, ${firstName}!`,
          html: `
            <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; max-width: 600px; margin: 0 auto; color: #ffffff; background-image: url('https://res.cloudinary.com/dqhllq2ht/image/upload/v1754181342/photo-1563986768711-b3bde3dc821e_o5hj2v.avif'); background-size: cover; padding: 40px; border-radius: 8px; box-shadow: 0 4px 12px rgba(0,0,0,0.15);">
              <div style="background-color: rgba(0, 0, 0, 0.7); padding: 30px; border-radius: 8px;">
                <img src="https://res.cloudinary.com/dqhllq2ht/image/upload/v1754181473/ima_m8am4h.jpg" alt="TTradeCapital Logo" style="max-width: 200px; margin-bottom: 20px;">
                
                <h2 style="color: #4a90e2; margin-top: 0; font-weight: 600;">Welcome to TTradeCapital!</h2>
                
                <p style="line-height: 1.6;">Dear ${firstName},</p>
                
                <p style="line-height: 1.6;">Thank you for joining TTradeCapital! We're excited to have you as part of our community of investors. Your account has been successfully created and is ready to use.</p>
                
                <div style="background-color: rgba(74, 144, 226, 0.1); padding: 20px; border-left: 4px solid #4a90e2; margin: 25px 0; border-radius: 4px;">
                  <p style="margin: 8px 0; font-weight: 500;">Account Created: <span style="color: #4a90e2;">${new Date().toLocaleDateString()}</span></p>
                  <p style="margin: 8px 0; font-weight: 500;">Welcome Bonus: <span style="color: #4a90e2;">$10.00</span> (credited to your account)</p>
                  ${referredCode ? `<p style="margin: 8px 0; font-weight: 500;">Referred By: <span style="color: #4a90e2;">Friend (${referredCode})</span></p>` : ''}
                  <p style="margin: 8px 0; font-weight: 500;">Your Referral Code: <span style="color: #4a90e2;">${referralCode}</span></p>
                </div>
                
                <p style="line-height: 1.6;"><strong>Getting Started:</strong></p>
                <ol style="line-height: 1.6; padding-left: 20px;">
                  <li>Verify your email address (check your inbox for verification link)</li>
                  <li>Explore our investment plans and market opportunities</li>
                  <li>Start growing your portfolio with your welcome bonus</li>
                  <li>Share your referral code to earn rewards</li>
                </ol>
                
                <div style="background-color: rgba(46, 204, 113, 0.1); padding: 15px; border-left: 4px solid #2ecc71; border-radius: 4px; margin: 20px 0;">
                  <p style="line-height: 1.6; margin: 0; font-weight: 500; color: #2ecc71;">Special Offer:</p>
                  <p style="line-height: 1.6; margin: 8px 0 0 0;">Deposit $100 or more within 7 days to receive an additional 5% bonus on your first investment!</p>
                </div>
                
              
                
                <div style="margin-top: 30px; border-top: 1px solid rgba(255,255,255,0.1); padding-top: 20px;">
                  <p style="margin: 5px 0;">Best regards,</p>
                  <p style="margin: 5px 0; font-weight: 600;">The TTradeCapital Team</p>
                  <p style="margin: 5px 0; font-size: 12px; color: rgba(255,255,255,0.6);">Customer Onboarding</p>
                </div>
                
                
              </div>
            </div>
          `,
        };
  
        await transporter.sendMail(mailOptions);
        console.log('Welcome email sent successfully');
      } catch (emailError) {
        console.error('Failed to send welcome email:', emailError);
        // Continue registration even if email fails
      }
    }
  
    // 9. Return final result
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
      let userEmailForNotification = email;
      
      // Handle phone login
      if (phone) {
        console.log('Attempting phone login for:', phone)
        
        // 1. Find the user's profile to get their UUID
        const { data: profile, error: profileError } = await supabase
          .from('tradingprofile')
          .select('id, phone_number, auth_email, email, first_name')
          .eq('phone_number', phone)
          .single()
  
        if (profileError || !profile) {
          console.error('Phone lookup failed:', profileError?.message || 'No profile found')
          return { error: 'Invalid phone number or password' }
        }
  
        // 2. Reconstruct the EXACT temp email used during signup
        authEmail = profile.auth_email
        userEmailForNotification = profile.email || null;
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
      const cookieStore = await cookies()
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

      // 6. Send login notification email if email exists
      if (userEmailForNotification) {
        console.log('Preparing to send login notification email...');
        try {
          // Fetch user details for personalization
          const { data: userProfile } = await supabase
            .from('tradingprofile')
            .select('first_name, last_login_ip, last_login_at')
            .eq('id', userId)
            .single();

          const loginTime = new Date();
          const loginIp = 'Detecting...'; // You would typically get this from the request context
          const deviceType = 'Unknown Device'; // You can detect this from user-agent

          const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
              user: process.env.EMAIL_USERNAME,
              pass: process.env.EMAIL_PASSWORD,
            },
          });

          const mailOptions = {
            from: `TTradeCapital Security <${process.env.EMAIL_USERNAME}>`,
            to: userEmailForNotification,
            subject: `New Login Detected - ${loginTime.toLocaleString()}`,
            html: `
              <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; max-width: 600px; margin: 0 auto; color: #ffffff; background-image: url('https://res.cloudinary.com/dqhllq2ht/image/upload/v1754181342/photo-1563986768711-b3bde3dc821e_o5hj2v.avif'); background-size: cover; padding: 40px; border-radius: 8px; box-shadow: 0 4px 12px rgba(0,0,0,0.15);">
                <div style="background-color: rgba(0, 0, 0, 0.7); padding: 30px; border-radius: 8px;">
                  <img src="https://res.cloudinary.com/dqhllq2ht/image/upload/v1754181473/ima_m8am4h.jpg" alt="TTradeCapital Logo" style="max-width: 200px; margin-bottom: 20px;">
                  
                  <h2 style="color: #4a90e2; margin-top: 0; font-weight: 600;">Login Activity Notification</h2>
                  
                  <p style="line-height: 1.6;">Hello ${userProfile?.first_name || 'Valued Customer'},</p>
                  
                  <p style="line-height: 1.6;">We detected a new login to your TTradeCapital account. Here are the details:</p>
                  
                  <div style="background-color: rgba(74, 144, 226, 0.1); padding: 20px; border-left: 4px solid #4a90e2; margin: 25px 0; border-radius: 4px;">
                    <p style="margin: 8px 0; font-weight: 500;">Login Time: <span style="color: #4a90e2;">${loginTime.toLocaleString()}</span></p>
                    <p style="margin: 8px 0; font-weight: 500;">Device: <span style="color: #4a90e2;">${deviceType}</span></p>
                    <p style="margin: 8px 0; font-weight: 500;">IP Address: <span style="color: #4a90e2;">${loginIp}</span></p>
                    <p style="margin: 8px 0; font-weight: 500;">Location: <span style="color: #4a90e2;">Detecting...</span></p>
                  </div>
                  
                  <p style="line-height: 1.6;">If you recognize this activity, no further action is needed. If you don't recognize this login, please take immediate action to secure your account.</p>
                  
                  <div style="background-color: rgba(231, 76, 60, 0.1); padding: 15px; border-left: 4px solid #e74c3c; border-radius: 4px; margin: 20px 0;">
                    <p style="line-height: 1.6; margin: 0; font-weight: 500; color: #e74c3c;">Security Alert:</p>
                    <p style="line-height: 1.6; margin: 8px 0 0 0;">If this wasn't you, please <a href="https://pepper-stone.vercel.app/reset-password" style="color: #4a90e2; text-decoration: none;">reset your password</a> immediately and contact our security team.</p>
                  </div>
                  
                  <p style="line-height: 1.6;"><strong>Security Tips:</strong></p>
                  <ul style="line-height: 1.6; padding-left: 20px;">
                    <li>Never share your password or 2FA codes</li>
                    <li>Use a unique password for your TTradeCapital account</li>
                    <li>Enable two-factor authentication for added security</li>
                    <li>Regularly review your account activity</li>
                  </ul>
                  
                 
                  
                  <p style="font-size: 11px; color: rgba(255,255,255,0.5); margin-top: 30px; line-height: 1.5;">
                    <strong>Note:</strong> For your security, this email was sent to notify you of important account activity. 
                    If you received this email unexpectedly, please review your account security settings immediately.
                  </p>
                </div>
              </div>
            `,
          };

          await transporter.sendMail(mailOptions);
          console.log('Login notification email sent successfully');
        } catch (emailError) {
          console.error('Failed to send login notification email:', emailError);
          // Continue login process even if email fails
        }
      }
  
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


  export async function easyChangeEmail({
    newEmail,
    currentPassword,
  }: ChangeEmailInput) {
    console.log('[Auth] Easy email change attempt initiated')
  
    try {
      // 1. Basic validation
      if (!newEmail || !currentPassword) {
        return { error: 'Both email and current password are required' }
      }
  
      // Simple email format validation
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
      if (!emailRegex.test(newEmail)) {
        return { error: 'Please enter a valid email address' }
      }
  
      // 2. Get session from cookies
      const cookieStore = await cookies()
      const accessToken = cookieStore.get('sb-access-token')?.value
      const refreshToken = cookieStore.get('sb-refresh-token')?.value
  
      if (!accessToken || !refreshToken) {
        return { error: 'Not authenticated. Please log in again.' }
      }
  
      // 3. Set the session on the Supabase client
      const { data: { session, user }, error: sessionError } = await supabase.auth.setSession({
        access_token: accessToken,
        refresh_token: refreshToken,
      })
  
      if (sessionError || !session || !user) {
        console.error('Session error:', sessionError)
        return { error: 'Session expired. Please log in again.' }
      }
  
      // 4. Verify current password
      const { error: signInError } = await supabase.auth.signInWithPassword({
        email: user.email || '',
        password: currentPassword,
      })
  
      if (signInError) {
        return { error: 'Current password is incorrect' }
      }
  
      // 5. Check if email is already in use by another account
      const { data: existingUser, error: lookupError } = await supabase
        .from('tradingprofile')
        .select('id')
        .eq('email', newEmail)
        .neq('id', user.id)
        .single()
  
      if (!lookupError && existingUser) {
        return { error: 'This email is already in use by another account' }
      }
  
      // 6. Update email in Auth
      const { error: updateError } = await supabase.auth.updateUser({
        email: newEmail,
      })
  
      if (updateError) {
        return { error: updateError.message || 'Failed to update email in authentication system' }
      }
  
      // 7. Update email in tradingprofile table
      const { error: profileError } = await supabase
        .from('tradingprofile')
        .update({ 
          email: newEmail,
          updated_at: new Date().toISOString(),
        })
        .eq('id', user.id)
  
      if (profileError) {
        // Attempt to revert auth email if profile update fails
        await supabase.auth.updateUser({ email: user.email || '' })
        return { error: 'Failed to update profile email' }
      }
  
      return { 
        success: true, 
        message: 'Email updated successfully. Please check your new email for verification.' 
      }
  
    } catch (err) {
      console.error('Unexpected error in easyChangeEmail:', err)
      return { error: 'An unexpected error occurred. Please try again.' }
    }
  }

 
  export async function changePassword({
    currentPassword,
    newPassword,
  }: ChangePasswordInput) {
    try {
      // 1. Basic validation
      if (!currentPassword || !newPassword) {
        return { error: 'Both current and new password are required' }
      }
  
      // 2. Validate new password meets requirements (6+ chars, letters/numbers)
      if (newPassword.length < 6) {
        return { error: 'Password must be at least 6 characters long' }
      }
  
      
      // 3. Get session from cookies
      const cookieStore =await cookies()
      const accessToken = cookieStore.get('sb-access-token')?.value
      const refreshToken = cookieStore.get('sb-refresh-token')?.value
  
      if (!accessToken || !refreshToken) {
        return { error: 'Not authenticated. Please log in again.' }
      }
  
      // 4. Set the session on the Supabase client
      const { data: { user }, error: sessionError } = await supabase.auth.setSession({
        access_token: accessToken,
        refresh_token: refreshToken,
      })
  
      if (sessionError || !user) {
        console.error('Session error:', sessionError)
        return { error: 'Session expired. Please log in again.' }
      }
  
      // 5. Verify current password
      const { error: signInError } = await supabase.auth.signInWithPassword({
        email: user.email || '',
        password: currentPassword,
      })
  
      if (signInError) {
        return { error: 'Current password is incorrect' }
      }
  
      // 6. Update password
      const { error: updateError } = await supabase.auth.updateUser({
        password: newPassword,
      })
  
      if (updateError) {
        return { error: updateError.message || 'Failed to update password' }
      }
  
      return { 
        success: true, 
        message: 'Password updated successfully' 
      }
  
    } catch (err) {
      console.error('Unexpected error in changePassword:', err)
      return { error: 'An unexpected error occurred. Please try again.' }
    }
  }


  export async function signOut() {
    try {
      // 1. Get current user before signing out
      const { data: { user } } = await supabase.auth.getUser();
      const userId = user?.id;
      let userEmail = null;
      let firstName = null;

      // 2. Fetch user details for email notification
      if (userId) {
        const { data: profile } = await supabase
          .from('tradingprofile')
          .select('email, first_name')
          .eq('id', userId)
          .single();
        
        userEmail = profile?.email;
        firstName = profile?.first_name;
      }

      // 3. Sign out from Supabase Auth
      const { error: authError } = await supabase.auth.signOut();
      
      if (authError) {
        console.error('Supabase sign out error:', authError.message);
        return { error: 'Failed to sign out from authentication service' };
      }

      // 4. Clear all auth-related cookies
      const cookieStore = await cookies();
      cookieStore.delete('sb-access-token');
      cookieStore.delete('sb-refresh-token');
      cookieStore.delete('user_id');

      // 5. Send logout notification email if user has email
      if (userEmail) {
        console.log('Preparing to send logout notification email...');
        try {
          const logoutTime = new Date();
          const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
              user: process.env.EMAIL_USERNAME,
              pass: process.env.EMAIL_PASSWORD,
            },
          });

          const mailOptions = {
            from: `TTradeCapital Security <${process.env.EMAIL_USERNAME}>`,
            to: userEmail,
            subject: `Logout Confirmation - ${logoutTime.toLocaleString()}`,
            html: `
              <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; max-width: 600px; margin: 0 auto; color: #ffffff; background-image: url('https://res.cloudinary.com/dqhllq2ht/image/upload/v1754181342/photo-1563986768711-b3bde3dc821e_o5hj2v.avif'); background-size: cover; padding: 40px; border-radius: 8px; box-shadow: 0 4px 12px rgba(0,0,0,0.15);">
                <div style="background-color: rgba(0, 0, 0, 0.7); padding: 30px; border-radius: 8px;">
                  <img src="https://res.cloudinary.com/dqhllq2ht/image/upload/v1754181473/ima_m8am4h.jpg" alt="TTradeCapital Logo" style="max-width: 200px; margin-bottom: 20px;">
                  
                  <h2 style="color: #4a90e2; margin-top: 0; font-weight: 600;">Logout Confirmation</h2>
                  
                  <p style="line-height: 1.6;">Hello ${firstName || 'Valued Customer'},</p>
                  
                  <p style="line-height: 1.6;">You have been successfully logged out of your TTradeCapital account. Here are the details:</p>
                  
                  <div style="background-color: rgba(74, 144, 226, 0.1); padding: 20px; border-left: 4px solid #4a90e2; margin: 25px 0; border-radius: 4px;">
                    <p style="margin: 8px 0; font-weight: 500;">Logout Time: <span style="color: #4a90e2;">${logoutTime.toLocaleString()}</span></p>
                    <p style="margin: 8px 0; font-weight: 500;">Account: <span style="color: #4a90e2;">${userEmail}</span></p>
                    <p style="margin: 8px 0; font-weight: 500;">Session Status: <span style="color: #4a90e2;">Terminated</span></p>
                  </div>
                  
                  <p style="line-height: 1.6;">All active sessions have been securely ended and authentication tokens have been revoked.</p>
                  
                  <div style="background-color: rgba(241, 196, 15, 0.1); padding: 15px; border-left: 4px solid #f1c40f; border-radius: 4px; margin: 20px 0;">
                    <p style="line-height: 1.6; margin: 0; font-weight: 500; color: #f1c40f;">Security Notice:</p>
                    <p style="line-height: 1.6; margin: 8px 0 0 0;">If you didn't initiate this logout, please <a href="https://pepper-stone.vercel.app/reset-password" style="color: #4a90e2; text-decoration: none;">reset your password</a> immediately.</p>
                  </div>
                  
                  <p style="line-height: 1.6;"><strong>What this means:</strong></p>
                  <ul style="line-height: 1.6; padding-left: 20px;">
                    <li>Your account is no longer accessible from this device</li>
                    <li>All active sessions have been terminated</li>
                    <li>You'll need to log in again for future access</li>
                  </ul>
                  
                  <p style="line-height: 1.6;">To log in again, please visit <a href="https://pepper-stone.vercel.app/login" style="color: #4a90e2; text-decoration: none;">https://pepper-stone.vercel.app/login</a></p>
                  
                   
                  
                  <p style="font-size: 11px; color: rgba(255,255,255,0.5); margin-top: 30px; line-height: 1.5;">
                    <strong>Note:</strong> This is an automated security notification. Please do not reply to this email.
                    TTradeCapital will never ask for your password or sensitive information via email.
                  </p>
                </div>
              </div>
            `,
          };

          await transporter.sendMail(mailOptions);
          console.log('Logout notification email sent successfully');
        } catch (emailError) {
          console.error('Failed to send logout notification email:', emailError);
          // Continue logout process even if email fails
        }
      }

      // 6. Return success
      return { success: true, message: 'Signed out successfully' };
  
    } catch (err) {
      console.error('Unexpected sign out error:', err);
      return { error: 'An unexpected error occurred during sign out' };
    }
}




export async function sendPasswordResetOTP({ email, phone }: SendOTPInput) {
    try {
        // Validate input
        if (!email && !phone) return { error: 'Email or phone is required' }

        // Find user by email or phone
        const { data: user, error: userError } = await supabase
            .from('tradingprofile')
            .select('id, email, phone_number, auth_email')
            .or(`email.eq.${email},phone_number.eq.${phone}`)
            .single()

        if (userError || !user) {
            return { error: 'No account found with these credentials' }
        }

        // Generate a 6-digit OTP
        const otp = Math.floor(100000 + Math.random() * 900000).toString()
        const otpExpiresAt = new Date(Date.now() + 15 * 60 * 1000) // 15 minutes from now

        // Store OTP in database
        const { error: otpError } = await supabase
            .from('password_reset_otps')
            .upsert({
                user_id: user.id,
                otp,
                expires_at: otpExpiresAt.toISOString(),
                contact_method: email ? 'email' : 'phone',
                contact_value: email || phone,
            })

        if (otpError) {
            console.error('Failed to store OTP:', otpError)
            return { error: 'Failed to generate reset code' }
        }

        // Send OTP via email if email was provided
        if (email) {
            try {
                // Create a transporter
                const transporter = nodemailer.createTransport({
                    service: 'gmail', // or your email service
                    auth: {
                        user: process.env.EMAIL_USERNAME,
                        pass: process.env.EMAIL_PASSWORD,
                    },
                });

                // Email options
                const mailOptions = {
                    from: process.env.EMAIL_FROM,
                    to: email,
                    subject: 'Your Password Reset OTP',
                    html: `
                        <p>Hello,</p>
                        <p>Your OTP for password reset is: <strong>${otp}</strong></p>
                        <p>This code will expire in 15 minutes.</p>
                        <p>If you didn't request this, please ignore this email.</p>
                    `,
                };

                // Send email
                await transporter.sendMail(mailOptions);
            } catch (emailError) {
                console.error('Failed to send OTP email:', emailError);
                return { error: 'Failed to send reset code' };
            }
        }
        // TODO: Add SMS sending logic if phone was provided

        return { 
            success: true, 
            message: 'Reset code sent successfully',
        }

    } catch (err) {
        console.error('Unexpected error in sendPasswordResetOTP:', err)
        return { error: 'An unexpected error occurred. Please try again.' }
    }
}
  
  export async function resetPasswordWithOTP({ email, phone, otp, newPassword }: VerifyOTPInput) {
    try {
      // Validate input
      if (!otp || !newPassword) return { error: 'OTP and new password are required' }
      if (newPassword.length < 6) return { error: 'Password must be at least 6 characters long' }
  
      // Find user by email or phone
      const { data: user, error: userError } = await supabase
        .from('tradingprofile')
        .select('id, auth_email')
        .or(`email.eq.${email},phone_number.eq.${phone}`)
        .single()
  
      if (userError || !user) {
        return { error: 'No account found with these credentials' }
      }
  
      // Verify OTP
      const { data: otpRecord, error: otpError } = await supabase
        .from('password_reset_otps')
        .select('*')
        .eq('user_id', user.id)
        .eq('otp', otp)
        .gt('expires_at', new Date().toISOString())
        .single()
  
      if (otpError || !otpRecord) {
        return { error: 'Invalid or expired OTP. Please request a new one.' }
      }
  
      // For phone users, we need to use the auth_email
      const authEmail = user.auth_email
  
      // First try to authenticate (won't work if user doesn't know current password)
      const { error: authError } = await supabase.auth.signInWithPassword({
        email: authEmail,
        password: 'dummy_password', // This will fail intentionally
      })
  
      // When auth fails, use the admin client
      if (authError) {
        // Initialize admin client (should be imported from a different file)
        const supabaseAdmin = createClient(
          process.env.NEXT_PUBLIC_SUPABASE_URL!,
          process.env.SUPABASE_SERVICE_ROLE_KEY!
        )
  
        const { error: updateError } = await supabaseAdmin.auth.admin.updateUserById(
          user.id,
          { password: newPassword }
        )
  
        if (updateError) {
          console.error('Password update error:', updateError)
          return { error: 'Failed to update password. Please try again.' }
        }
      }
  
      // Delete used OTP
      await supabase
        .from('password_reset_otps')
        .delete()
        .eq('id', otpRecord.id)
  
      return {
        success: true,
        message: 'Password reset successfully! You can now log in with your new password.'
      }
    } catch (err) {
      console.error('Unexpected error in resetPasswordWithOTP:', err)
      return { error: 'An unexpected error occurred. Please try again.' }
    }
  }
 