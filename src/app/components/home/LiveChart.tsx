"use client";
import { useEffect, useRef } from "react";

const LiveChart = () => {
  const chartContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
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
      backgroundColor: "#0d0d0d",
    });

    if (chartContainerRef.current) {
      chartContainerRef.current.innerHTML = ""; // clear before appending
      chartContainerRef.current.appendChild(script);
    }
  }, []);

  return (
    <div className="my-10 w-full rounded-xl shadow-2xl animate__animated animate__fadeInUp">
      <div ref={chartContainerRef} className="tradingview-widget-container" />
    </div>
  );
};

export default LiveChart;
