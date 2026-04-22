# PET-728: TWS shop frontend storekit.ts GraphQL integration

## Goal

Display TWS tenant products on `/shop` and `/shop/[id]` for the 2026-04-26 soft open by replacing the current product fetch path in `src/lib/storekit.ts` with the bakuure storefront product source.

Target branch: `feature/tws-storekit-graphql`

TWS tenant ID: `tn_01kkk6aav60anp20d5a8151ass`

## Current Findings

- `src/lib/storekit.ts` is a local abstraction layer intended to be replaced by `bakuure-storekit` when available.
- Product reads currently call REST endpoints:
  - `GET /v1/products`
  - `GET /v1/products/:id`
- This does not read the GraphQL `storefrontProducts` data populated through bakuure admin in PET-727, so `/shop` cannot display the newly registered TWS products.
- Next.js docs under `node_modules/next/dist/docs/` were requested by repo rules, but the directory is not present in the current checkout before dependency verification.

## References To Inspect

- This repo:
  - `src/lib/storekit.ts`
  - `src/app/shop`
  - `src/app/shop/[id]`
  - package/dependency files for SDK availability
- Tachyon/bakuure repo:
  - `~/tachyon-apps` for storekit SDK packages such as `@tachyon-apps/commerce`
  - GraphQL schema/resolvers for `storefrontProducts`
- Next.js 16 docs:
  - `node_modules/next/dist/docs/` if available after dependency install/check
  - focus on App Router static export and data fetching behavior

## Implementation Plan

1. Confirm the product shape consumed by `/shop` and `/shop/[id]`.
2. Search `~/tachyon-apps` for a storekit SDK product list/detail API.
3. Prefer SDK integration if it exposes a product list/detail method for tenant storefront data.
4. If no SDK API exists, implement a small GraphQL client in `src/lib/storekit.ts` that calls `storefrontProducts` directly.
5. Normalize GraphQL product records to the existing `Product` interface to keep page changes minimal.
6. Ensure product detail accepts the route identifier currently used by `/shop/[id]` and maps it to GraphQL slug/id behavior.
7. Run lint/build, then verify `/shop` and `/shop/[id]` locally.
8. Push the branch, open/update PR, confirm CI, and report preview URL to `coo:0`.

## Notes

- Do not reuse `bakuure-ui` or add any proxy to it.
- Do not deploy manually; Cloud App controls deploy.
- Keep all external display text as `THE WAN STANDARD`; do not expose `TWS`.
- Main branch direct push is forbidden.

## Implementation Notes

- SDK package import was not available in this standalone shop repo.
- `~/tachyon-apps/apps/bakuure-ui` already uses GraphQL `storefrontProducts` and `storefrontProduct` for the shop pages.
- `~/tachyon-apps/apps/bakuure-api/schema.graphql` confirms:
  - `storefrontProducts(limit, offset): StorefrontProductList!`
  - `storefrontProduct(productId): StorefrontProduct!`
  - `productStock(productId): GqlProductStock!`
- `src/lib/storekit.ts` now calls `${NEXT_PUBLIC_API_BASE_URL}/v1/graphql` with `x-operator-id`.
- `NEXT_PUBLIC_OPERATOR_ID` still wins when set; otherwise the TWS tenant ID is used as the fallback for static builds.
- `getProducts()` maps GraphQL storefront products to the existing `Product` interface to avoid page-level churn.
- `getProduct(id)` fetches `storefrontProduct` plus `productStock` so `/shop/[id]` quantity limits reflect current inventory at build time.
- Public brand text found during verification was normalized to `THE WAN STANDARD`.

## Verification

- `curl` against production GraphQL with tenant `tn_01kkk6aav60anp20d5a8151ass` returned the PET-727 products.
- `npm run lint` passed.
- `npm run build` passed.
- Static export generated `/shop` and 5 `/shop/[id]` pages from GraphQL data.
- Served `out/` locally at `http://localhost:3000` and confirmed:
  - `GET /shop/` returned 200 and included TWS tenant product cards.
  - `GET /shop/pd_01kpfqkppzfygz2sp2a3ee1vxd/` returned 200 and included product detail, price, description, and quantity options.
