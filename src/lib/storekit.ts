/**
 * Abstraction layer for bakuure-storekit.
 * Replace with `import { ... } from 'bakuure-storekit'` once the SDK is published.
 * See: https://github.com/quantum-box/bakuure-storekit (WIP)
 */

const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL ?? "https://bakuure.api.n1.tachy.one";
const OPERATOR_ID =
  process.env.NEXT_PUBLIC_OPERATOR_ID ?? "tn_01kkk6aav60anp20d5a8151ass";
const STORAGE_CDN_BASE =
  process.env.NEXT_PUBLIC_TACHYON_STORAGE_URL ?? "https://cdn.txcloud.app";

export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  imageUrl: string | null;
  stock: number;
  category: string | null;
}

interface GraphqlResponse<T> {
  data?: T;
  errors?: Array<{ message: string }>;
}

interface StorefrontProduct {
  id: string;
  name: string;
  description: string | null;
  listPrice: number;
  imageIds: string[];
  categoryId: string | null;
}

interface ProductStock {
  quantityAvailable: number;
  trackInventory: boolean;
}

export interface CartItem {
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
  shippingAddress: {
    name: string;
    postalCode: string;
    prefecture: string;
    city: string;
    line1: string;
    line2?: string;
    phone: string;
  };
}

async function apiFetch<T>(path: string, init?: RequestInit): Promise<T> {
  const res = await fetch(`${API_BASE}${path}`, {
    ...init,
    headers: {
      "Content-Type": "application/json",
      "x-operator-id": OPERATOR_ID,
      ...init?.headers,
    },
  });
  if (!res.ok) throw new Error(`API error: ${res.status} ${path}`);
  return res.json() as Promise<T>;
}

async function graphqlFetch<T>(
  query: string,
  variables?: Record<string, unknown>
): Promise<T> {
  const res = await fetch(`${API_BASE}/v1/graphql`, {
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

function imageIdToUrl(imageId: string | undefined): string | null {
  if (!imageId) return null;
  if (imageId.startsWith("http://") || imageId.startsWith("https://")) return imageId;
  const key = imageId.replace(/^\/+/, "");
  return `${STORAGE_CDN_BASE}/cdn-cgi/image/w=800,q=80,f=auto/${key}`;
}

function toProduct(product: StorefrontProduct, stock?: ProductStock): Product {
  return {
    id: product.id,
    name: product.name,
    description: product.description ?? "",
    price: product.listPrice,
    imageUrl: imageIdToUrl(product.imageIds[0]),
    stock: stock?.trackInventory ? stock.quantityAvailable : 99,
    category: product.categoryId,
  };
}

export async function getProducts(): Promise<Product[]> {
  const data = await graphqlFetch<{
    storefrontProducts: { items: StorefrontProduct[] };
  }>(
    `query StorefrontProducts($limit: Int!, $offset: Int!) {
      storefrontProducts(limit: $limit, offset: $offset) {
        items {
          id
          name
          description
          listPrice
          imageIds
          categoryId
        }
      }
    }`,
    { limit: 100, offset: 0 }
  );

  return data.storefrontProducts.items.map((product) => toProduct(product));
}

export async function getProduct(id: string): Promise<Product> {
  const data = await graphqlFetch<{
    storefrontProduct: StorefrontProduct;
    productStock: ProductStock;
  }>(
    `query StorefrontProduct($productId: ID!) {
      storefrontProduct(productId: $productId) {
        id
        name
        description
        listPrice
        imageIds
        categoryId
      }
      productStock(productId: $productId) {
        quantityAvailable
        trackInventory
      }
    }`,
    { productId: id }
  );

  return toProduct(data.storefrontProduct, data.productStock);
}

export async function getCart(cartId: string): Promise<Cart> {
  return apiFetch<Cart>(`/v1/carts/${cartId}`);
}

export async function addToCart(
  cartId: string | null,
  productId: string,
  quantity: number
): Promise<Cart> {
  const path = cartId ? `/v1/carts/${cartId}/items` : "/v1/carts";
  return apiFetch<Cart>(path, {
    method: "POST",
    body: JSON.stringify({ productId, quantity }),
  });
}

export async function updateCartItem(
  cartId: string,
  productId: string,
  quantity: number
): Promise<Cart> {
  return apiFetch<Cart>(`/v1/carts/${cartId}/items/${productId}`, {
    method: "PATCH",
    body: JSON.stringify({ quantity }),
  });
}

export async function removeCartItem(
  cartId: string,
  productId: string
): Promise<Cart> {
  return apiFetch<Cart>(`/v1/carts/${cartId}/items/${productId}`, {
    method: "DELETE",
  });
}

export async function createOrder(input: OrderInput): Promise<{ id: string; checkoutUrl: string }> {
  return apiFetch<{ id: string; checkoutUrl: string }>("/v1/orders", {
    method: "POST",
    body: JSON.stringify(input),
  });
}
