"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { useRouter } from "next/navigation";
import { getCategories, getProduct, addToCart, type Product, type StoreCategory } from "@/lib/storekit";
import { getCartId, setCartId } from "@/lib/cart-storage";
import { ProductImage } from "@/components/ui/ProductImage";
import styles from "@/components/ui/storefront.module.css";
import Link from "next/link";

export function ProductDetail({ productId }: { productId: string }) {
  const router = useRouter();
  const [product, setProduct] = useState<Product | null>(null);
  const [categories, setCategories] = useState<StoreCategory[]>([]);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const [adding, setAdding] = useState(false);
  const [error, setError] = useState("");
  const addingRef = useRef(false);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const [nextProduct, nextCategories] = await Promise.all([getProduct(productId), getCategories().catch(() => [])]);
      setProduct(nextProduct);
      setCategories(nextCategories);
    } catch { setProduct(null); }
    finally { setLoading(false); }
  }, [productId]);
  useEffect(() => { const timer = window.setTimeout(() => void load(), 0); return () => window.clearTimeout(timer); }, [load]);

  async function handleAddToCart() {
    if (!product?.orderable || addingRef.current) return;
    addingRef.current = true;
    setAdding(true);
    setError("");
    try {
      const cart = await addToCart(getCartId(), product.id, quantity);
      setCartId(cart.id);
      router.push("/shop/cart");
    } catch { setError("カートへの追加に失敗しました。通信環境をご確認のうえ、再度お試しください。"); }
    finally { addingRef.current = false; setAdding(false); }
  }

  if (loading) return <div className={styles.state} role="status"><h1>商品を読み込んでいます…</h1></div>;
  if (!product) return <div className={styles.state}><h1>商品情報を表示できませんでした。</h1><p>商品が見つからないか、一時的に読み込めない状態です。</p><div className={styles.actionRow}><button type="button" onClick={() => void load()} className={styles.primaryLink}>再読み込み</button><Link href="/shop" className={styles.textLink}>商品一覧に戻る</Link></div></div>;

  const category = product.category ? categories.find((item) => item.id === product.category) : undefined;
  const backHref = category ? `/shop?category=${encodeURIComponent(category.slug)}` : "/shop";
  return <div>
    <Link href={backHref} className={styles.textLink}>← {category ? `${category.name}の商品を見る` : "商品一覧に戻る"}</Link>
    <div className={styles.productDetail}>
      <div className={styles.productPhoto}><ProductImage src={product.imageUrl} name={product.name} priority sizes="(max-width: 767px) calc(100vw - 40px), 50vw" />{!product.orderable && <span className={styles.soldOut}>在庫切れ</span>}</div>
      <div className={styles.productInfo}>
        <p className={styles.eyebrow}>{category?.name ?? "THE COLLECTION"}</p><h1>{product.name}</h1><p className={styles.price}>¥{product.price.toLocaleString("ja-JP")}</p>
        {product.description && <p className={styles.description}>{product.description}</p>}
        <div className={styles.purchasePanel}>
          {!product.orderable ? <><p className="text-sm mb-3">現在在庫切れです。再入荷予定は未定です。</p><Link href="/contact" className={styles.textLink}>再入荷について問い合わせる</Link></> : <>
            <div className={styles.quantity}><label htmlFor="product-quantity">数量</label><select id="product-quantity" value={quantity} disabled={adding} onChange={(event) => setQuantity(Number(event.target.value))}>{Array.from({ length: 10 }, (_, i) => <option key={i + 1} value={i + 1}>{i + 1}</option>)}</select></div>
            {error && <p role="alert" className={styles.error}>{error}</p>}
            <button type="button" onClick={handleAddToCart} disabled={adding} className={styles.primaryLink}>{adding ? "追加中…" : "カートに追加"}</button>
          </>}
        </div>
        <div className={styles.actionRow}><Link href="/guide/size" className={styles.textLink}>サイズ・商品の選び方</Link><Link href="/guide/gift" className={styles.textLink}>ギフトをご検討の方へ</Link></div>
      </div>
    </div>
  </div>;
}
