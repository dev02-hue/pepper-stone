/* eslint-disable @next/next/no-img-element */
/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import { useState, useEffect, useCallback } from "react";
import axios from "axios";
import { motion, AnimatePresence,  } from "framer-motion";
import { FiRefreshCw, FiArrowRight,  FiChevronDown } from "react-icons/fi";
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
  name: string;
  percent: number;
  duration: string;
  range: { min: number; max: number };
  color: string;
  gradient: string;
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
    id: "bronze",
    name: "Starter Plan",
    percent: 400,
    duration: "24 Hours",
    range: { min: 300, max: 999 },
    color: "from-amber-600 to-amber-800",
    gradient: "bg-gradient-to-br from-amber-600 to-amber-800",
  },
  {
    id: "silver",
    name: "Growth Plan",
    percent: 500,
    duration: "24 Hours",
    range: { min: 1000, max: 4999 },
    color: "from-gray-500 to-gray-700",
    gradient: "bg-gradient-to-br from-gray-500 to-gray-700",
  },
  {
    id: "gold",
    name: "Premium Plan",
    percent: 550,
    duration: "48 Hours",
    range: { min: 5000, max: 100000 },
    color: "from-yellow-500 to-amber-600",
    gradient: "bg-gradient-to-br from-yellow-500 to-amber-600",
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

  const profit = typeof amount === "number" ? (amount * selectedPlan.percent) / 100 : 0;
  const total = typeof amount === "number" ? amount + profit : 0;

  const fetchNews = async () => {
    setIsLoadingNews(true);
    setNewsError("");
    try {
      const response = await axios.get(
        `https://api.rss2json.com/v1/api.json?rss_url=https://cointelegraph.com/rss`
      );
      
      if (response.data.items) {
        const formattedNews = response.data.items.slice(0, 5).map((item: any) => ({
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

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 py-12 px-4 sm:px-6 lg:px-8">
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="max-w-6xl mx-auto bg-gray-800 rounded-2xl shadow-2xl overflow-hidden backdrop-blur-sm bg-opacity-80"
      >
        {/* Header */}
        <div className="bg-gradient-to-r from-indigo-600 to-purple-600 p-6 text-center">
          <motion.h1 
            className="text-3xl font-bold text-white"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            TTRADE CAPITAL
          </motion.h1>
          <motion.p 
            className="text-indigo-100 mt-2"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
          >
            Smart tools for intelligent investors
          </motion.p>
        </div>

        {/* Navigation Tabs */}
        <div className="flex border-b border-gray-700">
          {["investment", "converter", "news"].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab as any)}
              className={`flex-1 py-4 font-medium text-sm relative ${
                activeTab === tab
                  ? "text-white"
                  : "text-gray-400 hover:text-gray-300"
              }`}
            >
              {tab === "investment" && "Investment Plans"}
              {tab === "converter" && "Crypto Converter"}
              {tab === "news" && "Market News"}
              {activeTab === tab && (
                <motion.div 
                  layoutId="tabIndicator"
                  className="absolute bottom-0 left-0 right-0 h-0.5 bg-indigo-500"
                  transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                />
              )}
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
                <h2 className="text-2xl font-bold text-white mb-6">Tailored Investment Solutions</h2>
                
                {/* Plan Cards */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {plans.map((plan) => (
                    <motion.div
                      key={plan.id}
                      whileHover={{ y: -5 }}
                      className={`${plan.gradient} rounded-xl p-1 cursor-pointer ${selectedPlan.id === plan.id ? "ring-2 ring-white ring-opacity-50" : ""}`}
                      onClick={() => setSelectedPlan(plan)}
                    >
                      <div className="bg-gray-800 bg-opacity-90 rounded-lg p-6 h-full">
                        <div className="flex justify-between items-start">
                          <h3 className="text-xl font-bold text-white">{plan.name}</h3>
                          <span className="px-3 py-1 rounded-full text-xs font-semibold bg-white bg-opacity-20 text-white">
                            {plan.duration}
                          </span>
                        </div>
                        <div className="mt-4">
                          <p className="text-3xl font-bold text-white">
                            {plan.percent}% <span className="text-sm font-normal text-gray-300">return</span>
                          </p>
                          <p className="text-gray-300 mt-2 text-sm">
                            ${plan.range.min.toLocaleString()} - ${plan.range.max.toLocaleString()}
                          </p>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>

                {/* Calculator Section */}
                <div className="mt-8 bg-gray-700 rounded-xl p-6">
                  <h3 className="text-lg font-semibold text-white mb-4">Project Your Earnings</h3>
                  
                  <div className="space-y-6">
                    <div>
                      <label htmlFor="amount" className="block text-sm font-medium text-gray-300 mb-2">
                        Investment Amount
                      </label>
                      <div className="relative">
                        <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">$</span>
                        <input
                          id="amount"
                          type="number"
                          min={selectedPlan.range.min}
                          max={selectedPlan.range.max}
                          value={amount}
                          onChange={(e) => setAmount(e.target.value === "" ? "" : Number(e.target.value))}
                          className="w-full pl-8 pr-4 py-3 bg-gray-800 border border-gray-600 rounded-lg text-lg font-medium text-white focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                          placeholder={`${selectedPlan.range.min} - ${selectedPlan.range.max}`}
                        />
                      </div>
                      <p className="text-xs text-gray-400 mt-2">
                        Minimum investment: ${selectedPlan.range.min.toLocaleString()}
                      </p>
                    </div>

                    {typeof amount === "number" && amount >= selectedPlan.range.min && amount <= selectedPlan.range.max ? (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        className="overflow-hidden"
                      >
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                          <div className="bg-gray-800 p-4 rounded-lg">
                            <p className="text-sm text-gray-400">Investment</p>
                            <p className="text-xl font-bold text-white">${amount.toLocaleString()}</p>
                          </div>
                          <div className="bg-gray-800 p-4 rounded-lg">
                            <p className="text-sm text-gray-400">Profit</p>
                            <p className="text-xl font-bold text-green-400">+${profit.toLocaleString(undefined, { maximumFractionDigits: 2 })}</p>
                          </div>
                          <div className="bg-gray-800 p-4 rounded-lg">
                            <p className="text-sm text-gray-400">Total Return</p>
                            <p className="text-xl font-bold text-indigo-400">${total.toLocaleString(undefined, { maximumFractionDigits: 2 })}</p>
                          </div>
                        </div>
                      </motion.div>
                    ) : amount !== "" ? (
                      <div className="bg-red-900 bg-opacity-30 border border-red-700 text-red-200 p-4 rounded-lg">
                        Please enter an amount between ${selectedPlan.range.min.toLocaleString()} and ${selectedPlan.range.max.toLocaleString()}
                      </div>
                    ) : (
                      <div className="bg-blue-900 bg-opacity-30 border border-blue-700 text-blue-200 p-4 rounded-lg">
                        Enter an amount to calculate your potential returns
                      </div>
                    )}
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
                <h2 className="text-2xl font-bold text-white mb-6">Real-time Crypto Converter</h2>
                
                <div className="bg-gray-700 rounded-xl p-6">
                  <div className="space-y-6">
                    {/* From Currency */}
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">From</label>
                      <div className="relative">
                        <button
                          onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                          className="w-full flex items-center justify-between bg-gray-800 border border-gray-600 rounded-lg px-4 py-3 text-white"
                        >
                          <div className="flex items-center">
                            <span className="mr-3 text-lg">
                              {cryptoIcons[fromCrypto.id] || <FaBitcoin />}
                            </span>
                            <span>
                              {fromCrypto.name} ({fromCrypto.symbol})
                            </span>
                          </div>
                          <FiChevronDown className={`transition-transform ${isDropdownOpen ? "rotate-180" : ""}`} />
                        </button>
                        
                        {isDropdownOpen && (
                          <motion.div
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="absolute z-10 mt-1 w-full bg-gray-800 border border-gray-600 rounded-lg shadow-lg overflow-hidden"
                          >
                            {popularCryptos.map((crypto) => (
                              <div
                                key={crypto.id}
                                className="flex items-center px-4 py-3 hover:bg-gray-700 cursor-pointer"
                                onClick={() => {
                                  setFromCrypto(crypto);
                                  setIsDropdownOpen(false);
                                }}
                              >
                                <span className="mr-3">
                                  {cryptoIcons[crypto.id] || <FaBitcoin />}
                                </span>
                                <span className="text-white">
                                  {crypto.name} ({crypto.symbol})
                                </span>
                              </div>
                            ))}
                          </motion.div>
                        )}
                      </div>
                    </div>

                    {/* Amount Input */}
                    <div>
                      <label htmlFor="fromAmount" className="block text-sm font-medium text-gray-300 mb-2">
                        Amount
                      </label>
                      <input
                        id="fromAmount"
                        type="number"
                        min="0"
                        step="0.00000001"
                        value={cryptoAmount}
                        onChange={(e) => setCryptoAmount(e.target.value === "" ? "" : Number(e.target.value))}
                        className="w-full px-4 py-3 bg-gray-800 border border-gray-600 rounded-lg text-lg font-medium text-white focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                        placeholder="0.00"
                      />
                    </div>

                    {/* Swap Button */}
                    <div className="flex justify-center">
                      <button
                        onClick={() => {
                          const temp = fromCrypto;
                          setFromCrypto(toCrypto);
                          setToCrypto(temp);
                        }}
                        className="p-3 bg-gray-600 hover:bg-gray-500 rounded-full transition-colors"
                        aria-label="Swap currencies"
                      >
                        <FiRefreshCw className="h-5 w-5 text-white" />
                      </button>
                    </div>

                    {/* To Currency */}
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">To</label>
                      <div className="relative">
                        <button
                          onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                          className="w-full flex items-center justify-between bg-gray-800 border border-gray-600 rounded-lg px-4 py-3 text-white"
                        >
                          <div className="flex items-center">
                            <span className="mr-3 text-lg">
                              {cryptoIcons[toCrypto.id] || <FaBitcoin />}
                            </span>
                            <span>
                              {toCrypto.name} ({toCrypto.symbol})
                            </span>
                          </div>
                          <FiChevronDown className={`transition-transform ${isDropdownOpen ? "rotate-180" : ""}`} />
                        </button>
                        
                        {isDropdownOpen && (
                          <motion.div
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="absolute z-10 mt-1 w-full bg-gray-800 border border-gray-600 rounded-lg shadow-lg overflow-hidden"
                          >
                            {popularCryptos.map((crypto) => (
                              <div
                                key={crypto.id}
                                className="flex items-center px-4 py-3 hover:bg-gray-700 cursor-pointer"
                                onClick={() => {
                                  setToCrypto(crypto);
                                  setIsDropdownOpen(false);
                                }}
                              >
                                <span className="mr-3">
                                  {cryptoIcons[crypto.id] || <FaBitcoin />}
                                </span>
                                <span className="text-white">
                                  {crypto.name} ({crypto.symbol})
                                </span>
                              </div>
                            ))}
                          </motion.div>
                        )}
                      </div>
                    </div>

                    {/* Conversion Result */}
                    <div className="bg-gray-800 p-4 rounded-lg">
                      <p className="text-sm text-gray-400 mb-2">Conversion Result</p>
                      {isConverting ? (
                        <div className="flex items-center space-x-2">
                          <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-indigo-500"></div>
                          <span className="text-gray-300">Converting...</span>
                        </div>
                      ) : conversionResult ? (
                        <div>
                          <p className="text-2xl font-bold text-white">
                            {conversionResult.result.toFixed(6)} {toCrypto.symbol}
                          </p>
                          <p className="text-sm text-gray-400 mt-1">
                            1 {fromCrypto.symbol} = {conversionResult.rate.toFixed(6)} {toCrypto.symbol}
                          </p>
                        </div>
                      ) : (
                        <p className="text-gray-400">Enter amount to see conversion</p>
                      )}
                    </div>

                    {conversionError && (
                      <div className="bg-red-900 bg-opacity-30 border border-red-700 text-red-200 p-3 rounded-lg">
                        {conversionError}
                      </div>
                    )}
                  </div>
                </div>
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
                className="space-y-6"
              >
                <div className="flex justify-between items-center">
                  <h2 className="text-2xl font-bold text-white">Latest Market News</h2>
                  <button
                    onClick={fetchNews}
                    disabled={isLoadingNews}
                    className="flex items-center space-x-2 bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors disabled:opacity-50"
                  >
                    {isLoadingNews ? (
                      <>
                        <FiRefreshCw className="animate-spin" />
                        <span>Loading...</span>
                      </>
                    ) : (
                      <>
                        <FiRefreshCw />
                        <span>Refresh</span>
                      </>
                    )}
                  </button>
                </div>
                
                {newsError && (
                  <div className="bg-yellow-900 bg-opacity-30 border border-yellow-700 text-yellow-200 p-4 rounded-lg">
                    {newsError}
                  </div>
                )}
                
                {isLoadingNews && !news.length ? (
                  <div className="flex justify-center items-center h-64">
                    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {news.map((item, index) => (
                      <motion.div
                        key={index}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.1 }}
                        whileHover={{ y: -5 }}
                        className="bg-gray-700 rounded-xl overflow-hidden shadow-lg hover:shadow-xl transition-all cursor-pointer"
                      >
                        <div className="h-48 overflow-hidden">
                          <img
                            src={item.image || `https://source.unsplash.com/random/600x400/?crypto,${index}`}
                            alt={item.title}
                            className="w-full h-full object-cover transition-transform hover:scale-105"
                          />
                        </div>
                        <div className="p-5">
                          <h3 className="text-lg font-bold text-white mb-2 line-clamp-2">{item.title}</h3>
                          <div className="flex justify-between items-center text-sm text-gray-400">
                            <span>{item.source || "Unknown source"}</span>
                            <span>{new Date(item.publishedAt).toLocaleDateString()}</span>
                          </div>
                          <a
                            href={item.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="mt-4 inline-flex items-center text-indigo-400 hover:text-indigo-300 font-medium text-sm"
                          >
                            Read more <FiArrowRight className="ml-1" />
                          </a>
                        </div>
                      </motion.div>
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