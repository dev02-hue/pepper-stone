"use client";
import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FiRefreshCw, FiMaximize, FiMinimize } from "react-icons/fi";
import { FaBitcoin, FaEthereum } from "react-icons/fa";
import { SiSolana, SiBinance, SiRipple } from "react-icons/si";

const LiveChart = () => {
  const chartContainerRef = useRef<HTMLDivElement>(null);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [activeTab, setActiveTab] = useState("crypto");
  const [isLoading, setIsLoading] = useState(true);

  const loadTradingViewWidget = () => {
    if (!chartContainerRef.current) return;

    setIsLoading(true);
    chartContainerRef.current.innerHTML = "";

    const script = document.createElement("script");
    script.src = "https://s3.tradingview.com/external-embedding/embed-widget-symbol-overview.js";
    script.type = "text/javascript";
    script.async = true;
    script.onload = () => setIsLoading(false);
    script.innerHTML = JSON.stringify({
      symbols: [
        ["BTC/USD", "BITSTAMP:BTCUSD|1D"],
        ["ETH/USD", "BITSTAMP:ETHUSD|1D"],
        ["SOL/USD", "BINANCE:SOLUSDT|1D"],
        ["BNB/USD", "BINANCE:BNBUSDT|1D"],
        ["XRP/USD", "BITSTAMP:XRPUSD|1D"],
      ],
      chartOnly: false,
      width: "100%",
      height: "100%",
      locale: "en",
      colorTheme: "dark",
      autosize: true,
      showVolume: true,
      showMA: true,
      hideLegend: false,
      hideSideToolbar: false,
      allowSymbolChange: true,
      backgroundColor: "rgba(0, 0, 0, 0)",
      transparent: true,
    });

    chartContainerRef.current.appendChild(script);
  };

  useEffect(() => {
    loadTradingViewWidget();
  }, []);

  const toggleFullscreen = () => {
    setIsFullscreen(!isFullscreen);
  };

  const cryptoIcons = {
    "BTC/USD": <FaBitcoin className="text-amber-500" />,
    "ETH/USD": <FaEthereum className="text-purple-400" />,
    "SOL/USD": <SiSolana className="text-green-400" />,
    "BNB/USD": <SiBinance className="text-yellow-400" />,
    "XRP/USD": <SiRipple className="text-blue-400" />,
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className={`relative w-full ${isFullscreen ? "fixed inset-0 z-50 p-6 bg-gray-950" : "my-8"}`}
    >
      {/* Header with tabs and controls */}
      <div className="flex justify-between items-center mb-4">
        <div className="flex space-x-1 bg-gray-800/50 rounded-lg p-1 border border-gray-700/50">
          {["crypto", "stocks", "forex"].map((tab) => (
            <motion.button
              key={tab}
              whileHover={{ backgroundColor: "rgba(55, 65, 81, 0.5)" }}
              whileTap={{ scale: 0.95 }}
              className={`px-4 py-2 rounded-md text-sm font-medium capitalize ${
                activeTab === tab ? "bg-gray-700 text-white" : "text-gray-400"
              }`}
              onClick={() => setActiveTab(tab)}
            >
              {tab}
            </motion.button>
          ))}
        </div>

        <div className="flex space-x-2">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={loadTradingViewWidget}
            className="p-2 bg-gray-800 rounded-lg border border-gray-700 hover:bg-gray-700 transition-colors"
            aria-label="Refresh chart"
          >
            <FiRefreshCw className="text-gray-300" />
          </motion.button>

          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={toggleFullscreen}
            className="p-2 bg-gray-800 rounded-lg border border-gray-700 hover:bg-gray-700 transition-colors"
            aria-label={isFullscreen ? "Minimize" : "Maximize"}
          >
            {isFullscreen ? (
              <FiMinimize className="text-gray-300" />
            ) : (
              <FiMaximize className="text-gray-300" />
            )}
          </motion.button>
        </div>
      </div>

      {/* Chart container */}
      <motion.div
        layout
        className={`relative overflow-hidden rounded-xl border border-gray-700/50 shadow-2xl ${
          isFullscreen ? "h-[calc(100vh-120px)]" : "h-[500px]"
        }`}
      >
        {/* Gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-br from-blue-900/20 to-purple-900/20 pointer-events-none" />

        {/* Loading state */}
        <AnimatePresence>
          {isLoading && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 flex items-center justify-center bg-gray-900/80 backdrop-blur-sm z-10"
            >
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
                className="text-gray-400"
              >
                <FiRefreshCw size={24} />
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Chart */}
        <div
          ref={chartContainerRef}
          className="tradingview-widget-container h-full w-full"
        />
      </motion.div>

      {/* Quick select buttons */}
      <motion.div className="mt-4 flex flex-wrap justify-center gap-2">
        {Object.entries(cryptoIcons).map(([symbol, icon]) => (
          <motion.button
            key={symbol}
            whileHover={{ y: -2, backgroundColor: "rgba(55, 65, 81, 0.5)" }}
            whileTap={{ scale: 0.95 }}
            className="flex items-center space-x-2 px-4 py-2 bg-gray-800/50 rounded-full border border-gray-700/50 text-sm font-medium hover:bg-gray-700/50 transition-colors"
            onClick={() => {
              // Would implement symbol change logic here
            }}
          >
            <span>{icon}</span>
            <span>{symbol.split("/")[0]}</span>
          </motion.button>
        ))}
      </motion.div>

      {/* Watermark */}
      {!isFullscreen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
          className="mt-2 text-center text-xs text-gray-500"
        >
          Powered by TradingView
        </motion.div>
      )}
    </motion.div>
  );
};

export default LiveChart;