import { expect, test } from "@playwright/test";
import { getProducts } from "../src/lib/storekit";

const CANONICAL_GRAPHQL_URL =
  "https://tachyon-field-api.txcloud.app/v1/graphql";

test("uses the build-time canonical Field API URL for storefront requests", async () => {
  const originalFetch = globalThis.fetch;
  const requestedUrls: string[] = [];

  globalThis.fetch = async (input, init) => {
    requestedUrls.push(input instanceof Request ? input.url : String(input));
    expect(init?.method).toBe("POST");

    return new Response(
      JSON.stringify({ data: { storefrontProducts: { items: [] } } }),
      {
        status: 200,
        headers: { "Content-Type": "application/json" },
      }
    );
  };

  try {
    await expect(getProducts()).resolves.toEqual([]);
    expect(requestedUrls).toEqual([CANONICAL_GRAPHQL_URL]);
  } finally {
    globalThis.fetch = originalFetch;
  }
});
