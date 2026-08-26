"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { createOrder, getCart, type Cart } from "@/lib/storekit";
import { clearCartId } from "@/lib/cart-storage";
import { clearCheckoutDraft, getCheckoutDraft, type CheckoutDraft } from "@/lib/checkout-storage";

export default function CheckoutConfirmPage() {
  const router = useRouter();
  const [draft, setDraft] = useState<CheckoutDraft | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const submittedRef = useRef(false);

  useEffect(() => { setDraft(getCheckoutDraft()); }, []);

  async function validateCart(cartId: string): Promise<Cart> {
    const latest = await getCart(cartId);
    if (latest.items.length === 0) throw new Error("EMPTY_CART");
    const unavailable = latest.items.find((item) => item.product.stock < item.quantity);
    if (unavailable) throw new Error(`OUT_OF_STOCK:${unavailable.product.name}`);
    return latest;
  }

  async function handleConfirm() {
    if (!draft || submitting || submittedRef.current) return;
    submittedRef.current = true;
    setSubmitting(true);
    setError(null);
    try {
      await validateCart(draft.cartId);
      const result = await createOrder({
        cartId: draft.cartId,
        name: draft.contact.name,
        phone: draft.contact.phone,
        email: draft.contact.email || undefined,
      });
      clearCartId();
      clearCheckoutDraft();
      if (result.checkoutUrl) window.location.href = result.checkoutUrl;
      else router.replace(`/shop/checkout/thanks?order=${encodeURIComponent(result.id)}`);
    } catch (cause) {
      submittedRef.current = false;
      const message = cause instanceof Error ? cause.message : "";
      if (message.startsWith("OUT_OF_STOCK:")) {
        setError(`${message.slice("OUT_OF_STOCK:".length)}の在庫が不足しています。カートに戻って数量を調整してください。`);
      } else if (message === "EMPTY_CART") {
        setError("カートに商品がありません。商品を選び直してください。");
      } else {
        setError("注文を確定できませんでした。内容を確認して、もう一度お試しください。");
      }
    } finally {
      setSubmitting(false);
    }
  }

  if (!draft) {
    return <div className="max-w-lg py-8"><h1 className="font-serif-en text-2xl tracking-widest uppercase text-p2 mb-4">Confirm</h1><p className="text-sm text-n1 mb-5">確認する注文情報がありません。</p><Link href="/shop/checkout" className="text-sm text-p2 underline">チェックアウトに戻る</Link></div>;
  }

  const total = draft.cart.items.reduce((sum, item) => sum + item.product.price * item.quantity, 0);

  return (
    <div className="max-w-2xl">
      <h1 className="font-serif-en text-2xl tracking-widest uppercase text-p2 mb-2">Confirm</h1>
      <p className="text-sm text-n1 mb-8">注文を確定する前に、内容をご確認ください。</p>

      <section className="border border-s2/40 bg-white mb-6">
        <h2 className="text-sm font-medium text-p2 px-5 py-4 border-b border-s2/30">ご注文商品</h2>
        <div className="divide-y divide-s2/30 px-5">
          {draft.cart.items.map((item) => (
            <div key={item.itemId} className="py-4 flex justify-between gap-4 text-sm">
              <div><p className="text-p2">{item.product.name}</p><p className="text-xs text-n1 mt-1">数量 {item.quantity} × ¥{item.product.price.toLocaleString("ja-JP")}</p></div>
              <p className="text-p2">¥{(item.product.price * item.quantity).toLocaleString("ja-JP")}</p>
            </div>
          ))}
        </div>
        <div className="px-5 py-4 border-t border-s2/40 flex justify-between text-sm font-medium text-p2"><span>合計</span><span>¥{total.toLocaleString("ja-JP")}</span></div>
      </section>

      <section className="grid sm:grid-cols-2 gap-4 mb-6">
        <div className="border border-s2/40 bg-white p-5"><h2 className="text-sm font-medium text-p2 mb-3">受け取り・お支払い</h2><dl className="text-sm space-y-2"><div><dt className="text-xs text-n1">受取方法</dt><dd className="text-p2">店舗受け取り</dd></div><div><dt className="text-xs text-n1">受取店舗</dt><dd className="text-p2">バーナードスクエア</dd></div><div><dt className="text-xs text-n1">受取期限</dt><dd className="text-p2">注文日から7日以内</dd></div><div><dt className="text-xs text-n1">支払方法</dt><dd className="text-p2">店頭払い</dd></div></dl></div>
        <div className="border border-s2/40 bg-white p-5"><h2 className="text-sm font-medium text-p2 mb-3">ご連絡先</h2><dl className="text-sm space-y-2"><div><dt className="text-xs text-n1">お名前</dt><dd className="text-p2 break-words">{draft.contact.name}</dd></div><div><dt className="text-xs text-n1">電話番号</dt><dd className="text-p2 break-words">{draft.contact.phone}</dd></div><div><dt className="text-xs text-n1">メール</dt><dd className="text-p2 break-words">{draft.contact.email || "未入力"}</dd></div></dl></div>
      </section>

      <p className="text-xs text-n1 leading-relaxed mb-5">注文確定前に<Link href="/guide/cancel" className="underline text-p2">返品・キャンセル条件</Link>をご確認ください。</p>
      {error && <p role="alert" className="text-sm text-s1 mb-4">{error}</p>}
      <div className="flex flex-col-reverse sm:flex-row gap-3">
        <Link href="/shop/checkout" className="flex-1 text-center py-3 border border-p2 text-p2 text-sm hover:bg-white">入力内容を修正する</Link>
        <button onClick={handleConfirm} disabled={submitting} className="flex-1 py-3 bg-p2 text-p1 text-sm tracking-widest hover:bg-p3 disabled:opacity-50 disabled:cursor-not-allowed">{submitting ? "注文を確定しています..." : "注文を確定する"}</button>
      </div>
    </div>
  );
}
