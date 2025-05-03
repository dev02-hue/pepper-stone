import type { Metadata } from "next"
import { Geist, Geist_Mono } from "next/font/google"
import "./globals.css"
import ReduxProvider from "./components/utils/ReduxProvider"
import RootStructure from "./components/layout/RootStructure"
import TelegramFloatButton from "./components/home/TelegramFloatButton"
 
const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
})

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
})

export const metadata: Metadata = {
  title: "TRADING SITE",
  description: "Global investment and trading platform offering real-time market access...",
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        <ReduxProvider>
          <RootStructure>
            {children}
            <TelegramFloatButton />  
          </RootStructure>
        </ReduxProvider>
      </body>
    </html>
  )
}