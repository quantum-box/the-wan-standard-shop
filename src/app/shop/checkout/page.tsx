"use client";

import { useRef, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { createOrder } from "@/lib/storekit";
import { createOnlinePickupOrder } from "@/lib/online-checkout";
import { getCartId, clearCartId } from "@/lib/cart-storage";
import { hasRecentPaymentAttempt, markPaymentAttempt } from "@/lib/payment-attempt";

type PaymentMethod = "in_store" | "online";
interface PickupForm { name:string; phone:string; email:string; }

export default function CheckoutPage() {
  const router = useRouter();
  const [form,setForm]=useState<PickupForm>({name:"",phone:"",email:""});
  const [paymentMethod,setPaymentMethod]=useState<PaymentMethod>("in_store");
  const [submitting,setSubmitting]=useState(false);
  const [error,setError]=useState<string|null>(null);
  const submitLock=useRef(false);

  function handleChange(e:React.ChangeEvent<HTMLInputElement>){setForm(prev=>({...prev,[e.target.name]:e.target.value}));}

  async function handleSubmit(e:React.FormEvent){
    e.preventDefault();
    if(submitLock.current)return;
    const cartId=getCartId();
    if(!cartId){setError("カートが見つかりません。");return;}
    if(paymentMethod==="online"&&hasRecentPaymentAttempt(cartId)){
      setError("このカートでは直前にオンライン決済を開始しています。二重決済防止のため、決済画面に戻るか数分後に注文状況をご確認ください。");
      return;
    }
    submitLock.current=true; setSubmitting(true); setError(null);
    try{
      if(paymentMethod==="in_store"){
        const result=await createOrder({cartId,name:form.name,phone:form.phone,email:form.email||undefined});
        clearCartId(); router.replace(`/shop/checkout/thanks?order=${encodeURIComponent(result.id)}`); return;
      }
      const origin=window.location.origin;
      markPaymentAttempt(cartId);
      const result=await createOnlinePickupOrder({cartId,name:form.name,phone:form.phone,email:form.email,successUrl:`${origin}/shop/checkout/thanks`,cancelUrl:`${origin}/shop/checkout/payment?status=cancelled&cart=${encodeURIComponent(cartId)}`});
      window.location.href=result.checkoutUrl;
    }catch{
      submitLock.current=false;
      setError(paymentMethod==="online"?"オンライン決済を開始できませんでした。カード情報は保存されていません。もう一度お試しください。":"注文処理に失敗しました。お手数ですが再度お試しください。");
    }finally{setSubmitting(false);}
  }

  const inputClass="w-full border border-s2/60 px-3 py-2.5 text-base sm:text-sm bg-p1 text-p2 focus:outline-none focus:border-p2";
  const labelClass="block text-xs text-n1 mb-1";
  return <div className="max-w-lg">
    <h1 className="font-serif-en text-2xl tracking-widest uppercase text-p2 mb-3">Checkout</h1>
    <p className="text-sm text-n1 mb-8">店舗受け取りのご注文です。</p>
    <form onSubmit={handleSubmit} className="flex flex-col gap-5">
      <div><label className={labelClass}>お名前 *</label><input name="name" value={form.name} onChange={handleChange} required autoComplete="name" className={inputClass}/></div>
      <div><label className={labelClass}>電話番号 *</label><input name="phone" value={form.phone} onChange={handleChange} required type="tel" autoComplete="tel" className={inputClass}/></div>
      <div><label className={labelClass}>メールアドレス{paymentMethod==="online"?" *":"（任意）"}</label><input name="email" value={form.email} onChange={handleChange} required={paymentMethod==="online"} type="email" autoComplete="email" className={inputClass}/></div>

      <fieldset className="border border-s2/40 bg-white p-5">
        <legend className="px-2 text-sm font-medium text-p2">お支払い方法</legend>
        <label className="flex items-start gap-3 py-2 cursor-pointer"><input type="radio" name="payment" value="in_store" checked={paymentMethod==="in_store"} onChange={()=>setPaymentMethod("in_store")} className="mt-1"/><span><span className="block text-sm text-p2">店頭払い</span><span className="block text-xs text-n1 mt-1">商品受け取り時にバーナードスクエアでお支払い</span></span></label>
        <label className="flex items-start gap-3 py-2 cursor-pointer"><input type="radio" name="payment" value="online" checked={paymentMethod==="online"} onChange={()=>setPaymentMethod("online")} className="mt-1"/><span><span className="block text-sm text-p2">クレジットカード</span><span className="block text-xs text-n1 mt-1">安全な外部決済画面でカード情報を入力します。このサイトではカード番号を保持しません。</span></span></label>
      </fieldset>

      <section className="border border-s2/40 bg-white p-4 text-sm"><p className="font-medium text-p2 mb-1">店舗受け取り</p><p className="text-xs text-n1">バーナードスクエア / 注文日から7日以内</p><Link href="/pickup" className="text-xs text-p2 underline mt-2 inline-block">受け取り案内</Link></section>
      {error&&<p role="alert" className="text-sm text-s1">{error}</p>}
      <button type="submit" disabled={submitting} className="py-3 bg-p2 text-p1 text-sm tracking-widest hover:bg-p3 disabled:opacity-50 disabled:cursor-not-allowed">{submitting?"処理中...":paymentMethod==="online"?"カード決済へ進む":"注文を確定する"}</button>
    </form>
  </div>;
}
