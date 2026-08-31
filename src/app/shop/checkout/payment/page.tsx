"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { clearPaymentAttempt, clearPendingPaymentOrder } from "@/lib/payment-attempt";

export default function PaymentResultPage() {
  const [status, setStatus] = useState("cancelled");

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const next = params.get("status") ?? "cancelled";
    const cartId = params.get("cart");
    const timeoutId = window.setTimeout(() => setStatus(next), 0);
    if (cartId) clearPaymentAttempt(cartId);
    clearPendingPaymentOrder();
    return () => window.clearTimeout(timeoutId);
  }, []);

  const failed = status === "failed";
  return (
    <div className="max-w-lg py-12 text-center">
      <p className="font-serif-en text-xs tracking-[0.3em] text-s1 mb-3">PAYMENT</p>
      <h1 className="font-serif-ja text-2xl text-p2 mb-4">{failed ? "決済を完了できませんでした" : "決済をキャンセルしました"}</h1>
      <p className="text-sm text-n1 leading-relaxed mb-8">{failed ? "カード決済は完了していません。注文状況をご確認のうえ、必要であればもう一度お試しください。" : "カードへの請求は完了していません。カートに戻って支払方法を選び直せます。"}</p>
      <div className="flex flex-col sm:flex-row justify-center gap-3"><Link href="/shop/cart" className="px-6 py-3 bg-p2 text-p1 text-sm">カートに戻る</Link><Link href="/shop/orders/lookup" className="px-6 py-3 border border-p2 text-p2 text-sm">注文状況を確認</Link></div>
    </div>
  );
}
