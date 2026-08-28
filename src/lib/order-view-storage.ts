import type { OrderLookup } from "@/lib/storekit";

const PREFIX = "tws_order_view:";

/** Drafts written by an earlier build carry the pre-migration order shape. */
function isCurrentLookup(value: unknown): value is OrderLookup {
  if (typeof value !== "object" || value === null) return false;
  const lookup = value as Partial<OrderLookup>;
  if (typeof lookup.lookupToken !== "string") return false;
  const order = lookup.order;
  return (
    typeof order === "object" &&
    order !== null &&
    typeof order.id === "string" &&
    typeof order.total === "number" &&
    Array.isArray(order.items)
  );
}


export function saveOrderView(lookup: OrderLookup): void {
  if (typeof window === "undefined") return;
  sessionStorage.setItem(`${PREFIX}${lookup.order.id}`, JSON.stringify(lookup));
}

export function getOrderView(orderId: string): OrderLookup | null {
  if (typeof window === "undefined") return null;
  const raw = sessionStorage.getItem(`${PREFIX}${orderId}`);
  if (!raw) return null;
  try {
    const parsed: unknown = JSON.parse(raw);
    if (isCurrentLookup(parsed)) return parsed;
  } catch {
    // fall through to the cleanup below
  }
  sessionStorage.removeItem(`${PREFIX}${orderId}`);
  return null;
}
