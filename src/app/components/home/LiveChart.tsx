"use client";
import { useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { FiRefreshCw } from "react-icons/fi";

const LiveChart = () => {
  const chartContainerRef = useRef<HTMLDivElement>(null);

  const loadTradingViewWidget = () => {
    if (!chartContainerRef.current) return;

    // Clear previous content
    chartContainerRef.current.innerHTML = "";

    const script = document.createElement("script");
    script.src = "https://s3.tradingview.com/external-embedding/embed-widget-symbol-overview.js";
    script.type = "text/javascript";
    script.async = true;
    script.innerHTML = JSON.stringify({
      symbols: [
        ["BTCUSD", "BITSTAMP:BTCUSD|1D"],
        ["ETHUSD", "BITSTAMP:ETHUSD|1D"],
        ["SOLUSD", "BINANCE:SOLUSDT|1D"],
        ["BNBUSD", "BINANCE:BNBUSDT|1D"],
        ["XRPUSD", "BITSTAMP:XRPUSD|1D"],
        ["ADAUSD", "BINANCE:ADAUSDT|1D"],
        ["DOGEUSD", "BINANCE:DOGEUSDT|1D"],
        ["AVAXUSD", "BINANCE:AVAXUSDT|1D"],
        ["DOTUSD", "BINANCE:DOTUSDT|1D"],
        ["LINKUSD", "BINANCE:LINKUSDT|1D"],
        ["USDTUSD", "BINANCE:USDTUSD|1D"],  
      ],
      chartOnly: false,
      width: "100%",
      height: "500",
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

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className="relative w-full"
    >
      <div className="absolute -top-2 -right-2 z-10">
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
          onClick={loadTradingViewWidget}
          className="p-2 bg-gradient-to-br from-blue-600 to-purple-600 rounded-full shadow-lg"
          aria-label="Refresh chart"
        >
          <FiRefreshCw className="text-white" />
        </motion.button>
      </div>
      
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-gray-900 to-gray-800 p-1 shadow-2xl">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 to-purple-500/10 rounded-2xl" />
        <div className="relative bg-gray-900/80 backdrop-blur-sm rounded-xl overflow-hidden">
          <div 
            ref={chartContainerRef} 
            className="tradingview-widget-container"
          />
        </div>
      </div>
      
      <div className="mt-3 flex justify-center gap-2">
        {['BTC', 'ETH', 'SOL', 'BNB', 'XRP'].map((symbol) => (
          <motion.div
            key={symbol}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="px-3 py-1 bg-gray-800 rounded-full text-xs font-medium cursor-pointer hover:bg-gray-700 transition-colors"
          >
            {symbol}
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
};

export default LiveChart;