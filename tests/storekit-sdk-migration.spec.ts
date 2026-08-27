import { expect, test } from "@playwright/test";
import { readFile } from "node:fs/promises";
import path from "node:path";
import { onRequestGet } from "../functions/api/storefront/products";
import {
  addToCart,
  createOrder,
  getCart,
  getCategories,
  getOrderByLookup,
  getProducts,
  removeCartItem,
  updateCartItem,
} from "../src/lib/storekit";

const product = {
  id: "product-1",
  name: "Wan Bowl",
  description: "A bowl",
  kind: "physical",
  listPrice: 3200,
  billingCycle: "one_time",
  publicationName: null,
  publicationDescription: null,
  imageIds: ["products/wan-bowl.jpg"],
  categoryId: "bowls",
  weightGrams: 400,
};

const stock = {
  id: "stock-1",
  productId: product.id,
  quantityOnHand: 3,
  quantityReserved: 3,
  quantityAvailable: 0,
  lowStockThreshold: 1,
  trackInventory: true,
  createdAt: "2026-08-27T00:00:00Z",
  updatedAt: "2026-08-27T00:00:00Z",
};

function graphqlResponse(data: unknown): Response {
  return new Response(JSON.stringify({ data }), {
    status: 200,
    headers: { "Content-Type": "application/json" },
  });
}

test("the aggregate Pages Function normalizes query parameters and runs stock fan-out once per TTL", async () => {
  const originalFetch = globalThis.fetch;
  const originalCaches = Object.getOwnPropertyDescriptor(globalThis, "caches");
  const upstreamQueries: string[] = [];
  const cachedResponses = new Map<string, Response>();
  const defaultCache = {
    async match(request: RequestInfo | URL) {
      const url = request instanceof Request ? request.url : String(request);
      return cachedResponses.get(url)?.clone();
    },
    async put(request: RequestInfo | URL, response: Response) {
      const url = request instanceof Request ? request.url : String(request);
      cachedResponses.set(url, response.clone());
    },
  } as Cache;

  Object.defineProperty(globalThis, "caches", {
    configurable: true,
    value: { default: defaultCache },
  });
  globalThis.fetch = async (_input, init) => {
    const body = JSON.parse(String(init?.body)) as { query: string };
    upstreamQueries.push(body.query);
    if (body.query.includes("query StorefrontProducts(")) {
      return graphqlResponse({
        storefrontProducts: { items: [product], limit: 100, offset: 0 },
      });
    }
    if (body.query.includes("query StorefrontProductWithStock")) {
      return graphqlResponse({ storefrontProduct: product, productStock: stock });
    }
    throw new Error(`Unexpected GraphQL operation: ${body.query}`);
  };

  try {
    const pending: Promise<unknown>[] = [];
    const contextFor = (query: string) => ({
      request: new Request(
        `https://thewanstandard.jp/api/storefront/products?${query}`
      ),
      waitUntil(promise: Promise<unknown>) {
        pending.push(promise);
      },
    });

    const firstResponse = await onRequestGet(contextFor("bust=first"));
    expect(firstResponse.status).toBe(200);
    expect(firstResponse.headers.get("Cache-Control")).toBe(
      "public, max-age=60, s-maxage=60"
    );
    await expect(firstResponse.json()).resolves.toEqual({
      products: [
        {
          id: product.id,
          name: product.name,
          description: product.description,
          price: product.listPrice,
          imageUrl:
            "https://cdn.txcloud.app/cdn-cgi/image/w=800,q=80,f=auto/products/wan-bowl.jpg",
          stock: 0,
          category: product.categoryId,
        },
      ],
    });
    await Promise.all(pending);
    expect(upstreamQueries).toHaveLength(2);

    const cachedResponse = await onRequestGet(contextFor("bust=second"));
    expect(cachedResponse.status).toBe(200);
    expect(upstreamQueries).toHaveLength(2);
    expect([...cachedResponses.keys()]).toEqual([
      "https://thewanstandard.jp/api/storefront/products",
    ]);
  } finally {
    globalThis.fetch = originalFetch;
    if (originalCaches) {
      Object.defineProperty(globalThis, "caches", originalCaches);
    } else {
      delete (globalThis as { caches?: CacheStorage }).caches;
    }
  }
});

test("the product grid client makes one request to the aggregate endpoint", async () => {
  const originalFetch = globalThis.fetch;
  const requestedUrls: string[] = [];

  globalThis.fetch = async (input) => {
    requestedUrls.push(input instanceof Request ? input.url : String(input));
    return new Response(JSON.stringify({ products: [] }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  };

  try {
    await expect(getProducts()).resolves.toEqual([]);
    expect(requestedUrls).toEqual(["/api/storefront/products"]);
  } finally {
    globalThis.fetch = originalFetch;
  }
});

test("categories use the SDK storefront operation", async () => {
  const originalFetch = globalThis.fetch;
  let requestBody = "";

  globalThis.fetch = async (_input, init) => {
    requestBody = String(init?.body);
    return graphqlResponse({
      storefrontCategories: [
        { id: "bowls", name: "Bowls", slug: "bowls" },
      ],
    });
  };

  try {
    await expect(getCategories()).resolves.toEqual([
      {
        id: "bowls",
        name: "Bowls",
        slug: "bowls",
        parentId: null,
        sortOrder: 0,
      },
    ]);
    expect(requestBody).toContain("query StorefrontCategories");
  } finally {
    globalThis.fetch = originalFetch;
  }
});

test("checkout uses the SDK cart operation", async () => {
  const originalFetch = globalThis.fetch;
  let requestBody = "";

  globalThis.fetch = async (_input, init) => {
    requestBody = String(init?.body);
    return graphqlResponse({
      checkout: { id: "order-1", checkoutUrl: null },
    });
  };

  try {
    await expect(
      createOrder({
        cartId: "cart-1",
        name: "Wan Customer",
        phone: "090-0000-0000",
      })
    ).resolves.toEqual({ id: "order-1", checkoutUrl: null });
    expect(requestBody).toContain("mutation Checkout($input: CheckoutInput!)");
    expect(requestBody).toContain('"fulfillmentMethod":"pickup"');
    expect(requestBody).toContain('"paymentMethod":"in_store"');
  } finally {
    globalThis.fetch = originalFetch;
  }
});

test("cart reads and mutations use SDK cart operations", async () => {
  const originalFetch = globalThis.fetch;
  const requests: Array<{
    query: string;
    variables: Record<string, unknown>;
  }> = [];
  const emptyCart = {
    id: "cart-1",
    tenantId: "tenant-1",
    userId: null,
    sessionId: "session-1",
    status: "active",
    items: [],
    expiresAt: null,
    createdAt: "2026-08-27T00:00:00Z",
    updatedAt: "2026-08-27T00:00:00Z",
  };

  globalThis.fetch = async (_input, init) => {
    const body = JSON.parse(String(init?.body)) as {
      query: string;
      variables: Record<string, unknown>;
    };
    requests.push(body);
    if (body.query.includes("mutation CreateCart")) {
      return graphqlResponse({ createCart: emptyCart });
    }
    if (body.query.includes("mutation AddCartItem")) {
      return graphqlResponse({ addCartItem: emptyCart });
    }
    if (body.query.includes("mutation UpdateCartItem")) {
      return graphqlResponse({ updateCartItem: emptyCart });
    }
    if (body.query.includes("mutation RemoveCartItem")) {
      return graphqlResponse({ removeCartItem: true });
    }
    if (body.query.includes("query Cart")) {
      return graphqlResponse({ cart: emptyCart });
    }
    throw new Error(`Unexpected GraphQL operation: ${body.query}`);
  };

  try {
    await expect(getCart("cart-1")).resolves.toEqual({ id: "cart-1", items: [] });
    await expect(addToCart(null, "product-1", 2)).resolves.toEqual({
      id: "cart-1",
      items: [],
    });
    await expect(updateCartItem("cart-1", "item-1", 3)).resolves.toEqual({
      id: "cart-1",
      items: [],
    });
    await expect(removeCartItem("cart-1", "item-1")).resolves.toEqual({
      id: "cart-1",
      items: [],
    });

    expect(requests.map(({ query }) => query.match(/(?:query|mutation) (\w+)/)?.[1]))
      .toEqual([
        "Cart",
        "CreateCart",
        "AddCartItem",
        "UpdateCartItem",
        "RemoveCartItem",
        "Cart",
      ]);
    expect(requests[1].variables).toEqual({
      input: { sessionId: expect.any(String) },
    });
    expect(requests[2].variables).toEqual({
      cartId: "cart-1",
      input: { productId: "product-1", quantity: 2 },
    });
    expect(requests[3].variables).toEqual({
      cartId: "cart-1",
      itemId: "item-1",
      input: { quantity: 3 },
    });
  } finally {
    globalThis.fetch = originalFetch;
  }
});

test("order lookup keeps paymentStatus on the documented temporary shim", async () => {
  const originalFetch = globalThis.fetch;
  const requestBodies: string[] = [];

  globalThis.fetch = async (_input, init) => {
    const body = String(init?.body);
    requestBodies.push(body);
    if (body.includes("mutation ConsumerOrderByLookup")) {
      return graphqlResponse({
        consumerOrderByLookup: { lookupToken: "lookup-token" },
      });
    }
    return graphqlResponse({
      consumerOrderByLookupToken: {
        id: "order-1",
        status: "ready",
        paymentStatus: "unpaid",
        fulfillmentMethod: "pickup",
        shippingName: "Wan Customer",
        totalNanodollar: "3200000000000",
        createdAt: "2026-08-27T00:00:00Z",
        items: [],
      },
    });
  };

  try {
    const result = await getOrderByLookup({
      phone: "090-0000-0000",
      lastDigits: "0001",
    });
    expect(result?.paymentStatus).toBe("unpaid");
    expect(requestBodies).toHaveLength(2);
    expect(requestBodies[1]).toContain("paymentStatus");

    const source = await readFile(
      path.join(process.cwd(), "src/lib/storekit.ts"),
      "utf8"
    );
    expect(source).toContain("PLT-3986 待ち");
    expect(source).toContain("landed 後に注文照会を SDK へ移し");
  } finally {
    globalThis.fetch = originalFetch;
  }
});
