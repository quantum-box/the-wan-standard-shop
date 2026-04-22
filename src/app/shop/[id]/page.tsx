import { notFound } from "next/navigation";
import { getProduct, getProducts } from "@/lib/storekit";
import { ProductDetail } from "./ProductDetail";

export async function generateStaticParams() {
  try {
    const products = await getProducts();
    return products.map((p) => ({ id: p.id }));
  } catch {
    return [];
  }
}

interface Props {
  params: Promise<{ id: string }>;
}

export default async function ProductPage({ params }: Props) {
  const { id } = await params;
  try {
    const product = await getProduct(id);
    return <ProductDetail product={product} />;
  } catch {
    notFound();
  }
}
