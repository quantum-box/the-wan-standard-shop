"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { getDeliveryOrderView } from "@/lib/delivery-order-storage";
import type { OrderLookupResult } from "@/lib/storekit";

const PRE_SHIPMENT = new Set(["pending", "confirmed", "processing", "preparing"]);
const SHIPPED = new Set(["shipped", "in_transit", "delivered"]);

function statusLabel(status:string){const labels:Record<string,string>={pending:"注文受付",confirmed:"注文確定",processing:"出荷準備中",preparing:"出荷準備中",shipped:"発送済み",in_transit:"配送中",delivered:"配達完了",cancelled:"キャンセル済み"};return labels[status.toLowerCase()]??status;}

export default function DeliveryOrderPage(){
 const [order,setOrder]=useState<OrderLookupResult|null>(null);
 useEffect(()=>setOrder(getDeliveryOrderView()),[]);
 if(!order)return <div className="max-w-xl py-8"><h1 className="font-serif-en text-2xl tracking-widest uppercase text-p2 mb-4">Delivery Status</h1><p className="text-sm text-n1 mb-5">表示する配送注文がありません。注文照会から確認してください。</p><Link href="/shop/orders/lookup" className="text-sm text-p2 underline">注文を照会する</Link></div>;
 const status=order.status.toLowerCase(); const canRequestAddressChange=PRE_SHIPMENT.has(status); const shipped=SHIPPED.has(status);
 const subject=encodeURIComponent(`配送先変更の相談 ${order.id}`); const body=encodeURIComponent(`注文番号: ${order.id}\n現在の配送先: ${order.shippingAddress??""}\n変更希望の配送先:\n`);
 return <div className="max-w-2xl"><div className="mb-8"><p className="text-xs text-n1 mb-1">注文番号</p><h1 className="font-serif-en text-xl tracking-wider text-p2 break-all">{order.id}</h1></div>
  <section className="border border-s2/40 bg-white p-5 mb-6"><p className="text-xs text-n1">配送状況</p><p className="font-serif-ja text-xl text-p2 mt-1">{statusLabel(order.status)}</p><div className="grid grid-cols-4 gap-1 mt-5" aria-label="配送進捗">{["注文受付","出荷準備","発送","配達完了"].map((label,index)=>{const progress=shipped?(status==="delivered"?4:3):canRequestAddressChange?(status==="pending"?1:2):1;return <div key={label}><div className={`h-1 ${index<progress?"bg-p2":"bg-s2/40"}`}/><p className="text-[10px] text-n1 mt-1">{label}</p></div>;})}</div></section>
  <section className="border border-s2/40 bg-white p-5 mb-6"><h2 className="text-sm font-medium text-p2 mb-3">配送先</h2><p className="text-sm text-p2 leading-relaxed whitespace-pre-line">{order.shippingAddress??"配送先情報なし"}</p>{canRequestAddressChange?<div className="mt-4"><p className="text-xs text-n1 mb-2">出荷前のため配送先変更をご相談いただけます。</p><a href={`mailto:info@quantum-box.com?subject=${subject}&body=${body}`} className="text-sm text-p2 underline">配送先変更を依頼する</a></div>:<p className="text-xs text-n1 mt-4">出荷準備後・発送後はオンラインで配送先を変更できません。必要な場合は配送会社またはお問い合わせ窓口へご相談ください。</p>}</section>
  <section className="border border-s2/40 bg-white p-5 mb-6"><h2 className="text-sm font-medium text-p2 mb-3">配送会社・追跡</h2><p className="text-sm text-n1 leading-relaxed">現在のStoreKit注文レスポンスには配送会社・追跡番号が公開されていません。配送基盤の `ShippedInfo` がStoreKitに公開された後、この画面に追跡番号と追跡リンクを表示します。</p></section>
  <div className="flex flex-wrap gap-x-6 gap-y-3 text-sm"><Link href="/shop/orders/lookup" className="text-p2 underline">別の注文を確認</Link><Link href="/contact" className="text-p2 underline">お問い合わせ</Link></div>
 </div>;
}
