"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { isRateLimited, lookupOrder } from "@/lib/storekit";
import { saveOrderView } from "@/lib/order-view-storage";
import { saveDeliveryOrderView } from "@/lib/delivery-order-storage";

type LookupState = "idle" | "loading" | "not_found" | "busy" | "error";

export default function OrderLookupPage() {
  const router = useRouter();
  const [phone, setPhone] = useState("");
  const [lastDigits, setLastDigits] = useState("");
  const [state, setState] = useState<LookupState>("idle");

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setState("loading");
    try {
      // The pair is the evidence; an order number on its own is not. Field
      // answers a wrong pair and an unused phone number identically, so a miss
      // here confirms nothing about either.
      const result = await lookupOrder({ phone, lastDigits });
      if (!result) {
        setState("not_found");
        return;
      }
      if (result.order.fulfillmentMethod === "delivery") {
        saveDeliveryOrderView(result);
        router.push("/shop/orders/delivery");
        return;
      }
      saveOrderView(result);
      router.push(`/shop/orders/detail?order=${encodeURIComponent(result.order.id)}`);
    } catch (cause) {
      setState(isRateLimited(cause) ? "busy" : "error");
    }
  }

  return (
    <div className="max-w-xl">
      <h1 className="font-serif-en text-2xl tracking-widest uppercase text-p2 mb-4">ご注文を確認する</h1>
      <p className="text-sm text-n1 mb-8">ご注文時の電話番号と注文番号の下4桁で注文を確認できます。</p>
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <div><label htmlFor="lookup-phone" className="block text-xs text-n1 mb-1">電話番号</label><input id="lookup-phone" value={phone} onChange={(event) => setPhone(event.target.value)} required type="tel" inputMode="tel" autoComplete="tel" placeholder="090-1234-5678" className="w-full border border-s2/60 px-3 py-2 text-base sm:text-sm bg-p1 text-p2 focus:outline-none focus:border-p2" /></div>
        <div><label htmlFor="lookup-digits" className="block text-xs text-n1 mb-1">注文番号の下4桁</label><input id="lookup-digits" value={lastDigits} onChange={(event) => setLastDigits(event.target.value)} required minLength={4} maxLength={32} placeholder="A1B2" className="w-full border border-s2/60 px-3 py-2 text-base sm:text-sm bg-p1 text-p2 uppercase focus:outline-none focus:border-p2" /></div>
        <button type="submit" disabled={state === "loading"} className="mt-2 py-3 bg-p2 text-p1 text-sm tracking-widest hover:bg-p3 disabled:opacity-50">{state === "loading" ? "確認中..." : "注文を確認する"}</button>
      </form>
      {state === "not_found" && <p role="alert" className="mt-6 text-sm text-s1">該当する注文が見つかりませんでした。入力内容をご確認ください。</p>}
      {state === "busy" && <p role="alert" className="mt-6 text-sm text-s1">注文確認が混み合っています。少し時間をおいてからお試しください。</p>}
      {state === "error" && <p role="alert" className="mt-6 text-sm text-s1">注文確認に失敗しました。時間をおいて再度お試しください。</p>}
      <Link href="/shop" className="text-sm text-n1 hover:text-p2 mt-8 inline-block">← ショップに戻る</Link>
    </div>
  );
}
