// Application-facing storefront layer. Everything below is served by Field's
// public storefront routes (see `storekit-client.ts`), so no page in this app
// ever needs a Field credential in the browser.
import * as storefront from "./storekit-client";
import { isNotFound, toYen } from "./storekit-client";
import { toProduct, type Product } from "./storekit-product";

export type { Product } from "./storekit-product";
export { isRateLimited } from "./storekit-client";

export interface StoreCategory {
  id: string;
  name: string;
  slug: string;
  parentId: string | null;
  sortOrder: number;
}

export interface CartItem {
  itemId: string;
  productId: string;
  quantity: number;
  /** Effective price per unit, as the server resolved it from the catalog. */
  unitPrice: number;
  subtotal: number;
  product: Product;
}

export interface Cart {
  id: string;
  items: CartItem[];
  subtotal: number;
}

export interface CouponPreview {
  code: string;
  subtotal: number;
  discount: number;
  total: number;
}

export type FulfillmentMethod = "pickup" | "delivery";
export type PaymentMethod = "in_store" | "online";

export interface PlaceOrderInput {
  cartId: string;
  name: string;
  phone: string;
  email?: string;
  fulfillmentMethod: FulfillmentMethod;
  paymentMethod: PaymentMethod;
  shippingAddress?: string;
  couponCode?: string;
  successUrl?: string;
  cancelUrl?: string;
}

export interface OrderItemSummary {
  id: string;
  productName: string;
  quantity: number;
  unitPrice: number;
  subtotal: number;
}

/**
 * What the public surface will say about an order. Contact details, the
 * shipping address and the customer record are not echoed back — a caller
 * holding the phone/digits pair learns no more than the confirmation screen
 * already showed at checkout.
 */
export interface OrderSummary {
  id: string;
  status: string;
  paymentStatus: string;
  fulfillmentMethod: string | null;
  items: OrderItemSummary[];
  subtotal: number;
  shippingFee: number;
  total: number;
  createdAt: string;
  pickupDeadline: string | null;
}

export interface OrderLookup {
  order: OrderSummary;
  lookupToken: string;
  expiresAt: string;
}

function toOrderSummary(order: storefront.PublicOrder): OrderSummary {
  return {
    id: order.id,
    status: order.status,
    paymentStatus: order.payment_status,
    fulfillmentMethod: order.fulfillment_method ?? null,
    items: order.items.map((item) => ({
      id: item.id,
      productName: item.product_name,
      quantity: item.quantity,
      unitPrice: toYen(item.unit_price_nanodollar),
      subtotal: toYen(item.subtotal_nanodollar),
    })),
    subtotal: toYen(order.subtotal_nanodollar),
    shippingFee: toYen(order.shipping_fee_nanodollar),
    total: toYen(order.total_nanodollar),
    createdAt: order.created_at,
    pickupDeadline: order.pickup_deadline ?? null,
  };
}

/**
 * A cart line names a product id and nothing else, so the catalog rows are
 * fetched alongside it to render names, images and the sold-out state.
 */
async function enrichCart(cart: storefront.PublicCart): Promise<Cart> {
  const items = await Promise.all(
    cart.items.map(async (item) => ({
      itemId: item.id,
      productId: item.product_id,
      quantity: item.quantity,
      unitPrice: toYen(item.unit_price_nanodollar),
      subtotal: toYen(item.subtotal_nanodollar),
      product: await getProduct(item.product_id),
    }))
  );
  return { id: cart.id, items, subtotal: toYen(cart.subtotal_nanodollar) };
}

/**
 * Goes through the Pages Function rather than Field directly: the aggregate is
 * cached at the edge for a minute, which keeps the listing off the tenant's
 * public read budget on every page view.
 */
export async function getProducts(): Promise<Product[]> {
  const response = await fetch("/api/storefront/products", {
    headers: { Accept: "application/json" },
  });
  if (!response.ok) {
    throw new Error(`Storefront products error: ${response.status}`);
  }
  const payload = (await response.json()) as {
    products?: Product[];
    error?: string;
    errors?: Array<{ message: string }>;
  };
  if (!Array.isArray(payload.products)) {
    const message =
      payload.error ??
      payload.errors?.map((error) => error.message).join("; ") ??
      "Storefront products error: invalid response";
    throw new Error(message);
  }
  return payload.products;
}

export async function getCategories(): Promise<StoreCategory[]> {
  const categories = await storefront.listCategories();
  return categories.map((category) => ({
    id: category.id,
    name: category.name,
    slug: category.slug,
    parentId: category.parent_id ?? null,
    sortOrder: category.sort_order,
  }));
}

export async function getProduct(id: string): Promise<Product> {
  return toProduct(await storefront.getProduct(id));
}

export async function getCart(cartId: string): Promise<Cart> {
  return enrichCart(await storefront.getCart(cartId));
}

export async function addToCart(
  cartId: string | null,
  productId: string,
  quantity: number
): Promise<Cart> {
  const actualCartId = cartId ?? (await storefront.createCart()).id;
  return enrichCart(
    await storefront.addCartItem(actualCartId, { productId, quantity })
  );
}

export async function updateCartItem(
  cartId: string,
  itemId: string,
  quantity: number
): Promise<Cart> {
  return enrichCart(await storefront.updateCartItem(cartId, itemId, quantity));
}

export async function removeCartItem(
  cartId: string,
  itemId: string
): Promise<Cart> {
  await storefront.removeCartItem(cartId, itemId);
  return getCart(cartId);
}

/**
 * Prices one member coupon against one cart (PLT-537). Returns null when the
 * code does not apply — Field collapses "no such code", "expired" and "under
 * the minimum" into the same 404 so working through a code space learns
 * nothing, which means the UI can only ever say "this code cannot be used".
 */
export async function previewCoupon(
  cartId: string,
  code: string
): Promise<CouponPreview | null> {
  try {
    const preview = await storefront.previewCoupon(cartId, code);
    return {
      code: preview.code,
      subtotal: toYen(preview.subtotal_nanodollar),
      discount: toYen(preview.discount_nanodollar),
      total: toYen(preview.total_nanodollar),
    };
  } catch (error) {
    if (isNotFound(error)) return null;
    throw error;
  }
}

/**
 * Places the order. The coupon is re-validated and re-priced server-side, so a
 * code that stopped applying between the preview and here fails the checkout
 * rather than quietly going through at full price.
 */
export async function placeOrder(
  input: PlaceOrderInput
): Promise<OrderSummary & { checkoutUrl: string | null }> {
  const order = await storefront.checkout({
    cart_id: input.cartId,
    fulfillment_method: input.fulfillmentMethod,
    payment_method: input.paymentMethod,
    shipping_name: input.name,
    shipping_phone: input.phone,
    shipping_address: input.shippingAddress,
    customer_email: input.email,
    coupon_code: input.couponCode,
    success_url: input.successUrl,
    cancel_url: input.cancelUrl,
  });
  return { ...toOrderSummary(order), checkoutUrl: order.checkout_url ?? null };
}

/**
 * Order enquiry (PET-739). Field takes the phone number and the receipt digits
 * rather than an order identifier, and hands back a short-lived token for the
 * one re-read that may follow. A wrong pair and an unused phone number are the
 * same 404, so a miss confirms nothing.
 */
export async function lookupOrder(input: {
  phone: string;
  lastDigits: string;
}): Promise<OrderLookup | null> {
  try {
    const result = await storefront.lookupOrder(input);
    return {
      order: toOrderSummary(result.order),
      lookupToken: result.lookup_token,
      expiresAt: result.expires_at,
    };
  } catch (error) {
    if (isNotFound(error)) return null;
    throw error;
  }
}

/** Re-reads an order with the lookup token. Null once the token has expired. */
export async function refreshOrder(
  lookupToken: string
): Promise<OrderSummary | null> {
  try {
    return toOrderSummary(await storefront.getOrderByLookupToken(lookupToken));
  } catch (error) {
    if (isNotFound(error)) return null;
    throw error;
  }
}
