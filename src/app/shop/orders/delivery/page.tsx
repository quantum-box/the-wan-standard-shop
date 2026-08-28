"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { getDeliveryOrderView, saveDeliveryOrderView } from "@/lib/delivery-order-storage";
import { refreshOrder, type OrderLookup } from "@/lib/storekit";

const PRE_SHIPMENT = new Set(["pending", "confirmed", "processing", "preparing"]);
const SHIPPED = new Set(["shipped", "in_transit", "delivered"]);

function statusLabel(status: string) {
  const labels: Record<string, string> = {
    pending: "注文受付",
    confirmed: "注文確定",
    processing: "出荷準備中",
    preparing: "出荷準備中",
    shipped: "発送済み",
    in_transit: "配送中",
    delivered: "配達完了",
    cancelled: "キャンセル済み",
  };
  return labels[status.toLowerCase()] ?? status;
}

type RefreshState = "idle" | "loading" | "expired" | "error";

export default function DeliveryOrderPage() {
  const [lookup, setLookup] = useState<OrderLookup | null>(null);
  const [refreshState, setRefreshState] = useState<RefreshState>("idle");

  useEffect(() => {
    const timeoutId = window.setTimeout(
      () => setLookup(getDeliveryOrderView()),
      0
    );
    return () => window.clearTimeout(timeoutId);
  }, []);

  const handleRefresh = useCallback(async () => {
    if (!lookup) return;
    setRefreshState("loading");
    try {
      const order = await refreshOrder(lookup.lookupToken);
      if (!order) { setRefreshState("expired"); return; }
      const next = { ...lookup, order };
      saveDeliveryOrderView(next);
      setLookup(next);
      setRefreshState("idle");
    } catch { setRefreshState("error"); }
  }, [lookup]);

  const order = lookup?.order ?? null;

  if (!order) {
    return <div className="max-w-xl py-8"><h1 className="font-serif-en text-2xl tracking-widest uppercase text-p2 mb-4">Delivery Status</h1><p className="text-sm text-n1 mb-5">表示する配送注文がありません。注文照会から確認してください。</p><Link href="/shop/orders/lookup" className="text-sm text-p2 underline">注文を照会する</Link></div>;
  }

  const status = order.status.toLowerCase();
  const canRequestAddressChange = PRE_SHIPMENT.has(status);
  const shipped = SHIPPED.has(status);
  const progress = shipped ? (status === "delivered" ? 4 : 3) : canRequestAddressChange ? (status === "pending" ? 1 : 2) : 1;
  const subject = encodeURIComponent(`配送先変更の相談 ${order.id}`);
  const body = encodeURIComponent(`注文番号: ${order.id}\n変更希望の配送先:\n`);

  return (
    <div className="max-w-2xl">
      <div className="mb-8"><p className="text-xs text-n1 mb-1">注文番号</p><h1 className="font-serif-en text-xl tracking-wider text-p2 break-all">{order.id}</h1></div>
      <section className="border border-s2/40 bg-white p-5 mb-4">
        <p className="text-xs text-n1">配送状況</p>
        <p className="font-serif-ja text-xl text-p2 mt-1">{statusLabel(order.status)}</p>
        <div className="grid grid-cols-4 gap-1 mt-5" aria-label="配送進捗">
          {["注文受付", "出荷準備", "発送", "配達完了"].map((label, index) => <div key={label}><div className={`h-1 ${index < progress ? "bg-p2" : "bg-s2/40"}`} /><p className="text-[10px] text-n1 mt-1">{label}</p></div>)}
        </div>
      </section>
      <div className="mb-6 flex flex-wrap items-center gap-x-4 gap-y-2">
        <button type="button" onClick={handleRefresh} disabled={refreshState === "loading" || refreshState === "expired"} className="px-4 py-2 border border-p2 text-p2 text-xs hover:bg-p2 hover:text-p1 transition-colors disabled:opacity-50 disabled:cursor-not-allowed">{refreshState === "loading" ? "更新中..." : "最新の状態に更新"}</button>
        {refreshState === "expired" && <span className="text-xs text-s1">確認の有効期限が切れました。<Link href="/shop/orders/lookup" className="underline">もう一度照会</Link>してください。</span>}
        {refreshState === "error" && <span className="text-xs text-s1">最新の状態を取得できませんでした。</span>}
      </div>
      <section className="border border-s2/40 bg-white mb-6">
        <h2 className="text-sm font-medium text-p2 px-5 py-4 border-b border-s2/30">商品</h2>
        <div className="divide-y divide-s2/30 px-5">{order.items.map((item) => <div key={item.id} className="py-4 flex justify-between gap-4 text-sm"><div><p className="text-p2">{item.productName}</p><p className="text-xs text-n1">数量 {item.quantity}</p></div><p className="text-p2">¥{item.subtotal.toLocaleString("ja-JP")}</p></div>)}</div>
        <dl className="px-5 py-4 border-t border-s2/40 text-sm space-y-2">
          <div className="flex justify-between"><dt className="text-n1">商品小計</dt><dd className="text-p2">¥{order.subtotal.toLocaleString("ja-JP")}</dd></div>
          <div className="flex justify-between"><dt className="text-n1">送料</dt><dd className="text-p2">¥{order.shippingFee.toLocaleString("ja-JP")}</dd></div>
          {order.subtotal + order.shippingFee > order.total && <div className="flex justify-between"><dt className="text-n1">割引</dt><dd className="text-s1">-¥{(order.subtotal + order.shippingFee - order.total).toLocaleString("ja-JP")}</dd></div>}
          <div className="flex justify-between font-medium pt-2 border-t border-s2/30"><dt className="text-p2">合計</dt><dd className="text-p2">¥{order.total.toLocaleString("ja-JP")}</dd></div>
        </dl>
      </section>
      <section className="border border-s2/40 bg-white p-5 mb-6">
        <h2 className="text-sm font-medium text-p2 mb-3">配送先</h2>
        {/* Field does not publish the shipping address on the public surface: a
            phone number and four digits are enough to reach this page, and an
            address is more than that pair should hand over. */}
        <p className="text-sm text-n1 leading-relaxed">配送先住所はこの画面には表示されません。ご注文時の控えメールをご確認ください。</p>
        {canRequestAddressChange ? <div className="mt-4"><p className="text-xs text-n1 mb-2">出荷前のため配送先変更をご相談いただけます。</p><a href={`mailto:info@quantum-box.com?subject=${subject}&body=${body}`} className="text-sm text-p2 underline">配送先変更を依頼する</a></div> : <p className="text-xs text-n1 mt-4">出荷準備後・発送後はオンラインで配送先を変更できません。必要な場合はお問い合わせください。</p>}
      </section>
      <section className="border border-s2/40 bg-white p-5 mb-6">
        <h2 className="text-sm font-medium text-p2 mb-3">配送会社・追跡</h2>
        <p className="text-sm text-n1 leading-relaxed">現在、追跡番号はオンラインでは表示できません。発送後の確認が必要な場合はお問い合わせください。</p>
      </section>
      <div className="flex flex-wrap gap-x-6 gap-y-3 text-sm"><Link href="/shop/orders/lookup" className="text-p2 underline">別の注文を確認</Link><Link href="/contact" className="text-p2 underline">お問い合わせ</Link></div>
    </div>
  );
}
