import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getProduct, getProducts } from "@/lib/storekit";
import { ProductDetail } from "./ProductDetail";

export const dynamicParams = false;

export async function generateStaticParams() {
  try {
    const products = await getProducts();
    if (products.length > 0) return products.map((p) => ({ id: p.id }));
  } catch {
    // API unavailable at build time — fall through to placeholder
  }
  // Placeholder keeps output:export happy when no products exist yet.
  // In CF Pages builds with NEXT_PUBLIC_OPERATOR_ID set, real IDs replace this.
  return [{ id: "_noop" }];
}

interface Props {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  if (id === "_noop") return {};
  const product = await getProduct(id).catch(() => null);
  if (!product) return {};

  const title = `${product.name} | THE WAN STANDARD`;
  const description = `${product.name} — THE WAN STANDARD公式オンラインストア。¥${product.price.toLocaleString("ja-JP")}`;
  const image = product.imageUrl || "/assets/og/tws-og-shop.jpg";

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      url: `/shop/${product.id}`,
      type: "website",
      images: [{ url: image, alt: product.name }],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [image],
    },
  };
}

export default async function ProductPage({ params }: Props) {
  const { id } = await params;
  if (id === "_noop") notFound();
  const product = await getProduct(id).catch(() => null);
  if (!product) notFound();
  return <ProductDetail product={product} />;
}
