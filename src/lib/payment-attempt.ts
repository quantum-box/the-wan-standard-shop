const PREFIX = "tws_payment_attempt:";
const LOCK_MS = 10 * 60 * 1000;

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
