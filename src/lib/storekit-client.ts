// Thin client for Field's public storefront routes
// (`/v1/public/storefront/{tenant_id}/…`, tachyonfield#1148 and #1169).
//
// These are the only Field routes an anonymous browser can reach: `/v1/graphql`
// and most of `/v1/storekit` are quarantined or Bearer-only. Nothing here sends
// a token, and the responses are deliberately narrower than their authenticated
// StoreKit twins — no stock counts, no discount table, no customer ledger.
//
// The wire shapes below mirror the `Public*` schemas in tachyonfield's
// `apps/api/tachyon-field.openapi.yaml`. `@tachyon-sdk/field` generates the same
// operations from that contract; it is not consumed here because the package is
// unpublished and lives in a subdirectory of field-sdk, which npm cannot install
// as a git dependency. Swap this module for the SDK once it reaches the registry.
import { PUBLIC_STOREFRONT_BASE } from "./storekit-config";

/** Amounts on the wire are nanodollar `i64`; the storefront trades in whole yen. */
const NANODOLLAR_PER_YEN = 1_000_000_000;

export function toYen(nanodollar: number): number {
  return Math.round(nanodollar / NANODOLLAR_PER_YEN);
}

export interface PublicProduct {
  id: string;
  name: string;
  description?: string | null;
  kind: string;
  list_price: number;
  billing_cycle: string;
  image_ids: string[];
  category_id?: string | null;
  /** False only when the product is inventory-tracked and has nothing available. */
  orderable: boolean;
  publication_name?: string | null;
  publication_description?: string | null;
  weight_grams?: number | null;
}

export interface PublicProductList {
  items: PublicProduct[];
  limit: number;
  offset: number;
  has_more: boolean;
}

export interface PublicCategory {
  id: string;
  name: string;
  slug: string;
  sort_order: number;
  parent_id?: string | null;
  image_url?: string | null;
}

export interface PublicCartItem {
  id: string;
  product_id: string;
  quantity: number;
  unit_price_nanodollar: number;
  subtotal_nanodollar: number;
  variant_name?: string | null;
  note?: string | null;
}

export interface PublicCart {
  id: string;
  status: string;
  items: PublicCartItem[];
  subtotal_nanodollar: number;
  created_at: string;
  updated_at: string;
  expires_at?: string | null;
}

export interface PublicCouponPreview {
  code: string;
  subtotal_nanodollar: number;
  discount_nanodollar: number;
  total_nanodollar: number;
}

export interface PublicOrderItem {
  id: string;
  product_id: string;
  product_name: string;
  quantity: number;
  unit_price_nanodollar: number;
  subtotal_nanodollar: number;
  variant_name?: string | null;
}

export interface PublicOrder {
  id: string;
  status: string;
  payment_status: string;
  items: PublicOrderItem[];
  subtotal_nanodollar: number;
  shipping_fee_nanodollar: number;
  total_nanodollar: number;
  created_at: string;
  checkout_url?: string | null;
  fulfillment_method?: string | null;
  pickup_deadline?: string | null;
  pickup_requested_at?: string | null;
}

export interface PublicOrderLookup {
  order: PublicOrder;
  lookup_token: string;
  expires_at: string;
}

export interface PublicCheckoutBody {
  cart_id: string;
  fulfillment_method?: string;
  payment_method?: string;
  shipping_name?: string;
  shipping_phone?: string;
  shipping_address?: string;
  customer_email?: string;
  coupon_code?: string;
  success_url?: string;
  cancel_url?: string;
}

export class StorefrontError extends Error {
  readonly status: number;
  readonly code: string;

  constructor(status: number, code: string, message: string) {
    super(message);
    this.name = "StorefrontError";
    this.status = status;
    this.code = code;
  }
}

/**
 * A 404 from the public surface is deliberately uninformative: an unknown
 * coupon, an expired one and a cart under the minimum are the same reply, as
 * are a wrong phone/digits pair and a phone number nobody ordered with.
 */
export function isNotFound(error: unknown): boolean {
  return error instanceof StorefrontError && error.status === 404;
}

/** The coupon and order-lookup budgets are 20/min/tenant — the tightest here. */
export function isRateLimited(error: unknown): boolean {
  return error instanceof StorefrontError && error.status === 429;
}

async function errorFrom(response: Response): Promise<StorefrontError> {
  let code = "UNKNOWN";
  let message = `Storefront API error: ${response.status}`;
  try {
    const body = (await response.json()) as { code?: string; message?: string };
    if (body.code) code = body.code;
    if (body.message) message = body.message;
  } catch {
    // Non-JSON error bodies (gateway pages) keep the status-only message.
  }
  return new StorefrontError(response.status, code, message);
}

async function request<T>(path: string, init?: RequestInit): Promise<T> {
  const headers = new Headers(init?.headers);
  headers.set("Accept", "application/json");
  if (init?.body !== undefined) headers.set("Content-Type", "application/json");

  const response = await fetch(`${PUBLIC_STOREFRONT_BASE}${path}`, {
    ...init,
    headers,
  });
  if (!response.ok) throw await errorFrom(response);
  return (await response.json()) as T;
}

export function listProducts(limit = 100, offset = 0): Promise<PublicProductList> {
  return request<PublicProductList>(`/products?limit=${limit}&offset=${offset}`);
}

export function getProduct(productId: string): Promise<PublicProduct> {
  return request<PublicProduct>(`/products/${encodeURIComponent(productId)}`);
}

export function listCategories(): Promise<PublicCategory[]> {
  return request<PublicCategory[]>("/categories");
}

/**
 * Takes no body on purpose: the session identifier is minted server-side, so
 * the returned cart id is the only handle to this cart and the caller is the
 * only party that has ever seen it.
 */
export function createCart(): Promise<PublicCart> {
  return request<PublicCart>("/carts", { method: "POST" });
}

export function getCart(cartId: string): Promise<PublicCart> {
  return request<PublicCart>(`/carts/${encodeURIComponent(cartId)}`);
}

export function addCartItem(
  cartId: string,
  input: { productId: string; quantity: number }
): Promise<PublicCart> {
  return request<PublicCart>(`/carts/${encodeURIComponent(cartId)}/items`, {
    method: "POST",
    body: JSON.stringify({ product_id: input.productId, quantity: input.quantity }),
  });
}

/**
 * Sending only `quantity` keeps the line's existing variant, options and note —
 * and the price it was added with.
 */
export function updateCartItem(
  cartId: string,
  itemId: string,
  quantity: number
): Promise<PublicCart> {
  return request<PublicCart>(
    `/carts/${encodeURIComponent(cartId)}/items/${encodeURIComponent(itemId)}`,
    { method: "POST", body: JSON.stringify({ quantity }) }
  );
}

export function removeCartItem(cartId: string, itemId: string): Promise<{ ok: boolean }> {
  return request<{ ok: boolean }>(
    `/carts/${encodeURIComponent(cartId)}/items/${encodeURIComponent(itemId)}`,
    { method: "DELETE" }
  );
}

/**
 * Prices one code against one cart. Nothing is persisted: checkout re-validates
 * and re-prices server-side, and that result is the one the order is built from.
 */
export function previewCoupon(
  cartId: string,
  code: string
): Promise<PublicCouponPreview> {
  return request<PublicCouponPreview>(
    `/carts/${encodeURIComponent(cartId)}/coupon-preview`,
    { method: "POST", body: JSON.stringify({ code }) }
  );
}

export function checkout(body: PublicCheckoutBody): Promise<PublicOrder> {
  return request<PublicOrder>("/checkout_sessions", {
    method: "POST",
    body: JSON.stringify(body),
  });
}

/** Finds one order from the phone number and receipt digits its customer knows. */
export function lookupOrder(input: {
  phone: string;
  lastDigits: string;
}): Promise<PublicOrderLookup> {
  return request<PublicOrderLookup>("/orders/lookup", {
    method: "POST",
    body: JSON.stringify({ phone: input.phone, last_digits: input.lastDigits }),
  });
}

/** Re-reads an order with the short-lived token the lookup handed back. */
export function getOrderByLookupToken(lookupToken: string): Promise<PublicOrder> {
  return request<PublicOrder>(
    `/orders/by-token/${encodeURIComponent(lookupToken)}`
  );
}
