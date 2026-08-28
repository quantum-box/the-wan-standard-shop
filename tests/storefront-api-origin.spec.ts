import { expect, test } from "@playwright/test";
import { getStorefrontProductsUncached } from "../src/lib/storefront-products-server";

const PUBLIC_STOREFRONT_BASE =
  "https://tachyon-field-api.txcloud.app/v1/public/storefront/tn_01kptmrtgnm746m5mpr78e2esd";

test("server-side storefront reads go to the canonical public storefront route", async () => {
  const originalFetch = globalThis.fetch;
  const requestedUrls: string[] = [];

  globalThis.fetch = async (input, init) => {
    requestedUrls.push(input instanceof Request ? input.url : String(input));
    expect(init?.method ?? "GET").toBe("GET");

    // The tenant travels in the path. A public route that accepted an
    // `x-operator-id` header would let an unauthenticated caller pick a tenant,
    // which is exactly what Field's tenant boundary refuses.
    const headers = new Headers(init?.headers);
    expect(headers.get("authorization")).toBeNull();
    expect(headers.get("x-operator-id")).toBeNull();

    return new Response(
      JSON.stringify({ items: [], limit: 100, offset: 0, has_more: false }),
      { status: 200, headers: { "Content-Type": "application/json" } }
    );
  };

  try {
    await expect(getStorefrontProductsUncached()).resolves.toEqual([]);
    expect(requestedUrls).toEqual([
      `${PUBLIC_STOREFRONT_BASE}/products?limit=100&offset=0`,
    ]);
  } finally {
    globalThis.fetch = originalFetch;
  }
});
