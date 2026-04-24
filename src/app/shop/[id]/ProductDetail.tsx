"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { getProduct, addToCart, type Product } from "@/lib/storekit";
import { getCartId, setCartId } from "@/lib/cart-storage";
import Link from "next/link";

interface Props {
  productId: string;
}

export function ProductDetail({ productId }: Props) {
  const router = useRouter();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const [adding, setAdding] = useState(false);

  useEffect(() => {
    getProduct(productId)
      .then(setProduct)
      .catch(() => setProduct(null))
      .finally(() => setLoading(false));
  }, [productId]);

  async function handleAddToCart() {
    if (!product) return;
    setAdding(true);
    try {
      const cartId = getCartId();
      const cart = await addToCart(cartId, product.id, quantity);
      setCartId(cart.id);
      router.push("/shop/cart");
    } catch {
      alert("カートへの追加に失敗しました。再度お試しください。");
    } finally {
      setAdding(false);
    }
  }

  if (loading) {
    return <p className="text-n1 text-sm">読み込み中...</p>;
  }

  if (!product) {
    return (
      <div>
        <Link href="/shop" className="text-sm text-n1 hover:text-p2 mb-6 inline-block">
          ← ショップに戻る
        </Link>
        <p className="text-n1 text-sm">商品が見つかりませんでした。</p>
      </div>
    );
  }

  return (
    <div>
      <Link href="/shop" className="text-sm text-n1 hover:text-p2 mb-6 inline-block">
        ← ショップに戻る
      </Link>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="aspect-square bg-white border border-s2/40 overflow-hidden">
          {product.imageUrl ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={product.imageUrl}
              alt={product.name}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-n1 text-sm">
              No Image
            </div>
          )}
        </div>
        <div className="flex flex-col gap-4">
          <h1 className="font-serif-ja text-2xl text-p2">{product.name}</h1>
          <p className="text-xl text-p2">¥{product.price.toLocaleString("ja-JP")}</p>
          {product.description && (
            <p className="text-sm text-n1 leading-relaxed">{product.description}</p>
          )}
          {product.stock === 0 && (
            <span className="inline-block w-fit px-3 py-1 bg-s1 text-p1 text-xs tracking-widest">
              在庫切れ
            </span>
          )}
          <div className="flex items-center gap-3">
            <label className="text-sm text-p2">数量</label>
            <select
              value={quantity}
              onChange={(e) => setQuantity(Number(e.target.value))}
              disabled={product.stock === 0}
              className="border border-s2/60 px-3 py-1.5 text-sm bg-p1 text-p2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {Array.from(
                { length: Math.max(1, Math.min(product.stock, 10)) },
                (_, i) => (
                  <option key={i + 1} value={i + 1}>
                    {i + 1}
                  </option>
                )
              )}
            </select>
          </div>
          <button
            onClick={handleAddToCart}
            disabled={adding || product.stock === 0}
            className="mt-2 px-6 py-3 bg-p2 text-p1 text-sm tracking-widest hover:bg-p3 transition-colors disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-p2"
          >
            {product.stock === 0
              ? "在庫切れ"
              : adding
              ? "追加中..."
              : "カートに追加"}
          </button>
        </div>
      </div>
    </div>
  );
}
