import { expect, test } from "@playwright/test";
import { getProducts } from "../src/lib/storekit";

test("storefront product loading rejects on network failure so UI can offer retry", async () => {
  const originalFetch = globalThis.fetch;
  globalThis.fetch = async () => { throw new TypeError("network offline"); };
  try { await expect(getProducts()).rejects.toThrow("network offline"); }
  finally { globalThis.fetch = originalFetch; }
});

test("storefront product loading rejects aggregate error payloads instead of treating them as empty products", async () => {
  const originalFetch = globalThis.fetch;
  globalThis.fetch = async () => new Response(JSON.stringify({ errors: [{ message: "inventory unavailable" }] }), { status: 200, headers: { "Content-Type": "application/json" } });
  try { await expect(getProducts()).rejects.toThrow("inventory unavailable"); }
  finally { globalThis.fetch = originalFetch; }
});

test("storefront product loading rejects HTTP errors", async () => {
  const originalFetch = globalThis.fetch;
  globalThis.fetch = async () => new Response("upstream error", { status: 503 });
  try { await expect(getProducts()).rejects.toThrow("Storefront products error: 503"); }
  finally { globalThis.fetch = originalFetch; }
});
