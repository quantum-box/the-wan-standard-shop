import Link from "next/link";
import { Header } from "@/components/ui/Header";
import { Footer } from "@/components/ui/Footer";

export default function NotFound() {
  return <><Header /><main className="flex-grow max-w-xl w-full mx-auto px-4 sm:px-6 py-20 text-center"><p className="font-serif-en text-xs tracking-[0.3em] text-s1 mb-3">404</p><h1 className="font-serif-ja text-2xl text-p2 mb-4">ページが見つかりません</h1><p className="text-sm text-n1 leading-relaxed mb-8">URLが変更されたか、ページが削除された可能性があります。</p><div className="flex flex-col sm:flex-row justify-center gap-3"><Link href="/shop" className="px-6 py-3 bg-p2 text-p1 text-sm">ショップを見る</Link><Link href="/" className="px-6 py-3 border border-p2 text-p2 text-sm">ホームに戻る</Link></div></main><Footer /></>;
}
