"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { getOrderView } from "@/lib/order-view-storage";
import type { OrderLookupResult } from "@/lib/storekit";

function formatDate(value: string) { const d=new Date(value); return Number.isNaN(d.getTime())?value:new Intl.DateTimeFormat("ja-JP",{year:"numeric",month:"2-digit",day:"2-digit",hour:"2-digit",minute:"2-digit"}).format(d); }
function formatMoney(nanodollar: string) { const raw=Number(nanodollar); if(!Number.isFinite(raw)) return "-"; return `¥${Math.round(raw/1_000_000_000).toLocaleString("ja-JP")}`; }
function statusLabel(status: string) { const labels:Record<string,string>={pending:"受付中",confirmed:"準備中",ready:"受取可能",completed:"受取済み",cancelled:"キャンセル済み"}; return labels[status.toLowerCase()]??status; }
function paymentLabel(status: string) { const labels:Record<string,string>={pending:"店頭支払い前",unpaid:"店頭支払い前",paid:"支払い済み"}; return labels[status.toLowerCase()]??status; }

export default function OrderDetailPage() {
  const [order,setOrder]=useState<OrderLookupResult|null>(null);
  const [orderId,setOrderId]=useState("");
  useEffect(()=>{const id=new URLSearchParams(window.location.search).get("order")??"";const timeoutId=window.setTimeout(()=>{setOrderId(id);if(id)setOrder(getOrderView(id));},0);return()=>window.clearTimeout(timeoutId);},[]);
  const pickupDeadline=useMemo(()=>{if(!order)return null;const date=new Date(order.createdAt);date.setDate(date.getDate()+7);return date;},[order]);
  if(!order) return <div className="max-w-xl py-8"><h1 className="font-serif-en text-2xl tracking-widest uppercase text-p2 mb-4">Order Detail</h1><p className="text-sm text-n1 mb-5">{orderId?"この端末に注文詳細がありません。もう一度注文照会を行ってください。":"表示する注文が指定されていません。"}</p><Link href="/shop/orders/lookup" className="text-sm text-p2 underline">注文を照会する</Link></div>;
  return <div className="max-w-2xl">
    <div className="flex flex-col sm:flex-row sm:justify-between gap-3 mb-8"><div><p className="text-xs text-n1 mb-1">注文番号</p><h1 className="font-serif-en text-xl tracking-wider text-p2 break-all">{order.id}</h1></div><div className="sm:text-right"><p className="text-xs text-n1">注文日時</p><p className="text-sm text-p2">{formatDate(order.createdAt)}</p></div></div>
    <section className="grid sm:grid-cols-2 gap-4 mb-6"><div className="border border-s2/40 bg-white p-5"><p className="text-xs text-n1">注文状態</p><p className="text-lg text-p2 mt-1">{statusLabel(order.status)}</p></div><div className="border border-s2/40 bg-white p-5"><p className="text-xs text-n1">支払状態</p><p className="text-lg text-p2 mt-1">{paymentLabel(order.paymentStatus)}</p></div></section>
    <section className="border border-s2/40 bg-white mb-6"><h2 className="text-sm font-medium text-p2 px-5 py-4 border-b border-s2/30">商品</h2><div className="divide-y divide-s2/30 px-5">{order.items.map((item)=><div key={item.id} className="py-4 flex justify-between gap-4 text-sm"><div><p className="text-p2">{item.productName}</p><p className="text-xs text-n1">数量 {item.quantity}</p></div><p className="text-p2">{formatMoney(item.subtotalNanodollar)}</p></div>)}</div><div className="px-5 py-4 border-t border-s2/40 flex justify-between text-sm font-medium text-p2"><span>合計</span><span>{formatMoney(order.totalNanodollar)}</span></div></section>
    <section className="border border-s2/40 bg-white p-5 mb-6"><h2 className="text-sm font-medium text-p2 mb-3">受け取り</h2><dl className="grid grid-cols-[7rem_1fr] gap-y-2 text-sm"><dt className="text-n1">方法</dt><dd className="text-p2">店舗受け取り</dd><dt className="text-n1">店舗</dt><dd className="text-p2">バーナードスクエア</dd><dt className="text-n1">お名前</dt><dd className="text-p2">{order.shippingName??"-"}</dd><dt className="text-n1">受取期限</dt><dd className="text-p2">{pickupDeadline?new Intl.DateTimeFormat("ja-JP").format(pickupDeadline):"-"}</dd></dl></section>
    <div className="flex flex-wrap gap-x-6 gap-y-3 text-sm"><Link href="/guide/cancel" className="text-p2 underline">キャンセルについて</Link><Link href="/contact" className="text-p2 underline">この注文について問い合わせる</Link><Link href="/guide/receipt" className="text-p2 underline">領収書について</Link></div>
  </div>;
}
