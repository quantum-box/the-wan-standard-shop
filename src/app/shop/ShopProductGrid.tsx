"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { getCategories, getProducts, type Product, type StoreCategory } from "@/lib/storekit";

type LoadState = "loading" | "ready" | "error";

export function ShopProductGrid() {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<StoreCategory[]>([]);
  const [selectedSlug, setSelectedSlug] = useState("all");
  const [query, setQuery] = useState("");
  const [state, setState] = useState<LoadState>("loading");

  const load = useCallback(async () => {
    setState("loading");
    try {
      const nextProducts = await getProducts();
      const nextCategories = await getCategories().catch(() => []);
      setProducts(nextProducts);
      setCategories(nextCategories);
      setState("ready");
    } catch {
      setState("error");
    }
  }, []);

  useEffect(() => {
    const requested = new URLSearchParams(window.location.search).get("category");
    const timeoutId = window.setTimeout(() => {
      if (requested) setSelectedSlug(requested);
      void load();
    }, 0);
    return () => window.clearTimeout(timeoutId);
  }, [load]);

  const categoryById = useMemo(() => new Map(categories.map((category) => [category.id, category])), [categories]);
  const visibleCategories = useMemo(() => categories.filter((category) => products.some((product) => product.category === category.id)).sort((a, b) => a.sortOrder - b.sortOrder || a.name.localeCompare(b.name, "ja")), [categories, products]);
  const selectedCategory = visibleCategories.find((category) => category.slug === selectedSlug);
  const results = useMemo(() => {
    const normalized = query.trim().toLowerCase();
    return products.filter((product) => {
      if (selectedCategory && product.category !== selectedCategory.id) return false;
      if (!normalized) return true;
      const category = product.category ? categoryById.get(product.category) : undefined;
      return `${product.name} ${product.description} ${category?.name ?? ""} ${category?.slug ?? ""}`.toLowerCase().includes(normalized);
    });
  }, [products, query, selectedCategory, categoryById]);

  if (state === "loading") return <div role="status" aria-live="polite" className="py-8 text-sm text-n1">商品を読み込んでいます...</div>;
  if (state === "error") return <div className="border border-s2/40 bg-white p-6 text-center"><p className="text-sm text-p2 mb-2">商品を読み込めませんでした。</p><p className="text-xs text-n1 mb-4">通信環境をご確認のうえ、もう一度お試しください。</p><button type="button" onClick={() => void load()} className="px-5 py-2.5 bg-p2 text-p1 text-sm">再読み込み</button></div>;
  if (products.length === 0) return <div className="py-12 text-center"><p className="text-sm text-n1 mb-3">現在、購入できる商品はありません。</p><Link href="/contact" className="text-sm text-p2 underline">商品について問い合わせる</Link></div>;

  return <>
    <div className="mb-7"><label htmlFor="product-search" className="block text-xs text-n1 mb-2">商品を検索</label><div className="relative max-w-xl"><input id="product-search" type="search" value={query} onChange={(event) => setQuery(event.target.value)} placeholder="商品名・カテゴリで検索" className="w-full border border-s2/60 bg-p1 px-4 py-3 pr-12 text-base sm:text-sm text-p2 focus:outline-none focus:border-p2" />{query && <button type="button" onClick={() => setQuery("")} aria-label="検索をクリア" className="absolute inset-y-0 right-0 px-4 text-n1 hover:text-p2">×</button>}</div>{query && <p className="text-xs text-n1 mt-2">{results.length}件の商品</p>}</div>
    {visibleCategories.length > 0 && <div className="flex flex-wrap gap-2 mb-7" aria-label="商品カテゴリ"><button type="button" onClick={() => setSelectedSlug("all")} className={`px-4 py-2 text-xs tracking-wider border transition-colors ${!selectedCategory ? "bg-p2 border-p2 text-p1" : "border-s2/60 text-p2 hover:border-p2"}`}>All</button>{visibleCategories.map((category) => <button key={category.id} type="button" onClick={() => setSelectedSlug(category.slug)} className={`px-4 py-2 text-xs tracking-wider border transition-colors ${selectedCategory?.id === category.id ? "bg-p2 border-p2 text-p1" : "border-s2/60 text-p2 hover:border-p2"}`}>{category.name}</button>)}</div>}
    {results.length === 0 ? <div className="py-14 text-center border-y border-s2/30"><p className="text-sm text-p2 mb-2">条件に一致する商品はありませんでした。</p><p className="text-xs text-n1 mb-4">検索語を短くするか、別のカテゴリをお試しください。</p><button onClick={() => { setQuery(""); setSelectedSlug("all"); }} className="text-sm text-p2 underline">すべての商品を見る</button></div> : <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">{results.map((product) => { const category = product.category ? categoryById.get(product.category) : undefined; const soldOut = !product.orderable; return <Link key={product.id} href={`/shop/${product.id}`} className="group border border-s2/40 hover:border-s2 transition-colors"><div className="relative aspect-square bg-white overflow-hidden">{product.imageUrl ? <img src={product.imageUrl} alt={product.name} className={`w-full h-full object-cover transition-transform duration-300 ${soldOut ? "opacity-65" : "group-hover:scale-105"}`} /> : <div className="w-full h-full flex items-center justify-center text-n1 text-xs">No Image</div>}{soldOut && <div className="absolute inset-x-0 bottom-0 bg-p2/90 py-2 text-center"><span className="text-p1 text-xs tracking-[0.2em]">SOLD OUT</span></div>}</div><div className="p-4">{category && <p className="text-[10px] tracking-widest text-s1 mb-1">{category.name}</p>}<p className="font-serif-ja text-p2 mb-1">{product.name}</p><p className="text-sm text-n1">¥{product.price.toLocaleString("ja-JP")}</p>{soldOut && <p className="text-xs text-s1 mt-2">再入荷予定: 未定</p>}</div></Link>; })}</div>}
  </>;
}
