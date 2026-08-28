import type { OrderLookup } from "@/lib/storekit";

const PREFIX = "tws_order_view:";

export function saveOrderView(lookup: OrderLookup): void {
  if (typeof window === "undefined") return;
  sessionStorage.setItem(`${PREFIX}${lookup.order.id}`, JSON.stringify(lookup));
}

export function getOrderView(orderId: string): OrderLookup | null {
  if (typeof window === "undefined") return null;
  const raw = sessionStorage.getItem(`${PREFIX}${orderId}`);
  if (!raw) return null;
  try { return JSON.parse(raw) as OrderLookup; }
  catch { sessionStorage.removeItem(`${PREFIX}${orderId}`); return null; }
}
