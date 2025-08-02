// app/components/layout/RootStructure.tsx
'use client'
import { usePathname } from 'next/navigation'
import { Nav } from "./Nav";
import Footer from "./Footer";
import Translatecomponent from '../home/translate-component';

export default function RootStructure({
  children,
}: {
  children: React.ReactNode
}) {
  const pathname = usePathname()
  const isDashboard = pathname?.startsWith('/user') || 
                     pathname?.startsWith('/joker')

  return (
    <>
      {!isDashboard && <Nav />}
      {!isDashboard && <Translatecomponent />}
      {children}
      {!isDashboard && <Footer />}
    </>
  )
}