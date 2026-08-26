import type { Cart } from "@/lib/storekit";

const CHECKOUT_DRAFT_KEY = "tws_checkout_draft";

export interface CheckoutContact {
  name: string;
  phone: string;
  email: string;
}

export interface CheckoutDraft {
  cartId: string;
  contact: CheckoutContact;
  cart: Cart;
  savedAt: string;
}

export function saveCheckoutDraft(draft: CheckoutDraft): void {
  if (typeof window === "undefined") return;
  sessionStorage.setItem(CHECKOUT_DRAFT_KEY, JSON.stringify(draft));
}

export function getCheckoutDraft(): CheckoutDraft | null {
  if (typeof window === "undefined") return null;
  const raw = sessionStorage.getItem(CHECKOUT_DRAFT_KEY);
  if (!raw) return null;
  try {
    return JSON.parse(raw) as CheckoutDraft;
  } catch {
    sessionStorage.removeItem(CHECKOUT_DRAFT_KEY);
    return null;
  }
}

export function clearCheckoutDraft(): void {
  if (typeof window === "undefined") return;
  sessionStorage.removeItem(CHECKOUT_DRAFT_KEY);
}
