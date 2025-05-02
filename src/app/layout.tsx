import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Nav } from "./components/layout/Nav";
import Footer from "./components/layout/Footer";
import ReduxProvider from "./components/utils/ReduxProvider";
 

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "TRADING SITE",
  description: "Global investment and trading platform offering real-time market access, secure transactions, expert insights, and powerful tools to grow your wealth.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <Nav />
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
         <ReduxProvider>{children}</ReduxProvider>
        
      </body>
      <Footer />
    </html>
  );
}
