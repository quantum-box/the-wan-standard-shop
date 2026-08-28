"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { getCart, isRateLimited, previewCoupon, type CouponPreview } from "@/lib/storekit";
import { getCartId } from "@/lib/cart-storage";
import {
  getCheckoutDraft,
  saveCheckoutDraft,
  type CheckoutContact,
  type CheckoutPaymentMethod,
  type DeliveryAddress,
  type FulfillmentMethod,
} from "@/lib/checkout-storage";

type CouponState =
  | "idle"
  | "checking"
  | "applied"
  | "rejected"
  | "stale"
  | "busy"
  | "error";

const EMPTY_ADDRESS: DeliveryAddress = {
  postalCode: "",
  prefecture: "",
  city: "",
  addressLine1: "",
  addressLine2: "",
};

export default function CheckoutPage() {
  const router = useRouter();
  const [contact, setContact] = useState<CheckoutContact>({ name: "", phone: "", email: "" });
  const [fulfillmentMethod, setFulfillmentMethod] = useState<FulfillmentMethod>("pickup");
  const [paymentMethod, setPaymentMethod] = useState<CheckoutPaymentMethod>("in_store");
  const [deliveryAddress, setDeliveryAddress] = useState<DeliveryAddress>(EMPTY_ADDRESS);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [couponCode, setCouponCode] = useState("");
  const [coupon, setCoupon] = useState<CouponPreview | null>(null);
  const [couponState, setCouponState] = useState<CouponState>("idle");

  useEffect(() => {
    let canceled = false;
    const timeoutId = window.setTimeout(() => {
      const draft = getCheckoutDraft();
      const cartId = getCartId();
      if (!draft || draft.cartId !== cartId) return;
      setContact(draft.contact);
      setFulfillmentMethod(draft.fulfillmentMethod ?? "pickup");
      setPaymentMethod(draft.paymentMethod ?? "in_store");
      if (draft.deliveryAddress) setDeliveryAddress(draft.deliveryAddress);

      const restored = draft.coupon;
      if (!restored) return;
      setCoupon(restored);
      setCouponCode(restored.code);
      setCouponState("applied");
      // The cart identifier survives a trip back to the cart page, so a
      // restored preview can describe a cart that no longer exists. Checking
      // the subtotal costs a cart read rather than one of the 20/min coupon
      // attempts, so it is safe to do on load.
      void getCart(cartId)
        .then((cart) => {
          if (canceled || cart.subtotal === restored.subtotal) return;
          setCoupon(null);
          setCouponState("stale");
        })
        .catch(() => {
          // Leave the restored preview alone; submit re-prices it anyway.
        });
    }, 0);
    return () => {
      canceled = true;
      window.clearTimeout(timeoutId);
    };
  }, []);

  // Applied on an explicit press, never as the shopper types: attempts run on
  // their own 20/min tenant budget, and Field answers every rejection — unknown
  // code, expired, under the minimum — with the same 404.
  async function handleApplyCoupon() {
    const code = couponCode.trim();
    const cartId = getCartId();
    if (!code || !cartId || couponState === "checking") return;
    setCouponState("checking");
    try {
      const preview = await previewCoupon(cartId, code);
      setCoupon(preview);
      setCouponState(preview ? "applied" : "rejected");
    } catch (cause) {
      setCoupon(null);
      setCouponState(isRateLimited(cause) ? "busy" : "error");
    }
  }

  function handleClearCoupon() {
    setCoupon(null);
    setCouponCode("");
    setCouponState("idle");
  }

  function handleContactChange(event: React.ChangeEvent<HTMLInputElement>) {
    setContact((previous) => ({ ...previous, [event.target.name]: event.target.value }));
  }

  function handleAddressChange(event: React.ChangeEvent<HTMLInputElement>) {
    setDeliveryAddress((previous) => ({ ...previous, [event.target.name]: event.target.value }));
  }

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
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

      const resolvedPaymentMethod: CheckoutPaymentMethod =
        fulfillmentMethod === "delivery" ? "online" : paymentMethod;

      // The preview above was priced against the cart as it stood then. A
      // shopper can go back, change quantities and return to a cart with the
      // same id, so the coupon is re-priced against the cart being confirmed —
      // otherwise the confirmation screen would show a discount that the
      // server-side recalculation at checkout does not agree with.
      // The code in the field is the source of truth, not the preview beside
      // it: a shopper may have typed one without pressing 適用する, or come back
      // to a cart whose contents changed under a preview taken earlier.
      const code = couponCode.trim();
      let appliedCoupon: CouponPreview | null = null;
      if (code) {
        appliedCoupon = await previewCoupon(cartId, code);
        setCoupon(appliedCoupon);
        if (!appliedCoupon) {
          setCouponState("rejected");
          setError("クーポンがこのご注文に適用できなくなりました。内容をご確認のうえ、もう一度お進みください。");
          return;
        }
        setCouponState("applied");
      }

      saveCheckoutDraft({
        cartId,
        contact,
        cart,
        fulfillmentMethod,
        paymentMethod: resolvedPaymentMethod,
        deliveryAddress: fulfillmentMethod === "delivery" ? deliveryAddress : undefined,
        coupon: appliedCoupon ?? undefined,
        savedAt: new Date().toISOString(),
      });
      router.push("/shop/checkout/confirm");
    } catch {
      setError("注文内容を読み込めませんでした。通信環境をご確認のうえ、もう一度お試しください。");
    } finally {
      setSubmitting(false);
    }
  }

  const onlinePayment = fulfillmentMethod === "delivery" || paymentMethod === "online";
  const inputClass = "w-full border border-s2/60 px-3 py-2.5 text-base sm:text-sm bg-p1 text-p2 focus:outline-none focus:border-p2";
  const labelClass = "block text-xs text-n1 mb-1";

  return (
    <div className="max-w-2xl">
      <h1 className="font-serif-en text-2xl tracking-widest uppercase text-p2 mb-3">Checkout</h1>
      <p className="text-sm text-n1 mb-8">受け取り方法とお支払い方法を選択してください。</p>
      <Link href="/shop/cart" className="text-sm text-n1 hover:text-p2 mb-6 inline-block">← カートに戻る</Link>

      <form onSubmit={handleSubmit} className="flex flex-col gap-5">
        <fieldset className="grid grid-cols-2 gap-2" aria-label="受け取り方法">
          <legend className="sr-only">受け取り方法</legend>
          <label className={`border px-4 py-4 text-sm cursor-pointer ${fulfillmentMethod === "pickup" ? "border-p2 bg-white text-p2" : "border-s2/50 text-n1"}`}>
            <input type="radio" name="fulfillment" value="pickup" checked={fulfillmentMethod === "pickup"} onChange={() => setFulfillmentMethod("pickup")} className="sr-only" />
            <span className="block font-medium">店舗受け取り</span>
            <span className="block text-xs mt-1">バーナードスクエア</span>
          </label>
          <label className={`border px-4 py-4 text-sm cursor-pointer ${fulfillmentMethod === "delivery" ? "border-p2 bg-white text-p2" : "border-s2/50 text-n1"}`}>
            <input type="radio" name="fulfillment" value="delivery" checked={fulfillmentMethod === "delivery"} onChange={() => setFulfillmentMethod("delivery")} className="sr-only" />
            <span className="block font-medium">配送</span>
            <span className="block text-xs mt-1">通常配送 / オンライン決済</span>
          </label>
        </fieldset>

        <section className="border border-s2/40 bg-white p-5">
          <h2 className="font-serif-ja text-base text-p2 mb-4">ご連絡先</h2>
          <div className="grid gap-4">
            <div><label className={labelClass}>お名前 *</label><input name="name" value={contact.name} onChange={handleContactChange} required autoComplete="name" className={inputClass} /></div>
            <div><label className={labelClass}>電話番号 *</label><input name="phone" value={contact.phone} onChange={handleContactChange} required type="tel" autoComplete="tel" className={inputClass} /></div>
            <div><label className={labelClass}>メールアドレス{onlinePayment ? " *" : "（任意）"}</label><input name="email" value={contact.email} onChange={handleContactChange} required={onlinePayment} type="email" autoComplete="email" className={inputClass} /></div>
          </div>
        </section>

        {fulfillmentMethod === "pickup" ? (
          <>
            <fieldset className="border border-s2/40 bg-white p-5">
              <legend className="px-2 text-sm font-medium text-p2">お支払い方法</legend>
              <label className="flex items-start gap-3 py-2 cursor-pointer">
                <input type="radio" name="payment" value="in_store" checked={paymentMethod === "in_store"} onChange={() => setPaymentMethod("in_store")} className="mt-1" />
                <span><span className="block text-sm text-p2">店頭払い</span><span className="block text-xs text-n1 mt-1">商品受け取り時に店舗でお支払い</span></span>
              </label>
              <label className="flex items-start gap-3 py-2 cursor-pointer">
                <input type="radio" name="payment" value="online" checked={paymentMethod === "online"} onChange={() => setPaymentMethod("online")} className="mt-1" />
                <span><span className="block text-sm text-p2">クレジットカード</span><span className="block text-xs text-n1 mt-1">外部決済画面でカード情報を入力します。このサイトではカード番号を保持しません。</span></span>
              </label>
            </fieldset>
            <section className="border border-s2/40 bg-white p-5 text-sm">
              <h2 className="font-serif-ja text-base text-p2 mb-3">店舗受け取り</h2>
              <p className="text-p2">バーナードスクエア</p>
              <p className="text-xs text-n1 mt-1">注文日から7日以内を目安にお受け取りください。</p>
              <Link href="/pickup" className="inline-block mt-3 text-p2 underline">店舗受け取り案内</Link>
            </section>
          </>
        ) : (
          <section className="border border-s2/40 bg-white p-5">
            <h2 className="font-serif-ja text-base text-p2 mb-4">配送先</h2>
            <div className="grid sm:grid-cols-2 gap-4">
              <div><label className={labelClass}>郵便番号 *</label><input name="postalCode" value={deliveryAddress.postalCode} onChange={handleAddressChange} required autoComplete="postal-code" placeholder="005-0831" className={inputClass} /></div>
              <div><label className={labelClass}>都道府県 *</label><input name="prefecture" value={deliveryAddress.prefecture} onChange={handleAddressChange} required autoComplete="address-level1" className={inputClass} /></div>
              <div className="sm:col-span-2"><label className={labelClass}>市区町村 *</label><input name="city" value={deliveryAddress.city} onChange={handleAddressChange} required autoComplete="address-level2" className={inputClass} /></div>
              <div className="sm:col-span-2"><label className={labelClass}>番地 *</label><input name="addressLine1" value={deliveryAddress.addressLine1} onChange={handleAddressChange} required autoComplete="address-line1" className={inputClass} /></div>
              <div className="sm:col-span-2"><label className={labelClass}>建物名・部屋番号</label><input name="addressLine2" value={deliveryAddress.addressLine2} onChange={handleAddressChange} autoComplete="address-line2" className={inputClass} /></div>
            </div>
            <div className="mt-5 pt-5 border-t border-s2/30 grid sm:grid-cols-2 gap-4 text-sm">
              <div><p className="text-xs text-n1 mb-1">配送方法</p><p className="text-p2">通常配送</p></div>
              <div><p className="text-xs text-n1 mb-1">配送希望日時</p><p className="text-p2">指定なし</p></div>
              <div><p className="text-xs text-n1 mb-1">送料</p><p className="text-p2">注文時に自動計算</p></div>
              <div><p className="text-xs text-n1 mb-1">お支払い</p><p className="text-p2">オンライン決済</p></div>
            </div>
          </section>
        )}

        <section className="border border-s2/40 bg-white p-5">
          <h2 className="font-serif-ja text-base text-p2 mb-1">クーポン</h2>
          <p className="text-xs text-n1 mb-4">バーナードスクエア会員特典のクーポンコードをお持ちの方はご入力ください。1回のご注文につき1枚までご利用いただけます。</p>
          <div className="flex flex-col sm:flex-row gap-2">
            <input
              id="coupon-code"
              name="couponCode"
              value={couponCode}
              onChange={(event) => { setCouponCode(event.target.value); if (couponState !== "idle") { setCoupon(null); setCouponState("idle"); } }}
              placeholder="クーポンコード"
              autoComplete="off"
              aria-label="クーポンコード"
              className={`${inputClass} uppercase sm:flex-1`}
            />
            <button type="button" onClick={handleApplyCoupon} disabled={!couponCode.trim() || couponState === "checking"} className="px-6 py-2.5 border border-p2 text-p2 text-sm hover:bg-p2 hover:text-p1 transition-colors disabled:opacity-50 disabled:cursor-not-allowed">
              {couponState === "checking" ? "確認中..." : "適用する"}
            </button>
          </div>
          {couponState === "applied" && coupon && (
            <dl className="mt-4 pt-4 border-t border-s2/30 text-sm space-y-2">
              <div className="flex justify-between"><dt className="text-n1">小計</dt><dd className="text-p2">¥{coupon.subtotal.toLocaleString("ja-JP")}</dd></div>
              <div className="flex justify-between"><dt className="text-n1">クーポン割引</dt><dd className="text-s1">-¥{coupon.discount.toLocaleString("ja-JP")}</dd></div>
              <div className="flex justify-between font-medium"><dt className="text-p2">割引後の商品合計</dt><dd className="text-p2">¥{coupon.total.toLocaleString("ja-JP")}</dd></div>
              <div className="pt-1"><button type="button" onClick={handleClearCoupon} className="text-xs text-n1 underline hover:text-p2">クーポンを外す</button></div>
            </dl>
          )}
          {couponState === "rejected" && <p role="alert" className="mt-3 text-sm text-s1">このクーポンコードはこのご注文にはご利用いただけません。コードと有効期限をご確認ください。</p>}
          {couponState === "stale" && <p role="alert" className="mt-3 text-sm text-s1">カートの内容が変わったため、割引額を計算し直す必要があります。「適用する」を押してご確認ください。</p>}
          {couponState === "busy" && <p role="alert" className="mt-3 text-sm text-s1">クーポンの確認が混み合っています。少し時間をおいてからもう一度お試しください。</p>}
          {couponState === "error" && <p role="alert" className="mt-3 text-sm text-s1">クーポンを確認できませんでした。通信環境をご確認のうえ、もう一度お試しください。</p>}
          {coupon && <p className="mt-3 text-xs text-n1">割引額は注文確定時にあらためて計算されます。送料は含みません。</p>}
        </section>

        <p className="text-xs text-n1 leading-relaxed">確認画面へ進む前に、<Link href="/guide/cancel" className="underline text-p2">返品・キャンセルポリシー</Link>をご確認ください。</p>
        {error && <p role="alert" className="text-sm text-s1">{error}</p>}
        <button type="submit" disabled={submitting} className="py-3 bg-p2 text-p1 text-sm tracking-widest hover:bg-p3 disabled:opacity-50 disabled:cursor-not-allowed">
          {submitting ? "確認画面を準備中..." : "注文内容を確認する"}
        </button>
      </form>
    </div>
  );
}
