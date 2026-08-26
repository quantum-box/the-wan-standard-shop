import Link from "next/link";
import { BrandLockup } from "@/components/BrandLockup";

interface HeaderProps { cartCount?: number; }

export function Header({ cartCount }: HeaderProps) {
  return (
    <header className="border-b border-s2 bg-p1">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 min-h-14 py-3 flex items-center justify-between gap-4">
        <Link href="/" aria-label="THE WAN STANDARD ホーム"><BrandLockup markSize={34} hideWordmarkOnMobile wordmarkClassName="text-base" /></Link>
        <nav className="flex flex-wrap justify-end items-center gap-x-5 gap-y-2">
          <Link href="/" className="text-sm text-n1 hover:text-p2 transition-colors">ホーム</Link>
          <Link href="/shop" className="text-sm text-p2 hover:text-s1 transition-colors">ショップ</Link>
          <Link href="/faq" className="text-sm text-n1 hover:text-p2 transition-colors">FAQ</Link>
          <Link href="/shop/cart" className="text-sm text-p2 hover:text-s1 transition-colors flex items-center gap-1">カート{cartCount !== undefined && cartCount > 0 && <span className="inline-flex items-center justify-center w-5 h-5 text-xs bg-s1 text-p1">{cartCount}</span>}</Link>
        </nav>
      </div>
    </header>
  );
}
