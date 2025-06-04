'use server'

import { createServerActionClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'

export async function changeEmail(newEmail: string) {
  console.log('🔧 use server action: changeEmail')
  console.log('📝 New Email:', newEmail)

  const cookieStore = cookies()
  const supabase = createServerActionClient({ cookies: () => cookieStore })

  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser()

  if (userError || !user) {
    console.error('⛔ User not authenticated:', userError?.message)
    return { error: 'User not authenticated' }
  }

  const userId = user.id
  console.log('✅ Authenticated user ID:', userId)

  // Get user profile
  const { data: profile, error: profileError } = await supabase
    .from('tradingprofile')
    .select('auth_email')
    .eq('id', userId)
    .single()

  if (profileError || !profile) {
    console.error('⛔ Profile error:', profileError)
    return { error: 'User profile not found' }
  }

  const { error: updateAuthError } = await supabase.auth.updateUser({
    email: newEmail,
  })

  if (updateAuthError) {
    console.error('⛔ Failed to update email in auth:', updateAuthError.message)
    return { error: `Failed to update email in auth: ${updateAuthError.message}` }
  }

  const now = new Date().toISOString()
  const { error: updateProfileError } = await supabase
    .from('tradingprofile')
    .update({ email: newEmail, updated_at: now })
    .eq('id', userId)

  if (updateProfileError) {
    console.error('⚠️ Email updated in auth, but failed in profile:', updateProfileError.message)
    return {
      error: `Email updated in auth, but failed in profile: ${updateProfileError.message}`,
    }
  }

  console.log('✅ Email updated successfully')
  return { message: 'Email updated successfully' }
}
