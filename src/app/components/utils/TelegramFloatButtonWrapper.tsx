// app/components/home/TelegramFloatButtonWrapper.tsx
'use client'

import { usePathname } from 'next/navigation'
import TelegramFloatButton from '../home/TelegramFloatButton'
 
const HIDDEN_PATHS = ['/user', '/joker']

const TelegramFloatButtonWrapper = () => {
  const pathname = usePathname()
  const shouldHide = HIDDEN_PATHS.some(path => pathname.startsWith(path))

  if (shouldHide) return null

  return <TelegramFloatButton />
}

export default TelegramFloatButtonWrapper
