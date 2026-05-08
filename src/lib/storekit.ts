/**
 * Storefront API layer powered by @tachyon-sdk/storekit.
 * Re-exports a TWS-specific Product shape with imageUrl/stock for UI compatibility.
 */

import {
  StorekitClient,
  type StorefrontProduct as SdkStorefrontProduct,
  type Cart as SdkCart,
  type StockInfo,
} from "@tachyon-sdk/storekit";

const API_BASE = "https://bakuure.api.n1.tachy.one";
const OPERATOR_ID = "tn_01kptmrtgnm746m5mpr78e2esd";
const STORAGE_CDN_BASE = "https://cdn.txcloud.app";

const client = new StorekitClient({
  baseUrl: `${API_BASE}/v1/graphql`,
  headers: { "x-operator-id": OPERATOR_ID },
});

export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  imageUrl: string | null;
  stock: number;
  category: string | null;
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

function imageIdToUrl(imageId: string | undefined): string | null {
  if (!imageId) return null;
  if (imageId.startsWith("http://") || imageId.startsWith("https://")) return imageId;
  const key = imageId.replace(/^\/+/, "");
  return `${STORAGE_CDN_BASE}/cdn-cgi/image/w=800,q=80,f=auto/${key}`;
}

function toProduct(sf: SdkStorefrontProduct, stock?: StockInfo): Product {
  return {
    id: sf.id,
    name: sf.name,
    description: sf.description ?? "",
    price: sf.listPrice,
    imageUrl: imageIdToUrl(sf.imageIds[0]),
    stock: stock?.trackInventory ? stock.quantityAvailable : 99,
    category: sf.categoryId,
  };
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

async function enrichCart(gqlCart: SdkCart): Promise<Cart> {
  const items = await Promise.all(
    gqlCart.items.map(async (item) => {
      const product = await getProduct(item.productId);
      return {
        itemId: item.id,
        productId: item.productId,
        quantity: item.quantity,
        product,
      };
    })
  );
  return { id: gqlCart.id, items };
}

export async function getProducts(): Promise<Product[]> {
  const result = await client.storefront.list({ limit: 100, offset: 0 });
  const stocks = await Promise.all(
    result.items.map((p) =>
      client.inventory.getStock(p.id).catch(() => undefined)
    )
  );
  return result.items.map((p, i) => toProduct(p, stocks[i]));
}

export async function getProduct(id: string): Promise<Product> {
  const { product, stock } = await client.storefront.getWithStock(id);
  return toProduct(product, stock);
}

export async function getCart(cartId: string): Promise<Cart> {
  const cart = await client.cart.get(cartId);
  return enrichCart(cart);
}

export async function addToCart(
  cartId: string | null,
  productId: string,
  quantity: number
): Promise<Cart> {
  let actualCartId = cartId;

  if (!actualCartId) {
    const sessionId = getSessionId();
    const created = await client.cart.create({ sessionId });
    actualCartId = created.id;
  }

  const updated = await client.cart.addItem(actualCartId, {
    productId,
    quantity,
  });
  return enrichCart(updated);
}

export async function updateCartItem(
  cartId: string,
  itemId: string,
  quantity: number
): Promise<Cart> {
  const updated = await client.cart.updateItem(cartId, itemId, { quantity });
  return enrichCart(updated);
}

export async function removeCartItem(
  cartId: string,
  itemId: string
): Promise<Cart> {
  await client.cart.removeItem(cartId, itemId);
  return getCart(cartId);
}

export async function createOrder(
  input: OrderInput
): Promise<{ id: string; checkoutUrl: string | null }> {
  const order = await client.cart.checkout({
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
