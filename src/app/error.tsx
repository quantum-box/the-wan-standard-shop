"use client";

import { useEffect } from "react";
import { PageShell } from "@/components/ui/PageShell";
import styles from "@/components/ui/storefront.module.css";

export default function GlobalError({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  useEffect(() => { console.error(error); }, [error]);
  return <PageShell variant="narrow"><div className={styles.state}><h1 className="font-serif-ja text-2xl text-p2 mb-4">読み込みに失敗しました</h1><p className="text-sm text-n1 leading-relaxed mb-6">一時的な通信エラーの可能性があります。時間をおいて再度お試しください。</p><button type="button" onClick={reset} className="px-6 py-3 bg-p2 text-p1 text-sm tracking-widest">もう一度試す</button></div></PageShell>;
}
