import type { ExtendedOrderLookupResult } from "@/lib/order-lookup";

const KEY = "tws_delivery_order_view";

export function saveDeliveryOrderView(order: ExtendedOrderLookupResult): void {
  if (typeof window === "undefined") return;
  sessionStorage.setItem(KEY, JSON.stringify(order));
}

export function getDeliveryOrderView(): ExtendedOrderLookupResult | null {
  if (typeof window === "undefined") return null;
  const raw = sessionStorage.getItem(KEY);
  if (!raw) return null;
  try {
    return JSON.parse(raw) as ExtendedOrderLookupResult;
  } catch {
    sessionStorage.removeItem(KEY);
    return null;
  }
}
