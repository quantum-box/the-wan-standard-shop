import type { OrderLookupResult } from "@/lib/storekit";

const PREFIX = "tws_order_view:";

export function saveOrderView(order: OrderLookupResult): void {
  if (typeof window === "undefined") return;
  sessionStorage.setItem(`${PREFIX}${order.id}`, JSON.stringify(order));
}

export function getOrderView(orderId: string): OrderLookupResult | null {
  if (typeof window === "undefined") return null;
  const raw = sessionStorage.getItem(`${PREFIX}${orderId}`);
  if (!raw) return null;
  try { return JSON.parse(raw) as OrderLookupResult; }
  catch { sessionStorage.removeItem(`${PREFIX}${orderId}`); return null; }
}
