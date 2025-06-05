'use client'

import { useState } from 'react'
import ForgotPasswordForm from '../components/auth/ForgotPasswordForm'
import ResetPasswordWithOTPForm from '../components/auth/ResetPasswordWithOTPForm'

export default function PasswordResetPage() {
  const [step, setStep] = useState<'request' | 'reset'>('request')
  const [contactInfo, setContactInfo] = useState<{email?: string, phone?: string}>({})

  const handleOTPSent = (email?: string, phone?: string) => {
    setContactInfo({ email, phone })
    setStep('reset')
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      {step === 'request' ? (
        <ForgotPasswordForm onSuccess={handleOTPSent} />
      ) : (
        <ResetPasswordWithOTPForm 
          email={contactInfo.email} 
          phone={contactInfo.phone} 
          onBack={() => setStep('request')}
        />
      )}
    </div>
  )
}