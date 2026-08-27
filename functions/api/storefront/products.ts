import { getProductsWithStockUncached } from "../../../src/lib/storefront-products-server";

const CACHE_TTL_SECONDS = 60;

interface PagesFunctionContext {
  request: Request;
  waitUntil(promise: Promise<unknown>): void;
}

type CloudflareCacheStorage = CacheStorage & { default: Cache };

function jsonResponse(body: unknown, init: ResponseInit): Response {
  const headers = new Headers(init.headers);
  headers.set("Content-Type", "application/json; charset=utf-8");
  return new Response(JSON.stringify(body), { ...init, headers });
}

export async function onRequestGet(
  context: PagesFunctionContext
): Promise<Response> {
  const cache = (globalThis.caches as CloudflareCacheStorage).default;
  const cacheKey = new Request(context.request.url, { method: "GET" });
  const cachedResponse = await cache.match(cacheKey);
  if (cachedResponse) return cachedResponse;

  try {
    const products = await getProductsWithStockUncached();
    const response = jsonResponse(
      { products },
      {
        status: 200,
        headers: {
          "Cache-Control": `public, max-age=${CACHE_TTL_SECONDS}, s-maxage=${CACHE_TTL_SECONDS}`,
        },
      }
    );
    context.waitUntil(cache.put(cacheKey, response.clone()));
    return response;
  } catch (error) {
    console.error("Storefront product aggregation failed", error);
    return jsonResponse(
      { error: "Storefront products are temporarily unavailable" },
      { status: 502, headers: { "Cache-Control": "no-store" } }
    );
  }
}
