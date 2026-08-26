"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { getProducts, type Product } from "@/lib/storekit";

function categoryKeywords(product: Product): string {
  const text = `${product.name} ${product.description}`.toLowerCase();
  if (/stand|スタンド|食器台|フード台/.test(text)) return "stand スタンド 食器台";
  if (/goods|グッズ|bag|バッグ|mat|マット|toy|おもちゃ|leash|リード/.test(text)) return "goods グッズ";
  return "bowl ボウル 器 食器";
}

export function ShopProductGrid() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [query, setQuery] = useState("");

  useEffect(() => { getProducts().then(setProducts).catch(() => setProducts([])).finally(() => setLoading(false)); }, []);

  const results = useMemo(() => {
    const normalized = query.trim().toLowerCase();
    if (!normalized) return products;
    return products.filter((product) => `${product.name} ${product.description} ${product.category ?? ""} ${categoryKeywords(product)}`.toLowerCase().includes(normalized));
  }, [products, query]);

  if (loading) return <p className="text-n1 text-sm">読み込み中...</p>;

  return <>
    <div className="mb-7">
      <label htmlFor="product-search" className="block text-xs text-n1 mb-2">商品を検索</label>
      <div className="relative max-w-xl"><input id="product-search" type="search" value={query} onChange={(e) => setQuery(e.target.value)} placeholder="商品名・カテゴリで検索" className="w-full border border-s2/60 bg-p1 px-4 py-3 pr-12 text-base sm:text-sm text-p2 focus:outline-none focus:border-p2" />{query && <button type="button" onClick={() => setQuery("")} aria-label="検索をクリア" className="absolute inset-y-0 right-0 px-4 text-n1 hover:text-p2">×</button>}</div>
      {query && <p className="text-xs text-n1 mt-2">{results.length}件の商品</p>}
    </div>

    {products.length === 0 ? <p className="text-n1 text-sm">現在、商品の準備中です。しばらくお待ちください。</p> : results.length === 0 ? <div className="py-14 text-center border-y border-s2/30"><p className="text-sm text-p2 mb-2">「{query}」に一致する商品はありませんでした。</p><p className="text-xs text-n1 mb-4">別のキーワードや、短い言葉でお試しください。</p><button onClick={() => setQuery("")} className="text-sm text-p2 underline">すべての商品を見る</button></div> :
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">{results.map((product) => <Link key={product.id} href={`/shop/${product.id}`} className="group border border-s2/40 hover:border-s2 transition-colors"><div className="relative aspect-square bg-white overflow-hidden">{product.imageUrl ? <img src={product.imageUrl} alt={product.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" /> : <div className="w-full h-full flex items-center justify-center text-n1 text-xs">No Image</div>}{product.stock === 0 && <div className="absolute inset-0 bg-black/40 flex items-center justify-center pointer-events-none"><span className="px-3 py-1 bg-s1 text-p1 text-xs tracking-widest">在庫切れ</span></div>}</div><div className="p-4"><p className="font-serif-ja text-p2 mb-1">{product.name}</p><p className="text-sm text-n1">¥{product.price.toLocaleString("ja-JP")}</p></div></Link>)}</div>}
  </>;
}
