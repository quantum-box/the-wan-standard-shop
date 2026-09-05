"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { getCart, updateCartItem, removeCartItem, type Cart } from "@/lib/storekit";
import { isNotFound } from "@/lib/storekit-client";
import { getCartId, clearCartId } from "@/lib/cart-storage";
import { ProductImage } from "@/components/ui/ProductImage";
import styles from "@/components/ui/storefront.module.css";
import Link from "next/link";

export default function CartPage() {
  const router = useRouter();
  const [cart, setCart] = useState<Cart | null>(null);
  const [loading, setLoading] = useState(true);
  const [pending, setPending] = useState(false);
  const [error, setError] = useState("");
  const pendingRef = useRef(false);

  const load = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const cartId = getCartId();
      setCart(cartId ? await getCart(cartId) : null);
    } catch (cause) {
      // A transient error must not silently discard a customer's cart.
      if (isNotFound(cause)) { clearCartId(); setCart(null); }
      else setError("カートを読み込めませんでした。通信環境をご確認のうえ、再読み込みしてください。");
    } finally { setLoading(false); }
  }, []);
  useEffect(() => { const timer = window.setTimeout(() => void load(), 0); return () => window.clearTimeout(timer); }, [load]);

  async function handleUpdate(itemId: string, quantity: number) {
    const cartId = getCartId();
    if (!cartId || pendingRef.current) return;
    pendingRef.current = true;
    setPending(true);
    setError("");
    try { setCart(quantity === 0 ? await removeCartItem(cartId, itemId) : await updateCartItem(cartId, itemId, quantity)); }
    catch { setError("カートを更新できませんでした。内容を確認して、もう一度お試しください。"); }
    finally { pendingRef.current = false; setPending(false); }
  }

  // Display the server's arithmetic, never a client-recomputed total.
  const total = cart?.subtotal ?? 0;
  const unavailable = cart?.items.some((item) => !item.product.orderable) ?? false;
  return <div>
    <h1>カート</h1><p className="text-sm text-n1 mb-8">お選びいただいた商品をご確認ください。</p>
    {loading ? <div className={styles.state} role="status"><p>カートを読み込んでいます…</p></div> : !cart && error ? <div className={styles.state}><p role="alert">{error}</p><button type="button" className={styles.primaryLink} onClick={() => void load()}>再読み込み</button></div> : !cart || cart.items.length === 0 ? <div className={styles.state}><h2>カートは空です。</h2><p>愛犬の毎日に寄り添う一椀を、ゆっくりお選びください。</p><Link href="/shop" className={styles.primaryLink}>商品を探す <span aria-hidden="true">→</span></Link></div> : <>
      {error && <p role="alert" className={styles.error}>{error}</p>}
      <div className={styles.cartLayout} aria-busy={pending}>
        <section aria-label="カートの商品">{cart.items.map((item) => <article key={item.itemId} className={styles.cartItem}>
          <Link href={`/shop/${item.productId}`} className={styles.cartImage} aria-label={`${item.product.name}の詳細`}><ProductImage src={item.product.imageUrl} name={item.product.name} sizes="96px" /></Link>
          <div><h2><Link href={`/shop/${item.productId}`}>{item.product.name}</Link></h2><p>単価 ¥{item.unitPrice.toLocaleString("ja-JP")}</p>{!item.product.orderable && <p className={styles.error}>現在お取り扱いできません。削除してからお進みください。</p>}
            <div className={styles.cartControls}><label className="sr-only" htmlFor={`qty-${item.itemId}`}>{item.product.name}の数量</label><select id={`qty-${item.itemId}`} value={item.quantity} disabled={pending} onChange={(event) => void handleUpdate(item.itemId, Number(event.target.value))}>{Array.from({ length: Math.max(10, item.quantity) }, (_, i) => <option key={i + 1} value={i + 1}>{i + 1}</option>)}</select><button type="button" disabled={pending} onClick={() => void handleUpdate(item.itemId, 0)} aria-label={`${item.product.name}を削除`}>削除</button></div>
          </div><p>¥{item.subtotal.toLocaleString("ja-JP")}</p>
        </article>)}<Link href="/shop" className={styles.textLink}>← お買い物を続ける</Link></section>
        <aside className={styles.cartSummary} aria-labelledby="cart-summary-title"><h2 id="cart-summary-title">ご注文内容</h2><dl><dt>商品合計</dt><dd>¥{total.toLocaleString("ja-JP")}</dd></dl><p>受け取り方法・お支払い方法・クーポンは、次の画面でご確認いただけます。</p>{unavailable && <p role="alert" className={styles.error}>在庫切れの商品を削除するとレジに進めます。</p>}<button type="button" onClick={() => router.push("/shop/checkout")} disabled={unavailable || pending} className={styles.primaryLink}>{pending ? "更新中…" : "レジに進む"}</button><Link href="/pickup" className={`${styles.textLink} mt-4`}>店舗受け取りについて</Link></aside>
      </div>
    </>}
  </div>;
}
