"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { getCategories, getProduct, addToCart, type Product, type StoreCategory } from "@/lib/storekit";
import { getCartId, setCartId } from "@/lib/cart-storage";
import Link from "next/link";

interface Props { productId: string; }

export function ProductDetail({ productId }: Props) {
  const router = useRouter();
  const [product, setProduct] = useState<Product | null>(null);
  const [categories, setCategories] = useState<StoreCategory[]>([]);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const [adding, setAdding] = useState(false);

  useEffect(() => {
    Promise.all([getProduct(productId), getCategories().catch(() => [])])
      .then(([nextProduct, nextCategories]) => { setProduct(nextProduct); setCategories(nextCategories); })
      .catch(() => setProduct(null))
      .finally(() => setLoading(false));
  }, [productId]);

  async function handleAddToCart() {
    if (!product || product.stock <= 0) return;
    setAdding(true);
    try {
      const cart = await addToCart(getCartId(), product.id, quantity);
      setCartId(cart.id);
      router.push("/shop/cart");
    } catch {
      alert("カートへの追加に失敗しました。再度お試しください。");
    } finally {
      setAdding(false);
    }
  }

  if (loading) return <p className="text-n1 text-sm">読み込み中...</p>;
  if (!product) return <div><Link href="/shop" className="text-sm text-n1 hover:text-p2 mb-6 inline-block">← ショップに戻る</Link><p className="text-n1 text-sm">商品が見つかりませんでした。</p></div>;

  const category = product.category ? categories.find((item) => item.id === product.category) : undefined;
  const backHref = category ? `/shop?category=${encodeURIComponent(category.slug)}` : "/shop";
  const backLabel = category ? `${category.name} の商品を見る` : "ショップに戻る";
  const soldOut = product.stock <= 0;

  return <div><Link href={backHref} className="text-sm text-n1 hover:text-p2 mb-6 inline-block">← {backLabel}</Link><div className="grid grid-cols-1 md:grid-cols-2 gap-8"><div className="relative aspect-square bg-white border border-s2/40 overflow-hidden">{product.imageUrl ? <img src={product.imageUrl} alt={product.name} className={`w-full h-full object-cover ${soldOut ? "opacity-65" : ""}`} /> : <div className="w-full h-full flex items-center justify-center text-n1 text-sm">No Image</div>}{soldOut && <div className="absolute inset-x-0 bottom-0 bg-p2/90 py-3 text-center text-p1 text-xs tracking-[0.25em]">SOLD OUT</div>}</div><div className="flex flex-col gap-4">{category && <p className="text-xs tracking-widest text-s1">{category.name}</p>}<h1 className="font-serif-ja text-2xl text-p2">{product.name}</h1><p className="text-xl text-p2">¥{product.price.toLocaleString("ja-JP")}</p>{product.description && <p className="text-sm text-n1 leading-relaxed">{product.description}</p>}<div className="flex flex-wrap gap-x-5 gap-y-2"><Link href="/guide/size" className="text-sm text-p2 underline w-fit">サイズ・商品の選び方を見る</Link><Link href="/guide/gift" className="text-sm text-p2 underline w-fit">ギフトとしてご検討の方へ</Link></div>{soldOut ? <div className="border border-s2/40 bg-white p-4"><p className="text-sm font-medium text-p2 mb-1">現在在庫切れです</p><p className="text-xs text-n1 leading-relaxed mb-3">再入荷予定は未定です。入荷状況について確認したい場合はお問い合わせください。</p><Link href="/contact" className="text-sm text-p2 underline">再入荷について問い合わせる</Link></div> : <><div className="flex items-center gap-3"><label className="text-sm text-p2">数量</label><select value={quantity} onChange={(event) => setQuantity(Number(event.target.value))} className="border border-s2/60 px-3 py-1.5 text-sm bg-p1 text-p2">{Array.from({ length: Math.min(product.stock, 10) }, (_, i) => <option key={i + 1} value={i + 1}>{i + 1}</option>)}</select></div><button onClick={handleAddToCart} disabled={adding} className="mt-2 px-6 py-3 bg-p2 text-p1 text-sm tracking-widest hover:bg-p3 transition-colors disabled:opacity-50 disabled:cursor-not-allowed">{adding ? "追加中..." : "カートに追加"}</button></>}</div></div></div>;
}
