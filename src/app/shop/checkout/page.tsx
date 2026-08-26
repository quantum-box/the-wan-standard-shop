"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createOrder } from "@/lib/storekit";
import { getCartId, clearCartId } from "@/lib/cart-storage";
import Link from "next/link";

interface PickupForm { name: string; phone: string; email: string; }

export default function CheckoutPage() {
  const router = useRouter();
  const [form, setForm] = useState<PickupForm>({ name: "", phone: "", email: "" });
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  function handleChange(e: React.ChangeEvent<HTMLInputElement>) { setForm((prev) => ({ ...prev, [e.target.name]: e.target.value })); }
  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault(); const cartId = getCartId();
    if (!cartId) { setError("カートが見つかりません。"); return; }
    setSubmitting(true); setError(null);
    try {
      const result = await createOrder({ cartId, name: form.name, phone: form.phone, email: form.email || undefined });
      clearCartId();
      if (result.checkoutUrl) window.location.href = result.checkoutUrl; else router.push(`/shop/checkout/thanks?order=${result.id}`);
    } catch { setError("注文処理に失敗しました。お手数ですが再度お試しください。"); }
    finally { setSubmitting(false); }
  }
  const inputClass = "w-full border border-s2/60 px-3 py-2 text-sm bg-p1 text-p2 focus:outline-none focus:border-p2";
  const labelClass = "block text-xs text-n1 mb-1";
  return <div className="max-w-lg">
    <h1 className="font-serif-en text-2xl tracking-widest uppercase text-p2 mb-8">Checkout</h1>
    <Link href="/shop/cart" className="text-sm text-n1 hover:text-p2 mb-6 inline-block">← カートに戻る</Link>
    <div className="border border-s2/40 bg-white px-4 py-3 mb-6 text-sm text-p2">
      <p className="font-medium mb-1">店舗受け取り</p>
      <p className="text-n1 text-xs">バーナードスクエア ドッグラン施設にてお受け取りください。</p>
      <p className="text-n1 text-xs mt-1">お支払いは店頭にてお願いいたします。</p>
      <Link href="/pickup" className="inline-block mt-2 text-xs text-p2 underline">受け取り場所・営業時間を確認</Link>
    </div>
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      <div><label className={labelClass}>お名前 *</label><input name="name" value={form.name} onChange={handleChange} required placeholder="山田 花子" className={inputClass}/></div>
      <div><label className={labelClass}>電話番号 *</label><input name="phone" value={form.phone} onChange={handleChange} required placeholder="090-1234-5678" type="tel" className={inputClass}/></div>
      <div><label className={labelClass}>メールアドレス（任意）</label><input name="email" value={form.email} onChange={handleChange} placeholder="example@email.com" type="email" className={inputClass}/></div>
      {error && <p className="text-sm text-s1">{error}</p>}
      <button type="submit" disabled={submitting} className="mt-2 py-3 bg-p2 text-p1 text-sm tracking-widest hover:bg-p3 transition-colors disabled:opacity-50">{submitting ? "処理中..." : "注文を確定する"}</button>
    </form>
  </div>;
}
