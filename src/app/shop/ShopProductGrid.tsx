"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { getCategories, getProducts, type Product, type StoreCategory } from "@/lib/storekit";

import { ProductImage } from "@/components/ui/ProductImage";
import styles from "@/components/ui/storefront.module.css";

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

  if (state === "loading") return <div role="status" aria-live="polite"><p className="text-sm text-n1 mb-6">商品を読み込んでいます…</p><div className={styles.skeletonGrid} aria-hidden="true">{[1, 2, 3].map((key) => <div key={key} className={styles.skeleton} />)}</div></div>;
  if (state === "error") return <div className={styles.state} role="alert"><h2>商品を読み込めませんでした。</h2><p>通信環境をご確認のうえ、もう一度お試しください。</p><button type="button" onClick={() => void load()} className={styles.primaryLink}>再読み込み</button></div>;
  if (products.length === 0) return <div className={styles.state}><h2>現在、購入できる商品はありません。</h2><p>商品についてのご相談は、お問い合わせからどうぞ。</p><Link href="/contact" className={styles.textLink}>商品について問い合わせる</Link></div>;

  return <>
    <div className={styles.catalogToolbar}>
      <div className={styles.search}><label htmlFor="product-search">商品を検索</label><div className={styles.searchField}><input id="product-search" type="search" value={query} onChange={(event) => setQuery(event.target.value)} placeholder="商品名・カテゴリで検索" />{query && <button type="button" onClick={() => setQuery("")} aria-label="検索をクリア">×</button>}</div></div>
      <p className={styles.resultCount} role="status" aria-live="polite">{results.length}件の商品</p>
    </div>
    {visibleCategories.length > 0 && <div className={styles.filters} role="group" aria-label="商品カテゴリ"><button type="button" onClick={() => setSelectedSlug("all")} aria-pressed={!selectedCategory}>すべて</button>{visibleCategories.map((category) => <button key={category.id} type="button" onClick={() => setSelectedSlug(category.slug)} aria-pressed={selectedCategory?.id === category.id}>{category.name}</button>)}</div>}
    {results.length === 0 ? <div className={styles.state}><h2>条件に一致する商品はありませんでした。</h2><p>検索語を短くするか、別のカテゴリをお試しください。</p><button type="button" onClick={() => { setQuery(""); setSelectedSlug("all"); }} className={styles.textLink}>すべての商品を見る</button></div> : <div className={styles.productGrid}>{results.map((product) => {
      const category = product.category ? categoryById.get(product.category) : undefined;
      return <Link key={product.id} href={`/shop/${product.id}`} className={styles.productCard}>
        <div className={styles.productPhoto}><ProductImage src={product.imageUrl} name={product.name} sizes="(max-width: 379px) calc(100vw - 40px), (max-width: 767px) 50vw, 33vw" />{!product.orderable && <span className={styles.soldOut}>在庫切れ</span>}</div>
        <div className={styles.productMeta}>{category && <p className={styles.category}>{category.name}</p>}<h2>{product.name}</h2><p>¥{product.price.toLocaleString("ja-JP")}</p></div>
      </Link>;
    })}</div>}
  </>;
}
