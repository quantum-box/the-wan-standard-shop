"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { createOrder } from "@/lib/storekit";
import { createDeliveryOrder } from "@/lib/delivery-checkout";
import { getCartId, clearCartId } from "@/lib/cart-storage";

type Fulfillment = "pickup" | "delivery";

interface FormState {
  name: string;
  phone: string;
  email: string;
  postalCode: string;
  prefecture: string;
  city: string;
  addressLine1: string;
  addressLine2: string;
}

export default function CheckoutPage() {
  const router = useRouter();
  const [fulfillment, setFulfillment] = useState<Fulfillment>("pickup");
  const [form, setForm] = useState<FormState>({
    name: "",
    phone: "",
    email: "",
    postalCode: "",
    prefecture: "",
    city: "",
    addressLine1: "",
    addressLine2: "",
  });
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (submitting) return;
    const cartId = getCartId();
    if (!cartId) {
      setError("カートが見つかりません。");
      return;
    }

    setSubmitting(true);
    setError(null);
    try {
      if (fulfillment === "pickup") {
        const result = await createOrder({
          cartId,
          name: form.name,
          phone: form.phone,
          email: form.email || undefined,
        });
        clearCartId();
        router.push(`/shop/checkout/thanks?order=${encodeURIComponent(result.id)}`);
        return;
      }

      const origin = window.location.origin;
      const result = await createDeliveryOrder({
        cartId,
        name: form.name,
        phone: form.phone,
        email: form.email || undefined,
        postalCode: form.postalCode,
        prefecture: form.prefecture,
        city: form.city,
        addressLine1: form.addressLine1,
        addressLine2: form.addressLine2 || undefined,
        successUrl: `${origin}/shop/checkout/thanks`,
        cancelUrl: `${origin}/shop/checkout?payment=cancelled`,
      });
      if (!result.checkoutUrl) throw new Error("Checkout URL is missing");
      clearCartId();
      window.location.href = result.checkoutUrl;
    } catch {
      setError(
        fulfillment === "delivery"
          ? "配送注文を開始できませんでした。配送先をご確認のうえ、もう一度お試しください。"
          : "注文処理に失敗しました。お手数ですが再度お試しください。"
      );
    } finally {
      setSubmitting(false);
    }
  }

  const inputClass = "w-full border border-s2/60 px-3 py-2.5 text-base sm:text-sm bg-p1 text-p2 focus:outline-none focus:border-p2";
  const labelClass = "block text-xs text-n1 mb-1";

  return (
    <div className="max-w-2xl">
      <h1 className="font-serif-en text-2xl tracking-widest uppercase text-p2 mb-3">Checkout</h1>
      <p className="text-sm text-n1 mb-8">受け取り方法を選択してください。</p>

      <div className="grid grid-cols-2 gap-2 mb-8" role="group" aria-label="受け取り方法">
        <button type="button" onClick={() => setFulfillment("pickup")} className={`border px-4 py-4 text-sm text-left ${fulfillment === "pickup" ? "border-p2 bg-white text-p2" : "border-s2/50 text-n1"}`}>
          <span className="block font-medium">店舗受け取り</span>
          <span className="block text-xs mt-1">バーナードスクエア / 店頭払い</span>
        </button>
        <button type="button" onClick={() => setFulfillment("delivery")} className={`border px-4 py-4 text-sm text-left ${fulfillment === "delivery" ? "border-p2 bg-white text-p2" : "border-s2/50 text-n1"}`}>
          <span className="block font-medium">配送</span>
          <span className="block text-xs mt-1">通常配送 / オンライン決済</span>
        </button>
      </div>

      <form onSubmit={handleSubmit} className="flex flex-col gap-5">
        <section className="border border-s2/40 bg-white p-5">
          <h2 className="font-serif-ja text-base text-p2 mb-4">ご連絡先</h2>
          <div className="grid gap-4">
            <div><label className={labelClass}>お名前 *</label><input name="name" value={form.name} onChange={handleChange} required autoComplete="name" className={inputClass} /></div>
            <div><label className={labelClass}>電話番号 *</label><input name="phone" value={form.phone} onChange={handleChange} required type="tel" autoComplete="tel" className={inputClass} /></div>
            <div><label className={labelClass}>メールアドレス{fulfillment === "delivery" ? " *" : "（任意）"}</label><input name="email" value={form.email} onChange={handleChange} required={fulfillment === "delivery"} type="email" autoComplete="email" className={inputClass} /></div>
          </div>
        </section>

        {fulfillment === "delivery" ? (
          <section className="border border-s2/40 bg-white p-5">
            <h2 className="font-serif-ja text-base text-p2 mb-4">配送先</h2>
            <div className="grid sm:grid-cols-2 gap-4">
              <div><label className={labelClass}>郵便番号 *</label><input name="postalCode" value={form.postalCode} onChange={handleChange} required autoComplete="postal-code" placeholder="005-0831" className={inputClass} /></div>
              <div><label className={labelClass}>都道府県 *</label><input name="prefecture" value={form.prefecture} onChange={handleChange} required autoComplete="address-level1" className={inputClass} /></div>
              <div className="sm:col-span-2"><label className={labelClass}>市区町村 *</label><input name="city" value={form.city} onChange={handleChange} required autoComplete="address-level2" className={inputClass} /></div>
              <div className="sm:col-span-2"><label className={labelClass}>番地 *</label><input name="addressLine1" value={form.addressLine1} onChange={handleChange} required autoComplete="address-line1" className={inputClass} /></div>
              <div className="sm:col-span-2"><label className={labelClass}>建物名・部屋番号</label><input name="addressLine2" value={form.addressLine2} onChange={handleChange} autoComplete="address-line2" className={inputClass} /></div>
            </div>
            <div className="mt-5 pt-5 border-t border-s2/30 grid sm:grid-cols-2 gap-4 text-sm">
              <div><p className="text-xs text-n1 mb-1">配送方法</p><p className="text-p2">通常配送</p></div>
              <div><p className="text-xs text-n1 mb-1">配送希望日時</p><p className="text-p2">指定なし</p><p className="text-[11px] text-n1 mt-1">日時指定はStoreKit側の専用field追加後に対応予定です。</p></div>
              <div><p className="text-xs text-n1 mb-1">送料</p><p className="text-p2">注文時に自動計算</p></div>
              <div><p className="text-xs text-n1 mb-1">お支払い</p><p className="text-p2">オンライン決済</p></div>
            </div>
          </section>
        ) : (
          <section className="border border-s2/40 bg-white p-5 text-sm">
            <h2 className="font-serif-ja text-base text-p2 mb-3">店舗受け取り</h2>
            <p className="text-p2">バーナードスクエア</p>
            <p className="text-xs text-n1 mt-1">商品受け取り時に店頭でお支払いください。</p>
            <Link href="/pickup" className="inline-block mt-3 text-p2 underline">店舗受け取り案内</Link>
          </section>
        )}

        {error && <p role="alert" className="text-sm text-s1">{error}</p>}
        <button type="submit" disabled={submitting} className="py-3 bg-p2 text-p1 text-sm tracking-widest hover:bg-p3 disabled:opacity-50 disabled:cursor-not-allowed">
          {submitting ? "処理中..." : fulfillment === "delivery" ? "配送注文へ進む" : "店舗受け取りで注文する"}
        </button>
      </form>
    </div>
  );
}
