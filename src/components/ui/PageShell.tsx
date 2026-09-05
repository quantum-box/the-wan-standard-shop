import type { ReactNode } from 'react'
import { Header } from './Header'
import { Footer } from './Footer'
import styles from './storefront.module.css'

type Props = {
  children: ReactNode
  variant?: 'document' | 'narrow' | 'editorial' | 'commerce'
}

/** One set of landmarks, typography and navigation for every non-home route. */
export function PageShell({ children, variant = 'document' }: Props) {
  return (
    <div className={styles.shell}>
      <a href="#main-content" className={styles.skipLink}>本文へスキップ</a>
      <Header />
      <main id="main-content" tabIndex={-1} className={`${styles.main} ${styles[variant]}`}>
        {children}
      </main>
      <Footer />
    </div>
  )
}
