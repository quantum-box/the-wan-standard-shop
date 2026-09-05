"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { getOrderView, saveOrderView } from "@/lib/order-view-storage";
import { refreshOrder, type OrderLookup } from "@/lib/storekit";
import { orderStatusLabel, paymentStatusLabel } from "@/lib/order-status";

function formatDate(value: string) { const d=new Date(value); return Number.isNaN(d.getTime())?value:new Intl.DateTimeFormat("ja-JP",{year:"numeric",month:"2-digit",day:"2-digit",hour:"2-digit",minute:"2-digit"}).format(d); }
function formatMoney(yen: number) { return `¥${yen.toLocaleString("ja-JP")}`; }

type RefreshState = "idle" | "loading" | "expired" | "error";

export default function OrderDetailPage() {
  const [lookup,setLookup]=useState<OrderLookup|null>(null);
  const [orderId,setOrderId]=useState("");
  const [refreshState,setRefreshState]=useState<RefreshState>("idle");

  useEffect(()=>{const id=new URLSearchParams(window.location.search).get("order")??"";const timeoutId=window.setTimeout(()=>{setOrderId(id);if(id)setLookup(getOrderView(id));},0);return()=>window.clearTimeout(timeoutId);},[]);

  // The lookup token is the only handle to this order that is not the
  // phone/digits pair, and it is short-lived by design — once it lapses the
  // customer has to present the pair again.
  const handleRefresh=useCallback(async()=>{
    if(!lookup)return;
    setRefreshState("loading");
    try{
      const order=await refreshOrder(lookup.lookupToken);
      if(!order){setRefreshState("expired");return;}
      const next={...lookup,order};
      saveOrderView(next);
      setLookup(next);
      setRefreshState("idle");
    }catch{setRefreshState("error");}
  },[lookup]);

  const order=lookup?.order??null;
  const pickupDeadline=useMemo(()=>{
    if(!order)return null;
    if(order.pickupDeadline){const parsed=new Date(order.pickupDeadline);if(!Number.isNaN(parsed.getTime()))return parsed;}
    const date=new Date(order.createdAt);date.setDate(date.getDate()+7);return date;
  },[order]);

  if(!order) return <div className="max-w-xl py-8"><h1 className="font-serif-en text-2xl tracking-widest uppercase text-p2 mb-4">ご注文の詳細</h1><p className="text-sm text-n1 mb-5">{orderId?"この端末に注文詳細がありません。もう一度注文照会を行ってください。":"表示する注文が指定されていません。"}</p><Link href="/shop/orders/lookup" className="text-sm text-p2 underline">注文を照会する</Link></div>;

  return <div className="max-w-2xl">
    <div className="flex flex-col sm:flex-row sm:justify-between gap-3 mb-8"><div><p className="text-xs text-n1 mb-1">注文番号</p><h1 className="font-serif-en text-xl tracking-wider text-p2 break-all">{order.id}</h1></div><div className="sm:text-right"><p className="text-xs text-n1">注文日時</p><p className="text-sm text-p2">{formatDate(order.createdAt)}</p></div></div>
    <section className="grid sm:grid-cols-2 gap-4 mb-4"><div className="border border-s2/40 bg-white p-5"><p className="text-xs text-n1">注文状態</p><p className="text-lg text-p2 mt-1">{orderStatusLabel(order.status)}</p></div><div className="border border-s2/40 bg-white p-5"><p className="text-xs text-n1">支払状態</p><p className="text-lg text-p2 mt-1">{paymentStatusLabel(order.paymentStatus)}</p></div></section>
    <div className="mb-6 flex flex-wrap items-center gap-x-4 gap-y-2">
      <button type="button" onClick={handleRefresh} disabled={refreshState==="loading"||refreshState==="expired"} className="px-4 py-2 border border-p2 text-p2 text-xs hover:bg-p2 hover:text-p1 transition-colors disabled:opacity-50 disabled:cursor-not-allowed">{refreshState==="loading"?"更新中...":"最新の状態に更新"}</button>
      {refreshState==="expired" && <span className="text-xs text-s1">確認の有効期限が切れました。<Link href="/shop/orders/lookup" className="underline">もう一度照会</Link>してください。</span>}
      {refreshState==="error" && <span className="text-xs text-s1">最新の状態を取得できませんでした。</span>}
    </div>
    <section className="border border-s2/40 bg-white mb-6"><h2 className="text-sm font-medium text-p2 px-5 py-4 border-b border-s2/30">商品</h2><div className="divide-y divide-s2/30 px-5">{order.items.map((item)=><div key={item.id} className="py-4 flex justify-between gap-4 text-sm"><div><p className="text-p2">{item.productName}</p><p className="text-xs text-n1">数量 {item.quantity}</p></div><p className="text-p2">{formatMoney(item.subtotal)}</p></div>)}</div><dl className="px-5 py-4 border-t border-s2/40 text-sm space-y-2"><div className="flex justify-between"><dt className="text-n1">商品小計</dt><dd className="text-p2">{formatMoney(order.subtotal)}</dd></div>{order.shippingFee>0&&<div className="flex justify-between"><dt className="text-n1">送料</dt><dd className="text-p2">{formatMoney(order.shippingFee)}</dd></div>}{order.subtotal+order.shippingFee>order.total&&<div className="flex justify-between"><dt className="text-n1">割引</dt><dd className="text-s1">-{formatMoney(order.subtotal+order.shippingFee-order.total)}</dd></div>}<div className="flex justify-between font-medium pt-2 border-t border-s2/30"><dt className="text-p2">合計</dt><dd className="text-p2">{formatMoney(order.total)}</dd></div></dl></section>
    <section className="border border-s2/40 bg-white p-5 mb-6"><h2 className="text-sm font-medium text-p2 mb-3">受け取り</h2><dl className="grid grid-cols-[7rem_1fr] gap-y-2 text-sm"><dt className="text-n1">方法</dt><dd className="text-p2">店舗受け取り</dd><dt className="text-n1">店舗</dt><dd className="text-p2">バーナードスクエア</dd><dt className="text-n1">受取期限</dt><dd className="text-p2">{pickupDeadline?new Intl.DateTimeFormat("ja-JP").format(pickupDeadline):"-"}</dd></dl><p className="text-xs text-n1 mt-3">お名前とご連絡先はこの画面には表示されません。店頭では注文番号をお伝えください。</p></section>
    <div className="flex flex-wrap gap-x-6 gap-y-3 text-sm"><Link href="/guide/cancel" className="text-p2 underline">キャンセルについて</Link><Link href="/contact" className="text-p2 underline">この注文について問い合わせる</Link><Link href="/guide/receipt" className="text-p2 underline">領収書について</Link></div>
  </div>;
}
