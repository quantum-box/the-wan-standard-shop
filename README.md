# The Wan Standard — Shop

The Wan Standard のオンラインショップです。[bakuure API](https://github.com/quantum-box/tachyon-apps) を使った storekit のリファレンス実装です。

## 概要

- **フレームワーク**: Next.js (App Router, Static Export)
- **スタイル**: Tailwind CSS v4 (TWS ブランドカラー適用)
- **デプロイ**: Tachyon Cloud App プラットフォーム (`thewanstandard.jp/shop`)
- **バックエンド**: bakuure API (TWS テナント)

## Phase 1 機能

- 商品一覧 (`/shop`)
- 商品詳細 (`/shop/[id]`)
- カート (`/shop/cart`)
- チェックアウト (`/shop/checkout`)

## セットアップ

```bash
npm install
cp .env.example .env.local
# .env.local に環境変数を設定
npm run dev
```

## 環境変数

| 変数名 | 説明 |
|--------|------|
| `NEXT_PUBLIC_API_BASE_URL` | bakuure API のベース URL |
| `NEXT_PUBLIC_OPERATOR_ID` | TWS テナントのオペレーター ID |

## ビルド

```bash
npm run build
# out/ に静的ファイルが生成される
```

## storekit について

現在 `src/lib/storekit.ts` に bakuure API の抽象レイヤーを実装しています。
[bakuure-storekit](https://github.com/quantum-box/bakuure-storekit) が公開された後、import を差し替えます。

## デプロイ

**Tachyon Cloud App プラットフォーム**でデプロイされる。

- GitHub Actions auto-deploy は **使わない** (削除済み / 削除予定)
- `CLOUDFLARE_API_TOKEN` 等の Cloudflare API クレデンシャルは **不要**
- Cloud App platform 経由で build / deploy が行われる
- Cloudflare Pages 手動 deploy も基本不要 (Cloud App が制御)

ビルド設定 (Cloud App 内で実行):

- **Build command**: `npm run build`
- **Output directory**: `out`
- **Environment variables**: `NEXT_PUBLIC_API_BASE_URL` / `NEXT_PUBLIC_OPERATOR_ID`

詳細は `AGENTS.md` の「デプロイ」セクションを参照。

PLT-811 post-fix preview probe at 2026-04-25T02:28:10+09:00
