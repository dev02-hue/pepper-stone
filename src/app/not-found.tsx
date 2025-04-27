"use client"

import React from "react"
import Image from "next/image"
import Link from "next/link"
 
export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center max-h-screen overflow-hidden bg-white ">
      <div className="w-full text-center">
        <div className="mb-[-40px] sm:mb-0">
          <Image
            src="/svgs/landing-page/not-found.svg"
            alt="404 Error - Page Not Found"
            width={1200}
            height={400}
            priority
            className="w-full h-auto max-w-[100%]"
          />
        </div>

        
        <div className="text-3xl sm:text-5xl mt-[60px] sm:mt-[-100px] font-bold text-[#2C6E8F]">
          Oops...
        </div>
        <p className="text-base sm:text-lg mb-6 sm:mb-8">
          This page does not exist or was removed!
        </p>


        <Link href="/">
          <button className="py-3 px-6 sm:py-4 sm:px-8 text-base sm:text-lg cursor-pointer">
            <div className="p-2 sm:p-4">Return Home</div>
          </button>
        </Link>
      </div>
    </div>
  )
}
