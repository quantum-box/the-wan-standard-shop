/**
 * Abstraction layer for bakuure-storekit.
 * Replace with `import { ... } from 'bakuure-storekit'` once the SDK is published.
 * See: https://github.com/quantum-box/bakuure-storekit (WIP)
 */

const API_BASE = "https://bakuure.api.n1.tachy.one";
const OPERATOR_ID = "tn_01kptmrtgnm746m5mpr78e2esd";
const STORAGE_CDN_BASE = "https://cdn.txcloud.app";

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

interface GqlCartItem {
  id: string;
  productId: string;
  quantity: number;
}

interface GqlCart {
  id: string;
  items: GqlCartItem[];
}

interface GqlConsumerOrder {
  id: string;
  checkoutUrl: string | null;
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
  order: OrderLookupResult;
  lookupToken: string;
  expiresAt: string;
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

function getSessionId(): string {
  if (typeof window === "undefined") return crypto.randomUUID();
  let sid = localStorage.getItem("tws_session_id");
  if (!sid) {
    sid = crypto.randomUUID();
    localStorage.setItem("tws_session_id", sid);
  }
  return sid;
}

async function enrichCart(gqlCart: GqlCart): Promise<Cart> {
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

async function getProductStock(productId: string): Promise<ProductStock | undefined> {
  const data = await graphqlFetch<{ productStock: ProductStock | null }>(
    `query ProductStock($productId: ID!) {
      productStock(productId: $productId) {
        quantityAvailable
        trackInventory
      }
    }`,
    { productId }
  );
  return data.productStock ?? undefined;
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

  const items = data.storefrontProducts.items;
  const stocks = await Promise.all(
    items.map((product) => getProductStock(product.id).catch(() => undefined))
  );
  return items.map((product, index) => toProduct(product, stocks[index]));
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
  const data = await graphqlFetch<{ cart: GqlCart }>(
    `query GetCart($cartId: ID!) {
      cart(cartId: $cartId) {
        id
        items {
          id
          productId
          quantity
        }
      }
    }`,
    { cartId }
  );
  return enrichCart(data.cart);
}

export async function addToCart(
  cartId: string | null,
  productId: string,
  quantity: number
): Promise<Cart> {
  let actualCartId = cartId;

  if (!actualCartId) {
    const sessionId = getSessionId();
    const createData = await graphqlFetch<{ createCart: { id: string } }>(
      `mutation CreateCart($sessionId: String) {
        createCart(input: { sessionId: $sessionId }) {
          id
        }
      }`,
      { sessionId }
    );
    actualCartId = createData.createCart.id;
  }

  const data = await graphqlFetch<{ addCartItem: GqlCart }>(
    `mutation AddCartItem($cartId: ID!, $productId: String!, $quantity: Int!) {
      addCartItem(cartId: $cartId, input: { productId: $productId, quantity: $quantity }) {
        id
        items {
          id
          productId
          quantity
        }
      }
    }`,
    { cartId: actualCartId, productId, quantity }
  );

  return enrichCart(data.addCartItem);
}

export async function updateCartItem(
  cartId: string,
  itemId: string,
  quantity: number
): Promise<Cart> {
  const data = await graphqlFetch<{ updateCartItem: GqlCart }>(
    `mutation UpdateCartItem($cartId: ID!, $itemId: ID!, $quantity: Int!) {
      updateCartItem(cartId: $cartId, itemId: $itemId, input: { quantity: $quantity }) {
        id
        items {
          id
          productId
          quantity
        }
      }
    }`,
    { cartId, itemId, quantity }
  );
  return enrichCart(data.updateCartItem);
}

export async function removeCartItem(
  cartId: string,
  itemId: string
): Promise<Cart> {
  await graphqlFetch<{ removeCartItem: boolean }>(
    `mutation RemoveCartItem($cartId: ID!, $itemId: ID!) {
      removeCartItem(cartId: $cartId, itemId: $itemId)
    }`,
    { cartId, itemId }
  );
  return getCart(cartId);
}

export async function createOrder(
  input: OrderInput
): Promise<{ id: string; checkoutUrl: string | null }> {
  const data = await graphqlFetch<{ checkout: GqlConsumerOrder }>(
    `mutation Checkout($input: CheckoutInput!) {
      checkout(input: $input) {
        id
        checkoutUrl
      }
    }`,
    {
      input: {
        cartId: input.cartId,
        fulfillmentMethod: "pickup",
        paymentMethod: "in_store",
        shippingName: input.name,
        shippingPhone: input.phone,
        customerEmail: input.email,
      },
    }
  );
  return {
    id: data.checkout.id,
    checkoutUrl: data.checkout.checkoutUrl ?? null,
  };
}

export async function getOrderByLookup(input: {
  phone: string;
  lastDigits: string;
}): Promise<OrderLookupResult | null> {
  try {
    const lookupData = await graphqlFetch<{
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

    const detailData = await graphqlFetch<{
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
