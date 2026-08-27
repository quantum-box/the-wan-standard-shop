# THE WAN STANDARD

THE WAN STANDARD のブランドサイト兼オンラインショップです。日本の工芸・陶器の美意識を取り入れた犬用食器を紹介・販売しています。

- ブランドサイト: [https://thewanstandard.jp](https://thewanstandard.jp)
- オンラインショップ: [https://thewanstandard.jp/shop](https://thewanstandard.jp/shop)

Next.js App Router で実装し、静的サイトとして出力します。ショップ機能は独立した TWS テナントとして **TACHYON Field GraphQL API** へ接続します。

## 主な機能

- ブランドトップ・ブランド紹介
- 商品一覧・商品詳細・在庫表示
- カートへの追加、数量変更、削除、ローカル保存
- バーナードスクエアでの店舗受け取り注文
- 店頭支払いによるチェックアウト
- 注文完了ページ
- 電話番号と注文番号下4桁によるゲスト注文照会
- 注文に関する問い合わせ導線
- プライバシーポリシー・利用規約
- OGP / SEO メタデータ
- Google Analytics 連携（任意）

## 主なページ

| パス | 内容 |
|---|---|
| `/` | ブランドトップ |
| `/about` | ブランド紹介 |
| `/shop` | 商品一覧 |
| `/shop/[id]` | 商品詳細 |
| `/shop/cart` | カート |
| `/shop/checkout` | 店舗受け取り注文 |
| `/shop/checkout/thanks` | 注文完了 |
| `/shop/orders/lookup` | ゲスト注文照会 |
| `/my-orders` | 注文確認・問い合わせ案内 |
| `/thanks` | 購入後コミュニケーション用ページ |
| `/legal/privacy` | プライバシーポリシー |
| `/legal/terms` | 利用規約 |

## 技術スタック

- Next.js 16.2.4（App Router / Static Export）
- React 19.2.4
- TypeScript 5
- Tailwind CSS 4
- ESLint 9
- Playwright
- TACHYON Field GraphQL API
- Tachyon Cloud App

`next.config.ts` では `output: "export"`、`trailingSlash: true`、画像の最適化無効を設定しています。ビルド成果物は `out/` に生成されます。

## 必要環境

- Node.js 20.9.0 以上
- npm

## セットアップ

```bash
git clone https://github.com/quantum-box/the-wan-standard-shop.git
cd the-wan-standard-shop
npm ci
npm run dev
```

開発サーバーは通常 [http://localhost:3000](http://localhost:3000) で起動します。

## 環境変数

基本的なショップ動作に必須の環境変数はありません。

| 変数名 | 必須 | 説明 |
|---|---:|---|
| `NEXT_PUBLIC_GA_MEASUREMENT_ID` | 任意 | Google Analytics の Measurement ID。未設定時はスクリプトを読み込みません。 |
| `NEXT_PUBLIC_LINE_URL` | 任意 | `/thanks` で使用する LINE URL。未設定時は既定値を使用します。 |

ストアフロントの API オリジンとオペレーター ID は、静的出力へ確実に反映するため `src/lib/storekit-config.ts` の定数として管理しています。`NEXT_PUBLIC_API_BASE_URL` と `NEXT_PUBLIC_OPERATOR_ID` は現在使用していません。

接続先を変更する場合は、`src/lib/storekit-config.ts` と接続先を検証するテストを同時に更新してください。

## コマンド

| コマンド | 内容 |
|---|---|
| `npm run dev` | Next.js と Pages Functions を同一 origin の開発サーバーで起動 |
| `npm run lint` | ESLint を実行 |
| `npm test` | API オリジン、EC の耐障害性、SDK 移行、ビルド成果物スキャンのテストを実行 |
| `npm run build` | テスト、静的ビルド、Pages Function の bundle、成果物スキャンを順番に実行 |
| `npm run scan:retired-origins` | `out/` に廃止済みオリジンが含まれていないか検査 |
| `npm run scan:pages-worker` | Pages Worker に Node.js 専用 import がなく、集約 API が含まれることを検査 |

`npm run build` では次の処理が自動的に実行されます。

1. `prebuild`: `npm test`
2. `build`: `next build` と `npm run build:functions`
3. `postbuild`: 廃止済みオリジンと Pages Worker をスキャン

廃止済み API オリジンは `config/retired-origins.txt` で管理します。

## API・ストア機能

`src/lib/storekit.ts` が **TACHYON Field GraphQL API** の storefront 向け抽象レイヤーです。`@tachyon-sdk/storekit` を利用し、次の処理を提供しています。

- 商品一覧・商品詳細の取得
- 在庫数の取得
- カートの作成・取得・更新
- 店舗受け取り注文の作成
- ゲスト注文照会
- 商品画像 ID から CDN URL への変換

注文照会だけは SDK の `ConsumerOrder` に `paymentStatus` が追加されるまで、自前 GraphQL 経路を残しています（`PLT-3986`）。現在の API エンドポイントは以下です。

```text
https://tachyon-field-api.txcloud.app/v1/graphql
```

### 商品追加時の注意

静的出力では商品詳細ルートを事前生成するため、商品を追加した際は `src/app/shop/[id]/page.tsx` の `PRODUCT_IDS` に商品 ID を追加してください。未登録の商品 ID は商品詳細ページとして出力されません。

### 商品一覧の集約 API

商品一覧は `/api/storefront/products` の Pages Function で商品ごとの在庫を集約し、
在庫の鮮度と Field API の負荷を釣り合わせるため 60 秒キャッシュしてからブラウザへ返します。
ブラウザからは集約 API を1回だけ呼び、商品単位の在庫リクエストは送信しません。
`npm run build` は Pages Function を `out/_worker.js/index.js` に bundle し、静的成果物と
同じ Cloudflare Pages deployment に含めます。

`npm run dev` では開発専用の custom server が Next.js を配信し、
`/api/storefront/products` だけをローカル Wrangler Pages Functions runtime へ中継します。
production の静的 export とデプロイ設定には影響しません。

## ディレクトリ構成

```text
.
├── config/             # 廃止済みオリジンなどの設定
├── docs/               # ブランド・タスク関連資料
├── functions/          # Cloudflare Pages Functions
├── public/             # 画像、OGP、リダイレクト設定など
├── scripts/            # ビルド成果物の検査スクリプト
├── src/
│   ├── app/            # Next.js App Router ページ
│   ├── components/     # 共通 UI コンポーネント
│   └── lib/            # Store API・カート関連処理
└── tests/              # Playwright テスト
```

## デプロイ

Tachyon Cloud App プラットフォームからデプロイします。

- Build command: `npm run build`
- Output directory: `out`
- API 接続設定: `src/lib/storekit-config.ts` に含めて静的ビルド
- 任意の build-time environment variables: `NEXT_PUBLIC_GA_MEASUREMENT_ID`, `NEXT_PUBLIC_LINE_URL`

GitHub Actions からの Cloudflare Pages 自動デプロイや、`CLOUDFLARE_API_TOKEN` などの Cloudflare API クレデンシャルは使用しません。

## 開発ルール

- 対外表記は常に `THE WAN STANDARD` を使用します。
- `main` へ直接 push せず、Pull Request 経由で変更します。
- マージ前に `npm run lint` と `npm run build` を実行します。
- API オリジンを変更する場合は、廃止済みオリジンの登録と成果物スキャンも更新します。

詳細な実装・運用ルールは `AGENTS.md` を参照してください。

## 関連リポジトリ

- [TACHYON Field API / Tachyon Apps](https://github.com/quantum-box/tachyon-apps)
