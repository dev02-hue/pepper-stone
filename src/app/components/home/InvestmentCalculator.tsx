/* eslint-disable @next/next/no-img-element */
/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import { useState, useEffect, useCallback } from "react";
import axios from "axios";
import { motion, AnimatePresence } from "framer-motion";
import { FiRefreshCw, FiArrowRight, FiChevronDown, FiCheck, FiStar } from "react-icons/fi";
import { FaBitcoin, FaEthereum } from "react-icons/fa";
import { SiBinance, SiTether, SiSolana, SiRipple, SiCardano, SiDogecoin } from "react-icons/si";

const cryptoIcons: Record<string, React.ReactNode> = {
  bitcoin: <FaBitcoin className="text-orange-500" />,
  ethereum: <FaEthereum className="text-purple-500" />,
  tether: <SiTether className="text-green-500" />,
  binancecoin: <SiBinance className="text-yellow-500" />,
  solana: <SiSolana className="text-blue-500" />,
  ripple: <SiRipple className="text-blue-400" />,
  cardano: <SiCardano className="text-blue-600" />,
  dogecoin: <SiDogecoin className="text-yellow-400" />,
};

// Types
type Plan = {
  id: string;
  title: string;
  percent: string;
  duration: string;
  range: string;
  description: string;
  features: string[];
  colors: string;
  accent: string;
  popular?: boolean;
};

type Cryptocurrency = {
  id: string;
  symbol: string;
  name: string;
};

type NewsItem = {
  title: string;
  url: string;
  source: string;
  publishedAt: string;
  image?: string;
};

type ConversionResult = {
  from: string;
  to: string;
  amount: number;
  result: number;
  rate: number;
};

const plans: Plan[] = [
  {
    id: "starter",
    title: "Starter",
    percent: "400%",
    duration: "30 Days Term",
    range: "$300 - $999",
    description: "With a lower entry point of $300, the potential returns are substantial — up to $3,996 in 30 days.",
    features: ["Capital returned", "24/7 Support", "5% Referral Bonus"],
    colors: "from-blue-500 to-blue-600",
    accent: "bg-blue-100 text-blue-600",
  },
  {
    id: "professional",
    title: "Professional",
    percent: "500%",
    duration: "32 Days Term",
    range: "$1,000 - $4,999",
    description: "Starting with as little as $1,000, you can potentially earn up to $24,995 in just 32 days.",
    features: ["Capital returned", "Priority Support", "7% Referral Bonus", "Weekly Insights"],
    colors: "from-purple-500 to-purple-600",
    accent: "bg-purple-100 text-purple-600",
    popular: true,
  },
  {
    id: "enterprise",
    title: "Enterprise",
    percent: "550%",
    duration: "35 Days Term",
    range: "$5,000 - $100,000",
    description: "With a minimum of $5,000, your returns could reach as high as $550,000 within 35 days.",
    features: ["Capital returned", "VIP Support", "10% Referral Bonus", "Dedicated Manager", "Custom Strategies"],
    colors: "from-amber-500 to-amber-600",
    accent: "bg-amber-100 text-amber-600",
  },
];

const popularCryptos = [
  { id: "bitcoin", symbol: "BTC", name: "Bitcoin" },
  { id: "ethereum", symbol: "ETH", name: "Ethereum" },
  { id: "tether", symbol: "USDT", name: "Tether" },
  { id: "binancecoin", symbol: "BNB", name: "BNB" },
  { id: "solana", symbol: "SOL", name: "Solana" },
  { id: "ripple", symbol: "XRP", name: "XRP" },
  { id: "cardano", symbol: "ADA", name: "Cardano" },
  { id: "dogecoin", symbol: "DOGE", name: "Dogecoin" },
];

const fallbackNews: NewsItem[] = [
  {
    title: "Bitcoin Surges Past $60,000 as Institutional Adoption Grows",
    url: "https://example.com/bitcoin-surge",
    source: "Crypto News",
    publishedAt: new Date().toISOString(),
    image: "https://source.unsplash.com/random/600x400/?bitcoin",
  },
  {
    title: "Ethereum 2.0 Upgrade Nears Completion, ETH Price Reacts Positively",
    url: "https://example.com/ethereum-upgrade",
    source: "Blockchain Daily",
    publishedAt: new Date(Date.now() - 86400000).toISOString(),
    image: "https://source.unsplash.com/random/600x400/?ethereum",
  },
  {
    title: "DeFi Projects See Record TVL as Crypto Markets Recover",
    url: "https://example.com/defi-record",
    source: "DeFi Pulse",
    publishedAt: new Date(Date.now() - 172800000).toISOString(),
    image: "https://source.unsplash.com/random/600x400/?defi",
  },
];

export default function InvestmentCalculator() {
  const [selectedPlan, setSelectedPlan] = useState<Plan>(plans[0]);
  const [amount, setAmount] = useState<number | "">("");
  const [activeTab, setActiveTab] = useState<"investment" | "converter" | "news">("investment");
  const [fromCrypto, setFromCrypto] = useState<Cryptocurrency>(popularCryptos[0]);
  const [toCrypto, setToCrypto] = useState<Cryptocurrency>(popularCryptos[1]);
  const [cryptoAmount, setCryptoAmount] = useState<number | "">(1);
  const [conversionResult, setConversionResult] = useState<ConversionResult | null>(null);
  const [isConverting, setIsConverting] = useState(false);
  const [conversionError, setConversionError] = useState("");
  const [news, setNews] = useState<NewsItem[]>([]);
  const [isLoadingNews, setIsLoadingNews] = useState(false);
  const [newsError, setNewsError] = useState("");
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [dropdownType, setDropdownType] = useState<"from" | "to" | null>(null);

  // Parse range string to get min and max values
  const getPlanRange = (range: string) => {
    const [minStr, maxStr] = range.replace(/[$,]/g, '').split(' - ');
    return {
      min: parseInt(minStr),
      max: parseInt(maxStr)
    };
  };

  const planRange = getPlanRange(selectedPlan.range);
  const total = typeof amount === "number" ? (amount * parseInt(selectedPlan.percent)) / 100 : 0;
  const profit = total - (typeof amount === "number" ? amount : 0);

  const fetchNews = async () => {
    setIsLoadingNews(true);
    setNewsError("");
    try {
      const response = await axios.get(
        `https://api.rss2json.com/v1/api.json?rss_url=https://cointelegraph.com/rss`
      );
      
      if (response.data.items) {
        const formattedNews = response.data.items.slice(0, 6).map((item: any) => ({
          title: item.title,
          url: item.link,
          source: "CoinTelegraph",
          publishedAt: item.pubDate,
          image: item.enclosure?.link || `https://source.unsplash.com/random/600x400/?crypto,${Math.floor(Math.random() * 100)}`,
        }));
        setNews(formattedNews);
      } else {
        setNews(fallbackNews);
        setNewsError("Using fallback news data");
      }
    } catch (error) {
      console.error("Error fetching news:", error);
      setNews(fallbackNews);
      setNewsError("Failed to fetch news. Showing sample data.");
    } finally {
      setIsLoadingNews(false);
    }
  };

  const convertCurrency = useCallback(async () => {
    if (typeof cryptoAmount !== "number" || cryptoAmount <= 0) {
      setConversionError("Please enter a valid amount");
      return;
    }

    setIsConverting(true);
    setConversionError("");
    try {
      const fromResponse = await axios.get(
        `https://api.coingecko.com/api/v3/simple/price?ids=${fromCrypto.id}&vs_currencies=usd`
      );
      
      const toResponse = await axios.get(
        `https://api.coingecko.com/api/v3/simple/price?ids=${toCrypto.id}&vs_currencies=usd`
      );
      
      const fromPrice = fromResponse.data[fromCrypto.id]?.usd;
      const toPrice = toResponse.data[toCrypto.id]?.usd;
      
      if (!fromPrice || !toPrice) {
        throw new Error("Could not get conversion rates");
      }
      
      const rate = fromPrice / toPrice;
      const result = cryptoAmount * rate;
      
      setConversionResult({
        from: fromCrypto.symbol,
        to: toCrypto.symbol,
        amount: cryptoAmount,
        result,
        rate,
      });
    } catch (error) {
      console.error("Error converting currency:", error);
      setConversionError("Failed to convert. Please try again later.");
    } finally {
      setIsConverting(false);
    }
  }, [cryptoAmount, fromCrypto, toCrypto]);

  useEffect(() => {
    if (activeTab === "news" && news.length === 0) {
      fetchNews();
    }
  }, [activeTab, news.length]);

  useEffect(() => {
    if (activeTab === "converter" && cryptoAmount && typeof cryptoAmount === "number") {
      const timer = setTimeout(() => {
        convertCurrency();
      }, 500);
      
      return () => clearTimeout(timer);
    }
  }, [cryptoAmount, fromCrypto, toCrypto, activeTab, convertCurrency]);

  const openDropdown = (type: "from" | "to") => {
    setDropdownType(type);
    setIsDropdownOpen(true);
  };

  const selectCrypto = (crypto: Cryptocurrency) => {
    if (dropdownType === "from") {
      setFromCrypto(crypto);
    } else {
      setToCrypto(crypto);
    }
    setIsDropdownOpen(false);
    setDropdownType(null);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 py-12 px-4 sm:px-6 lg:px-8">
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="max-w-7xl mx-auto bg-slate-800/50 rounded-3xl shadow-2xl overflow-hidden backdrop-blur-lg border border-slate-700/50"
      >
        {/* Header */}
        <div className="relative bg-gradient-to-r from-blue-600 via-purple-600 to-cyan-600 p-8 text-center overflow-hidden">
          <div className="absolute inset-0 bg-black/20"></div>
          <div className="relative z-10">
            <motion.h1 
              className="text-4xl md:text-5xl font-bold text-white mb-4"
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              TTRADE CAPITAL
            </motion.h1>
            <motion.p 
              className="text-blue-100 text-lg md:text-xl font-light"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
            >
              Advanced Investment Platform with Smart Tools
            </motion.p>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="flex border-b border-slate-700/50 bg-slate-800/30">
          {["investment", "converter", "news"].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab as any)}
              className={`flex-1 py-5 font-semibold text-sm relative group ${
                activeTab === tab
                  ? "text-white"
                  : "text-slate-400 hover:text-slate-300"
              }`}
            >
              <span className="relative z-10">
                {tab === "investment" && "Investment Plans"}
                {tab === "converter" && "Crypto Converter"}
                {tab === "news" && "Market News"}
              </span>
              {activeTab === tab && (
                <motion.div 
                  layoutId="tabIndicator"
                  className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-500 to-purple-500"
                  transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                />
              )}
              <div className={`absolute inset-0 bg-gradient-to-r from-blue-600/10 to-purple-600/10 opacity-0 group-hover:opacity-100 transition-opacity ${activeTab === tab ? 'opacity-100' : ''}`}></div>
            </button>
          ))}
        </div>

        {/* Content Area */}
        <div className="p-6 md:p-8">
          <AnimatePresence mode="wait">
            {/* Investment Calculator */}
            {activeTab === "investment" && (
              <motion.div
                key="investment"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                transition={{ duration: 0.3 }}
                className="space-y-8"
              >
                <div className="text-center">
                  <h2 className="text-3xl font-bold text-white mb-3">Premium Investment Solutions</h2>
                  <p className="text-slate-400 max-w-2xl mx-auto">Choose from our carefully crafted investment plans designed to maximize your returns with secure capital protection.</p>
                </div>
                
                {/* Plan Cards */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                  {plans.map((plan) => (
                    <motion.div
                      key={plan.id}
                      whileHover={{ y: -8, scale: 1.02 }}
                      className={`relative rounded-2xl overflow-hidden cursor-pointer transition-all duration-300 ${
                        selectedPlan.id === plan.id ? 'ring-3 ring-white/50 transform scale-105' : ''
                      } ${plan.popular ? 'ring-2 ring-yellow-400' : ''}`}
                      onClick={() => setSelectedPlan(plan)}
                    >
                      {plan.popular && (
                        <div className="absolute top-4 right-4 z-10">
                          <span className="bg-yellow-400 text-yellow-900 px-3 py-1 rounded-full text-sm font-bold flex items-center gap-1">
                            <FiStar className="fill-current" /> POPULAR
                          </span>
                        </div>
                      )}
                      
                      <div className={`h-2 bg-gradient-to-r ${plan.colors}`}></div>
                      
                      <div className="bg-slate-800/80 p-6">
                        <div className="text-center mb-6">
                          <h3 className="text-2xl font-bold text-white mb-2">{plan.title}</h3>
                          <span className={`inline-block px-3 py-1 rounded-full text-sm font-semibold ${plan.accent}`}>
                            {plan.duration}
                          </span>
                        </div>
                        
                        <div className="text-center mb-6">
                          <p className="text-4xl font-bold text-white mb-2">
                            {plan.percent}
                          </p>
                          <p className="text-slate-300 font-medium">{plan.range}</p>
                        </div>
                        
                        <p className="text-slate-400 text-sm text-center mb-6">{plan.description}</p>
                        
                        <ul className="space-y-3 mb-6">
                          {plan.features.map((feature, index) => (
                            <li key={index} className="flex items-center text-slate-300">
                              <FiCheck className="text-green-400 mr-3 flex-shrink-0" />
                              <span>{feature}</span>
                            </li>
                          ))}
                        </ul>
                        
                        <div className={`text-center py-3 rounded-lg font-semibold ${selectedPlan.id === plan.id ? 'bg-white/10 text-white' : 'bg-slate-700/50 text-slate-300'}`}>
                          {selectedPlan.id === plan.id ? 'Selected Plan' : 'Select Plan'}
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>

                {/* Calculator Section */}
                <div className="mt-8 bg-slate-800/50 rounded-2xl p-8 border border-slate-700/50">
                  <h3 className="text-2xl font-bold text-white mb-2">Earnings Calculator</h3>
                  <p className="text-slate-400 mb-6">Calculate your potential returns with the {selectedPlan.title} plan</p>
                  
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    <div>
                      <label htmlFor="amount" className="block text-sm font-medium text-slate-300 mb-3">
                        Investment Amount ($)
                      </label>
                      <div className="relative">
                        <span className="absolute left-4 top-1/2 transform -translate-y-1/2 text-slate-400 text-lg">$</span>
                        <input
                          id="amount"
                          type="number"
                          min={planRange.min}
                          max={planRange.max}
                          value={amount}
                          onChange={(e) => setAmount(e.target.value === "" ? "" : Number(e.target.value))}
                          className="w-full pl-12 pr-4 py-4 bg-slate-700/50 border border-slate-600 rounded-xl text-lg font-medium text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                          placeholder={`${planRange.min} - ${planRange.max}`}
                        />
                      </div>
                      <p className="text-xs text-slate-500 mt-2">
                        Investment range: {selectedPlan.range}
                      </p>
                    </div>

                    <div className="space-y-4">
                      {typeof amount === "number" && amount >= planRange.min && amount <= planRange.max ? (
                        <motion.div
                          initial={{ opacity: 0, scale: 0.95 }}
                          animate={{ opacity: 1, scale: 1 }}
                          className="space-y-4"
                        >
                          <div className="grid grid-cols-2 gap-4">
                            <div className="bg-slate-700/30 p-4 rounded-xl border border-slate-600/50">
                              <p className="text-sm text-slate-400">Investment</p>
                              <p className="text-xl font-bold text-white">${amount.toLocaleString()}</p>
                            </div>
                            <div className="bg-slate-700/30 p-4 rounded-xl border border-slate-600/50">
                              <p className="text-sm text-slate-400">Profit</p>
                              <p className="text-xl font-bold text-green-400">+${profit.toLocaleString()}</p>
                            </div>
                          </div>
                          <div className="bg-gradient-to-r from-blue-500/20 to-purple-500/20 p-4 rounded-xl border border-blue-500/30">
                            <p className="text-sm text-blue-300">Total Return</p>
                            <p className="text-2xl font-bold text-white">${total.toLocaleString()}</p>
                            <p className="text-xs text-blue-300 mt-1">After {selectedPlan.duration.toLowerCase()}</p>
                          </div>
                        </motion.div>
                      ) : amount !== "" ? (
                        <div className="bg-red-500/10 border border-red-500/30 text-red-200 p-4 rounded-xl">
                          Please enter an amount between {selectedPlan.range}
                        </div>
                      ) : (
                        <div className="bg-blue-500/10 border border-blue-500/30 text-blue-200 p-4 rounded-xl">
                          Enter an amount to calculate your potential returns
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </motion.div>
            )}

            {/* Crypto Converter */}
            {activeTab === "converter" && (
              <motion.div
                key="converter"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                transition={{ duration: 0.3 }}
                className="space-y-8"
              >
                <div className="text-center">
                  <h2 className="text-3xl font-bold text-white mb-3">Real-time Crypto Converter</h2>
                  <p className="text-slate-400">Convert between cryptocurrencies with live market rates</p>
                </div>
                
                <div className="bg-slate-800/50 rounded-2xl p-8 border border-slate-700/50">
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    {/* From Currency */}
                    <div>
                      <label className="block text-sm font-medium text-slate-300 mb-3">From</label>
                      <div className="relative">
                        <button
                          onClick={() => openDropdown("from")}
                          className="w-full flex items-center justify-between bg-slate-700/50 border border-slate-600 rounded-xl px-4 py-4 text-white hover:bg-slate-700/70 transition-colors"
                        >
                          <div className="flex items-center">
                            <span className="mr-3 text-2xl">
                              {cryptoIcons[fromCrypto.id] || <FaBitcoin />}
                            </span>
                            <div className="text-left">
                              <div className="font-semibold">{fromCrypto.name}</div>
                              <div className="text-slate-400 text-sm">{fromCrypto.symbol}</div>
                            </div>
                          </div>
                          <FiChevronDown className={`transition-transform ${isDropdownOpen && dropdownType === "from" ? "rotate-180" : ""}`} />
                        </button>
                      </div>

                      {/* Amount Input */}
                      <div className="mt-4">
                        <label htmlFor="fromAmount" className="block text-sm font-medium text-slate-300 mb-3">
                          Amount
                        </label>
                        <input
                          id="fromAmount"
                          type="number"
                          min="0"
                          step="0.00000001"
                          value={cryptoAmount}
                          onChange={(e) => setCryptoAmount(e.target.value === "" ? "" : Number(e.target.value))}
                          className="w-full px-4 py-4 bg-slate-700/50 border border-slate-600 rounded-xl text-lg font-medium text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          placeholder="0.00"
                        />
                      </div>
                    </div>

                    {/* To Currency */}
                    <div>
                      <label className="block text-sm font-medium text-slate-300 mb-3">To</label>
                      <div className="relative">
                        <button
                          onClick={() => openDropdown("to")}
                          className="w-full flex items-center justify-between bg-slate-700/50 border border-slate-600 rounded-xl px-4 py-4 text-white hover:bg-slate-700/70 transition-colors"
                        >
                          <div className="flex items-center">
                            <span className="mr-3 text-2xl">
                              {cryptoIcons[toCrypto.id] || <FaBitcoin />}
                            </span>
                            <div className="text-left">
                              <div className="font-semibold">{toCrypto.name}</div>
                              <div className="text-slate-400 text-sm">{toCrypto.symbol}</div>
                            </div>
                          </div>
                          <FiChevronDown className={`transition-transform ${isDropdownOpen && dropdownType === "to" ? "rotate-180" : ""}`} />
                        </button>
                      </div>

                      {/* Conversion Result */}
                      <div className="mt-4">
                        <label className="block text-sm font-medium text-slate-300 mb-3">Conversion Result</label>
                        <div className="bg-slate-700/30 p-4 rounded-xl border border-slate-600/50 min-h-[64px] flex items-center">
                          {isConverting ? (
                            <div className="flex items-center space-x-3">
                              <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-500"></div>
                              <span className="text-slate-300">Converting...</span>
                            </div>
                          ) : conversionResult ? (
                            <div>
                              <p className="text-2xl font-bold text-white">
                                {conversionResult.result.toFixed(8)} {toCrypto.symbol}
                              </p>
                              <p className="text-sm text-slate-400 mt-1">
                                1 {fromCrypto.symbol} = {conversionResult.rate.toFixed(8)} {toCrypto.symbol}
                              </p>
                            </div>
                          ) : (
                            <p className="text-slate-400">Enter amount to see conversion</p>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Swap Button */}
                  <div className="flex justify-center mt-6">
                    <button
                      onClick={() => {
                        const temp = fromCrypto;
                        setFromCrypto(toCrypto);
                        setToCrypto(temp);
                      }}
                      className="p-4 bg-slate-700 hover:bg-slate-600 rounded-full transition-all transform hover:rotate-180"
                      aria-label="Swap currencies"
                    >
                      <FiRefreshCw className="h-6 w-6 text-white" />
                    </button>
                  </div>

                  {conversionError && (
                    <div className="mt-6 bg-red-500/10 border border-red-500/30 text-red-200 p-4 rounded-xl">
                      {conversionError}
                    </div>
                  )}
                </div>

                {/* Crypto Dropdown */}
                <AnimatePresence>
                  {isDropdownOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      className="absolute z-50 mt-2 w-full max-w-md bg-slate-800 border border-slate-700 rounded-xl shadow-lg overflow-hidden"
                    >
                      <div className="max-h-64 overflow-y-auto">
                        {popularCryptos.map((crypto) => (
                          <div
                            key={crypto.id}
                            className="flex items-center px-4 py-3 hover:bg-slate-700 cursor-pointer transition-colors"
                            onClick={() => selectCrypto(crypto)}
                          >
                            <span className="mr-3 text-xl">
                              {cryptoIcons[crypto.id] || <FaBitcoin />}
                            </span>
                            <div className="flex-1">
                              <div className="text-white font-medium">{crypto.name}</div>
                              <div className="text-slate-400 text-sm">{crypto.symbol}</div>
                            </div>
                            {(dropdownType === "from" && crypto.id === fromCrypto.id) || 
                             (dropdownType === "to" && crypto.id === toCrypto.id) ? (
                              <FiCheck className="text-green-400 ml-2" />
                            ) : null}
                          </div>
                        ))}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            )}

            {/* Crypto News */}
            {activeTab === "news" && (
              <motion.div
                key="news"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                transition={{ duration: 0.3 }}
                className="space-y-8"
              >
                <div className="flex justify-between items-center">
                  <div>
                    <h2 className="text-3xl font-bold text-white mb-2">Latest Market News</h2>
                    <p className="text-slate-400">Stay updated with the latest cryptocurrency market news</p>
                  </div>
                  <button
                    onClick={fetchNews}
                    disabled={isLoadingNews}
                    className="flex items-center space-x-2 bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-xl font-medium transition-colors disabled:opacity-50"
                  >
                    {isLoadingNews ? (
                      <>
                        <FiRefreshCw className="animate-spin" />
                        <span>Loading...</span>
                      </>
                    ) : (
                      <>
                        <FiRefreshCw />
                        <span>Refresh News</span>
                      </>
                    )}
                  </button>
                </div>
                
                {newsError && (
                  <div className="bg-yellow-500/10 border border-yellow-500/30 text-yellow-200 p-4 rounded-xl">
                    {newsError}
                  </div>
                )}
                
                {isLoadingNews && !news.length ? (
                  <div className="flex justify-center items-center h-64">
                    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {news.map((item, index) => (
                      <motion.a
                        key={index}
                        href={item.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.1 }}
                        whileHover={{ y: -5 }}
                        className="bg-slate-800/50 rounded-xl overflow-hidden shadow-lg hover:shadow-xl transition-all cursor-pointer border border-slate-700/50 group"
                      >
                        <div className="h-48 overflow-hidden relative">
                          <img
                            src={item.image || `https://source.unsplash.com/random/600x400/?crypto,${index}`}
                            alt={item.title}
                            className="w-full h-full object-cover transition-transform group-hover:scale-110"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 to-transparent"></div>
                        </div>
                        <div className="p-5">
                          <h3 className="text-lg font-bold text-white mb-3 line-clamp-2 group-hover:text-blue-300 transition-colors">{item.title}</h3>
                          <div className="flex justify-between items-center text-sm text-slate-400">
                            <span className="bg-slate-700/50 px-2 py-1 rounded">{item.source}</span>
                            <span>{new Date(item.publishedAt).toLocaleDateString()}</span>
                          </div>
                          <div className="mt-4 flex items-center text-blue-400 group-hover:text-blue-300 font-medium text-sm">
                            Read full article <FiArrowRight className="ml-2 transition-transform group-hover:translate-x-1" />
                          </div>
                        </div>
                      </motion.a>
                    ))}
                  </div>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.div>
    </div>
  );
}