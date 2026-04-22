'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'

export default function Nav() {
  const pathname = usePathname()

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-p3/90 backdrop-blur-sm border-b border-s2/30">
      <div className="max-w-7xl mx-auto px-8 md:px-16 h-16 flex items-center justify-between">
        <Link
          href="/"
          className="font-serif-en font-light tracking-[0.3em] text-s2 text-sm md:text-base uppercase"
        >
          THE WAN STANDARD
        </Link>

        <div className="flex items-center gap-8 md:gap-10">
          <Link
            href="/"
            className={`font-sans-ja text-xs tracking-widest transition-colors duration-200 ${
              pathname === '/' ? 'text-p1' : 'text-n1 hover:text-p1'
            }`}
          >
            Top
          </Link>
          <Link
            href="/about"
            className={`font-sans-ja text-xs tracking-widest transition-colors duration-200 ${
              pathname === '/about' ? 'text-p1' : 'text-n1 hover:text-p1'
            }`}
          >
            About
          </Link>
          <Link
            href="/shop"
            className={`font-sans-ja text-xs tracking-widest transition-colors duration-200 ${
              pathname?.startsWith('/shop') ? 'text-p1' : 'text-n1 hover:text-p1'
            }`}
          >
            Shop
          </Link>
        </div>
      </div>

      <div className="h-px bg-gradient-to-r from-transparent via-s2/50 to-transparent" />
    </nav>
  )
}
