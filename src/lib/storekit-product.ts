import type { PublicProduct } from "./storekit-client";

const STORAGE_CDN_BASE = "https://cdn.txcloud.app";

export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  imageUrl: string | null;
  /**
   * The public storefront publishes availability as one bit. Quantity on hand,
   * reservation counts and low-stock thresholds stay the store's business, so
   * the UI can say "sold out" but never "3 left".
   */
  orderable: boolean;
  category: string | null;
}

function imageIdToUrl(imageId: string | undefined): string | null {
  if (!imageId) return null;
  if (imageId.startsWith("http://") || imageId.startsWith("https://")) {
    return imageId;
  }
  const key = imageId.replace(/^\/+/, "");
  return `${STORAGE_CDN_BASE}/cdn-cgi/image/w=800,q=80,f=auto/${key}`;
}

export function toProduct(product: PublicProduct): Product {
  return {
    id: product.id,
    name: product.name,
    description: product.description ?? "",
    price: product.list_price,
    imageUrl: imageIdToUrl(product.image_ids[0]),
    orderable: product.orderable,
    category: product.category_id ?? null,
  };
}
