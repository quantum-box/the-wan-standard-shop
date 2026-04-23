# PET-732: TWS /shop 4/26 SO 向け店舗受け取り購入完走実装

## Goal

2026-04-26 ソフトオープンに向け、`/shop` → カート追加 → チェックアウト → 店舗受取注文完走を実現する。

- storekit.ts の cart / checkout を REST から GraphQL に修正（実エンドポイントと一致させる）
- checkout は `fulfillmentMethod=pickup` / `paymentMethod=in_store` 固定、配送 UI を非表示
- 新テナント `tn_01kptmrtgnm746m5mpr78e2esd` への products seed 確認・依頼

## Current Findings

### API エンドポイント調査

- `storefrontProducts` GraphQL クエリ: operator-id ヘッダーで tenant 識別、`limit/offset` のみで OK → 現状 OK
- `getProducts` / `getProduct` の GraphQL クエリ: **schema と一致、問題なし**
- `GET /v1/carts/{cartId}` (REST) → **存在しない**。bakuure-api は GraphQL のみ
- `POST /v1/carts` (REST) → **存在しない**
- `POST /v1/carts/{cartId}/items` (REST) → **存在しない**
- `POST /v1/orders` (REST) → **存在しない**

bakuure-api の cart/order は `/v1/graphql` の GraphQL mutation のみ。

### GraphQL API 実動作確認

```bash
# storefrontProducts → 空配列
curl -H "x-operator-id: tn_01kptmrtgnm746m5mpr78e2esd" .../v1/graphql \
  -d '{"query":"{ storefrontProducts(limit:10, offset:0) { items { id name } } }"}'
# → {"data":{"storefrontProducts":{"items":[]}}}   ← seed 未投入

# createCart → 成功（sessionId 必須）
# → {"data":{"createCart":{"id":"crt_...", "status":"active"}}}
```

### schema.graphql キー定義

```graphql
createCart(input: CreateCartInput!): GqlCart!
  # CreateCartInput: { userId: String, sessionId: String }  # どちらか必須

addCartItem(cartId: ID!, input: AddCartItemInput!): GqlCart!
  # AddCartItemInput: { productId: String!, quantity: Int! }

updateCartItem(cartId: ID!, itemId: ID!, input: UpdateCartItemInput!): GqlCart!
  # UpdateCartItemInput: { quantity: Int! }
  # !! itemId (GqlCartItem.id) を使う、productId ではない

removeCartItem(cartId: ID!, itemId: ID!): Boolean!
  # Boolean! を返す（Cart ではない）

checkout(input: CheckoutInput!): GqlConsumerOrder!

type GqlCartItem {
  id: String!
  productId: String!
  quantity: Int!
  unitPriceNanodollar: String!
  # product オブジェクトはなし → 商品情報は別途 storefrontProduct クエリで取得
}

input CheckoutInput {
  cartId: String!
  shippingName: String
  shippingAddress: String   # 構造化でなく文字列
  shippingPhone: String
  customerEmail: String
  storeId: String
  pickupRequestedAt: String
  fulfillmentMethod: String  # "pickup" or "delivery"
  paymentMethod: String      # "in_store" or "online"
  couponCode: String
  successUrl: String
  cancelUrl: String
}
```

## Implementation Plan

### storekit.ts 修正

1. `Cart` / `CartItem` インターフェースに `itemId: string` を追加
2. `getCart(cartId)` → GraphQL `cart(cartId)` query + 各 item を `storefrontProduct` で enrich
3. `addToCart(cartId|null, productId, quantity)`:
   - cartId なし → `createCart(input: {sessionId})` → `addCartItem`
   - cartId あり → `addCartItem` のみ
   - sessionId は `localStorage` で永続化
4. `updateCartItem(cartId, itemId, quantity)` → GraphQL `updateCartItem`（引数を productId→itemId に変更）
5. `removeCartItem(cartId, itemId)` → GraphQL `removeCartItem`（Boolean を受け取り `getCart` でリフレッシュ）
6. `OrderInput` を `{ cartId, name, phone, email? }` に変更
7. `createOrder(input)` → GraphQL `checkout` mutation (`fulfillmentMethod:"pickup"`, `paymentMethod:"in_store"` 固定)
8. REST 用 `apiFetch` ヘルパーは削除（GraphQL のみ）

### checkout/page.tsx 修正

- 住所フォーム全廃（郵便番号・都道府県・市区町村・番地・建物名）
- 残すフィールド: お名前・電話番号・メールアドレス（任意）
- 「店舗受け取り」バナー表示（バーナードスクエアで受け取り）
- `createOrder` 呼び出しを新 OrderInput に合わせる

### cart/page.tsx 修正

- `updateCartItem(cartId, productId, ...)` → `updateCartItem(cartId, item.itemId, ...)`
- `removeCartItem(cartId, productId)` → `removeCartItem(cartId, item.itemId)`

### products seed

- pdm-pd window に seed 依頼を送る

## Status

- [x] 調査完了
- [ ] taskdoc 初回 commit
- [ ] storekit.ts 修正
- [ ] checkout/page.tsx 修正
- [ ] cart/page.tsx 修正
- [ ] products seed 依頼 (pdm-pd)
- [ ] PR 作成
- [ ] CI → merge
- [ ] 本番 E2E
