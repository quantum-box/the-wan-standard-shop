/**
 * Abstraction layer for bakuure-storekit.
 * Replace with `import { ... } from 'bakuure-storekit'` once the SDK is published.
 * See: https://github.com/quantum-box/bakuure-storekit (WIP)
 */

const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL ?? "https://bakuure.api.n1.tachy.one";
const OPERATOR_ID = process.env.NEXT_PUBLIC_OPERATOR_ID ?? "";

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

export async function getProducts(): Promise<Product[]> {
  return apiFetch<Product[]>("/v1/products");
}

export async function getProduct(id: string): Promise<Product> {
  return apiFetch<Product>(`/v1/products/${id}`);
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
