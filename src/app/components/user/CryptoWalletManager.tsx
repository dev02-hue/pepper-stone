'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiPlus, FiTrash2, FiCheck, FiX, FiCopy } from 'react-icons/fi';
import { FaBitcoin, FaEthereum } from 'react-icons/fa';
import { SiBinance, SiSolana, SiCardano, SiRipple, SiPolkadot, SiTether } from 'react-icons/si';
import { CRYPTO_OPTIONS, CryptoType } from '@/types/crypto';
import { createOrUpdateWallet, deleteWallet, getWallets } from '@/lib/walletManager';

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

export default function CryptoWalletManager() {
  const [wallets, setWallets] = useState<Record<string, string | null>>({});
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeForm, setActiveForm] = useState<CryptoType | null>(null);
  const [newAddress, setNewAddress] = useState('');
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

  const handleAddWallet = async (cryptoType: CryptoType) => {
    if (!newAddress.trim()) return;
    
    setIsLoading(true);
    setError(null);
    try {
      const result = await createOrUpdateWallet(cryptoType, newAddress);
      if (result.error) {
        setError(result.error);
      } else {
        await loadWallets();
        setActiveForm(null);
        setNewAddress('');
      }
    } catch (err) {
      console.log(err);
      setError('Failed to add wallet');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteWallet = async (cryptoType: CryptoType) => {
    setIsLoading(true);
    setError(null);
    try {
      const result = await deleteWallet(cryptoType);
      if (result.error) {
        setError(result.error);
      } else {
        await loadWallets();
      }
    } catch (err) {
      console.log(err);
      setError('Failed to delete wallet');
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
    <div className="w-full max-w-3xl mx-auto px-4 py-6 sm:p-6 bg-white dark:bg-gray-800 rounded-xl shadow-lg">
      <h2 className="text-xl sm:text-2xl font-bold text-gray-800 dark:text-white mb-6">Manage Crypto Wallets</h2>
      
      {error && (
        <motion.div 
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-4 p-3 bg-red-100 dark:bg-red-900 text-red-700 dark:text-red-100 rounded-lg text-sm sm:text-base"
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
        <div className="space-y-3 sm:space-y-4">
          {CRYPTO_OPTIONS.map((option) => {
            const address = getWalletAddress(option.value);
            const isActive = activeForm === option.value;
            
            return (
              <motion.div 
                key={option.value}
                layout
                className="p-3 sm:p-4 bg-gray-50 dark:bg-gray-700 rounded-lg shadow-sm"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2 sm:space-x-3 min-w-0">
                    <div className="text-lg sm:text-xl">
                      {cryptoIcons[option.value]}
                    </div>
                    <div className="min-w-0">
                      <h3 className="font-medium text-gray-800 dark:text-white text-sm sm:text-base truncate">
                        {option.label}
                      </h3>
                      {address && (
                        <div className="flex items-center mt-1">
                          <span className="text-xs sm:text-sm text-gray-600 dark:text-gray-300 font-mono truncate max-w-[180px] xs:max-w-[220px] sm:max-w-xs">
                            {address}
                          </span>
                          <button 
                            onClick={() => copyToClipboard(address)}
                            className="ml-1 sm:ml-2 text-gray-500 hover:text-blue-500 transition-colors"
                            aria-label="Copy address"
                          >
                            {copiedAddress === address ? (
                              <FiCheck className="text-green-500 text-sm sm:text-base" />
                            ) : (
                              <FiCopy className="text-sm sm:text-base" />
                            )}
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                  
                  {address ? (
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => handleDeleteWallet(option.value)}
                      className="p-1 sm:p-2 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/30 rounded-full transition-colors"
                      aria-label="Delete wallet"
                    >
                      <FiTrash2 className="text-sm sm:text-base" />
                    </motion.button>
                  ) : (
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => setActiveForm(isActive ? null : option.value)}
                      className={`p-1 sm:p-2 rounded-full transition-colors ${isActive 
                        ? 'bg-gray-200 dark:bg-gray-600 text-gray-700 dark:text-white' 
                        : 'text-blue-500 hover:bg-blue-50 dark:hover:bg-blue-900/30'}`}
                      aria-label={isActive ? "Cancel" : "Add wallet"}
                    >
                      {isActive ? <FiX className="text-sm sm:text-base" /> : <FiPlus className="text-sm sm:text-base" />}
                    </motion.button>
                  )}
                </div>

                <AnimatePresence>
                  {isActive && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      transition={{ duration: 0.2 }}
                      className="mt-3 overflow-hidden"
                    >
                      <div className="flex flex-col xs:flex-row gap-2">
                        <input
                          type="text"
                          value={newAddress}
                          onChange={(e) => setNewAddress(e.target.value)}
                          placeholder={`Enter ${option.label} address`}
                          className="flex-1 px-3 py-2 text-sm sm:text-base border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-800 dark:text-white"
                        />
                        <motion.button
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          onClick={() => handleAddWallet(option.value)}
                          disabled={!newAddress.trim() || isLoading}
                          className="px-3 py-2 sm:px-4 sm:py-2 bg-blue-500 hover:bg-blue-600 text-white text-sm sm:text-base rounded-lg disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                        >
                          Save
                        </motion.button>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            );
          })}
        </div>
      )}
    </div>
  );
}