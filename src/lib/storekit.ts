import type { Cart as StorekitCart } from "@tachyon-sdk/storekit";
import { storekit } from "./storekit-client";
import { FIELD_GRAPHQL_URL, OPERATOR_ID } from "./storekit-config";
import { toProduct, type Product } from "./storekit-product";

export type { Product } from "./storekit-product";

export interface StoreCategory {
  id: string;
  name: string;
  slug: string;
  parentId: string | null;
  sortOrder: number;
}

interface GraphqlResponse<T> {
  data?: T;
  errors?: Array<{ message: string }>;
}

export interface CartItem {
  itemId: string;
  productId: string;
  quantity: number;
  product: Product;
}

export interface Cart {
  id: string;
  items: CartItem[];
}

export interface OrderInput {
  cartId: string;
  name: string;
  phone: string;
  email?: string;
}

export interface OrderLookupItem {
  id: string;
  productName: string;
  quantity: number;
  subtotalNanodollar: string;
}

export interface OrderLookupResult {
  id: string;
  status: string;
  paymentStatus: string;
  fulfillmentMethod: string | null;
  shippingName: string | null;
  totalNanodollar: string;
  createdAt: string;
  items: OrderLookupItem[];
}

interface GqlOrderLookupPayload {
  lookupToken: string;
}

// PLT-3986 待ち: SDK の ConsumerOrder に paymentStatus が無く、
// status/paymentMethod/confirmedAt からは導出できない（反例あり）。
// landed 後に注文照会を SDK へ移し、この自前 GraphQL 経路を削除する。
async function lookupGraphqlFetch<T>(
  query: string,
  variables?: Record<string, unknown>
): Promise<T> {
  const res = await fetch(FIELD_GRAPHQL_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-operator-id": OPERATOR_ID,
    },
    body: JSON.stringify({ query, variables }),
  });

  if (!res.ok) throw new Error(`GraphQL API error: ${res.status}`);

  const payload = (await res.json()) as GraphqlResponse<T>;
  if (payload.errors?.length) {
    throw new Error(payload.errors.map((error) => error.message).join("; "));
  }
  if (!payload.data) throw new Error("GraphQL API error: missing data");
  return payload.data;
}

function getSessionId(): string {
  if (typeof window === "undefined") return crypto.randomUUID();
  let sid = localStorage.getItem("tws_session_id");
  if (!sid) {
    sid = crypto.randomUUID();
    localStorage.setItem("tws_session_id", sid);
  }
  return sid;
}

async function enrichCart(cart: StorekitCart): Promise<Cart> {
  const items = await Promise.all(
    cart.items.map(async (item) => {
      const product = await getProduct(item.productId);
      return {
        itemId: item.id,
        productId: item.productId,
        quantity: item.quantity,
        product,
      };
    })
  );
  return { id: cart.id, items };
}

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
  const categories = await storekit.storefront.categories();
  return categories.map((category, index) => ({
    ...category,
    parentId: null,
    sortOrder: index,
  }));
}

export async function getProduct(id: string): Promise<Product> {
  const { product, stock } = await storekit.storefront.getWithStock(id);
  return toProduct(product, stock);
}

export async function getCart(cartId: string): Promise<Cart> {
  return enrichCart(await storekit.cart.get(cartId));
}

export async function addToCart(
  cartId: string | null,
  productId: string,
  quantity: number
): Promise<Cart> {
  let actualCartId = cartId;

  if (!actualCartId) {
    const sessionId = getSessionId();
    actualCartId = (await storekit.cart.create({ sessionId })).id;
  }

  return enrichCart(
    await storekit.cart.addItem(actualCartId, { productId, quantity })
  );
}

export async function updateCartItem(
  cartId: string,
  itemId: string,
  quantity: number
): Promise<Cart> {
  return enrichCart(
    await storekit.cart.updateItem(cartId, itemId, { quantity })
  );
}

export async function removeCartItem(
  cartId: string,
  itemId: string
): Promise<Cart> {
  await storekit.cart.removeItem(cartId, itemId);
  return getCart(cartId);
}

export async function createOrder(
  input: OrderInput
): Promise<{ id: string; checkoutUrl: string | null }> {
  const order = await storekit.cart.checkout({
    cartId: input.cartId,
    fulfillmentMethod: "pickup",
    paymentMethod: "in_store",
    shippingName: input.name,
    shippingPhone: input.phone,
    customerEmail: input.email,
  });
  return {
    id: order.id,
    checkoutUrl: order.checkoutUrl ?? null,
  };
}

export async function getOrderByLookup(input: {
  phone: string;
  lastDigits: string;
}): Promise<OrderLookupResult | null> {
  try {
    const lookupData = await lookupGraphqlFetch<{
      consumerOrderByLookup: GqlOrderLookupPayload;
    }>(
      `mutation ConsumerOrderByLookup($input: ConsumerOrderLookupInput!) {
        consumerOrderByLookup(input: $input) {
          lookupToken
          order {
            id
          }
        }
      }`,
      { input }
    );

    const detailData = await lookupGraphqlFetch<{
      consumerOrderByLookupToken: OrderLookupResult | null;
    }>(
      `query ConsumerOrderByLookupToken($lookupToken: String!) {
        consumerOrderByLookupToken(lookupToken: $lookupToken) {
          id
          status
          paymentStatus
          fulfillmentMethod
          shippingName
          totalNanodollar
          createdAt
          items {
            id
            productName
            quantity
            subtotalNanodollar
          }
        }
      }`,
      { lookupToken: lookupData.consumerOrderByLookup.lookupToken }
    );

    return detailData.consumerOrderByLookupToken;
  } catch (error) {
    const message = error instanceof Error ? error.message : "";
    if (
      message.includes("Order lookup not found") ||
      message.includes("not found")
    ) {
      return null;
    }
    throw error;
  }
}
