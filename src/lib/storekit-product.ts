import type {
  StockInfo,
  StorefrontProduct,
} from "@tachyon-sdk/storekit";

const STORAGE_CDN_BASE = "https://cdn.txcloud.app";

export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  imageUrl: string | null;
  stock: number;
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

export function toProduct(
  product: StorefrontProduct,
  stock?: StockInfo
): Product {
  return {
    id: product.id,
    name: product.name,
    description: product.description ?? "",
    price: product.listPrice,
    imageUrl: imageIdToUrl(product.imageIds[0]),
    stock: stock?.trackInventory ? stock.quantityAvailable : 99,
    category: product.categoryId,
  };
}
