import type { Cart, CouponPreview } from "@/lib/storekit";

const CHECKOUT_DRAFT_KEY = "tws_checkout_draft";

export type FulfillmentMethod = "pickup" | "delivery";
export type CheckoutPaymentMethod = "in_store" | "online";

export interface CheckoutContact {
  name: string;
  phone: string;
  email: string;
}

export interface DeliveryAddress {
  postalCode: string;
  prefecture: string;
  city: string;
  addressLine1: string;
  addressLine2: string;
}

export interface CheckoutDraft {
  cartId: string;
  contact: CheckoutContact;
  cart: Cart;
  fulfillmentMethod?: FulfillmentMethod;
  paymentMethod?: CheckoutPaymentMethod;
  deliveryAddress?: DeliveryAddress;
  /**
   * The preview Field returned for this cart. Indicative only — checkout
   * re-prices the code server-side and that result is the one that binds.
   */
  coupon?: CouponPreview;
  savedAt: string;
}

export function saveCheckoutDraft(draft: CheckoutDraft): void {
  if (typeof window === "undefined") return;
  sessionStorage.setItem(CHECKOUT_DRAFT_KEY, JSON.stringify(draft));
}

/**
 * A draft saved by an earlier build carries the pre-migration cart shape —
 * per-line `product.price` instead of `unitPrice`/`subtotal`, and no cart
 * `subtotal`. Deploying under an open checkout would otherwise hand the
 * confirmation page an object whose amounts are `undefined`, so anything that
 * does not match the current shape is discarded and the shopper starts the
 * checkout form again rather than meeting an error boundary.
 */
function isCurrentDraft(value: unknown): value is CheckoutDraft {
  if (typeof value !== "object" || value === null) return false;
  const draft = value as Partial<CheckoutDraft>;
  if (typeof draft.cartId !== "string") return false;
  const cart = draft.cart;
  if (typeof cart !== "object" || cart === null) return false;
  if (typeof cart.subtotal !== "number" || !Array.isArray(cart.items)) return false;
  return cart.items.every(
    (item) =>
      typeof item?.unitPrice === "number" && typeof item?.subtotal === "number"
  );
}

export function getCheckoutDraft(): CheckoutDraft | null {
  if (typeof window === "undefined") return null;
  const raw = sessionStorage.getItem(CHECKOUT_DRAFT_KEY);
  if (!raw) return null;
  try {
    const parsed: unknown = JSON.parse(raw);
    if (!isCurrentDraft(parsed)) {
      sessionStorage.removeItem(CHECKOUT_DRAFT_KEY);
      return null;
    }
    return parsed;
  } catch {
    sessionStorage.removeItem(CHECKOUT_DRAFT_KEY);
    return null;
  }
}

export function clearCheckoutDraft(): void {
  if (typeof window === "undefined") return;
  sessionStorage.removeItem(CHECKOUT_DRAFT_KEY);
}
