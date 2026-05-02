"use client";

import { useState } from "react";
import Link from "next/link";
import { getOrderByLookup, type OrderLookupResult } from "@/lib/storekit";

type LookupState = "idle" | "loading" | "found" | "not_found" | "error";

function formatDate(value: string): string {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  return new Intl.DateTimeFormat("ja-JP", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  }).format(date);
}

function formatOrderId(id: string): string {
  return id.length > 8 ? `${id.slice(0, 4)}…${id.slice(-4)}` : id;
}

export default function OrderLookupPage() {
  const [phone, setPhone] = useState("");
  const [lastDigits, setLastDigits] = useState("");
  const [state, setState] = useState<LookupState>("idle");
  const [order, setOrder] = useState<OrderLookupResult | null>(null);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setState("loading");
    setOrder(null);

    try {
      const result = await getOrderByLookup({
        phone,
        lastDigits,
      });
      if (!result) {
        setState("not_found");
        return;
      }
      setOrder(result);
      setState("found");
    } catch {
      setState("error");
    }
  }

  return (
    <div className="max-w-xl">
      <h1 className="font-serif-en text-2xl tracking-widest uppercase text-p2 mb-4">
        Order Lookup
      </h1>
      <p className="text-sm text-n1 mb-8">
        ご注文時の電話番号と注文番号の下4桁で、店舗受け取り注文を確認できます。
      </p>

      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <div>
          <label className="block text-xs text-n1 mb-1">電話番号</label>
          <input
            value={phone}
            onChange={(event) => setPhone(event.target.value)}
            required
            type="tel"
            inputMode="tel"
            placeholder="090-1234-5678"
            className="w-full border border-s2/60 px-3 py-2 text-sm bg-p1 text-p2 focus:outline-none focus:border-p2"
          />
        </div>
        <div>
          <label className="block text-xs text-n1 mb-1">注文番号の下4桁</label>
          <input
            value={lastDigits}
            onChange={(event) => setLastDigits(event.target.value)}
            required
            minLength={4}
            maxLength={32}
            placeholder="A1B2"
            className="w-full border border-s2/60 px-3 py-2 text-sm bg-p1 text-p2 uppercase focus:outline-none focus:border-p2"
          />
        </div>
        <button
          type="submit"
          disabled={state === "loading"}
          className="mt-2 py-3 bg-p2 text-p1 text-sm tracking-widest hover:bg-p3 transition-colors disabled:opacity-50"
        >
          {state === "loading" ? "確認中..." : "注文を確認する"}
        </button>
      </form>

      {state === "not_found" && (
        <p className="mt-6 text-sm text-s1">
          該当する注文が見つかりませんでした。入力内容をご確認ください。
        </p>
      )}
      {state === "error" && (
        <p className="mt-6 text-sm text-s1">
          注文確認に失敗しました。時間をおいて再度お試しください。
        </p>
      )}

      {order && (
        <section className="mt-8 border border-s2/40 bg-white p-4">
          <div className="flex items-start justify-between gap-4 border-b border-s2/30 pb-4 mb-4">
            <div>
              <p className="text-xs text-n1">注文番号</p>
              <p className="font-serif-en text-lg tracking-widest text-p2">
                {formatOrderId(order.id)}
              </p>
            </div>
            <div className="text-right">
              <p className="text-xs text-n1">注文日時</p>
              <p className="text-sm text-p2">{formatDate(order.createdAt)}</p>
            </div>
          </div>
          <dl className="grid grid-cols-2 gap-3 text-sm mb-4">
            <div>
              <dt className="text-xs text-n1">お名前</dt>
              <dd className="text-p2">{order.shippingName ?? "-"}</dd>
            </div>
            <div>
              <dt className="text-xs text-n1">お支払い</dt>
              <dd className="text-p2">{order.paymentStatus}</dd>
            </div>
            <div>
              <dt className="text-xs text-n1">注文状態</dt>
              <dd className="text-p2">{order.status}</dd>
            </div>
            <div>
              <dt className="text-xs text-n1">受け取り方法</dt>
              <dd className="text-p2">{order.fulfillmentMethod ?? "pickup"}</dd>
            </div>
          </dl>
          <div className="divide-y divide-s2/30">
            {order.items.map((item) => (
              <div key={item.id} className="py-3 flex justify-between gap-4 text-sm">
                <div>
                  <p className="text-p2">{item.productName}</p>
                  <p className="text-xs text-n1">数量 {item.quantity}</p>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      <Link href="/shop" className="text-sm text-n1 hover:text-p2 mt-8 inline-block">
        ← ショップに戻る
      </Link>
    </div>
  );
}
