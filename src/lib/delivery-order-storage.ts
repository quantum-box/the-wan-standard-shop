import type { OrderLookup } from "@/lib/storekit";

const KEY = "tws_delivery_order_view";

export function saveDeliveryOrderView(lookup: OrderLookup): void {
  if (typeof window === "undefined") return;
  sessionStorage.setItem(KEY, JSON.stringify(lookup));
}

export function getDeliveryOrderView(): OrderLookup | null {
  if (typeof window === "undefined") return null;
  const raw = sessionStorage.getItem(KEY);
  if (!raw) return null;
  try {
    return JSON.parse(raw) as OrderLookup;
  } catch {
    sessionStorage.removeItem(KEY);
    return null;
  }
}
