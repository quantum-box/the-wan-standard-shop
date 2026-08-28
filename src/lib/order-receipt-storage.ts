import type { Cart } from "@/lib/storekit";
import type { CheckoutPaymentMethod, FulfillmentMethod } from "@/lib/checkout-storage";

const PREFIX = "tws_order_receipt:";

/** Receipts written by an earlier build carry the pre-migration cart shape. */
function isCurrentReceipt(value: unknown): value is OrderReceipt {
  if (typeof value !== "object" || value === null) return false;
  const receipt = value as Partial<OrderReceipt>;
  if (typeof receipt.orderId !== "string") return false;
  const cart = receipt.cart;
  if (typeof cart !== "object" || cart === null) return false;
  if (typeof cart.subtotal !== "number" || !Array.isArray(cart.items)) return false;
  return cart.items.every((item) => typeof item?.subtotal === "number");
}


export interface OrderReceipt {
  orderId: string;
  cart: Cart;
  name: string;
  phone: string;
  email?: string;
  createdAt: string;
  fulfillmentMethod?: FulfillmentMethod;
  paymentMethod?: CheckoutPaymentMethod;
  deliveryAddress?: string;
  pickupDeadline?: string;
  /** Amounts as the order was actually priced, coupon and shipping included. */
  subtotal?: number;
  discount?: number;
  shippingFee?: number;
  total?: number;
  couponCode?: string;
}

export function saveOrderReceipt(receipt: OrderReceipt): void {
  if (typeof window === "undefined") return;
  sessionStorage.setItem(`${PREFIX}${receipt.orderId}`, JSON.stringify(receipt));
}

export function getOrderReceipt(orderId: string): OrderReceipt | null {
  if (typeof window === "undefined") return null;
  const raw = sessionStorage.getItem(`${PREFIX}${orderId}`);
  if (!raw) return null;
  try {
    const parsed: unknown = JSON.parse(raw);
    if (isCurrentReceipt(parsed)) return parsed;
  } catch {
    // fall through to the cleanup below
  }
  sessionStorage.removeItem(`${PREFIX}${orderId}`);
  return null;
}
