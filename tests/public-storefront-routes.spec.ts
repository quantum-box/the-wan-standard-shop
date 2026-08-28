import { expect, test } from "@playwright/test";
import { onRequestGet } from "../functions/api/storefront/products";
import {
  addToCart,
  getCart,
  getCategories,
  getProduct,
  getProducts,
  isRateLimited,
  lookupOrder,
  placeOrder,
  previewCoupon,
  refreshOrder,
  removeCartItem,
  updateCartItem,
} from "../src/lib/storekit";

const BASE =
  "https://tachyon-field-api.txcloud.app/v1/public/storefront/tn_01kptmrtgnm746m5mpr78e2esd";

const product = {
  id: "pd_01",
  name: "Wan Bowl",
  description: "A bowl",
  kind: "physical",
  list_price: 3200,
  billing_cycle: "one_time",
  image_ids: ["products/wan-bowl.jpg"],
  category_id: "cat_bowls",
  orderable: false,
  publication_name: null,
  publication_description: null,
  weight_grams: 400,
};

const cart = {
  id: "crt_01",
  status: "active",
  items: [
    {
      id: "cri_01",
      product_id: product.id,
      quantity: 2,
      unit_price_nanodollar: 3_200_000_000_000,
      subtotal_nanodollar: 6_400_000_000_000,
    },
  ],
  subtotal_nanodollar: 6_400_000_000_000,
  created_at: "2026-08-28T00:00:00Z",
  updated_at: "2026-08-28T00:00:00Z",
};

const order = {
  id: "ord_01",
  status: "pending",
  payment_status: "unpaid",
  items: [
    {
      id: "ori_01",
      product_id: product.id,
      product_name: product.name,
      quantity: 2,
      unit_price_nanodollar: 3_200_000_000_000,
      subtotal_nanodollar: 6_400_000_000_000,
    },
  ],
  subtotal_nanodollar: 6_400_000_000_000,
  shipping_fee_nanodollar: 0,
  total_nanodollar: 5_120_000_000_000,
  created_at: "2026-08-28T00:00:00Z",
  fulfillment_method: "pickup",
  pickup_deadline: "2026-09-04T00:00:00Z",
  checkout_url: null,
};

interface Call {
  url: string;
  method: string;
  body: string | null;
  headers: Headers;
}

/**
 * Installs a fetch stub that records every call and answers from `routes`,
 * keyed by "METHOD /path" relative to the public storefront base.
 */
function stubFetch(
  routes: Record<string, () => Response>
): { calls: Call[]; restore: () => void } {
  const originalFetch = globalThis.fetch;
  const calls: Call[] = [];

  globalThis.fetch = async (input, init) => {
    const url = input instanceof Request ? input.url : String(input);
    const method = (init?.method ?? "GET").toUpperCase();
    calls.push({
      url,
      method,
      body: init?.body === undefined ? null : String(init.body),
      headers: new Headers(init?.headers),
    });
    const key = `${method} ${url.startsWith(BASE) ? url.slice(BASE.length) : url}`;
    const route = routes[key];
    if (!route) throw new Error(`Unexpected request: ${key}`);
    return route();
  };

  return { calls, restore: () => { globalThis.fetch = originalFetch; } };
}

function json(body: unknown, status = 200): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: { "Content-Type": "application/json" },
  });
}

function fieldError(status: number, code: string, message: string): Response {
  return json({ code, message }, status);
}

test("no storefront request carries a Field credential", async () => {
  const { calls, restore } = stubFetch({
    "GET /products/pd_01": () => json(product),
    "GET /categories": () => json([]),
  });

  try {
    await getProduct(product.id);
    await getCategories();
    for (const call of calls) {
      expect(call.headers.get("authorization")).toBeNull();
      expect(call.headers.get("x-operator-id")).toBeNull();
      expect(call.headers.get("x-platform-id")).toBeNull();
    }
  } finally {
    restore();
  }
});

test("the aggregate Pages Function makes one upstream call per TTL", async () => {
  const originalCaches = Object.getOwnPropertyDescriptor(globalThis, "caches");
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

  const { calls, restore } = stubFetch({
    "GET /products?limit=100&offset=0": () =>
      json({ items: [product], limit: 100, offset: 0, has_more: false }),
  });

  try {
    const pending: Promise<unknown>[] = [];
    const contextFor = (query: string) => ({
      request: new Request(
        `https://thewanstandard.jp/api/storefront/products?${query}`
      ),
      waitUntil(promise: Promise<unknown>) { pending.push(promise); },
    });

    const first = await onRequestGet(contextFor("bust=first"));
    expect(first.status).toBe(200);
    expect(first.headers.get("Cache-Control")).toBe(
      "public, max-age=60, s-maxage=60"
    );
    await expect(first.json()).resolves.toEqual({
      products: [
        {
          id: product.id,
          name: product.name,
          description: product.description,
          price: product.list_price,
          imageUrl:
            "https://cdn.txcloud.app/cdn-cgi/image/w=800,q=80,f=auto/products/wan-bowl.jpg",
          orderable: false,
          category: product.category_id,
        },
      ],
    });
    await Promise.all(pending);

    // `orderable` rides on the listing itself, so the per-product stock fan-out
    // the authenticated route needed is gone: one request answers the page.
    expect(calls).toHaveLength(1);

    const cached = await onRequestGet(contextFor("bust=second"));
    expect(cached.status).toBe(200);
    expect(calls).toHaveLength(1);
    expect([...cachedResponses.keys()]).toEqual([
      "https://thewanstandard.jp/api/storefront/products",
    ]);
  } finally {
    restore();
    if (originalCaches) {
      Object.defineProperty(globalThis, "caches", originalCaches);
    } else {
      delete (globalThis as { caches?: CacheStorage }).caches;
    }
  }
});

test("the product grid client makes one request to the aggregate endpoint", async () => {
  const { calls, restore } = stubFetch({
    "GET /api/storefront/products": () => json({ products: [] }),
  });

  try {
    await expect(getProducts()).resolves.toEqual([]);
    expect(calls.map((call) => call.url)).toEqual(["/api/storefront/products"]);
  } finally {
    restore();
  }
});

test("categories come from the public categories route with their real ordering", async () => {
  const { restore } = stubFetch({
    "GET /categories": () =>
      json([
        { id: "cat_bowls", name: "Bowls", slug: "bowls", sort_order: 2, parent_id: "cat_all" },
      ]),
  });

  try {
    await expect(getCategories()).resolves.toEqual([
      { id: "cat_bowls", name: "Bowls", slug: "bowls", parentId: "cat_all", sortOrder: 2 },
    ]);
  } finally {
    restore();
  }
});

test("cart operations use the public cart routes and the server's arithmetic", async () => {
  const { calls, restore } = stubFetch({
    "POST /carts": () => json(cart, 201),
    "GET /carts/crt_01": () => json(cart),
    "POST /carts/crt_01/items": () => json(cart),
    "POST /carts/crt_01/items/cri_01": () => json(cart),
    "DELETE /carts/crt_01/items/cri_01": () => json({ ok: true }),
    "GET /products/pd_01": () => json(product),
  });

  try {
    const enriched = {
      id: "crt_01",
      subtotal: 6400,
      items: [
        {
          itemId: "cri_01",
          productId: product.id,
          quantity: 2,
          unitPrice: 3200,
          subtotal: 6400,
          product: {
            id: product.id,
            name: product.name,
            description: product.description,
            price: product.list_price,
            imageUrl:
              "https://cdn.txcloud.app/cdn-cgi/image/w=800,q=80,f=auto/products/wan-bowl.jpg",
            orderable: false,
            category: product.category_id,
          },
        },
      ],
    };

    await expect(getCart("crt_01")).resolves.toEqual(enriched);
    await expect(addToCart(null, product.id, 2)).resolves.toEqual(enriched);
    await expect(updateCartItem("crt_01", "cri_01", 3)).resolves.toEqual(enriched);
    await expect(removeCartItem("crt_01", "cri_01")).resolves.toEqual(enriched);

    const createCall = calls.find((call) => call.url === `${BASE}/carts`);
    // The session identifier is minted server-side; a caller-chosen one would
    // be a guess away from another shopper's cart.
    expect(createCall?.body).toBeNull();

    const addCall = calls.find((call) => call.url === `${BASE}/carts/crt_01/items`);
    expect(JSON.parse(addCall?.body ?? "{}")).toEqual({
      product_id: product.id,
      quantity: 2,
    });

    const updateCall = calls.find(
      (call) => call.method === "POST" && call.url === `${BASE}/carts/crt_01/items/cri_01`
    );
    expect(JSON.parse(updateCall?.body ?? "{}")).toEqual({ quantity: 3 });
  } finally {
    restore();
  }
});

test("a coupon is priced against the cart the caller holds", async () => {
  const { calls, restore } = stubFetch({
    "POST /carts/crt_01/coupon-preview": () =>
      json({
        code: "BSQ20",
        subtotal_nanodollar: 6_400_000_000_000,
        discount_nanodollar: 1_280_000_000_000,
        total_nanodollar: 5_120_000_000_000,
      }),
  });

  try {
    await expect(previewCoupon("crt_01", "BSQ20")).resolves.toEqual({
      code: "BSQ20",
      subtotal: 6400,
      discount: 1280,
      total: 5120,
    });
    expect(calls[0].url).toBe(`${BASE}/carts/crt_01/coupon-preview`);
    expect(JSON.parse(calls[0].body ?? "{}")).toEqual({ code: "BSQ20" });
  } finally {
    restore();
  }
});

test("every coupon rejection is the same answer, and the budget is distinguishable", async () => {
  const rejected = stubFetch({
    "POST /carts/crt_01/coupon-preview": () =>
      fieldError(404, "NOT_FOUND", "This code does not apply to this cart"),
  });
  try {
    // Unknown, expired and under-the-minimum are one 404 upstream, so the UI can
    // only ever say "this code cannot be used" — that is the point.
    await expect(previewCoupon("crt_01", "NOPE")).resolves.toBeNull();
  } finally {
    rejected.restore();
  }

  const throttled = stubFetch({
    "POST /carts/crt_01/coupon-preview": () =>
      fieldError(429, "TOO_MANY_REQUESTS", "Tenant coupon attempt budget exhausted"),
  });
  try {
    await previewCoupon("crt_01", "BSQ20").then(
      () => { throw new Error("expected the coupon budget to reject this attempt"); },
      (error: unknown) => { expect(isRateLimited(error)).toBe(true); }
    );
  } finally {
    throttled.restore();
  }
});

test("checkout submits the coupon code and returns the order Field priced", async () => {
  const { calls, restore } = stubFetch({
    "POST /checkout_sessions": () => json(order, 201),
  });

  try {
    await expect(
      placeOrder({
        cartId: "crt_01",
        name: "Wan Customer",
        phone: "090-0000-0000",
        fulfillmentMethod: "pickup",
        paymentMethod: "in_store",
        couponCode: "BSQ20",
      })
    ).resolves.toMatchObject({
      id: "ord_01",
      subtotal: 6400,
      shippingFee: 0,
      total: 5120,
      pickupDeadline: "2026-09-04T00:00:00Z",
      checkoutUrl: null,
    });

    expect(JSON.parse(calls[0].body ?? "{}")).toMatchObject({
      cart_id: "crt_01",
      fulfillment_method: "pickup",
      payment_method: "in_store",
      shipping_name: "Wan Customer",
      shipping_phone: "090-0000-0000",
      coupon_code: "BSQ20",
    });
  } finally {
    restore();
  }
});

test("order enquiry trades the phone/digits pair for a short-lived token", async () => {
  const { calls, restore } = stubFetch({
    "POST /orders/lookup": () =>
      json({
        order,
        lookup_token: "lut_01",
        expires_at: "2026-08-28T00:30:00Z",
      }),
    "GET /orders/by-token/lut_01": () => json({ ...order, status: "ready" }),
  });

  try {
    const lookup = await lookupOrder({ phone: "090-0000-0000", lastDigits: "0001" });
    expect(JSON.parse(calls[0].body ?? "{}")).toEqual({
      phone: "090-0000-0000",
      last_digits: "0001",
    });
    expect(lookup?.lookupToken).toBe("lut_01");
    expect(lookup?.order).toMatchObject({
      id: "ord_01",
      status: "pending",
      paymentStatus: "unpaid",
      total: 5120,
    });

    // The token, not the order id, is what opens the re-read.
    await expect(refreshOrder("lut_01")).resolves.toMatchObject({ status: "ready" });
    expect(calls[1].url).toBe(`${BASE}/orders/by-token/lut_01`);
  } finally {
    restore();
  }
});

test("a wrong pair and an expired token both read as absence, not as an error", async () => {
  const { restore } = stubFetch({
    "POST /orders/lookup": () =>
      fieldError(404, "NOT_FOUND", "No order matches that phone number and those digits"),
    "GET /orders/by-token/expired": () =>
      fieldError(404, "NOT_FOUND", "No order for that token, or the token has expired"),
  });

  try {
    await expect(
      lookupOrder({ phone: "090-0000-0000", lastDigits: "9999" })
    ).resolves.toBeNull();
    await expect(refreshOrder("expired")).resolves.toBeNull();
  } finally {
    restore();
  }
});
