import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // TODO: Cloudflare Pages deploy setup
  // Option A (static export): output: 'export' + generateStaticParams fetches all product IDs at build time
  //   Requires NEXT_PUBLIC_OPERATOR_ID to be set in CF Pages build environment
  // Option B (CF Pages adapter): @cloudflare/next-on-pages — no static export needed
  //   Run: npx create-cloudflare@latest -- --existing-script=build
};

export default nextConfig;
