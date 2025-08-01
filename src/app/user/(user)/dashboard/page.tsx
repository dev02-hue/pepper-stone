'use client'
import { useCallback, useEffect, useState } from 'react'
import { 
  AreaChart, Area, BarChart, Bar, LineChart, Line, XAxis, YAxis, 
  CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell 
} from 'recharts'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  FiArrowUpRight, FiArrowDownRight, FiTrendingUp, FiDollarSign, FiRefreshCw, FiBarChart2, 
  FiActivity
} from 'react-icons/fi'
import { FaBitcoin, FaEthereum } from 'react-icons/fa'
import { SiBinance, SiDogecoin, SiLitecoin, SiRipple } from 'react-icons/si'
import { TbCurrencySolana } from 'react-icons/tb'
import { getUserBalance } from '@/lib/getUserBalance' 
import { getUserWalletBalances } from '@/lib/getUserWalletBalances'

const CryptoDashboard = () => {
  const [activeTab, setActiveTab] = useState('portfolio')
  const [timeRange, setTimeRange] = useState('7d')
  const [isLoading, setIsLoading] = useState(false)
  const [darkMode, setDarkMode] = useState(true)
  const [balanceData, setBalanceData] = useState<number>(0)
  const [usdtBalance, setUsdtBalance] = useState<number>(0)
  const [ethBalance, setEthBalance] = useState<number>(0)
  const [btcBalance, setBtcBalance] = useState<number>(0)
  const [bnbBalance, setBnbBalance] = useState<number>(0)
  const [solBalance, setSolBalance] = useState<number>(0)
  const [xrpBalance, setXrpBalance] = useState<number>(0)
  const [priceData, setPriceData] = useState({
    BTC: 62543.12,
    ETH: 3421.56,
    BNB: 586.34,
    SOL: 142.67,
    XRP: 0.5423,
    USDT: 1.00
  })
  const [portfolioData, setPortfolioData] = useState([
    { name: 'BTC', value: 12500, change: 2.4, icon: <FaBitcoin className="text-amber-500" /> },
    { name: 'ETH', value: 8500, change: -1.2, icon: <FaEthereum className="text-purple-500" /> },
    { name: 'BNB', value: 3200, change: 0.8, icon: <SiBinance className="text-yellow-500" /> },
    { name: 'SOL', value: 2800, change: 5.3, icon: <TbCurrencySolana className="text-green-500" /> },
    { name: 'XRP', value: 1500, change: -0.5, icon: <SiRipple className="text-blue-500" /> },
    { name: 'USDT', value: 1500, change: 0, icon: <FiDollarSign className="text-green-300" /> },
  ])

  const priceHistoryData = [
    { name: 'Jan', btc: 4000, eth: 2400, sol: 2400 },
    { name: 'Feb', btc: 3000, eth: 1398, sol: 2210 },
    { name: 'Mar', btc: 2000, eth: 9800, sol: 2290 },
    { name: 'Apr', btc: 2780, eth: 3908, sol: 2000 },
    { name: 'May', btc: 1890, eth: 4800, sol: 2181 },
    { name: 'Jun', btc: 2390, eth: 3800, sol: 2500 },
    { name: 'Jul', btc: 3490, eth: 4300, sol: 2100 },
  ]

  const pieData = [
    { name: 'BTC', value: 45 },
    { name: 'ETH', value: 25 },
    { name: 'Altcoins', value: 20 },
    { name: 'Stablecoins', value: 10 },
  ]

  const COLORS = ['#FD4A36', '#8884d8', '#FFBB28', '#00C49F']

  // Fetch user balance
  const fetchBalance = async () => {
    setIsLoading(true)
    try {
      const result = await getUserBalance()
      setBalanceData(result.balance)
      
      const walletResponse = await getUserWalletBalances()
      if (walletResponse && !walletResponse.error) {
        setUsdtBalance(walletResponse.balances?.USDT || 0)
        setEthBalance(walletResponse.balances?.ETH || 0)
        setBtcBalance(walletResponse.balances?.BTC || 0)
        setBnbBalance(walletResponse.balances?.BNB || 0)
        setSolBalance(walletResponse.balances?.SOL || 0)
        setXrpBalance(walletResponse.balances?.XRP || 0)
      }
    } catch (error) {
      console.error('Error fetching balances:', error)
    } finally {
      setIsLoading(false)
    }
  }

   const simulatePriceChanges = useCallback(() => {
    setPriceData(prev => ({
      BTC: prev.BTC * (1 + (Math.random() * 0.02 - 0.01)),
      ETH: prev.ETH * (1 + (Math.random() * 0.02 - 0.01)),
      BNB: prev.BNB * (1 + (Math.random() * 0.02 - 0.01)),
      SOL: prev.SOL * (1 + (Math.random() * 0.02 - 0.01)),
      XRP: prev.XRP * (1 + (Math.random() * 0.02 - 0.01)),
      USDT: 1.00
    }));
  
    setPortfolioData(prev => prev.map(item => ({
      ...item,
      change: item.name === 'USDT' ? 0 : Number((item.change + (Math.random() * 0.4 - 0.2)).toFixed(2)),
      value: item.name === 'BTC' ? btcBalance * priceData.BTC :
             item.name === 'ETH' ? ethBalance * priceData.ETH :
             item.name === 'BNB' ? bnbBalance * priceData.BNB :
             item.name === 'SOL' ? solBalance * priceData.SOL :
             item.name === 'XRP' ? xrpBalance * priceData.XRP :
             usdtBalance * priceData.USDT,
    })));
  }, [btcBalance, ethBalance, bnbBalance, solBalance, xrpBalance, usdtBalance]);
  
  useEffect(() => {
    fetchBalance();  
    
     const priceInterval = setInterval(() => {
      simulatePriceChanges();
    }, 2000);  
  
    return () => clearInterval(priceInterval);
  }, [simulatePriceChanges]);

  // Calculate totals
  const totalBalance = portfolioData.reduce((sum, item) => sum + item.value, 0)
  const totalProfit = portfolioData.reduce((sum, item) => sum + (item.value * (item.change / 100)), 0)

  const refreshData = () => {
    setIsLoading(true)
    fetchBalance()
    setTimeout(() => setIsLoading(false), 1000)
  }

  // Format currency
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(value)
  }

  // Format crypto amount
  const formatCrypto = (value: number) => {
    return value.toFixed(8)
  }

  // Get asset price
  const getAssetPrice = (asset: string) => {
    switch (asset) {
      case 'BTC': return priceData.BTC
      case 'ETH': return priceData.ETH
      case 'BNB': return priceData.BNB
      case 'SOL': return priceData.SOL
      case 'XRP': return priceData.XRP
      case 'USDT': return priceData.USDT
      default: return 0
    }
  }

  // Get asset balance
  const getAssetBalance = (asset: string) => {
    switch (asset) {
      case 'BTC': return btcBalance
      case 'ETH': return ethBalance
      case 'BNB': return bnbBalance
      case 'SOL': return solBalance
      case 'XRP': return xrpBalance
      case 'USDT': return usdtBalance
      default: return 0
    }
  }

  return (
    <div className={`min-h-screen ${darkMode ? 'bg-gray-900 text-white' : 'bg-gray-50 text-gray-900'}`}>
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex justify-between items-center mb-8"
        >
          <h1 className="text-3xl font-bold bg-gradient-to-r from-[#FD4A36] to-orange-500 bg-clip-text text-transparent">
            Crypto Dashboard
          </h1>
          <div className="flex items-center space-x-4">
            <button 
              onClick={() => setDarkMode(!darkMode)}
              className={`p-2 rounded-full ${darkMode ? 'bg-gray-800 text-yellow-400' : 'bg-gray-200 text-gray-700'}`}
            >
              {darkMode ? '☀️' : '🌙'}
            </button>
            <button 
              onClick={refreshData}
              className={`p-2 rounded-full ${darkMode ? 'bg-gray-800' : 'bg-gray-200'} ${isLoading ? 'animate-spin' : ''}`}
            >
              <FiRefreshCw className={darkMode ? 'text-white' : 'text-gray-700'} />
            </button>
          </div>
        </motion.div>

        {/* Balance Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {/* Total Balance */}
          <motion.div 
            whileHover={{ y: -5 }}
            className={`p-6 rounded-xl ${darkMode ? 'bg-gray-800' : 'bg-white'} shadow-lg`}
          >
            <div className="flex justify-between items-start">
              <div>
                <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>Total Balance</p>
                <h2 className="text-2xl font-bold mt-1">
  {isLoading || typeof balanceData !== 'number'
    ? '...'
    : new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
        minimumFractionDigits: 2
      }).format(balanceData)}
</h2>
              </div>
              <div className={`p-3 rounded-full ${darkMode ? 'bg-gray-700' : 'bg-gray-100'}`}>
                <FiDollarSign className="text-[#FD4A36]" size={20} />
              </div>
            </div>
            <div className="mt-4 flex items-center">
              {totalProfit >= 0 ? (
                <FiTrendingUp className="text-green-500 mr-2" />
              ) : (
                <FiTrendingUp className="text-red-500 mr-2 transform rotate-180" />
              )}
              <span className={`text-sm ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                {totalProfit >= 0 ? '+' : ''}{formatCurrency(totalProfit)} ({totalBalance > 0 ? (totalProfit / totalBalance * 100).toFixed(2) : '0.00'}%) last 24h
              </span>
            </div>
          </motion.div>

          {/* BTC Balance */}
          <motion.div 
            whileHover={{ y: -5 }}
            className={`p-6 rounded-xl ${darkMode ? 'bg-gray-800' : 'bg-white'} shadow-lg`}
          >
            <div className="flex justify-between items-start">
              <div>
                <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>BTC Balance</p>
                <h2 className="text-2xl font-bold mt-1">
                  {isLoading ? '...' : formatCrypto(btcBalance)}
                </h2>
                <p className={`text-sm mt-1 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                  ≈ {formatCurrency(btcBalance * priceData.BTC)}
                </p>
              </div>
              <div className={`p-3 rounded-full ${darkMode ? 'bg-gray-700' : 'bg-gray-100'}`}>
                <FaBitcoin className="text-amber-500" size={20} />
              </div>
            </div>
            <div className="mt-4 flex items-center">
              {portfolioData.find(a => a.name === 'BTC')?.change !== undefined && portfolioData.find(a => a.name === 'BTC')!.change >= 0 ? (
                <FiTrendingUp className="text-green-500 mr-2" />
              ) : (
                <FiTrendingUp className="text-red-500 mr-2 transform rotate-180" />
              )}
              <span className={`text-sm ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                {portfolioData.find(a => a.name === 'BTC')?.change.toFixed(2)}% last 24h
              </span>
            </div>
          </motion.div>

          {/* USDT Balance */}
          <motion.div 
            whileHover={{ y: -5 }}
            className={`p-6 rounded-xl ${darkMode ? 'bg-gray-800' : 'bg-white'} shadow-lg`}
          >
            <div className="flex justify-between items-start">
              <div>
                <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>USDT Balance</p>
                <h2 className="text-2xl font-bold mt-1">
                  {isLoading ? '...' : formatCrypto(usdtBalance)}
                </h2>
                <p className={`text-sm mt-1 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                  ≈ {formatCurrency(usdtBalance * priceData.USDT)}
                </p>
              </div>
              <div className={`p-3 rounded-full ${darkMode ? 'bg-gray-700' : 'bg-gray-100'}`}>
                <FiDollarSign className="text-green-500" size={20} />
              </div>
            </div>
            <div className="mt-4">
              <span className={`text-sm ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                Stablecoin (1:1 USD)
              </span>
            </div>
          </motion.div>
        </div>

        {/* Tabs */}
        <div className="flex space-x-2 mb-6 border-b border-gray-700">
          {['portfolio', 'market', 'analytics'].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-4 py-2 text-sm font-medium rounded-t-lg transition-colors ${
                activeTab === tab 
                  ? `${darkMode ? 'bg-[#FD4A36] text-white' : 'bg-[#FD4A36] text-white'}`
                  : `${darkMode ? 'text-gray-400 hover:text-white' : 'text-gray-500 hover:text-gray-900'}`
              }`}
            >
              {tab.charAt(0).toUpperCase() + tab.slice(1)}
            </button>
          ))}
        </div>

        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
          >
            {/* Portfolio Tab */}
            {activeTab === 'portfolio' && (
              <div className="space-y-6">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                  {/* Portfolio Allocation */}
                  <motion.div 
                    whileHover={{ scale: 1.02 }}
                    className={`p-6 rounded-xl ${darkMode ? 'bg-gray-800' : 'bg-white'} shadow-lg`}
                  >
                    <div className="flex justify-between items-center mb-4">
                      <h3 className="font-semibold">Portfolio Allocation</h3>
                      <div className="flex space-x-2">
                        {['7d', '1m', '1y'].map((range) => (
                          <button 
                            key={range}
                            onClick={() => setTimeRange(range)} 
                            className={`text-xs px-2 py-1 rounded ${
                              timeRange === range 
                                ? 'bg-[#FD4A36] text-white' 
                                : darkMode ? 'bg-gray-700' : 'bg-gray-200'
                            }`}
                          >
                            {range.toUpperCase()}
                          </button>
                        ))}
                      </div>
                    </div>
                    <div className="h-64">
                      <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                          <Pie
                            data={pieData}
                            cx="50%"
                            cy="50%"
                            innerRadius={60}
                            outerRadius={80}
                            paddingAngle={5}
                            dataKey="value"
                          >
                            {pieData.map((entry, index) => (
                              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                            ))}
                          </Pie>
                          <Tooltip 
                            formatter={(value) => [`${value}%`, 'Allocation']}
                            contentStyle={{
                              backgroundColor: darkMode ? '#1F2937' : '#FFFFFF',
                              borderColor: darkMode ? '#374151' : '#E5E7EB',
                              borderRadius: '0.5rem'
                            }}
                          />
                        </PieChart>
                      </ResponsiveContainer>
                    </div>
                    <div className="grid grid-cols-2 gap-2 mt-4">
                      {pieData.map((entry, index) => (
                        <div key={`legend-${index}`} className="flex items-center">
                          <div 
                            className="w-3 h-3 rounded-full mr-2" 
                            style={{ backgroundColor: COLORS[index % COLORS.length] }}
                          />
                          <span className={`text-sm ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                            {entry.name}: {entry.value}%
                          </span>
                        </div>
                      ))}
                    </div>
                  </motion.div>

                  {/* Price History */}
                  <motion.div 
                    whileHover={{ scale: 1.02 }}
                    className={`p-6 rounded-xl ${darkMode ? 'bg-gray-800' : 'bg-white'} shadow-lg lg:col-span-2`}
                  >
                    <div className="flex justify-between items-center mb-4">
                      <h3 className="font-semibold">Price History</h3>
                      <div className="flex items-center space-x-2">
                        <FiBarChart2 className={`${darkMode ? 'text-gray-400' : 'text-gray-600'}`} />
                        <select 
                          className={`text-sm rounded ${darkMode ? 'bg-gray-700 text-white' : 'bg-gray-100 text-gray-900'} px-2 py-1`}
                          value={timeRange}
                          onChange={(e) => setTimeRange(e.target.value)}
                        >
                          <option value="7d">Last 7 days</option>
                          <option value="1m">Last month</option>
                          <option value="1y">Last year</option>
                        </select>
                      </div>
                    </div>
                    <div className="h-64">
                      <ResponsiveContainer width="100%" height="100%">
                        <AreaChart
                          data={priceHistoryData}
                          margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
                        >
                          <defs>
                            <linearGradient id="colorBtc" x1="0" y1="0" x2="0" y2="1">
                              <stop offset="5%" stopColor="#FD4A36" stopOpacity={0.8}/>
                              <stop offset="95%" stopColor="#FD4A36" stopOpacity={0}/>
                            </linearGradient>
                            <linearGradient id="colorEth" x1="0" y1="0" x2="0" y2="1">
                              <stop offset="5%" stopColor="#8884d8" stopOpacity={0.8}/>
                              <stop offset="95%" stopColor="#8884d8" stopOpacity={0}/>
                            </linearGradient>
                          </defs>
                          <CartesianGrid strokeDasharray="3 3" stroke={darkMode ? '#374151' : '#E5E7EB'} />
                          <XAxis 
                            dataKey="name" 
                            tick={{ fill: darkMode ? '#9CA3AF' : '#6B7280' }} 
                          />
                          <YAxis 
                            tick={{ fill: darkMode ? '#9CA3AF' : '#6B7280' }} 
                          />
                          <Tooltip 
                            formatter={(value) => [formatCurrency(Number(value)), 'Price']}
                            contentStyle={{
                              backgroundColor: darkMode ? '#1F2937' : '#FFFFFF',
                              borderColor: darkMode ? '#374151' : '#E5E7EB',
                              borderRadius: '0.5rem'
                            }}
                          />
                          <Area 
                            type="monotone" 
                            dataKey="btc" 
                            stroke="#FD4A36" 
                            fillOpacity={1} 
                            fill="url(#colorBtc)" 
                          />
                          <Area 
                            type="monotone" 
                            dataKey="eth" 
                            stroke="#8884d8" 
                            fillOpacity={1} 
                            fill="url(#colorEth)" 
                          />
                        </AreaChart>
                      </ResponsiveContainer>
                    </div>
                  </motion.div>
                </div>

                {/* Assets Table */}
                <motion.div 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className={`p-6 rounded-xl ${darkMode ? 'bg-gray-800' : 'bg-white'} shadow-lg`}
                >
                  <h3 className="font-semibold mb-4">Your Assets</h3>
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead>
                        <tr className={`${darkMode ? 'border-b border-gray-700' : 'border-b border-gray-200'}`}>
                          <th className="text-left py-3 px-4">Asset</th>
                          <th className="text-right py-3 px-4">Balance</th>
                          <th className="text-right py-3 px-4">Price</th>
                          <th className="text-right py-3 px-4">Value</th>
                          <th className="text-right py-3 px-4">24h</th>
                        </tr>
                      </thead>
                      <tbody>
                        {portfolioData.map((asset, index) => (
                          <tr 
                            key={index} 
                            className={`${index !== portfolioData.length - 1 ? (darkMode ? 'border-b border-gray-700' : 'border-b border-gray-200') : ''}`}
                          >
                            <td className="py-3 px-4">
                              <div className="flex items-center">
                                <div className="mr-3">
                                  {asset.icon}
                                </div>
                                <div>
                                  <p className="font-medium">{asset.name}</p>
                                  <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                                    {asset.name === 'BTC' ? 'Bitcoin' : 
                                     asset.name === 'ETH' ? 'Ethereum' : 
                                     asset.name === 'BNB' ? 'Binance Coin' : 
                                     asset.name === 'SOL' ? 'Solana' : 
                                     asset.name === 'XRP' ? 'Ripple' : 'Tether'}
                                  </p>
                                </div>
                              </div>
                            </td>
                            <td className="text-right py-3 px-4">
                              <p className="font-medium">
                                {isLoading ? '...' : formatCrypto(getAssetBalance(asset.name))} {asset.name}
                              </p>
                            </td>
                            <td className="text-right py-3 px-4">
                              <p className="font-medium">
                                {formatCurrency(getAssetPrice(asset.name))}
                              </p>
                            </td>
                            <td className="text-right py-3 px-4">
                              <p className="font-medium">
                                {formatCurrency(asset.value)}
                              </p>
                            </td>
                            <td className="text-right py-3 px-4">
                              <div className={`flex items-center justify-end ${asset.change >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                                {asset.change >= 0 ? (
                                  <FiArrowUpRight className="mr-1" />
                                ) : (
                                  <FiArrowDownRight className="mr-1" />
                                )}
                                <span>{asset.change >= 0 ? '+' : ''}{asset.change.toFixed(2)}%</span>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </motion.div>
              </div>
            )}

            {/* Market Tab */}
            {activeTab === 'market' && (
              <div className="space-y-6">
                <motion.div 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className={`p-6 rounded-xl ${darkMode ? 'bg-gray-800' : 'bg-white'} shadow-lg`}
                >
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="font-semibold">Market Overview</h3>
                    <div className="flex items-center space-x-2">
                      <FiActivity className={`${darkMode ? 'text-gray-400' : 'text-gray-600'}`} />
                      <select 
                        className={`text-sm rounded ${darkMode ? 'bg-gray-700 text-white' : 'bg-gray-100 text-gray-900'} px-2 py-1`}
                        value={timeRange}
                        onChange={(e) => setTimeRange(e.target.value)}
                      >
                        <option value="7d">Top Gainers</option>
                        <option value="1m">Top Losers</option>
                        <option value="1y">By Volume</option>
                      </select>
                    </div>
                  </div>
                  <div className="h-96">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart
                        data={portfolioData}
                        margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                      >
                        <CartesianGrid strokeDasharray="3 3" stroke={darkMode ? '#374151' : '#E5E7EB'} />
                        <XAxis 
                          dataKey="name" 
                          tick={{ fill: darkMode ? '#9CA3AF' : '#6B7280' }} 
                        />
                        <YAxis 
                          tick={{ fill: darkMode ? '#9CA3AF' : '#6B7280' }} 
                        />
                        <Tooltip 
                          formatter={(value) => [formatCurrency(Number(value)), 'Value']}
                          contentStyle={{
                            backgroundColor: darkMode ? '#1F2937' : '#FFFFFF',
                            borderColor: darkMode ? '#374151' : '#E5E7EB',
                            borderRadius: '0.5rem'
                          }}
                        />
                        <Bar dataKey="value" fill="#FD4A36" radius={[4, 4, 0, 0]} />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </motion.div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Top Gainers */}
                  <motion.div 
                    whileHover={{ scale: 1.02 }}
                    className={`p-6 rounded-xl ${darkMode ? 'bg-gray-800' : 'bg-white'} shadow-lg`}
                  >
                    <h3 className="font-semibold mb-4">Top Gainers</h3>
                    <div className="space-y-4">
                      {portfolioData.filter(c => c.change > 0).map((crypto, index) => (
                        <div 
                          key={index} 
                          className={`flex items-center justify-between p-3 rounded-lg ${darkMode ? 'bg-gray-700' : 'bg-gray-100'}`}
                        >
                          <div className="flex items-center">
                            <div className="mr-3">
                              {crypto.icon}
                            </div>
                            <div>
                              <p className="font-medium">{crypto.name}</p>
                              <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                                {formatCurrency(getAssetPrice(crypto.name))}
                              </p>
                            </div>
                          </div>
                          <div className="text-green-500 flex items-center">
                            <FiArrowUpRight className="mr-1" />
                            <span>+{crypto.change.toFixed(2)}%</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </motion.div>

                  {/* Top Losers */}
                  <motion.div 
                    whileHover={{ scale: 1.02 }}
                    className={`p-6 rounded-xl ${darkMode ? 'bg-gray-800' : 'bg-white'} shadow-lg`}
                  >
                    <h3 className="font-semibold mb-4">Top Losers</h3>
                    <div className="space-y-4">
                      {portfolioData.filter(c => c.change < 0).map((crypto, index) => (
                        <div 
                          key={index} 
                          className={`flex items-center justify-between p-3 rounded-lg ${darkMode ? 'bg-gray-700' : 'bg-gray-100'}`}
                        >
                          <div className="flex items-center">
                            <div className="mr-3">
                              {crypto.icon}
                            </div>
                            <div>
                              <p className="font-medium">{crypto.name}</p>
                              <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                                {formatCurrency(getAssetPrice(crypto.name))}
                              </p>
                            </div>
                          </div>
                          <div className="text-red-500 flex items-center">
                            <FiArrowDownRight className="mr-1" />
                            <span>{crypto.change.toFixed(2)}%</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </motion.div>
                </div>
              </div>
            )}

            {/* Analytics Tab */}
            {activeTab === 'analytics' && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Trading Volume */}
                <motion.div 
                  whileHover={{ scale: 1.02 }}
                  className={`p-6 rounded-xl ${darkMode ? 'bg-gray-800' : 'bg-white'} shadow-lg`}
                >
                  <h3 className="font-semibold mb-4">Trading Volume</h3>
                  <div className="h-64">
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart
                        data={priceHistoryData}
                        margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                      >
                        <CartesianGrid strokeDasharray="3 3" stroke={darkMode ? '#374151' : '#E5E7EB'} />
                        <XAxis 
                          dataKey="name" 
                          tick={{ fill: darkMode ? '#9CA3AF' : '#6B7280' }} 
                        />
                        <YAxis 
                          tick={{ fill: darkMode ? '#9CA3AF' : '#6B7280' }} 
                        />
                        <Tooltip 
                          formatter={(value) => [formatCurrency(Number(value)), 'Volume']}
                          contentStyle={{
                            backgroundColor: darkMode ? '#1F2937' : '#FFFFFF',
                            borderColor: darkMode ? '#374151' : '#E5E7EB',
                            borderRadius: '0.5rem'
                          }}
                        />
                        <Line 
                          type="monotone" 
                          dataKey="btc" 
                          stroke="#FD4A36" 
                          strokeWidth={2} 
                          dot={{ r: 4 }} 
                          activeDot={{ r: 6 }} 
                        />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                </motion.div>

                {/* Market Cap Distribution */}
                <motion.div 
                  whileHover={{ scale: 1.02 }}
                  className={`p-6 rounded-xl ${darkMode ? 'bg-gray-800' : 'bg-white'} shadow-lg`}
                >
                  <h3 className="font-semibold mb-4">Market Cap Distribution</h3>
                  <div className="h-64">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={pieData}
                          cx="50%"
                          cy="50%"
                          labelLine={false}
                          outerRadius={80}
                          fill="#8884d8"
                          dataKey="value"
                          label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                        >
                          {pieData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                          ))}
                        </Pie>
                        <Tooltip 
                          formatter={(value) => [`${value}%`, 'Allocation']}
                          contentStyle={{
                            backgroundColor: darkMode ? '#1F2937' : '#FFFFFF',
                            borderColor: darkMode ? '#374151' : '#E5E7EB',
                            borderRadius: '0.5rem'
                          }}
                        />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                </motion.div>

                {/* Watchlist */}
                <motion.div 
                  whileHover={{ scale: 1.02 }}
                  className={`p-6 rounded-xl ${darkMode ? 'bg-gray-800' : 'bg-white'} shadow-lg`}
                >
                  <h3 className="font-semibold mb-4">Your Watchlist</h3>
                  <div className="space-y-3">
                    {[
                      { name: 'DOGE', icon: <SiDogecoin className="text-yellow-500" />, price: 0.1234, change: 8.2 },
                      { name: 'LTC', icon: <SiLitecoin className="text-gray-400" />, price: 78.56, change: -1.3 },
                      { name: 'DOT', icon: <div className="text-pink-500">●</div>, price: 6.78, change: 2.1 },
                    ].map((item, index) => (
                      <div 
                        key={index} 
                        className={`flex items-center justify-between p-3 rounded-lg ${darkMode ? 'bg-gray-700' : 'bg-gray-100'}`}
                      >
                        <div className="flex items-center">
                          <div className="mr-3">
                            {item.icon}
                          </div>
                          <div>
                            <p className="font-medium">{item.name}</p>
                            <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                              {formatCurrency(item.price)}
                            </p>
                          </div>
                        </div>
                        <div className={`flex items-center ${item.change >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                          {item.change >= 0 ? (
                            <FiArrowUpRight className="mr-1" />
                          ) : (
                            <FiArrowDownRight className="mr-1" />
                          )}
                          <span>{item.change >= 0 ? '+' : ''}{item.change.toFixed(1)}%</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </motion.div>

                {/* Recent Activity */}
                <motion.div 
                  whileHover={{ scale: 1.02 }}
                  className={`p-6 rounded-xl ${darkMode ? 'bg-gray-800' : 'bg-white'} shadow-lg`}
                >
                  <h3 className="font-semibold mb-4">Recent Activity</h3>
                  <div className="space-y-4">
                    {[
                      { type: 'buy', asset: 'BTC', amount: 0.005, value: 312.72, time: '2 mins ago' },
                      { type: 'sell', asset: 'ETH', amount: 0.42, value: 1437.05, time: '1 hour ago' },
                      { type: 'swap', asset: 'USDT to SOL', amount: 500, value: 3.5, time: '5 hours ago' },
                    ].map((activity, index) => (
                      <div key={index} className="flex items-start">
                        <div className={`p-2 rounded-full mr-3 ${
                          activity.type === 'buy' ? 'bg-green-500 bg-opacity-20 text-green-500' : 
                          activity.type === 'sell' ? 'bg-red-500 bg-opacity-20 text-red-500' : 
                          'bg-blue-500 bg-opacity-20 text-blue-500'
                        }`}>
                          {activity.type === 'buy' ? 'B' : activity.type === 'sell' ? 'S' : '↔'}
                        </div>
                        <div className="flex-1">
                          <div className="flex justify-between">
                            <p className="font-medium capitalize">{activity.type} {activity.asset}</p>
                            <p className={`${
                              activity.type === 'buy' ? 'text-green-500' : 
                              activity.type === 'sell' ? 'text-red-500' : 
                              'text-blue-500'
                            }`}>
                              {activity.type === 'buy' ? '+' : activity.type === 'sell' ? '-' : ''}
                              {activity.amount} {activity.asset.split(' ')[0]}
                            </p>
                          </div>
                          <div className="flex justify-between">
                            <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                              {activity.time}
                            </p>
                            <p className={`text-sm ${
                              darkMode ? 'text-gray-300' : 'text-gray-700'
                            }`}>
                              {formatCurrency(activity.value)}
                            </p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </motion.div>
              </div>
            )}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  )
}

export default CryptoDashboard;