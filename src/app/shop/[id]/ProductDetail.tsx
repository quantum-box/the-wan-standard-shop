"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { addToCart, type Product } from "@/lib/storekit";
import { getCartId, setCartId } from "@/lib/cart-storage";
import Link from "next/link";

interface Props {
  product: Product;
}

export function ProductDetail({ product }: Props) {
  const router = useRouter();
  const [quantity, setQuantity] = useState(1);
  const [adding, setAdding] = useState(false);

  async function handleAddToCart() {
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
          {product.stock === 0 ? (
            <p className="text-sm text-s1">在庫切れです</p>
          ) : (
            <>
              <div className="flex items-center gap-3">
                <label className="text-sm text-p2">数量</label>
                <select
                  value={quantity}
                  onChange={(e) => setQuantity(Number(e.target.value))}
                  className="border border-s2/60 px-3 py-1.5 text-sm bg-p1 text-p2"
                >
                  {Array.from({ length: Math.min(product.stock, 10) }, (_, i) => (
                    <option key={i + 1} value={i + 1}>
                      {i + 1}
                    </option>
                  ))}
                </select>
              </div>
              <button
                onClick={handleAddToCart}
                disabled={adding}
                className="mt-2 px-6 py-3 bg-p2 text-p1 text-sm tracking-widest hover:bg-p3 transition-colors disabled:opacity-50"
              >
                {adding ? "追加中..." : "カートに追加"}
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
