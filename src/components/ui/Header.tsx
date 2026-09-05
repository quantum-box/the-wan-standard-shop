'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { BrandLockup } from '@/components/BrandLockup'
import styles from './storefront.module.css'

interface HeaderProps { cartCount?: number }

export function Header({ cartCount }: HeaderProps) {
  const pathname = usePathname()?.replace(/\/$/, '') || '/'
  const links = [
    { href: '/shop', label: '商品を見る', active: pathname === '/shop' || pathname?.startsWith('/shop/') },
    { href: '/guide/size', label: '選び方', active: pathname?.startsWith('/guide') || pathname?.startsWith('/use/') },
    { href: '/about', label: '私たちについて', active: pathname === '/about' },
  ]
  return (
    <header className={styles.header}>
      <div className={`${styles.container} ${styles.headerInner}`}>
        <Link href="/" aria-label="THE WAN STANDARD ホーム" className={styles.brand}>
          <BrandLockup markSize={30} wordmarkClassName={styles.wordmark} />
        </Link>
        <nav className={styles.navigation} aria-label="メインナビゲーション">
          {links.map(({ href, label, active }) => (
            <Link key={href} href={href} aria-current={active ? 'page' : undefined}>{label}</Link>
          ))}
        </nav>
        <Link href="/shop/cart" className={styles.cartLink} aria-label={cartCount ? `カートを見る（${cartCount}点）` : 'カートを見る'}>
          <svg width="20" height="24" viewBox="0 0 24 28" fill="none" aria-hidden="true">
            <path d="M5 9h14l1 15H4L5 9Z" stroke="currentColor" strokeWidth="1.2" />
            <path d="M8 10V7a4 4 0 0 1 8 0v3" stroke="currentColor" strokeWidth="1.2" />
          </svg>
          {cartCount !== undefined && cartCount > 0 && <span className={styles.cartCount}>{cartCount}</span>}
        </Link>
      </div>
    </header>
  )
}
