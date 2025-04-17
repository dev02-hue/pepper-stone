"use client";
import { useState } from "react";
import Link from "next/link";
import { FiMenu, FiX } from "react-icons/fi"; 
import Translatecomponent from "../home/translate-component";
import { Poppins } from 'next/font/google';


const poppins = Poppins({
  subsets: ['latin'],
  weight: ['400', '600'], 
});

export const Nav = () => {
  const [menuOpen, setMenuOpen] = useState(false);

  const navLinks = [
    { href: "/", label: "Home" },
    { href: "/plan", label: "Plan" },
    { href: "/about", label: "About" },
    { href: "/services", label: "Our Services" },
    { href: "/blog", label: "Blog" },
    { href: "/contact", label: "Contact" },
    { href: "/login", label: "Investor Login" },
  ];

  return (
    <header className={`${poppins.className} w-full`}>
      {/* Top bar */}
      <div className="bg-white text-sm text-gray-600 flex justify-between items-center px-4 py-2 border-b">
        <p>TITC House City Road Auckland CBD, Auckland 1701, New Zealand</p>
        <a href="mailto:support@bitcistackasset.com" className="text-red-500">
          support@bitcistackasset.com
        </a>
      </div>

      {/* Main Navbar */}
      <nav className="bg-white shadow-md px-4 py-3">
        <div className="flex justify-between items-center">
          {/* Logo */}
          <div className="flex items-center bg-[#FD4A36] px-4 py-2">
            <span className="text-white font-bold text-lg">TRADING PLATFORM</span>
          </div>

          {/* Desktop Links */}
          <ul className="hidden md:flex flex-1 justify-center items-center space-x-6 text-black font-medium text-sm">
            {navLinks.map(({ href, label }) => (
              <li key={href} className="group relative">
                <Link
                  href={href}
                  className="transition-colors text-xl duration-200 group-hover:text-[#FD4A36]"
                >
                  {label}
                  <span className="absolute left-0 -bottom-1 w-full h-0.5 bg-[#FD4A36] scale-x-0 group-hover:scale-x-100 transition-transform origin-left duration-300" />
                </Link>
              </li>
            ))}
          </ul>

        
          <div className="md:hidden">
            <button
              onClick={() => setMenuOpen(!menuOpen)}
              className="text-2xl text-black"
              aria-label="Toggle menu"
            >
              {menuOpen ? <FiX /> : <FiMenu />}
            </button>
          </div>

          <div className="hidden md:block">
  <Link
    href="/register"
    className="text-red-500 text-xl font-semibold"
    onClick={() => setMenuOpen(false)}
  >
    Register
  </Link>
</div>
         
        </div>

        {/* Mobile Menu */}
        {menuOpen && (
          <ul className="flex flex-col mt-4 space-y-4 md:hidden text-black text-base font-medium">
            {navLinks.map(({ href, label }) => (
              <li key={href}>
                <Link
                  href={href}
                  className="block w-full px-2 py-1 hover:text-[#FD4A36]"
                  onClick={() => setMenuOpen(false)}
                >
                  {label}
                </Link>
              </li>
            ))}
            <li>
              <Link
                href="/register"
                className="block text-red-500 font-semibold px-2"
                onClick={() => setMenuOpen(false)}
              >
                Register
              </Link>
            </li>
          </ul>
        )}
      </nav>

      
      <div className=" flex ml-4">
            <Translatecomponent />
          </div>
    </header>
  );
};
