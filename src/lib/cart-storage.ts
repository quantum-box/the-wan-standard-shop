"use client";

const CART_ID_KEY = "tws_cart_id";

export function getCartId(): string | null {
  if (typeof window === "undefined") return null;
  return localStorage.getItem(CART_ID_KEY);
}

export function setCartId(id: string): void {
  if (typeof window === "undefined") return;
  localStorage.setItem(CART_ID_KEY, id);
}

export function clearCartId(): void {
  if (typeof window === "undefined") return;
  localStorage.removeItem(CART_ID_KEY);
}
