'use client'

import { useEffect } from 'react'

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
    <div className="min-h-screen bg-p1">
      <div className="mx-auto max-w-[480px]">

        {/* Hero */}
        <div className="bg-p1 pt-16 pb-8 text-center px-6">
          <div className="mx-auto w-12 h-12 flex items-center justify-center">
            <span className="font-serif-ja text-4xl text-p2 leading-none">椀</span>
          </div>
          <h1 className="font-serif-en text-2xl font-light text-p3 mt-6">
            ご注文、ありがとうございます。
          </h1>
          <p className="font-serif-ja text-sm text-p2 leading-[1.75] mt-3 whitespace-pre-line">
            {'この一椀が、愛犬との日常に\n溶け込んでいきますように。'}
          </p>
        </div>

        {/* Message */}
        <div className="px-6 py-8 text-p2 text-sm leading-[1.75]">
          <p>THE WAN STANDARD をお選びいただき、ありがとうございます。</p>
          <br />
          <p>
            お届けした商品は、食品衛生法基準に適合した
            <br />
            腕利きの作り手だけが並ぶ、厳選の一椀です。
            <br />
            愛犬が迷いなく食べられる品質を、毎日の食卓に。
          </p>
          <br />
          <p>またのご注文を、心よりお待ちしております。</p>
        </div>

        {/* CTA Section */}
        <div className="px-6 pb-10">
          <p className="font-serif-ja text-p2 text-center mb-6 text-sm">
            つながりをもっていただけますか
          </p>

          {/* CTA-A LINE */}
          <a
            href={lineUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="block w-full bg-p2 text-white py-3.5 px-6 text-sm text-center"
          >
            バナスク公式LINEに友だち追加
          </a>
          <p className="text-n1 text-xs text-center mt-2 leading-relaxed">
            友だち追加で、次回ご注文 5%OFFクーポンをプレゼント
            <br />
            クーポンコードはLINEでご確認ください（2026年6月30日まで有効）
          </p>

          {/* gap */}
          <div className="h-3" />

          {/* CTA-B Instagram */}
          <a
            href="https://www.instagram.com/thewanstandard/"
            target="_blank"
            rel="noopener noreferrer"
            className="block w-full border border-p2 bg-p1 text-p2 py-3.5 px-6 text-sm text-center mt-3"
          >
            Instagramをフォロー
          </a>
          <p className="text-n1 text-xs text-center mt-2">
            最新の一椀と作り手の話を、写真でお届けしています
          </p>
        </div>

        {/* Footer */}
        <div className="border-t border-s2/50 mt-8 pt-6 pb-10 px-6">
          <p className="text-p2 text-[12px] text-center leading-relaxed">
            バナスク公式LINEでは、wan selection（バーナードスクエア店内コーナー）の
            <br />
            最新情報や、THE WAN STANDARD の先行案内をお届けしています。
          </p>
        </div>

      </div>
    </div>
  )
}
