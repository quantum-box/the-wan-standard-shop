"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { getCart, updateCartItem, removeCartItem, type Cart } from "@/lib/storekit";
import { getCartId, clearCartId } from "@/lib/cart-storage";
import Link from "next/link";

export default function CartPage() {
  const router = useRouter();
  const [cart, setCart] = useState<Cart | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let canceled = false;

    async function loadCart() {
      try {
        const cartId = getCartId();
        if (!cartId) return;
        const nextCart = await getCart(cartId);
        if (!canceled) setCart(nextCart);
      } catch {
        clearCartId();
      } finally {
        if (!canceled) setLoading(false);
      }
    }

    loadCart();
    return () => {
      canceled = true;
    };
  }, []);

  async function handleUpdate(itemId: string, quantity: number) {
    const cartId = getCartId();
    if (!cartId) return;
    try {
      if (quantity === 0) {
        const updated = await removeCartItem(cartId, itemId);
        setCart(updated);
      } else {
        const updated = await updateCartItem(cartId, itemId, quantity);
        setCart(updated);
      }
    } catch {
      alert("更新に失敗しました。");
    }
  }

  const total = cart?.items.reduce(
    (sum, item) => sum + item.product.price * item.quantity,
    0
  ) ?? 0;

  if (loading) return <p className="text-n1 text-sm">読み込み中...</p>;

  return (
    <div>
      <h1 className="font-serif-en text-2xl tracking-widest uppercase text-p2 mb-8">
        Cart
      </h1>
      {!cart || cart.items.length === 0 ? (
        <div className="text-center py-16">
          <p className="text-n1 text-sm mb-4">カートは空です</p>
          <Link href="/shop" className="text-sm text-p2 hover:text-s1 underline">
            ショップを見る
          </Link>
        </div>
      ) : (
        <div className="flex flex-col gap-6">
          <div className="divide-y divide-s2/30">
            {cart.items.map((item) => (
              <div key={item.itemId} className="py-4 flex items-start gap-4">
                <div className="w-20 h-20 bg-white border border-s2/40 flex-shrink-0 overflow-hidden">
                  {item.product.imageUrl ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={item.product.imageUrl}
                      alt={item.product.name}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-n1 text-xs">
                      No Image
                    </div>
                  )}
                </div>
                <div className="flex-grow">
                  <p className="font-serif-ja text-p2 mb-1">{item.product.name}</p>
                  <p className="text-sm text-n1 mb-2">
                    ¥{item.product.price.toLocaleString("ja-JP")}
                  </p>
                  <div className="flex items-center gap-2">
                    <select
                      value={item.quantity}
                      onChange={(e) =>
                        handleUpdate(item.itemId, Number(e.target.value))
                      }
                      className="border border-s2/60 px-2 py-1 text-sm bg-p1 text-p2"
                    >
                      {Array.from({ length: 10 }, (_, i) => (
                        <option key={i + 1} value={i + 1}>
                          {i + 1}
                        </option>
                      ))}
                    </select>
                    <button
                      onClick={() => handleUpdate(item.itemId, 0)}
                      className="text-xs text-n1 hover:text-s1 transition-colors"
                    >
                      削除
                    </button>
                  </div>
                </div>
                <p className="text-sm text-p2 font-medium whitespace-nowrap">
                  ¥{(item.product.price * item.quantity).toLocaleString("ja-JP")}
                </p>
              </div>
            ))}
          </div>
          <div className="border-t border-s2 pt-4 flex justify-between items-center">
            <p className="text-sm text-p2">合計</p>
            <p className="text-lg text-p2 font-medium">
              ¥{total.toLocaleString("ja-JP")}
            </p>
          </div>
          <button
            onClick={() => router.push("/shop/checkout")}
            className="w-full py-3 bg-p2 text-p1 text-sm tracking-widest hover:bg-p3 transition-colors"
          >
            レジに進む
          </button>
        </div>
      )}
    </div>
  );
}
