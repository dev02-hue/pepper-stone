'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { getUserWalletBalances } from '@/lib/getUserWalletBalances';
import { FaBitcoin, FaCoins, FaDollarSign, FaEthereum } from 'react-icons/fa';
import { SiBinance, SiCardano, SiPolkadot, SiRipple, SiSnowflake, SiSolana } from 'react-icons/si';
 

const CryptoIcon = ({ symbol }: { symbol: string }) => {
  switch (symbol) {
    case 'BTC':
      return <FaBitcoin className="text-orange-500" />;
    case 'ETH':
      return <FaEthereum className="text-purple-500" />;
    case 'USDC':
    case 'USDT':
      return <FaDollarSign className="text-green-500" />;
    case 'BNB':
      return <SiBinance className="text-yellow-500" />;
    case 'SOL':
      return <SiSolana className="text-cyan-500" />;
    case 'DOT':
      return <SiPolkadot className="text-pink-500" />;
    case 'XRP':
      return <SiRipple className="text-blue-500" />;
    case 'AVAX':
      return <SiSnowflake className="text-red-500" />;
    case 'ADA':
      return <SiCardano className="text-blue-600" />;
    default:
      return <FaCoins className="text-gray-500" />;
  }
};

const WalletBalances = () => {
  const [balances, setBalances] = useState<Record<string, number> | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchBalances = async () => {
      try {
        setLoading(true);
        const result = await getUserWalletBalances();
        
        if ('error' in result) {
          if (result.error === 'signin') {
            setError('Please sign in to view wallet balances');
          } else {
            setError('Failed to load wallet balances');
          }
        } else {
          setBalances(result.balances);
        }
      } catch (err) {
        console.error('Error fetching wallet balances:', err);
        setError('An unexpected error occurred');
      } finally {
        setLoading(false);
      }
    };

    fetchBalances();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full"
        />
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4">
        <p>{error}</p>
      </div>
    );
  }

  if (!balances) {
    return (
      <div className="bg-yellow-100 border-l-4 border-yellow-500 text-yellow-700 p-4">
        <p>No wallet balances found</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold text-gray-800 dark:text-white">Wallet Balances</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {Object.entries(balances).map(([symbol, balance]) => (
          <motion.div
            key={symbol}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            whileHover={{ scale: 1.03 }}
            className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-4 border border-gray-200 dark:border-gray-700"
          >
            <div className="flex items-center space-x-3">
              <div className="p-2 rounded-full bg-gray-100 dark:bg-gray-700">
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
    </div>
  );
};

export default WalletBalances;