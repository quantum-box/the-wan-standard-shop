"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { getProducts, type Product } from "@/lib/storekit";
import { getStoreCategory, STORE_CATEGORIES, type StoreCategory } from "@/lib/product-category";

export function ShopProductGrid() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [category, setCategory] = useState<StoreCategory | "All">("All");

  useEffect(() => {
    const requested = new URLSearchParams(window.location.search).get("category");
    if (requested && STORE_CATEGORIES.includes(requested as StoreCategory)) setCategory(requested as StoreCategory);
    getProducts().then(setProducts).catch(() => setProducts([])).finally(() => setLoading(false));
  }, []);

  const filtered = useMemo(() => category === "All" ? products : products.filter((product) => getStoreCategory(product) === category), [products, category]);

  if (loading) return <p className="text-n1 text-sm">読み込み中...</p>;
  if (products.length === 0) return <p className="text-n1 text-sm">現在、商品の準備中です。しばらくお待ちください。</p>;

  return <>
    <div className="flex flex-wrap gap-2 mb-7" aria-label="商品カテゴリ">
      {(["All", ...STORE_CATEGORIES] as const).map((item) => <button key={item} type="button" onClick={() => setCategory(item)} className={`px-4 py-2 text-xs tracking-wider border transition-colors ${category === item ? "bg-p2 border-p2 text-p1" : "border-s2/60 text-p2 hover:border-p2"}`}>{item}</button>)}
    </div>
    {filtered.length === 0 ? <div className="py-12 text-center"><p className="text-sm text-n1 mb-3">このカテゴリの商品はまだありません。</p><button onClick={() => setCategory("All")} className="text-sm text-p2 underline">すべての商品を見る</button></div> :
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">{filtered.map((product) => {
      const itemCategory = getStoreCategory(product);
      return <Link key={product.id} href={`/shop/${product.id}`} className="group border border-s2/40 hover:border-s2 transition-colors"><div className="relative aspect-square bg-white overflow-hidden">{product.imageUrl ? <img src={product.imageUrl} alt={product.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" /> : <div className="w-full h-full flex items-center justify-center text-n1 text-xs">No Image</div>}{product.stock === 0 && <div className="absolute inset-0 bg-black/40 flex items-center justify-center pointer-events-none"><span className="px-3 py-1 bg-s1 text-p1 text-xs tracking-widest">在庫切れ</span></div>}</div><div className="p-4"><p className="text-[10px] tracking-widest uppercase text-s1 mb-1">{itemCategory}</p><p className="font-serif-ja text-p2 mb-1">{product.name}</p><p className="text-sm text-n1">¥{product.price.toLocaleString("ja-JP")}</p></div></Link>;
    })}</div>}
  </>;
}
