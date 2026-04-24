# PET-740 mock E2E evidence (本番 `thewanstandard.jp`)

- **実施**: 2026-04-24 (PR #16 admin merge + Tachyon Cloud App deploy 完了後)
- **対象本番**: `https://thewanstandard.jp/`
- **deploy 確認**: detail chunk `09wj~hezlxdku.js` に `Math.max(1,` / `disabled:cursor-not-allowed` / `tracking-widest` / `在庫切れ` を確認（merge 前の `09~3b46yvwia_.js` は `在庫切れです` 旧文字列のみ）
- **対象商品 (mock OOS)**: `pd_01kpx25jdx1z5h7y38s7h83a35`（無添加ジャーキートリーツ（ビーフ）50g）
- **対象商品 (regression)**: listing で MOCK_OOS 以外の先頭商品 → `グレインフリードッグフード（サーモン）800g`
- **test runner**: `@playwright/test@1.59.1` (chromium)
- **mock 方式**: `page.route('https://bakuure.api.n1.tachy.one/v1/graphql', ...)` で MOCK_OOS_PRODUCT_ID 宛 `productStock` query の upstream response の `quantityAvailable` を 0 に書き換え、`trackInventory` を true に固定

## 結果サマリ

| # | 観測項目 | 結果 | 証跡 |
|---|---|---|---|
| (1) | listing `/shop/` で MOCK_OOS 商品にのみ overlay badge、他 4 商品は非表示 | PASS | `screenshots/01-listing-oos-overlay.png`, `logs/01-listing-console.json` |
| (2) | detail `/shop/[id]/` で badge + 数量 select disabled + 「在庫切れ」button disabled、`addCartItem` mutation 未発行 | PASS | `screenshots/02-detail-oos-disabled.png`, `logs/02-detail-console.json` |
| (3) | in-stock 商品での detail → cart → checkout regression 完走（cart 到達後 `読み込み中...` 解消確認・item 行描画・`合計` 行・`レジに進む` button 表示を assert した上で、button click で `/shop/checkout/` に実遷移） | PASS | `screenshots/03a-detail-in-stock.png`（detail, cart button enabled）, `screenshots/03b-cart-after-add.png`（`グレインフリードッグフード（サーモン）800g` ¥4,500 × 1, 合計 ¥4,500, レジに進む button）, `screenshots/03c-checkout-landed.png`（CHECKOUT form: 店舗受け取り・お名前・電話番号・メール・注文を確定する button）, `logs/03-regression-console.json` |
| (4) | ブラウザ console 新規 error なし（`net::ERR_ABORTED` を除く） | PASS | 上記 `*-console.json` は全て `[]`（`net::ERR_ABORTED` のみフィルタ、理由は tests/pet740-mock-e2e.spec.ts 内コメント参照） |

## 再現コマンド

```
cd ~/the-wan-standard-shop.pet-740/state/pet740-stock-ux
npx playwright test --config=playwright.config.ts
```

## CloudWatch / Sentry

TWS shop は現時点で Sentry 未導入（CLAUDE.md Phase2 対応）。CloudWatch は bakuure-api 側の観測で、UI 層（Tachyon Cloud App Pages）の console error は Playwright で捕捉した上記結果で代替。

## 残タスク

- PET-737 leader-tws-dryrun と合同で、実在庫 0 商品（候補 `pd_01kpx25jdx1z5h7y38s7h83a35` を adjustStock(-N) で 0 化 → 観測 → adjustStock(+N) で復帰）で real 検証を実施。token 確保 + Scope 1 完了後に本 window で coordinate。
