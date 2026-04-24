# PET-740 — TWS /shop 在庫切れ UX 暫定対応

- **Linear**: PET-740
- **Priority**: Urgent
- **Deadline**: 2026-04-25 夕（最低限 badge + disable は 2026-04-25 午前中）
- **Branch**: `feature/pet-740-stock-ux`
- **Worktree**: `~/the-wan-standard-shop.pet-740`
- **Repo**: `the-wan-standard-shop`（単独。`apps/bakuure-ui` は touch しない）

## 背景

- TWS 本番 `thewanstandard.jp/shop` で、在庫切れ商品が「購入できない」のに detail 画面上は従来通り「カートに追加」できてしまう UX バグ（PET-737 観測）。
- bakuure-api GraphQL の `productStock { quantityAvailable, trackInventory }` 自体は既に取得可能（PET-737 API 側で確認済）。UI 層で活用していないだけ。
- SDK 抽象化（`bakuure-storekit`）本体の整備は PLT-826（PdM-Product）側で並行進行。本 issue はあくまで UI 暫定対応 (`src/lib/storekit.ts` を局所修正するのみ)。

## スコープ

### (1) 商品詳細 `/shop/[id]/`
- `productStock.quantityAvailable <= 0` かつ `trackInventory === true` のとき「在庫切れ」badge を常時表示。
- 「カートに追加」ボタンを **disable**（hide ではない）。数量 `<select>` も disable。
- 数量 combobox の上限を `Math.min(10, quantityAvailable)` に制限（下限ガード `Math.max(1, ...)` で 0 要素 `<select>` を回避）。
- `trackInventory === false` の商品は従来通り（`toProduct` で `stock = 99` 扱い → 既存ロジックで非表示）。

### (2) 商品一覧 `/shop/`
- 在庫切れカードに画像 overlay で badge を表示。クリック自体は可（detail へ遷移可）。
- overlay は `aspect-square` wrapper を `relative` にして absolute 配置。

### (3) Listing の stock 取得
- `storefrontProducts` query は現状 stock 未包含。
- 方針: `getProducts()` 内で items 取得後、各 product ID について `productStock(productId)` を `Promise.all` で並列取得（N+1、5 商品なら許容）。
- **Per-item `.catch(() => undefined)`** で単発 fail 時も listing 全体は壊さない（fail-open）。
- SDK（`bakuure-storekit`）拡張で効率化は **PLT-826（PdM-Product）側** で別進行。

### (4) 本番反映
- PR 作成 → CI green → admin merge → Tachyon Cloud App deploy 完了確認 → `thewanstandard.jp` で Playwright E2E:
  1. 在庫 0 detail: badge 表示 + button disabled
  2. 在庫あり detail: 通常動作、数量 select 上限 = min(10, quantityAvailable)
  3. listing: 在庫 0 商品に overlay badge、クリックで detail 遷移

## テスト用在庫 0 商品

- 本番 5 商品から 1 つを一時的に在庫 0 に設定する必要あり。
- bakuure 管理画面 admin 操作は PET-737 leader-tws-dryrun（別 window）で進行中。admin credentials を PdM-Pet に確認依頼済。
- credentials 未入手なら実装中は mock（Playwright で `quantityAvailable=0` inject）で visual test を先行し、E2E 直前に実在庫 0 へ切替。

## 設計上の注意（既知の fail-open 挙動）

- `toProduct(product, stock?)` は `stock === undefined`（取得失敗 / 未 fetch）と `trackInventory === false` を同じく `stock = 99` に落とす。
- つまり listing 側 stock fetch が失敗した商品は「在庫切れ badge 出ない」= 表示上は「購入可能」扱い。
- これは fail-open 仕様で本 issue ではそのまま受け入れる（UX 的にも「badge を誤表示するより表示しない」の方が無難）。
- 恒久対応（`stock undefined` と `unlimited` を区別する）は PLT-826 で SDK 抽象化されたタイミングで行う。

## アーキ遵守

- `apps/bakuure-ui` は touch しない（CEO 2026-04-22 明示ルール）。
- `CF Pages Functions proxy` / `NEXT_PUBLIC_TENANT_BRAND` build-time override は一切使わない。
- 修正は `the-wan-standard-shop` リポ単独で完結。

## 進行

- [ ] taskdoc 初回 commit
- [ ] `src/lib/storekit.ts` getProducts に stock fetch 追加
- [ ] `src/app/shop/[id]/ProductDetail.tsx` badge + disable
- [ ] `src/app/shop/ShopProductGrid.tsx` overlay badge
- [ ] `npm run lint` / `npm run build` green
- [ ] PR 作成 → CI green → admin merge
- [ ] 本番 deploy 反映 → Playwright 3 パターン E2E
- [ ] PdM-Pet に完了報告 → window kill
