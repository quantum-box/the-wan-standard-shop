"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { getCart } from "@/lib/storekit";
import { getCartId } from "@/lib/cart-storage";
import { getCheckoutDraft, saveCheckoutDraft, type CheckoutContact } from "@/lib/checkout-storage";
import Link from "next/link";

export default function CheckoutPage() {
  const router = useRouter();
  const [form, setForm] = useState<CheckoutContact>({ name: "", phone: "", email: "" });
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const draft = getCheckoutDraft();
    const cartId = getCartId();
    if (draft && draft.cartId === cartId) setForm(draft.contact);
  }, []);

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (submitting) return;
    const cartId = getCartId();
    if (!cartId) {
      setError("カートが見つかりません。商品を選び直してください。");
      return;
    }
    setSubmitting(true);
    setError(null);
    try {
      const cart = await getCart(cartId);
      if (cart.items.length === 0) {
        setError("カートに商品がありません。");
        return;
      }
      saveCheckoutDraft({ cartId, contact: form, cart, savedAt: new Date().toISOString() });
      router.push("/shop/checkout/confirm");
    } catch {
      setError("注文内容を読み込めませんでした。通信環境をご確認のうえ、もう一度お試しください。");
    } finally {
      setSubmitting(false);
    }
  }

  const inputClass = "w-full border border-s2/60 px-3 py-2 text-sm bg-p1 text-p2 focus:outline-none focus:border-p2";
  const labelClass = "block text-xs text-n1 mb-1";

  return (
    <div className="max-w-lg">
      <h1 className="font-serif-en text-2xl tracking-widest uppercase text-p2 mb-8">Checkout</h1>
      <Link href="/shop/cart" className="text-sm text-n1 hover:text-p2 mb-6 inline-block">← カートに戻る</Link>

      <div className="border border-s2/40 bg-white px-4 py-3 mb-6 text-sm text-p2">
        <p className="font-medium mb-1">店舗受け取り</p>
        <p className="text-n1 text-xs">バーナードスクエアにてお受け取りください。</p>
        <p className="text-n1 text-xs mt-1">お支払いは店頭にてお願いいたします。</p>
      </div>

      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <div><label className={labelClass}>お名前 *</label><input name="name" value={form.name} onChange={handleChange} required autoComplete="name" placeholder="山田 花子" className={inputClass} /></div>
        <div><label className={labelClass}>電話番号 *</label><input name="phone" value={form.phone} onChange={handleChange} required autoComplete="tel" placeholder="090-1234-5678" type="tel" className={inputClass} /></div>
        <div><label className={labelClass}>メールアドレス（任意）</label><input name="email" value={form.email} onChange={handleChange} autoComplete="email" placeholder="example@email.com" type="email" className={inputClass} /></div>
        {error && <p role="alert" className="text-sm text-s1">{error}</p>}
        <button type="submit" disabled={submitting} className="mt-2 py-3 bg-p2 text-p1 text-sm tracking-widest hover:bg-p3 transition-colors disabled:opacity-50 disabled:cursor-not-allowed">
          {submitting ? "確認画面を準備中..." : "注文内容を確認する"}
        </button>
      </form>
    </div>
  );
}
