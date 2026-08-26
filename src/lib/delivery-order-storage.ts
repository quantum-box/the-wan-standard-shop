import type { OrderLookupResult } from "@/lib/storekit";

const KEY = "tws_delivery_order_view";

export function saveDeliveryOrderView(order: OrderLookupResult): void {
  if (typeof window === "undefined") return;
  sessionStorage.setItem(KEY, JSON.stringify(order));
}

export function getDeliveryOrderView(): OrderLookupResult | null {
  if (typeof window === "undefined") return null;
  const raw = sessionStorage.getItem(KEY);
  if (!raw) return null;
  try {
    return JSON.parse(raw) as OrderLookupResult;
  } catch {
    sessionStorage.removeItem(KEY);
    return null;
  }
}
