import type { Cart } from "@/lib/storekit";

const PREFIX = "tws_order_receipt:";

export interface OrderReceipt {
  orderId: string;
  cart: Cart;
  name: string;
  phone: string;
  email?: string;
  createdAt: string;
  pickupDeadline: string;
}

export function saveOrderReceipt(receipt: OrderReceipt): void {
  if (typeof window === "undefined") return;
  sessionStorage.setItem(`${PREFIX}${receipt.orderId}`, JSON.stringify(receipt));
}

export function getOrderReceipt(orderId: string): OrderReceipt | null {
  if (typeof window === "undefined") return null;
  const raw = sessionStorage.getItem(`${PREFIX}${orderId}`);
  if (!raw) return null;
  try { return JSON.parse(raw) as OrderReceipt; }
  catch { sessionStorage.removeItem(`${PREFIX}${orderId}`); return null; }
}
