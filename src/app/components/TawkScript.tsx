"use client"

import Script from "next/script"
import { usePathname } from "next/navigation"

export default function TawkScript() {
  const pathname = usePathname()

  const isUserOrAdminPage =
    pathname.startsWith("/joker") || 
    pathname.startsWith("/user") 

  if (isUserOrAdminPage) return null

  return (
    <Script id="tawk-script" strategy="afterInteractive">
      {`
        var Tawk_API=Tawk_API||{}, Tawk_LoadStart=new Date();
        (function(){
          var s1=document.createElement("script"),
              s0=document.getElementsByTagName("script")[0];
          s1.async=true;
          s1.src='https://embed.tawk.to/689dd91e664fee19271dff4d/1j2k9g8a7';
          s1.charset='UTF-8';
          s1.setAttribute('crossorigin','*');
          s0.parentNode.insertBefore(s1,s0);
        })();
      `}
    </Script>
  )
}
