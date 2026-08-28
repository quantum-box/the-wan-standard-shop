"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { getCart, placeOrder, type Cart } from "@/lib/storekit";
import { clearCartId } from "@/lib/cart-storage";
import { clearCheckoutDraft, getCheckoutDraft, type CheckoutDraft, type DeliveryAddress } from "@/lib/checkout-storage";
import { saveOrderReceipt } from "@/lib/order-receipt-storage";
import {
  clearPaymentAttempt,
  hasRecentPaymentAttempt,
  markPaymentAttempt,
  savePendingPaymentOrder,
} from "@/lib/payment-attempt";

function cartChanged(previous: Cart, latest: Cart): boolean {
  if (previous.items.length !== latest.items.length) return true;
  const latestById = new Map(latest.items.map((item) => [item.itemId, item]));
  return previous.items.some((item) => {
    const current = latestById.get(item.itemId);
    return !current || current.productId !== item.productId || current.quantity !== item.quantity || current.unitPrice !== item.unitPrice;
  });
}

function addressText(address: DeliveryAddress | undefined): string {
  if (!address) return "";
  return [
    `〒${address.postalCode}`,
    address.prefecture,
    address.city,
    address.addressLine1,
    address.addressLine2,
  ].filter(Boolean).join(" ");
}

export default function CheckoutConfirmPage() {
  const router = useRouter();
  const [draft, setDraft] = useState<CheckoutDraft | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const submittedRef = useRef(false);

  useEffect(() => {
    const timeoutId = window.setTimeout(() => setDraft(getCheckoutDraft()), 0);
    return () => window.clearTimeout(timeoutId);
  }, []);

  async function validateCart(checkoutDraft: CheckoutDraft): Promise<void> {
    const latest = await getCart(checkoutDraft.cartId);
    if (latest.items.length === 0) throw new Error("EMPTY_CART");
    // The public catalog publishes availability as one bit, so this is the whole
    // stock check the storefront can make — and the one the shopper needs.
    const unavailable = latest.items.find((item) => !item.product.orderable);
    if (unavailable) throw new Error(`OUT_OF_STOCK:${unavailable.product.name}`);
    if (cartChanged(checkoutDraft.cart, latest)) throw new Error("CART_CHANGED");
  }

  async function handleConfirm() {
    if (!draft || submitting || submittedRef.current) return;
    const fulfillmentMethod = draft.fulfillmentMethod ?? "pickup";
    const paymentMethod = fulfillmentMethod === "delivery" ? "online" : (draft.paymentMethod ?? "in_store");
    const onlinePayment = paymentMethod === "online";

    if (onlinePayment && hasRecentPaymentAttempt(draft.cartId)) {
      setError("このカートでは直前にオンライン決済を開始しています。二重決済防止のため、決済画面に戻るか数分後に注文状況をご確認ください。");
      return;
    }

    submittedRef.current = true;
    setSubmitting(true);
    setError(null);

    try {
      await validateCart(draft);
      if (onlinePayment && !draft.contact.email) throw new Error("EMAIL_REQUIRED");

      const createdAt = new Date();
      const shippingAddress = fulfillmentMethod === "delivery" ? addressText(draft.deliveryAddress) : undefined;
      const origin = window.location.origin;

      if (onlinePayment) markPaymentAttempt(draft.cartId);

      // One call for every combination: Field re-prices the cart and the coupon
      // server-side, so the amounts below come back from the order it built.
      const order = await placeOrder({
        cartId: draft.cartId,
        name: draft.contact.name,
        phone: draft.contact.phone,
        email: draft.contact.email || undefined,
        fulfillmentMethod,
        paymentMethod,
        shippingAddress,
        couponCode: draft.coupon?.code,
        successUrl: onlinePayment ? `${origin}/shop/checkout/thanks` : undefined,
        cancelUrl: onlinePayment
          ? `${origin}/shop/checkout/payment?status=cancelled&cart=${encodeURIComponent(draft.cartId)}`
          : undefined,
      });

      const pickupDeadline = order.pickupDeadline ?? (() => {
        const deadline = new Date(createdAt);
        deadline.setDate(deadline.getDate() + 7);
        return deadline.toISOString();
      })();

      saveOrderReceipt({
        orderId: order.id,
        cart: draft.cart,
        name: draft.contact.name,
        phone: draft.contact.phone,
        email: draft.contact.email || undefined,
        createdAt: createdAt.toISOString(),
        fulfillmentMethod,
        paymentMethod,
        deliveryAddress: shippingAddress,
        pickupDeadline: fulfillmentMethod === "pickup" ? pickupDeadline : undefined,
        subtotal: order.subtotal,
        discount: Math.max(order.subtotal + order.shippingFee - order.total, 0),
        shippingFee: order.shippingFee,
        total: order.total,
        couponCode: draft.coupon?.code,
      });

      if (onlinePayment) {
        if (!order.checkoutUrl) throw new Error("CHECKOUT_URL_MISSING");
        savePendingPaymentOrder({ orderId: order.id, cartId: draft.cartId });
        window.location.href = order.checkoutUrl;
        return;
      }

      clearCartId();
      clearCheckoutDraft();
      router.replace(`/shop/checkout/thanks?order=${encodeURIComponent(order.id)}`);
    } catch (cause) {
      submittedRef.current = false;
      if (onlinePayment) clearPaymentAttempt(draft.cartId);
      const message = cause instanceof Error ? cause.message : "";
      if (message.startsWith("OUT_OF_STOCK:")) {
        setError(`${message.slice("OUT_OF_STOCK:".length)}は現在お取り扱いできません。カートに戻って内容を調整してください。`);
      } else if (message === "EMPTY_CART") {
        setError("カートに商品がありません。商品を選び直してください。");
      } else if (message === "CART_CHANGED") {
        setError("確認中に商品の数量または価格が変更されました。カートに戻って最新の内容をご確認ください。");
      } else if (message === "EMAIL_REQUIRED") {
        setError("オンライン決済にはメールアドレスが必要です。入力内容を修正してください。");
      } else if (message === "CHECKOUT_URL_MISSING") {
        setError("決済画面を開けませんでした。時間をおいて注文状況をご確認ください。");
      } else if (draft.coupon) {
        // The coupon is re-validated at checkout, so a code that lapsed between
        // the preview and here fails the order instead of quietly dropping off.
        setError("注文を確定できませんでした。クーポンが利用できなくなっている可能性があります。入力内容を修正するか、クーポンを外して再度お試しください。");
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

  const fulfillmentMethod = draft.fulfillmentMethod ?? "pickup";
  const paymentMethod = fulfillmentMethod === "delivery" ? "online" : (draft.paymentMethod ?? "in_store");
  const subtotal = draft.cart.subtotal;
  const discount = draft.coupon?.discount ?? 0;
  const total = subtotal - discount;

  return (
    <div className="max-w-2xl">
      <h1 className="font-serif-en text-2xl tracking-widest uppercase text-p2 mb-2">Confirm</h1>
      <p className="text-sm text-n1 mb-8">注文を確定する前に、内容をご確認ください。</p>

      <section className="border border-s2/40 bg-white mb-6">
        <h2 className="text-sm font-medium text-p2 px-5 py-4 border-b border-s2/30">ご注文商品</h2>
        <div className="divide-y divide-s2/30 px-5">
          {draft.cart.items.map((item) => <div key={item.itemId} className="py-4 flex justify-between gap-4 text-sm"><div><p className="text-p2">{item.product.name}</p><p className="text-xs text-n1 mt-1">数量 {item.quantity} × ¥{item.unitPrice.toLocaleString("ja-JP")}</p></div><p className="text-p2">¥{item.subtotal.toLocaleString("ja-JP")}</p></div>)}
        </div>
        <dl className="px-5 py-4 border-t border-s2/40 text-sm space-y-2">
          <div className="flex justify-between"><dt className="text-n1">商品小計</dt><dd className="text-p2">¥{subtotal.toLocaleString("ja-JP")}</dd></div>
          {draft.coupon && <div className="flex justify-between"><dt className="text-n1">クーポン割引（{draft.coupon.code}）</dt><dd className="text-s1">-¥{discount.toLocaleString("ja-JP")}</dd></div>}
          <div className="flex justify-between font-medium pt-2 border-t border-s2/30"><dt className="text-p2">{fulfillmentMethod === "delivery" ? "商品合計" : "合計"}</dt><dd className="text-p2">¥{total.toLocaleString("ja-JP")}</dd></div>
        </dl>
        {fulfillmentMethod === "delivery" && <p className="px-5 pb-4 text-xs text-n1">送料は決済時に自動計算されます。</p>}
        {draft.coupon && <p className="px-5 pb-4 text-xs text-n1">割引は注文確定時にあらためて計算されます。</p>}
      </section>

      <section className="grid sm:grid-cols-2 gap-4 mb-6">
        <div className="border border-s2/40 bg-white p-5">
          <h2 className="text-sm font-medium text-p2 mb-3">受け取り・お支払い</h2>
          <dl className="text-sm space-y-2">
            <div><dt className="text-xs text-n1">受取方法</dt><dd className="text-p2">{fulfillmentMethod === "delivery" ? "配送" : "店舗受け取り"}</dd></div>
            {fulfillmentMethod === "pickup" ? <><div><dt className="text-xs text-n1">受取店舗</dt><dd className="text-p2">バーナードスクエア</dd></div><div><dt className="text-xs text-n1">受取期限</dt><dd className="text-p2">注文日から7日以内</dd></div></> : <div><dt className="text-xs text-n1">配送先</dt><dd className="text-p2 break-words">{addressText(draft.deliveryAddress)}</dd></div>}
            <div><dt className="text-xs text-n1">支払方法</dt><dd className="text-p2">{paymentMethod === "online" ? "クレジットカード（オンライン決済）" : "店頭払い"}</dd></div>
          </dl>
        </div>
        <div className="border border-s2/40 bg-white p-5">
          <h2 className="text-sm font-medium text-p2 mb-3">ご連絡先</h2>
          <dl className="text-sm space-y-2"><div><dt className="text-xs text-n1">お名前</dt><dd className="text-p2 break-words">{draft.contact.name}</dd></div><div><dt className="text-xs text-n1">電話番号</dt><dd className="text-p2 break-words">{draft.contact.phone}</dd></div><div><dt className="text-xs text-n1">メール</dt><dd className="text-p2 break-words">{draft.contact.email || "未入力"}</dd></div></dl>
        </div>
      </section>

      <p className="text-xs text-n1 leading-relaxed mb-5">注文確定前に<Link href="/guide/cancel" className="underline text-p2">返品・キャンセル条件</Link>をご確認ください。</p>
      {error && <p role="alert" className="text-sm text-s1 mb-4">{error}</p>}
      <div className="flex flex-col-reverse sm:flex-row gap-3">
        <Link href="/shop/cart" className="flex-1 text-center py-3 border border-s2 text-n1 text-sm hover:border-p2 hover:text-p2">カートに戻る</Link>
        <Link href="/shop/checkout" className="flex-1 text-center py-3 border border-p2 text-p2 text-sm hover:bg-white">入力内容を修正する</Link>
        <button onClick={handleConfirm} disabled={submitting} className="flex-1 py-3 bg-p2 text-p1 text-sm tracking-widest hover:bg-p3 disabled:opacity-50 disabled:cursor-not-allowed">{submitting ? "処理中..." : paymentMethod === "online" ? "決済画面へ進む" : "注文を確定する"}</button>
      </div>
    </div>
  );
}
