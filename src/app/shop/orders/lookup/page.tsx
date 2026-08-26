"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { getOrderByLookup } from "@/lib/storekit";
import { saveDeliveryOrderView } from "@/lib/delivery-order-storage";

type LookupState = "idle" | "loading" | "not_found" | "error";

export default function OrderLookupPage() {
  const router = useRouter();
  const [phone,setPhone]=useState(""); const [lastDigits,setLastDigits]=useState(""); const [state,setState]=useState<LookupState>("idle");
  async function handleSubmit(event:React.FormEvent<HTMLFormElement>){event.preventDefault();setState("loading");try{const result=await getOrderByLookup({phone,lastDigits});if(!result){setState("not_found");return;}if(result.fulfillmentMethod==="delivery"){saveDeliveryOrderView(result);router.push("/shop/orders/delivery");return;}setState("error");}catch{setState("error");}}
  return <div className="max-w-xl"><h1 className="font-serif-en text-2xl tracking-widest uppercase text-p2 mb-4">Order Lookup</h1><p className="text-sm text-n1 mb-8">ご注文時の電話番号と注文番号の下4桁で注文を確認できます。</p><form onSubmit={handleSubmit} className="flex flex-col gap-4"><div><label className="block text-xs text-n1 mb-1">電話番号</label><input value={phone} onChange={e=>setPhone(e.target.value)} required type="tel" className="w-full border border-s2/60 px-3 py-2 text-sm bg-p1 text-p2"/></div><div><label className="block text-xs text-n1 mb-1">注文番号の下4桁</label><input value={lastDigits} onChange={e=>setLastDigits(e.target.value)} required minLength={4} className="w-full border border-s2/60 px-3 py-2 text-sm bg-p1 text-p2 uppercase"/></div><button type="submit" disabled={state==="loading"} className="mt-2 py-3 bg-p2 text-p1 text-sm tracking-widest disabled:opacity-50">{state==="loading"?"確認中...":"注文を確認する"}</button></form>{state==="not_found"&&<p className="mt-6 text-sm text-s1">該当する注文が見つかりませんでした。</p>}{state==="error"&&<p className="mt-6 text-sm text-s1">配送注文ではないか、注文情報を表示できませんでした。</p>}<Link href="/shop" className="text-sm text-n1 mt-8 inline-block">← ショップに戻る</Link></div>;
}
