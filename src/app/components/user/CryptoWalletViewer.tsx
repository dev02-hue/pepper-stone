'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FiCheck, FiCopy } from 'react-icons/fi';
import { FaBitcoin, FaEthereum } from 'react-icons/fa';
import { SiBinance, SiSolana, SiCardano, SiRipple, SiPolkadot, SiTether } from 'react-icons/si';
import { CRYPTO_OPTIONS, CryptoType } from '@/types/crypto';
import { getWallets } from '@/lib/walletManager';

const cryptoIcons: Record<CryptoType, React.ReactNode> = {
  BTC: <FaBitcoin className="text-orange-500" />,
  ETH: <FaEthereum className="text-purple-500" />,
  BNB: <SiBinance className="text-yellow-500" />,
  SOL: <SiSolana className="text-green-500" />,
  ADA: <SiCardano className="text-blue-500" />,
  XRP: <SiRipple className="text-sky-500" />,
  DOT: <SiPolkadot className="text-pink-500" />,
  USDT: <SiTether className="text-emerald-500" />,
  USDC: <SiTether className="text-blue-400" />,
  AVAX: <div className="text-red-500 font-bold text-sm">AVAX</div>,
};

export default function CryptoWalletViewer() {
  const [wallets, setWallets] = useState<Record<string, string | null>>({});
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [copiedAddress, setCopiedAddress] = useState<string | null>(null);

  useEffect(() => {
    loadWallets();
  }, []);

  const loadWallets = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const result = await getWallets();
      if (result.error) {
        setError(result.error);
      } else if (result.success) {
        setWallets(result.wallets);
      }
    } catch (err) {
      console.log(err);
      setError('Failed to load wallets');
    } finally {
      setIsLoading(false);
    }
  };

  const copyToClipboard = (address: string) => {
    navigator.clipboard.writeText(address);
    setCopiedAddress(address);
    setTimeout(() => setCopiedAddress(null), 2000);
  };

  const getWalletAddress = (cryptoType: CryptoType): string | null => {
    const fieldName = `${cryptoType.toLowerCase()}wallet_address`;
    return wallets[fieldName] || null;
  };

  return (
    <div className="max-w-3xl mx-auto p-6 bg-white dark:bg-gray-800 rounded-xl shadow-lg">
      <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-6">My Crypto Wallets</h2>
      
      {error && (
        <motion.div 
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-4 p-3 bg-red-100 dark:bg-red-900 text-red-700 dark:text-red-100 rounded-lg"
        >
          {error}
        </motion.div>
      )}

      {isLoading && !Object.keys(wallets).length ? (
        <div className="flex justify-center py-8">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
            className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full"
          />
        </div>
      ) : (
        <div className="space-y-4">
          {CRYPTO_OPTIONS.map((option) => {
            const address = getWalletAddress(option.value);
            if (!address) return null;
            
            return (
              <motion.div 
                key={option.value}
                layout
                className="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg shadow-sm"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="text-xl">
                      {cryptoIcons[option.value]}
                    </div>
                    <div>
                      <h3 className="font-medium text-gray-800 dark:text-white">{option.label}</h3>
                      <div className="flex items-center mt-1">
                        <span className="text-sm text-gray-600 dark:text-gray-300 font-mono truncate max-w-xs">
                          {address}
                        </span>
                        <button 
                          onClick={() => copyToClipboard(address)}
                          className="ml-2 text-gray-500 hover:text-blue-500 transition-colors"
                          aria-label="Copy address"
                        >
                          {copiedAddress === address ? (
                            <FiCheck className="text-green-500" />
                          ) : (
                            <FiCopy />
                          )}
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      )}
    </div>
  );
}