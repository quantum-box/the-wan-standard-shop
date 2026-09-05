'use client'

import { usePathname } from 'next/navigation'
import styles from './storefront.module.css'

export function PurchaseProgress() {
  const pathname = usePathname()?.replace(/\/$/, '') || '/'
  const current = pathname === '/shop/cart' ? 0
    : pathname === '/shop/checkout' ? 1
    : pathname === '/shop/checkout/confirm' || pathname === '/shop/checkout/payment' ? 2
    : pathname === '/shop/checkout/thanks' ? 3 : -1
  if (current < 0) return null
  return (
    <nav aria-label="お買い物の進み方">
      <ol className={styles.progress}>
        {['カート', 'ご入力', 'ご確認', '受付状況'].map((label, index) => (
          <li key={label} aria-current={current === index ? 'step' : undefined}>
            <span aria-hidden="true">0{index + 1}</span>{label}
          </li>
        ))}
      </ol>
    </nav>
  )
}
