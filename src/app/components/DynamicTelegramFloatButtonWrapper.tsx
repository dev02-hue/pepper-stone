'use client';

import dynamic from 'next/dynamic';

const TelegramFloatButtonWrapper = dynamic(
  () => import('./utils/TelegramFloatButtonWrapper'),
  { 
    ssr: false,
    loading: () => null
  }
);

export default function DynamicTelegramFloatButtonWrapper() {
  return <TelegramFloatButtonWrapper />;
}