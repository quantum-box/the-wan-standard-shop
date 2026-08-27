"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { clearCartId } from "@/lib/cart-storage";
import { clearCheckoutDraft } from "@/lib/checkout-storage";
import { getOrderReceipt, type OrderReceipt } from "@/lib/order-receipt-storage";
import {
  clearPaymentAttempt,
  clearPendingPaymentOrder,
  getPendingPaymentOrder,
} from "@/lib/payment-attempt";

function formatDate(value: string | undefined) {
  if (!value) return "注文日から7日以内";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "注文日から7日以内";
  return new Intl.DateTimeFormat("ja-JP", { year: "numeric", month: "long", day: "numeric" }).format(date);
}

export default function ThanksPage() {
  const [orderId, setOrderId] = useState("");
  const [receipt, setReceipt] = useState<OrderReceipt | null>(null);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    const queryId = new URLSearchParams(window.location.search).get("order") ?? "";
    const pending = getPendingPaymentOrder();
    const id = queryId || pending?.orderId || "";
    setOrderId(id);
    if (id) setReceipt(getOrderReceipt(id));
    if (pending) {
      clearPaymentAttempt(pending.cartId);
      clearPendingPaymentOrder();
      clearCartId();
      clearCheckoutDraft();
    }
  }, []);

  const total = useMemo(() => receipt?.cart.items.reduce((sum, item) => sum + item.product.price * item.quantity, 0) ?? 0, [receipt]);

  async function copyOrderId() {
    if (!orderId || !navigator.clipboard) return;
    try {
      await navigator.clipboard.writeText(orderId);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1600);
    } catch {
      setCopied(false);
    }
  }

  const fulfillmentMethod = receipt?.fulfillmentMethod ?? "pickup";
  const paymentMethod = receipt?.paymentMethod ?? "in_store";

  return (
    <div className="py-10 max-w-2xl mx-auto px-4">
      <div className="text-center mb-8">
        <h1 className="font-serif-en text-2xl tracking-widest uppercase text-p2 mb-3">Thank You</h1>
        <p className="text-sm text-n1">ご注文ありがとうございます。この画面を注文控えとしてご利用ください。</p>
      </div>

      {orderId && (
        <section className="border-2 border-p2 bg-white p-5 mb-6 text-center">
          <p className="text-xs text-n1 mb-1">注文番号</p>
          <p className="font-serif-en text-xl sm:text-2xl tracking-wider text-p2 break-all mb-3">{orderId}</p>
          <button onClick={copyOrderId} className="px-4 py-2 border border-p2 text-p2 text-xs hover:bg-p2 hover:text-p1">{copied ? "コピーしました" : "注文番号をコピー"}</button>
        </section>
      )}

      {receipt ? (
        <>
          <section className="border border-s2/40 bg-white mb-6">
            <h2 className="text-sm font-medium text-p2 px-5 py-4 border-b border-s2/30">ご注文内容</h2>
            <div className="divide-y divide-s2/30 px-5">
              {receipt.cart.items.map((item) => (
                <div key={item.itemId} className="py-4 flex justify-between gap-4 text-sm">
                  <div><p className="text-p2">{item.product.name}</p><p className="text-xs text-n1">数量 {item.quantity}</p></div>
                  <p className="text-p2">¥{(item.product.price * item.quantity).toLocaleString("ja-JP")}</p>
                </div>
              ))}
            </div>
            <div className="px-5 py-4 border-t border-s2/40 flex justify-between text-sm font-medium text-p2"><span>{fulfillmentMethod === "delivery" ? "商品合計" : "合計"}</span><span>¥{total.toLocaleString("ja-JP")}</span></div>
            {fulfillmentMethod === "delivery" && <p className="px-5 pb-4 text-xs text-n1">送料・決済金額の確定内容は決済画面および注文照会でご確認ください。</p>}
          </section>

          <section className="grid sm:grid-cols-2 gap-4 mb-6">
            <div className="border border-s2/40 bg-white p-5">
              <h2 className="text-sm font-medium text-p2 mb-3">{fulfillmentMethod === "delivery" ? "お届け" : "受け取り"}</h2>
              {fulfillmentMethod === "delivery" ? <><p className="text-sm text-p2">通常配送</p><p className="text-xs text-n1 mt-2 break-words">{receipt.deliveryAddress || "配送先は注文照会でご確認ください。"}</p></> : <><p className="text-sm text-p2">店舗受け取り</p><p className="text-sm text-n1">バーナードスクエア</p><p className="text-xs text-n1 mt-2">受け取り期限: {formatDate(receipt.pickupDeadline)}</p><Link href="/pickup" className="inline-block mt-3 text-xs text-p2 underline">受け取り場所・営業時間を確認</Link></>}
            </div>
            <div className="border border-s2/40 bg-white p-5">
              <h2 className="text-sm font-medium text-p2 mb-3">お支払い</h2>
              <p className="text-sm text-p2">{paymentMethod === "online" ? "クレジットカード（オンライン決済）" : "店頭払い"}</p>
              <p className="text-xs text-n1 mt-2">{paymentMethod === "online" ? "決済状況は注文照会でも確認できます。" : "商品受け取り時に店舗でお支払いください。"}</p>
            </div>
          </section>
        </>
      ) : orderId ? (
        <p className="text-sm text-n1 mb-6">この端末に保存された注文詳細はありません。注文番号は上記から控えてください。</p>
      ) : null}

      <section className="border border-s2/40 bg-white p-5 mb-8">
        <p className="text-sm text-p2 font-medium mb-2">注文の確認・お問い合わせ</p>
        <p className="text-xs text-n1 leading-relaxed mb-4">後から確認する場合は注文番号の下4桁とご注文時の電話番号が必要です。</p>
        <div className="grid sm:grid-cols-2 gap-2">
          <Link href="/shop/orders/lookup" className="text-center px-4 py-2.5 bg-p2 text-p1 text-sm">注文を確認する</Link>
          <Link href="/contact" className="text-center px-4 py-2.5 border border-p2 text-p2 text-sm">お問い合わせ方法を見る</Link>
        </div>
      </section>

      <div className="text-center"><Link href="/shop" className="text-sm text-p2 underline">ショップに戻る</Link></div>
    </div>
  );
}
