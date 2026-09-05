import Link from "next/link";
import { PageShell } from "@/components/ui/PageShell";
import styles from "@/components/ui/storefront.module.css";

export default function NotFound() {
  return <PageShell variant="narrow"><div className={styles.state}><p className={styles.eyebrow}>404 / NOT FOUND</p><h1>ページが見つかりません。</h1><p>URLが変更されたか、ページが削除された可能性があります。</p><div className={styles.actionRow}><Link href="/shop" className={styles.primaryLink}>商品を探す</Link><Link href="/" className={styles.textLink}>ホームに戻る</Link></div></div></PageShell>;
}
