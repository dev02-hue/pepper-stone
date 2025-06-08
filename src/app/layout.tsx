import type { Metadata } from "next"
import { Geist, Geist_Mono } from "next/font/google"
import "./globals.css"
 import RootStructure from "./components/layout/RootStructure"
 import TelegramFloatButtonWrapper from "./components/utils/TelegramFloatButtonWrapper"
 
const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
})

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
})

export const metadata: Metadata = {
  title: "TTRADE CAPITAL | Global Investment & Trading Platform",
  description: "Trade stocks, forex, and cryptocurrencies with real-time market data, advanced tools, and secure transactions. Join millions of traders worldwide.",
  keywords: ["trading", "investing", "stocks", "forex", "cryptocurrency", "market"],
  authors: [{ name: "Ttradecapital Team", url: "https://www.ttradecapital.com/" }],
  openGraph: {
    title: "Ttradecapital | Global Investment & Trading Platform",
    description: "Trade stocks, forex, and cryptocurrencies with real-time market data.",
    url: "https://www.ttradecapital.com/",
    siteName: "TTRADECAPITAL",
    images: [
      {
        url: "https://www.ttradecapital.com/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "TTRADECAPITAL - Global Investment & Trading Platform",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "TradeHub | Global Investment & Trading Platform",
    description: "Trade stocks, forex, and cryptocurrencies with real-time market data.",
    images: ["https://www.ttradecapital.com/twitter-card.jpg"],
  },
  robots: {
    index: true,
    follow: true,
    nocache: false,
    googleBot: {
      index: true,
      follow: true,
      noimageindex: false,
    },
  },
  themeColor: "#1A1A2E",
  metadataBase: new URL("https://www.ttradecapital.com/"),
  alternates: {
    canonical: "/",
  },
   
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        
          <RootStructure>
            {children}
            <TelegramFloatButtonWrapper /> 
          </RootStructure>
         
      </body>
    </html>
  )
}