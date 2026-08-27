import { storefront } from "./storefront-client-server";
import { toProduct, type Product } from "./storekit-product";

/**
 * Pages Function only. Keep the per-product stock fan-out off the browser;
 * client code must call the aggregate endpoint exposed by getProducts().
 */
export async function getProductsWithStockUncached(): Promise<Product[]> {
  const { items } = await storefront.list({ limit: 100, offset: 0 });
  const productsWithStock = await Promise.all(
    items.map(async (listedProduct) => {
      try {
        return await storefront.getWithStock(listedProduct.id);
      } catch {
        return { product: listedProduct, stock: undefined };
      }
    })
  );
  return productsWithStock.map(({ product, stock }) =>
    toProduct(product, stock)
  );
}
