import Link from "next/link";
import { getProducts, type Product } from "@/lib/storekit";

export const revalidate = 60;

export default async function ShopPage() {
  let products: Product[] = [];
  try {
    products = await getProducts();
  } catch {
    products = [];
  }

  return (
    <div>
      <h1 className="font-serif-en text-2xl tracking-widest uppercase text-p2 mb-8">
        Shop
      </h1>
      {products.length === 0 ? (
        <p className="text-n1 text-sm">現在、商品の準備中です。しばらくお待ちください。</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {products.map((product) => (
            <Link
              key={product.id}
              href={`/shop/${product.id}`}
              className="group border border-s2/40 hover:border-s2 transition-colors"
            >
              <div className="aspect-square bg-white overflow-hidden">
                {product.imageUrl ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={product.imageUrl}
                    alt={product.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-n1 text-xs">
                    No Image
                  </div>
                )}
              </div>
              <div className="p-4">
                <p className="font-serif-ja text-p2 mb-1">{product.name}</p>
                <p className="text-sm text-n1">
                  ¥{product.price.toLocaleString("ja-JP")}
                </p>
                {product.stock === 0 && (
                  <p className="text-xs text-s1 mt-1">在庫切れ</p>
                )}
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
