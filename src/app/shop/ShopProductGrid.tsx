"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { getProducts, type Product } from "@/lib/storekit";

export function ShopProductGrid() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  useEffect(() => { getProducts().then(setProducts).catch(() => setProducts([])).finally(() => setLoading(false)); }, []);
  if (loading) return <p className="text-n1 text-sm">読み込み中...</p>;
  if (products.length === 0) return <p className="text-n1 text-sm">現在、商品の準備中です。しばらくお待ちください。</p>;
  return <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">{products.map((product) => {
    const soldOut = product.stock <= 0;
    return <Link key={product.id} href={`/shop/${product.id}`} className="group border border-s2/40 hover:border-s2 transition-colors"><div className="relative aspect-square bg-white overflow-hidden">{product.imageUrl ? <img src={product.imageUrl} alt={product.name} className={`w-full h-full object-cover transition-transform duration-300 ${soldOut ? "opacity-65" : "group-hover:scale-105"}`} /> : <div className="w-full h-full flex items-center justify-center text-n1 text-xs">No Image</div>}{soldOut && <div className="absolute inset-x-0 bottom-0 bg-p2/90 py-2 text-center"><span className="text-p1 text-xs tracking-[0.2em]">SOLD OUT</span></div>}</div><div className="p-4"><p className="font-serif-ja text-p2 mb-1">{product.name}</p><p className="text-sm text-n1">¥{product.price.toLocaleString("ja-JP")}</p>{soldOut && <p className="text-xs text-s1 mt-2">再入荷予定: 未定</p>}</div></Link>;
  })}</div>;
}
