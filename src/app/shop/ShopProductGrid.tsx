"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { getProducts, type Product } from "@/lib/storekit";

type LoadState = "loading" | "ready" | "error";

export function ShopProductGrid() {
  const [products, setProducts] = useState<Product[]>([]);
  const [state, setState] = useState<LoadState>("loading");
  const load = useCallback(async () => { setState("loading"); try { setProducts(await getProducts()); setState("ready"); } catch { setState("error"); } }, []);
  useEffect(() => { void load(); }, [load]);
  if (state === "loading") return <div role="status" aria-live="polite" className="py-8 text-sm text-n1">商品を読み込んでいます...</div>;
  if (state === "error") return <div className="border border-s2/40 bg-white p-6 text-center"><p className="text-sm text-p2 mb-2">商品を読み込めませんでした。</p><p className="text-xs text-n1 mb-4">通信環境をご確認のうえ、もう一度お試しください。</p><button type="button" onClick={() => void load()} className="px-5 py-2.5 bg-p2 text-p1 text-sm">再読み込み</button></div>;
  if (products.length === 0) return <div className="py-12 text-center"><p className="text-sm text-n1 mb-3">現在、購入できる商品はありません。</p><Link href="/contact" className="text-sm text-p2 underline">商品について問い合わせる</Link></div>;
  return <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">{products.map((product)=><Link key={product.id} href={`/shop/${product.id}`} className="group border border-s2/40 hover:border-s2 transition-colors"><div className="relative aspect-square bg-white overflow-hidden">{product.imageUrl?<img src={product.imageUrl} alt={product.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"/>:<div className="w-full h-full flex items-center justify-center text-n1 text-xs">No Image</div>}{product.stock===0&&<div className="absolute inset-0 bg-black/40 flex items-center justify-center pointer-events-none"><span className="px-3 py-1 bg-s1 text-p1 text-xs tracking-widest">在庫切れ</span></div>}</div><div className="p-4"><p className="font-serif-ja text-p2 mb-1">{product.name}</p><p className="text-sm text-n1">¥{product.price.toLocaleString("ja-JP")}</p></div></Link>)}</div>;
}
