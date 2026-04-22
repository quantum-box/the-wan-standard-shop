"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createOrder } from "@/lib/storekit";
import { getCartId, clearCartId } from "@/lib/cart-storage";
import Link from "next/link";

interface ShippingForm {
  name: string;
  postalCode: string;
  prefecture: string;
  city: string;
  line1: string;
  line2: string;
  phone: string;
}

const PREFECTURES = [
  "北海道", "青森県", "岩手県", "宮城県", "秋田県", "山形県", "福島県",
  "茨城県", "栃木県", "群馬県", "埼玉県", "千葉県", "東京都", "神奈川県",
  "新潟県", "富山県", "石川県", "福井県", "山梨県", "長野県", "岐阜県",
  "静岡県", "愛知県", "三重県", "滋賀県", "京都府", "大阪府", "兵庫県",
  "奈良県", "和歌山県", "鳥取県", "島根県", "岡山県", "広島県", "山口県",
  "徳島県", "香川県", "愛媛県", "高知県", "福岡県", "佐賀県", "長崎県",
  "熊本県", "大分県", "宮崎県", "鹿児島県", "沖縄県",
];

export default function CheckoutPage() {
  const router = useRouter();
  const [form, setForm] = useState<ShippingForm>({
    name: "",
    postalCode: "",
    prefecture: "",
    city: "",
    line1: "",
    line2: "",
    phone: "",
  });
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  function handleChange(
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const cartId = getCartId();
    if (!cartId) {
      setError("カートが見つかりません。");
      return;
    }
    setSubmitting(true);
    setError(null);
    try {
      const result = await createOrder({
        cartId,
        shippingAddress: {
          name: form.name,
          postalCode: form.postalCode,
          prefecture: form.prefecture,
          city: form.city,
          line1: form.line1,
          line2: form.line2 || undefined,
          phone: form.phone,
        },
      });
      clearCartId();
      if (result.checkoutUrl) {
        window.location.href = result.checkoutUrl;
      } else {
        router.push(`/shop/checkout/thanks?order=${result.id}`);
      }
    } catch {
      setError("注文処理に失敗しました。お手数ですが再度お試しください。");
    } finally {
      setSubmitting(false);
    }
  }

  const inputClass =
    "w-full border border-s2/60 px-3 py-2 text-sm bg-p1 text-p2 focus:outline-none focus:border-p2";
  const labelClass = "block text-xs text-n1 mb-1";

  return (
    <div className="max-w-lg">
      <h1 className="font-serif-en text-2xl tracking-widest uppercase text-p2 mb-8">
        Checkout
      </h1>
      <Link href="/shop/cart" className="text-sm text-n1 hover:text-p2 mb-6 inline-block">
        ← カートに戻る
      </Link>
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <div>
          <label className={labelClass}>お名前 *</label>
          <input
            name="name"
            value={form.name}
            onChange={handleChange}
            required
            placeholder="山田 花子"
            className={inputClass}
          />
        </div>
        <div>
          <label className={labelClass}>郵便番号 *</label>
          <input
            name="postalCode"
            value={form.postalCode}
            onChange={handleChange}
            required
            placeholder="000-0000"
            pattern="\d{3}-?\d{4}"
            className={inputClass}
          />
        </div>
        <div>
          <label className={labelClass}>都道府県 *</label>
          <select
            name="prefecture"
            value={form.prefecture}
            onChange={handleChange}
            required
            className={inputClass}
          >
            <option value="">選択してください</option>
            {PREFECTURES.map((p) => (
              <option key={p} value={p}>
                {p}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className={labelClass}>市区町村 *</label>
          <input
            name="city"
            value={form.city}
            onChange={handleChange}
            required
            placeholder="渋谷区"
            className={inputClass}
          />
        </div>
        <div>
          <label className={labelClass}>番地・建物名 *</label>
          <input
            name="line1"
            value={form.line1}
            onChange={handleChange}
            required
            placeholder="神南1-2-3"
            className={inputClass}
          />
        </div>
        <div>
          <label className={labelClass}>建物名・部屋番号（任意）</label>
          <input
            name="line2"
            value={form.line2}
            onChange={handleChange}
            placeholder="○○マンション 101"
            className={inputClass}
          />
        </div>
        <div>
          <label className={labelClass}>電話番号 *</label>
          <input
            name="phone"
            value={form.phone}
            onChange={handleChange}
            required
            placeholder="090-1234-5678"
            type="tel"
            className={inputClass}
          />
        </div>
        {error && <p className="text-sm text-s1">{error}</p>}
        <button
          type="submit"
          disabled={submitting}
          className="mt-2 py-3 bg-p2 text-p1 text-sm tracking-widest hover:bg-p3 transition-colors disabled:opacity-50"
        >
          {submitting ? "処理中..." : "注文を確定する"}
        </button>
      </form>
    </div>
  );
}
