// types/crypto.ts
export const CRYPTO_TYPES = ['USDC', 'USDT', 'DOT', 'XRP', 'ETH', 'AVAX', 'ADA', 'SOL', 'BTC', 'BNB'] as const;

export type CryptoType = typeof CRYPTO_TYPES[number];

export interface CryptoOption {
  value: CryptoType;
  label: string;
}

export const CRYPTO_OPTIONS: CryptoOption[] = [
  { value: 'USDC', label: 'USDC' },
  { value: 'USDT', label: 'Tether (USDT)' },
  { value: 'DOT', label: 'Polkadot (DOT)' },
  { value: 'XRP', label: 'XRP (XRP)' },
  { value: 'ETH', label: 'Ethereum (ETH)' },
  { value: 'AVAX', label: 'Avalanche (AVAX)' },
  { value: 'ADA', label: 'Cardano (ADA)' },
  { value: 'SOL', label: 'Solana (SOL)' },
  { value: 'BTC', label: 'Bitcoin (BTC)' },
  { value: 'BNB', label: 'BNB (BNB)' }
];