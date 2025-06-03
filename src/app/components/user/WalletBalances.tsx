'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiCheck, FiCopy, FiRefreshCw } from 'react-icons/fi';
import { FaBitcoin, FaEthereum, FaCoins, FaDollarSign } from 'react-icons/fa';
import { SiBinance, SiSolana, SiCardano, SiRipple, SiPolkadot, SiTether, SiSnowflake } from 'react-icons/si';
import { CRYPTO_OPTIONS, CryptoType } from '@/types/crypto';
import { getWallets } from '@/lib/walletManager';
import { getUserWalletBalances } from '@/lib/getUserWalletBalances';

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
  AVAX: <SiSnowflake className="text-red-500" />,
};

export default function WalletBalances() {
  // Wallet addresses state
  const [wallets, setWallets] = useState<Record<string, string | null>>({});
  const [isLoadingWallets, setIsLoadingWallets] = useState(true);
  const [walletError, setWalletError] = useState<string | null>(null);
  const [copiedAddress, setCopiedAddress] = useState<string | null>(null);
  
  // Balances state
  const [balances, setBalances] = useState<Record<string, number> | null>(null);
  const [isLoadingBalances, setIsLoadingBalances] = useState(true);
  const [balanceError, setBalanceError] = useState<string | null>(null);
  
  // Active tab state
  const [activeTab, setActiveTab] = useState<'addresses' | 'balances'>('addresses');
  const [isRefreshing, setIsRefreshing] = useState(false);

  useEffect(() => {
    loadWallets();
    loadBalances();
  }, []);

  const loadWallets = async () => {
    setIsLoadingWallets(true);
    setWalletError(null);
    try {
      const result = await getWallets();
      if (result.error) {
        setWalletError(result.error);
      } else if (result.success) {
        setWallets(result.wallets);
      }
    } catch (err) {
      console.error(err);
      setWalletError('Failed to load wallets');
    } finally {
      setIsLoadingWallets(false);
    }
  };

  const loadBalances = async () => {
    setIsLoadingBalances(true);
    setBalanceError(null);
    try {
      const result = await getUserWalletBalances();
      if ('error' in result) {
        if (result.error === 'signin') {
          setBalanceError('Please sign in to view wallet balances');
        } else {
          setBalanceError('Failed to load wallet balances');
        }
      } else {
        setBalances(result.balances);
      }
    } catch (err) {
      console.error('Error fetching wallet balances:', err);
      setBalanceError('An unexpected error occurred');
    } finally {
      setIsLoadingBalances(false);
    }
  };

  const refreshAll = async () => {
    setIsRefreshing(true);
    await Promise.all([loadWallets(), loadBalances()]);
    setIsRefreshing(false);
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

  const CryptoIcon = ({ symbol }: { symbol: string }) => {
    switch (symbol) {
      case 'BTC': return <FaBitcoin className="text-orange-500" />;
      case 'ETH': return <FaEthereum className="text-purple-500" />;
      case 'USDC':
      case 'USDT': return <FaDollarSign className="text-green-500" />;
      case 'BNB': return <SiBinance className="text-yellow-500" />;
      case 'SOL': return <SiSolana className="text-cyan-500" />;
      case 'DOT': return <SiPolkadot className="text-pink-500" />;
      case 'XRP': return <SiRipple className="text-blue-500" />;
      case 'AVAX': return <SiSnowflake className="text-red-500" />;
      case 'ADA': return <SiCardano className="text-blue-600" />;
      default: return <FaCoins className="text-gray-500" />;
    }
  };

  return (
    <div className="max-w-6xl mx-auto p-4 sm:p-6">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden"
      >
        {/* Header */}
        <div className="p-6 pb-0 flex flex-col sm:flex-row sm:items-center sm:justify-between">
          <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-4 sm:mb-0">
            Crypto Wallet Dashboard
          </h2>
          
          <div className="flex items-center space-x-3">
            <button
              onClick={refreshAll}
              disabled={isRefreshing}
              className="flex items-center px-3 py-2 bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-lg hover:bg-blue-100 dark:hover:bg-blue-900/50 transition-colors"
            >
              <FiRefreshCw className={`mr-2 ${isRefreshing ? 'animate-spin' : ''}`} />
              Refresh
            </button>
            
            <div className="flex bg-gray-100 dark:bg-gray-700 rounded-lg p-1">
              <button
                onClick={() => setActiveTab('addresses')}
                className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${activeTab === 'addresses' ? 'bg-white dark:bg-gray-600 shadow-sm text-gray-800 dark:text-white' : 'text-gray-600 dark:text-gray-300 hover:text-gray-800 dark:hover:text-white'}`}
              >
                Addresses
              </button>
              <button
                onClick={() => setActiveTab('balances')}
                className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${activeTab === 'balances' ? 'bg-white dark:bg-gray-600 shadow-sm text-gray-800 dark:text-white' : 'text-gray-600 dark:text-gray-300 hover:text-gray-800 dark:hover:text-white'}`}
              >
                Balances
              </button>
            </div>
          </div>
        </div>

        {/* Error messages */}
        <AnimatePresence>
          {walletError && activeTab === 'addresses' && (
            <motion.div 
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="mx-6 mt-4 p-3 bg-red-100 dark:bg-red-900 text-red-700 dark:text-red-100 rounded-lg"
            >
              {walletError}
            </motion.div>
          )}
          
          {balanceError && activeTab === 'balances' && (
            <motion.div 
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="mx-6 mt-4 p-3 bg-red-100 dark:bg-red-900 text-red-700 dark:text-red-100 rounded-lg"
            >
              {balanceError}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Loading state */}
        {(isLoadingWallets && activeTab === 'addresses') || (isLoadingBalances && activeTab === 'balances') ? (
          <div className="flex justify-center py-16">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
              className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full"
            />
          </div>
        ) : (
          <div className="p-6">
            {/* Addresses Tab */}
            {activeTab === 'addresses' && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.3 }}
                className="space-y-4"
              >
                <h3 className="text-lg font-semibold text-gray-700 dark:text-gray-300 mb-4">Wallet Addresses</h3>
                
                {CRYPTO_OPTIONS.filter(option => getWalletAddress(option.value)).length === 0 ? (
                  <div className="text-center py-8 text-gray-500 dark:text-gray-400">
                    No wallet addresses found
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {CRYPTO_OPTIONS.map((option) => {
                      const address = getWalletAddress(option.value);
                      if (!address) return null;
                      
                      return (
                        <motion.div 
                          key={option.value}
                          layout
                          whileHover={{ scale: 1.01 }}
                          className="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg shadow-sm border border-gray-200 dark:border-gray-600"
                        >
                          <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-3">
                              <div className="text-2xl">
                                {cryptoIcons[option.value]}
                              </div>
                              <div>
                                <h3 className="font-medium text-gray-800 dark:text-white">{option.label}</h3>
                                <div className="flex items-center mt-1">
                                  <span className="text-sm text-gray-600 dark:text-gray-300 font-mono truncate max-w-[180px] md:max-w-[220px]">
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
              </motion.div>
            )}

            {/* Balances Tab */}
            {activeTab === 'balances' && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.3 }}
                className="space-y-4"
              >
                <h3 className="text-lg font-semibold text-gray-700 dark:text-gray-300 mb-4">Wallet Balances</h3>
                
                {!balances || Object.keys(balances).length === 0 ? (
                  <div className="text-center py-8 text-gray-500 dark:text-gray-400">
                    No wallet balances found
                  </div>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                    {Object.entries(balances).map(([symbol, balance]) => (
                      <motion.div
                        key={symbol}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.3 }}
                        whileHover={{ scale: 1.03 }}
                        className="bg-white dark:bg-gray-700 rounded-lg shadow-sm p-4 border border-gray-200 dark:border-gray-600"
                      >
                        <div className="flex items-center space-x-3">
                          <div className="p-2 rounded-full bg-gray-100 dark:bg-gray-600">
                            <CryptoIcon symbol={symbol} />
                          </div>
                          <div>
                            <h3 className="font-semibold text-gray-800 dark:text-white">{symbol}</h3>
                            <p className="text-gray-600 dark:text-gray-300">
                              {balance.toFixed(8)}
                            </p>
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                )}
              </motion.div>
            )}
          </div>
        )}
      </motion.div>
    </div>
  );
}





