import { listProducts } from "./storekit-client";
import { toProduct, type Product } from "./storekit-product";

/**
 * Pages Function only. The listing carries `orderable` on every row, so the
 * per-product stock fan-out the authenticated route needed is gone; client code
 * still goes through the aggregate endpoint exposed by getProducts() so the
 * response can be cached at the edge.
 */
export async function getStorefrontProductsUncached(): Promise<Product[]> {
  const { items } = await listProducts(100, 0);
  return items.map(toProduct);
}
