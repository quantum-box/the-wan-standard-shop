const PREFIX = "tws_payment_attempt:";
const PENDING_KEY = "tws_pending_payment_order";
const LOCK_MS = 10 * 60 * 1000;

export interface PendingPaymentOrder {
  orderId: string;
  cartId: string;
}

export function hasRecentPaymentAttempt(cartId: string): boolean {
  if (typeof window === "undefined") return false;
  const raw = sessionStorage.getItem(`${PREFIX}${cartId}`);
  if (!raw) return false;
  const createdAt = Number(raw);
  if (!Number.isFinite(createdAt) || Date.now() - createdAt > LOCK_MS) {
    sessionStorage.removeItem(`${PREFIX}${cartId}`);
    return false;
  }
  return true;
}

export function markPaymentAttempt(cartId: string): void {
  if (typeof window === "undefined") return;
  sessionStorage.setItem(`${PREFIX}${cartId}`, String(Date.now()));
}

export function clearPaymentAttempt(cartId: string): void {
  if (typeof window === "undefined") return;
  sessionStorage.removeItem(`${PREFIX}${cartId}`);
}

export function savePendingPaymentOrder(order: PendingPaymentOrder): void {
  if (typeof window === "undefined") return;
  sessionStorage.setItem(PENDING_KEY, JSON.stringify(order));
}

export function getPendingPaymentOrder(): PendingPaymentOrder | null {
  if (typeof window === "undefined") return null;
  const raw = sessionStorage.getItem(PENDING_KEY);
  if (!raw) return null;
  try {
    return JSON.parse(raw) as PendingPaymentOrder;
  } catch {
    sessionStorage.removeItem(PENDING_KEY);
    return null;
  }
}

export function clearPendingPaymentOrder(): void {
  if (typeof window === "undefined") return;
  sessionStorage.removeItem(PENDING_KEY);
}
