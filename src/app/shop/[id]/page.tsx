import type { Metadata } from "next";
import { ProductDetail } from "./ProductDetail";

export const dynamicParams = false;

// Hardcoded product IDs seeded for TWS tenant (tn_01kptmrtgnm746m5mpr78e2esd).
// CF Pages build environment cannot reach bakuure API, so IDs are static here.
// Add new IDs when products are added to the tenant.
const PRODUCT_IDS = [
  "pd_01kpx25jdxawpstd6mtt8f2bhd",
  "pd_01kpx25jdx9jdjqp1zszbrtff8",
  "pd_01kpx25jdx1z5h7y38s7h83a35",
  "pd_01kpx25jdxbwr5texzq3d5zahy",
  "pd_01kpx25jdxecw29dy9njm3mhzd",
];

export async function generateStaticParams() {
  return PRODUCT_IDS.map((id) => ({ id }));
}

export const metadata: Metadata = {
  title: "商品詳細 | THE WAN STANDARD",
  description: "THE WAN STANDARD公式オンラインストア。職人の手による、愛犬のための一椀をお届けします。",
};

interface Props {
  params: Promise<{ id: string }>;
}

export default async function ProductPage({ params }: Props) {
  const { id } = await params;
  return <ProductDetail productId={id} />;
}
