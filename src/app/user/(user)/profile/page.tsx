import CryptoWalletManager from '@/app/components/user/CryptoWalletManager'
import ProfilePage from '@/app/components/user/Profile'
import React from 'react'

const page = () => {
  return (
    <div>
      <ProfilePage />
      <CryptoWalletManager />
    </div>
  )
}

export default page