import { expect, test } from "@playwright/test";
import { getProductsWithStockUncached } from "../src/lib/storefront-products-server";

const CANONICAL_GRAPHQL_URL =
  "https://tachyon-field-api.txcloud.app/v1/graphql";

test("uses the canonical Field API URL for server-side storefront requests", async () => {
  const originalFetch = globalThis.fetch;
  const requestedUrls: string[] = [];

  globalThis.fetch = async (input, init) => {
    requestedUrls.push(input instanceof Request ? input.url : String(input));
    expect(init?.method).toBe("POST");
    expect(new Headers(init?.headers).get("x-operator-id")).toBeTruthy();

    return new Response(
      JSON.stringify({ data: { storefrontProducts: { items: [] } } }),
      {
        status: 200,
        headers: { "Content-Type": "application/json" },
      }
    );
  };

  try {
    await expect(getProductsWithStockUncached()).resolves.toEqual([]);
    expect(requestedUrls).toEqual([CANONICAL_GRAPHQL_URL]);
  } finally {
    globalThis.fetch = originalFetch;
  }
});
