'use client'

import { useEffect } from 'react'
import Link from 'next/link'
import { PageShell } from '@/components/ui/PageShell'
import styles from '@/components/ui/storefront.module.css'

declare global {
  interface Window {
    gtag?: (...args: unknown[]) => void
  }
}

export default function ThanksClient() {
  useEffect(() => {
    if (typeof window.gtag === 'function') {
      window.gtag('event', 'purchase', {
        currency: 'JPY',
        value: 0,
        transaction_id: `tws-${Date.now()}`,
      })
    }
  }, [])

  const lineUrl = process.env.NEXT_PUBLIC_LINE_URL ?? 'https://line.me/R/ti/p/@thewanstandard'

  return (
    <PageShell variant="narrow">
      <p className={styles.eyebrow} lang="en">WITH OUR THANKS</p>
      <h1 className="mt-5">ご注文、ありがとうございます。</h1>
      <p className="text-sm text-n1">この一椀が、愛犬との日常に溶け込んでいきますように。</p>
      <section className={styles.card}>
        <h2 className="text-xl mb-4">これからの暮らしも、ご一緒に。</h2>
        <p>THE WAN STANDARD をお選びいただき、ありがとうございます。最新の一椀や作り手の話を、LINEとInstagramでお届けしています。</p>
        <div className={styles.actionRow}>
          <a href={lineUrl} target="_blank" rel="noopener noreferrer" className={styles.primaryLink}>公式LINEを見る <span aria-hidden="true">↗</span></a>
          <a href="https://www.instagram.com/thewanstandard/" target="_blank" rel="noopener noreferrer" className={styles.textLink}>Instagramを見る <span aria-hidden="true">↗</span></a>
        </div>
      </section>
      <section className={styles.notice}>
        <h2 className="text-xl mb-3">ご注文について</h2>
        <p>注文内容の確認や、受け取りについてのご相談はこちらから。</p>
        <div className={styles.actionRow}><Link href="/shop/orders/lookup" className={styles.textLink}>注文を確認する</Link><Link href="/my-orders" className={styles.textLink}>ご注文に関するご案内</Link></div>
      </section>
      <Link href="/shop" className={styles.textLink}>商品一覧へ戻る</Link>
    </PageShell>
  )
}
