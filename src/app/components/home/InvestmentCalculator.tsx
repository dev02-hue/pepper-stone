"use client";
import { useState, useEffect } from "react";
import axios from "axios";
import { motion } from "framer-motion";

import { Inter } from 'next/font/google';

const inter = Inter({
    subsets: ['latin'],
    weight: ['400', '600', '700'],  
    display: 'swap',
  });

// Types
type Plan = {
  name: string;
  percent: number;
  duration: string;
  range: { min: number; max: number };
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
    name: "Bronze Plan",
    percent: 400,
    duration: "24 Hours",
    range: { min: 300, max: 999 },
  },
  {
    name: "Silver Plan",
    percent: 500,
    duration: "24 Hours",
    range: { min: 1000, max: 4999 },
  },
  {
    name: "Gold Plan",
    percent: 550,
    duration: "48 Hours",
    range: { min: 5000, max: 100000 },
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

// Fallback news data when API fails
const fallbackNews: NewsItem[] = [
  {
    title: "Bitcoin Surges Past $60,000 as Institutional Adoption Grows",
    url: "https://example.com/bitcoin-surge",
    source: "Crypto News",
    publishedAt: new Date().toISOString(),
  },
  {
    title: "Ethereum 2.0 Upgrade Nears Completion, ETH Price Reacts Positively",
    url: "https://example.com/ethereum-upgrade",
    source: "Blockchain Daily",
    publishedAt: new Date(Date.now() - 86400000).toISOString(),
  },
  {
    title: "DeFi Projects See Record TVL as Crypto Markets Recover",
    url: "https://example.com/defi-record",
    source: "DeFi Pulse",
    publishedAt: new Date(Date.now() - 172800000).toISOString(),
  },
];

export default function InvestmentCalculator() {
  // Investment states
  const [selectedPlan, setSelectedPlan] = useState<Plan>(plans[0]);
  const [amount, setAmount] = useState<number | "">("");
  const [activeTab, setActiveTab] = useState<"investment" | "converter" | "news">("investment");

  // Crypto converter states
  const [fromCrypto, setFromCrypto] = useState<Cryptocurrency>(popularCryptos[0]);
  const [toCrypto, setToCrypto] = useState<Cryptocurrency>(popularCryptos[1]);
  const [cryptoAmount, setCryptoAmount] = useState<number | "">(1);
  const [conversionResult, setConversionResult] = useState<ConversionResult | null>(null);
  const [isConverting, setIsConverting] = useState(false);
  const [conversionError, setConversionError] = useState("");

  // News states
  const [news, setNews] = useState<NewsItem[]>([]);
  const [isLoadingNews, setIsLoadingNews] = useState(false);
  const [newsError, setNewsError] = useState("");

  // Calculate investment returns
  const profit = typeof amount === "number" ? (amount * selectedPlan.percent) / 100 : 0;
  const total = typeof amount === "number" ? amount + profit : 0;

  // Fetch crypto news - using a proxy to avoid CORS issues
  const fetchNews = async () => {
    setIsLoadingNews(true);
    setNewsError("");
    try {
      // Using a cryptocurrency news API endpoint
      const response = await axios.get(
        `https://api.rss2json.com/v1/api.json?rss_url=https://cointelegraph.com/rss`
      );
      
      if (response.data.items) {
        const formattedNews = response.data.items.slice(0, 5).map((item: { title: string; link: string; pubDate: string }) => ({
          title: item.title,
          url: item.link,
          source: "CoinTelegraph",
          publishedAt: item.pubDate,
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

  // Convert cryptocurrencies using CoinGecko API
  const convertCurrency = async () => {
    if (typeof cryptoAmount !== "number" || cryptoAmount <= 0) {
      setConversionError("Please enter a valid amount");
      return;
    }

    setIsConverting(true);
    setConversionError("");
    try {
      // First get the price of both currencies in USD
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
      
      // Calculate the conversion rate
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
  };

  // Load news when tab is switched to news
  useEffect(() => {
    if (activeTab === "news" && news.length === 0) {
      fetchNews();
    }
  }, [activeTab, news.length]);

  // Convert currencies when inputs change (with debounce)
  useEffect(() => {
    if (activeTab === "converter" && cryptoAmount && typeof cryptoAmount === "number") {
      const timer = setTimeout(() => {
        convertCurrency();
      }, 500);
      
      return () => clearTimeout(timer);
    }
  }, [cryptoAmount, fromCrypto, toCrypto, activeTab]);

  return (
    <div className={`${inter.className} min-h-screen bg-gradient-to-br from-purple-900 to-orange-400 py-12 px-4 sm:px-6 lg:px-8`}>
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="max-w-6xl mx-auto bg-white rounded-xl shadow-2xl overflow-hidden"
      >
        {/* Header */}
        <div className="bg-black p-6 text-center">
           
          <p className="text-gray-300 mt-2">
            Investment Calculator & Cryptocurrency Tools
          </p>
        </div>

        {/* Navigation Tabs */}
        <div className="flex border-b border-gray-200">
          <button
            onClick={() => setActiveTab("investment")}
            className={`flex-1 py-4 font-medium text-sm ${
              activeTab === "investment"
                ? "text-[#FD4A36] border-b-2 border-[#FD4A36]"
                : "text-gray-500 hover:text-gray-700"
            }`}
          >
            Investment Plans
          </button>
          <button
            onClick={() => setActiveTab("converter")}
            className={`flex-1 py-4 font-medium text-sm ${
              activeTab === "converter"
                ? "text-[#FD4A36] border-b-2 border-[#FD4A36]"
                : "text-gray-500 hover:text-gray-700"
            }`}
          >
            Crypto Converter
          </button>
          <button
            onClick={() => setActiveTab("news")}
            className={`flex-1 py-4 font-medium text-sm ${
              activeTab === "news"
                ? "text-[#FD4A36] border-b-2 border-[#FD4A36]"
                : "text-gray-500 hover:text-gray-700"
            }`}
          >
            Crypto News
          </button>
        </div>

        {/* Content Area */}
        <div className="p-6 md:p-8">
          {/* Investment Calculator */}
          {activeTab === "investment" && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
            >
              <h2 className="text-2xl font-bold text-gray-800 mb-6">Investment Plans</h2>
              
              {/* Plan Selector */}
              <div className="flex flex-wrap gap-4 justify-center mb-8">
                {plans.map((plan) => (
                  <motion.button
                    key={plan.name}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className={`px-6 py-3 rounded-lg font-semibold transition-all ${
                      selectedPlan.name === plan.name
                        ? "bg-gradient-to-r from-[#FD4A36] to-orange-500 text-white shadow-lg"
                        : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                    }`}
                    onClick={() => setSelectedPlan(plan)}
                  >
                    {plan.name}
                  </motion.button>
                ))}
              </div>

              {/* Plan Details */}
              <div className="bg-gray-50 p-6 rounded-xl mb-8">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="text-center">
                    <p className="text-sm text-gray-500">Daily Profit</p>
                    <p className="text-2xl font-bold text-[#FD4A36]">
                      {selectedPlan.percent}%
                    </p>
                  </div>
                  <div className="text-center">
                    <p className="text-sm text-gray-500">Investment Range</p>
                    <p className="text-xl font-bold text-gray-800">
                      ${selectedPlan.range.min} - ${selectedPlan.range.max}
                    </p>
                  </div>
                  <div className="text-center">
                    <p className="text-sm text-gray-500">Duration</p>
                    <p className="text-xl font-bold text-gray-800">
                      {selectedPlan.duration}
                    </p>
                  </div>
                </div>
              </div>

              {/* Input Field */}
              <div className="text-center mb-8">
                <label htmlFor="amount" className="block text-sm font-medium text-gray-700 mb-2">
                  Enter Investment Amount
                </label>
                <div className="relative max-w-md mx-auto">
                  <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">$</span>
                  <input
                    id="amount"
                    type="number"
                    min={selectedPlan.range.min}
                    max={selectedPlan.range.max}
                    value={amount}
                    onChange={(e) => setAmount(e.target.value === "" ? "" : Number(e.target.value))}
                    className="w-full pl-8 pr-4 py-3 border border-gray-300 rounded-lg text-lg font-medium text-center focus:ring-2 focus:ring-[#FD4A36] focus:border-transparent"
                    placeholder={`${selectedPlan.range.min} - ${selectedPlan.range.max}`}
                  />
                </div>
                <p className="text-xs text-gray-500 mt-2">
                  Minimum investment: ${selectedPlan.range.min}
                </p>
              </div>

              {/* Results */}
              {typeof amount === "number" && amount >= selectedPlan.range.min && amount <= selectedPlan.range.max ? (
                <motion.div
                  initial={{ scale: 0.9 }}
                  animate={{ scale: 1 }}
                  className="bg-gradient-to-r from-purple-50 to-orange-50 p-6 rounded-xl border border-gray-200"
                >
                  <h3 className="text-lg font-semibold text-gray-800 mb-4">Projected Returns</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="bg-white p-4 rounded-lg shadow">
                      <p className="text-sm text-gray-500">Investment</p>
                      <p className="text-xl font-bold text-gray-800">${amount.toLocaleString()}</p>
                    </div>
                    <div className="bg-white p-4 rounded-lg shadow">
                      <p className="text-sm text-gray-500">Profit ({selectedPlan.percent}%)</p>
                      <p className="text-xl font-bold text-green-600">+${profit.toLocaleString(undefined, { maximumFractionDigits: 2 })}</p>
                    </div>
                    <div className="bg-white p-4 rounded-lg shadow md:col-span-2">
                      <p className="text-sm text-gray-500">Total Return After {selectedPlan.duration}</p>
                      <p className="text-2xl font-bold text-[#FD4A36]">${total.toLocaleString(undefined, { maximumFractionDigits: 2 })}</p>
                    </div>
                  </div>
                </motion.div>
              ) : amount !== "" ? (
                <div className="bg-red-50 border border-red-200 text-red-700 p-4 rounded-lg text-center">
                  Please enter an amount between ${selectedPlan.range.min} and ${selectedPlan.range.max}
                </div>
              ) : (
                <div className="bg-blue-50 border border-blue-200 text-blue-700 p-4 rounded-lg text-center">
                  Enter an amount to calculate your potential returns
                </div>
              )}
            </motion.div>
          )}

          {/* Crypto Converter */}
          {activeTab === "converter" && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
            >
              <h2 className="text-2xl font-bold text-gray-800 mb-6">Cryptocurrency Converter</h2>
              
              <div className="max-w-2xl mx-auto">
                <div className="grid grid-cols-1 md:grid-cols-5 gap-4 items-end mb-8">
                  <div className="md:col-span-2">
                    <label htmlFor="fromAmount" className="block text-sm font-medium text-gray-700 mb-1">
                      Amount
                    </label>
                    <input
                      id="fromAmount"
                      type="number"
                      min="0"
                      step="0.00000001"
                      value={cryptoAmount}
                      onChange={(e) => setCryptoAmount(e.target.value === "" ? "" : Number(e.target.value))}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg text-lg font-medium focus:ring-2 focus:ring-[#FD4A36] focus:border-transparent"
                      placeholder="0.00"
                    />
                  </div>
                  
                  <div className="md:col-span-2">
                    <label htmlFor="fromCrypto" className="block text-sm font-medium text-gray-700 mb-1">
                      From
                    </label>
                    <select
                      id="fromCrypto"
                      value={fromCrypto.id}
                      onChange={(e) => {
                        const selected = popularCryptos.find(c => c.id === e.target.value);
                        if (selected) setFromCrypto(selected);
                      }}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg text-lg font-medium focus:ring-2 focus:ring-[#FD4A36] focus:border-transparent"
                    >
                      {popularCryptos.map((crypto) => (
                        <option key={crypto.id} value={crypto.id}>
                          {crypto.name} ({crypto.symbol})
                        </option>
                      ))}
                    </select>
                  </div>
                  
                  <button
                    onClick={() => {
                      // Swap from and to currencies
                      const temp = fromCrypto;
                      setFromCrypto(toCrypto);
                      setToCrypto(temp);
                    }}
                    className="bg-gray-200 hover:bg-gray-300 p-3 rounded-lg flex items-center justify-center"
                    aria-label="Swap currencies"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
                    </svg>
                  </button>
                  
                  <div className="md:col-span-2">
                    <label htmlFor="toCrypto" className="block text-sm font-medium text-gray-700 mb-1">
                      To
                    </label>
                    <select
                      id="toCrypto"
                      value={toCrypto.id}
                      onChange={(e) => {
                        const selected = popularCryptos.find(c => c.id === e.target.value);
                        if (selected) setToCrypto(selected);
                      }}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg text-lg font-medium focus:ring-2 focus:ring-[#FD4A36] focus:border-transparent"
                    >
                      {popularCryptos.map((crypto) => (
                        <option key={crypto.id} value={crypto.id}>
                          {crypto.name} ({crypto.symbol})
                        </option>
                      ))}
                    </select>
                  </div>
                  
                  <div className="md:col-span-2">
                    <p className="text-sm font-medium text-gray-700 mb-1">Result</p>
                    <div className="w-full px-4 py-3 bg-gray-100 rounded-lg text-lg font-medium min-h-[56px] flex items-center">
                      {isConverting ? (
                        <span className="text-gray-500">Converting...</span>
                      ) : conversionResult ? (
                        <span>
                          {conversionResult.result.toFixed(8)} {toCrypto.symbol}
                        </span>
                      ) : (
                        <span className="text-gray-500">0.00</span>
                      )}
                    </div>
                  </div>
                </div>
                
                {conversionError && (
                  <div className="bg-red-50 border border-red-200 text-red-700 p-4 rounded-lg text-center mb-6">
                    {conversionError}
                  </div>
                )}
                
                {(conversionResult && !isConverting) && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-white p-6 rounded-xl shadow-md border border-gray-200"
                  >
                    <h3 className="text-lg font-semibold text-gray-800 mb-3">Conversion Details</h3>
                    <div className="space-y-2">
                      <p className="text-lg">
                        <span className="font-bold">{conversionResult.amount} {conversionResult.from}</span> = 
                        <span className="font-bold text-[#FD4A36]"> {conversionResult.result.toFixed(6)} {conversionResult.to}</span>
                      </p>
                      <p className="text-sm text-gray-600">
                        Exchange Rate: 1 {conversionResult.from} = {conversionResult.rate.toFixed(6)} {conversionResult.to}
                      </p>
                      <p className="text-sm text-gray-600">
                        Last updated: {new Date().toLocaleTimeString()}
                      </p>
                    </div>
                  </motion.div>
                )}
              </div>
            </motion.div>
          )}

          {/* Crypto News */}
          {activeTab === "news" && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
            >
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-gray-800">Latest Crypto News</h2>
                <button
                  onClick={fetchNews}
                  disabled={isLoadingNews}
                  className="bg-[#FD4A36] hover:bg-[#FD4A36]/90 text-white px-4 py-2 rounded-lg text-sm font-medium flex items-center disabled:opacity-50"
                >
                  {isLoadingNews ? (
                    <>
                      <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Loading...
                    </>
                  ) : (
                    <>
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                      </svg>
                      Refresh
                    </>
                  )}
                </button>
              </div>
              
              {newsError && (
                <div className="bg-yellow-50 border border-yellow-200 text-yellow-700 p-4 rounded-lg mb-4">
                  {newsError}
                </div>
              )}
              
              {isLoadingNews && !news.length ? (
                <div className="flex justify-center items-center h-64">
                  <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#FD4A36]"></div>
                </div>
              ) : (
                <div className="space-y-6">
                  {news.map((item, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 hover:shadow-md transition-shadow"
                    >
                      <h3 className="text-xl font-bold text-gray-800 mb-2">{item.title}</h3>
                      <p className="text-sm text-gray-500 mb-3">
                        {item.source || "Unknown source"} • {new Date(item.publishedAt).toLocaleDateString()}
                      </p>
                      <a
                        href={item.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center text-[#FD4A36] hover:text-[#FD4A36]/80 font-medium"
                      >
                        Read more
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                        </svg>
                      </a>
                    </motion.div>
                  ))}
                </div>
              )}
            </motion.div>
          )}
        </div>

         
      </motion.div>
    </div>
  );
}