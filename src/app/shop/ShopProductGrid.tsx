"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { getCategories, getProducts, type Product, type StoreCategory } from "@/lib/storekit";

export function ShopProductGrid() {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<StoreCategory[]>([]);
  const [selectedSlug, setSelectedSlug] = useState("all");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const requested = new URLSearchParams(window.location.search).get("category");
    if (requested) setSelectedSlug(requested);

    Promise.all([getProducts(), getCategories().catch(() => [])])
      .then(([nextProducts, nextCategories]) => {
        setProducts(nextProducts);
        setCategories(nextCategories);
      })
      .catch(() => setProducts([]))
      .finally(() => setLoading(false));
  }, []);

  const categoryById = useMemo(
    () => new Map(categories.map((category) => [category.id, category])),
    [categories]
  );

  const visibleCategories = useMemo(
    () => categories
      .filter((category) => products.some((product) => product.category === category.id))
      .sort((a, b) => a.sortOrder - b.sortOrder || a.name.localeCompare(b.name, "ja")),
    [categories, products]
  );

  const selectedCategory = visibleCategories.find((category) => category.slug === selectedSlug);
  const filtered = selectedCategory
    ? products.filter((product) => product.category === selectedCategory.id)
    : products;

  if (loading) return <p className="text-n1 text-sm">読み込み中...</p>;
  if (products.length === 0) return <p className="text-n1 text-sm">現在、商品の準備中です。しばらくお待ちください。</p>;

  return (
    <>
      {visibleCategories.length > 0 && (
        <div className="flex flex-wrap gap-2 mb-7" aria-label="商品カテゴリ">
          <button type="button" onClick={() => setSelectedSlug("all")} className={`px-4 py-2 text-xs tracking-wider border transition-colors ${!selectedCategory ? "bg-p2 border-p2 text-p1" : "border-s2/60 text-p2 hover:border-p2"}`}>All</button>
          {visibleCategories.map((category) => (
            <button key={category.id} type="button" onClick={() => setSelectedSlug(category.slug)} className={`px-4 py-2 text-xs tracking-wider border transition-colors ${selectedCategory?.id === category.id ? "bg-p2 border-p2 text-p1" : "border-s2/60 text-p2 hover:border-p2"}`}>{category.name}</button>
          ))}
        </div>
      )}

      {filtered.length === 0 ? (
        <div className="py-12 text-center">
          <p className="text-sm text-n1 mb-3">このカテゴリの商品はまだありません。</p>
          <button onClick={() => setSelectedSlug("all")} className="text-sm text-p2 underline">すべての商品を見る</button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map((product) => {
            const category = product.category ? categoryById.get(product.category) : undefined;
            return (
              <Link key={product.id} href={`/shop/${product.id}`} className="group border border-s2/40 hover:border-s2 transition-colors">
                <div className="relative aspect-square bg-white overflow-hidden">
                  {product.imageUrl ? <img src={product.imageUrl} alt={product.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" /> : <div className="w-full h-full flex items-center justify-center text-n1 text-xs">No Image</div>}
                  {product.stock === 0 && <div className="absolute inset-0 bg-black/40 flex items-center justify-center pointer-events-none"><span className="px-3 py-1 bg-s1 text-p1 text-xs tracking-widest">在庫切れ</span></div>}
                </div>
                <div className="p-4">
                  {category && <p className="text-[10px] tracking-widest text-s1 mb-1">{category.name}</p>}
                  <p className="font-serif-ja text-p2 mb-1">{product.name}</p>
                  <p className="text-sm text-n1">¥{product.price.toLocaleString("ja-JP")}</p>
                </div>
              </Link>
            );
          })}
        </div>
      )}
    </>
  );
}
