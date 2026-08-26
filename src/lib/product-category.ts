import type { Product } from "@/lib/storekit";

export type StoreCategory = "Bowl" | "Stand" | "Goods";
export const STORE_CATEGORIES: StoreCategory[] = ["Bowl", "Stand", "Goods"];

export function getStoreCategory(product: Pick<Product, "name" | "description">): StoreCategory {
  const haystack = `${product.name} ${product.description}`.toLowerCase();
  if (/stand|スタンド|食器台|フード台/.test(haystack)) return "Stand";
  if (/goods|グッズ|bag|バッグ|mat|マット|toy|おもちゃ|leash|リード/.test(haystack)) return "Goods";
  return "Bowl";
}
