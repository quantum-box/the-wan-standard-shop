import Link from 'next/link'
import { BrandLockup } from '@/components/BrandLockup'
import styles from './storefront.module.css'

export function Footer() {
  return (
    <footer className={styles.footer}>
      <div className={styles.container}>
        <div className={styles.footerMain}>
          <div className={styles.footerBrand}>
            <Link href="/" aria-label="THE WAN STANDARD ホーム" className={styles.brand}>
              <BrandLockup markSize={28} wordmarkClassName={styles.wordmark} />
            </Link>
            <p>犬と、人と。心地よい毎日のために。</p>
          </div>
          <div>
            <p className={styles.footerTitle} lang="en">EXPLORE</p>
            <nav aria-label="商品とブランド" className={styles.footerNav}>
              <Link href="/shop">商品一覧</Link>
              <Link href="/about">私たちについて</Link>
              <Link href="/guide/size">器の選び方</Link>
              <Link href="/guide/gift">贈りものについて</Link>
              <Link href="/pickup">店舗受け取り</Link>
            </nav>
          </div>
          <div>
            <p className={styles.footerTitle} lang="en">CUSTOMER CARE</p>
            <nav aria-label="お買い物のサポート" className={styles.footerNav}>
              <Link href="/guide">ショッピングガイド</Link>
              <Link href="/my-orders">ご注文について</Link>
              <Link href="/faq">よくある質問</Link>
              <Link href="/contact">お問い合わせ</Link>
            </nav>
          </div>
        </div>
        <div className={styles.footerBottom}>
          <p>© {new Date().getFullYear()} THE WAN STANDARD</p>
          <nav aria-label="規約とポリシー" className={styles.legalLinks}>
            <Link href="/legal/commercial-transactions">特定商取引法に基づく表記</Link>
            <Link href="/legal/terms">利用規約</Link>
            <Link href="/legal/privacy">プライバシーポリシー</Link>
          </nav>
        </div>
      </div>
    </footer>
  )
}
