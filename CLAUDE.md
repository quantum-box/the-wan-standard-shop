# THE WAN STANDARD — Shop (agents guide)

<!-- BEGIN:nextjs-agent-rules -->
## This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

このリポジトリは **THE WAN STANDARD**（以下 TWS / 社内略称）オンラインショップの実装。bakuure API (storekit) のリファレンス実装でもある。

---

## プロダクト概要

- **ブランド**: THE WAN STANDARD（旧称 POWSON EC、2026-04-14 リブランド）
- **対象顧客**: バーナードスクエア（BSQ / バナスク）ドッグラン施設のサブスク会員
- **ソフトオープン**: 2026-04-26（土）
- **主導線**: 店舗受け取り（Pick Up / BOPIS）— 来店頻度・体験価値の向上が目的
- **会員特典**: チェックアウト時クーポンコード入力で 20% OFF
- **バナスク還元**: 対象売上の 10% を月次 CSV レポートで還元
- **本番 URL**: `https://thewanstandard.jp/shop`
- **ブランド構造**: THE WAN STANDARD(本体 EC) / wan selection(バナスクコラボライン)

---

## ブランド表記ルール(最重要 / CEO 2026-04-22 明示)

- **対外公開はすべて `THE WAN STANDARD`(全大文字フル表記)で統一**。`The Wan Standard`(mixed case)も対外 NG。
- **略称 `TWS` は対外露出で使用禁止**(SNS / EC 表示 / プレス / Zenn / note / IG アセット等すべて)。社内ドキュメント・リポジトリ名・issue タイトル等の内部利用は OK。
- **ハッシュタグ `#` 禁止**(SNS 投稿 X / Instagram / Threads 含む)。

---

## アーキ原則(CEO 2026-04-22 明示・絶対遵守)

- **TWS は bakuure とは完全独立のテナント**。bakuure API のマルチテナント機能で「TWS テナント」として動く。
- **bakuure-ui (apps/bakuure-ui) を TWS の shop に流用してはいけない**。`thewanstandard.jp/shop` と bakuure-ui は無関係。
- **TWS shop はこのリポジトリ(the-wan-standard-shop)で独立実装**する。CF Pages Functions で bakuure-ui に proxy してはいけない。build-time env(`NEXT_PUBLIC_TENANT_BRAND=tws` 等)で bakuure-ui を上書きするのも NG。
- bakuure 販売サイト(`bakuure.txcloud.app`)と TWS(`thewanstandard.jp`)は **同じ UI コードベースを共有しない**。
- アーキ判断前(新規 PR / 新 leader 起動)で「○○ アプリを別テナントに流用」案が出たら、必ず CEO 確認を入れる。

### 違反事例(2026-04-22 全 revert 済 / PR #2842)
- **v1**: CF Pages Functions で `thewanstandard.jp/shop` → bakuure-ui proxy → 設計違反で revert
- **v2**: `NEXT_PUBLIC_TENANT_BRAND=tws` build-time env で bakuure-ui を TWS branding 上書き → 設計違反(bakuure 販売サイト破壊リスク)で revert

---

## 技術スタック

- **フレームワーク**: Next.js 16.2.4(App Router, Static Export)
- **React**: 19.2.4
- **スタイル**: Tailwind CSS v4(TWS ブランドカラー適用)
- **言語**: TypeScript 5
- **デプロイ**: Tachyon Cloud App プラットフォーム(詳細は下記)
- **バックエンド**: bakuure API(TWS テナント)
- **Lint**: ESLint 9 + eslint-config-next

### ディレクトリ構成

```
src/
├── app/         # Next.js App Router ページ
├── components/  # UI コンポーネント
└── lib/         # storekit.ts(Field 公開ストアフロントの抽象レイヤー)
```

`src/lib/storekit.ts` は Field 公開ストアフロント(`/v1/public/storefront/{tenant_id}/…`)の抽象レイヤー。HTTP は `src/lib/storekit-client.ts` が担当し、wire 型は tachyonfield の `Public*` schema をなぞっている。

**ブラウザに Field の資格情報を出さない**。`/v1/graphql` と `/v1/storekit` は quarantine 済みか Bearer 必須で、未認証呼び出しの `x-operator-id` によるテナント選択も Field 側が拒否する。テナントは URL パスで渡す。`npm run scan:browser-surface` がビルド成果物を検査してこれを守る。

同じ contract から [field-sdk](https://github.com/quantum-box/field-sdk) が `@tachyon-sdk/field` を生成しているが、npm 未公開かつ package がサブディレクトリにあり npm の git dependency では入らないため、当面は上記の薄いクライアントを使う。npm に載ったら差し替える。

### 環境変数

ショップ動作に必須の環境変数は無い。API オリジンとテナント ID は静的出力へ確実に載せるため `src/lib/storekit-config.ts` の定数として持つ。

| 変数名 | 説明 |
|--------|------|
| `NEXT_PUBLIC_GA_MEASUREMENT_ID` | 任意。Google Analytics の Measurement ID |
| `NEXT_PUBLIC_LINE_URL` | 任意。`/thanks` で使う LINE URL |

### コマンド

```bash
npm install
cp .env.example .env.local   # 環境変数を設定
npm run dev                  # 開発サーバ
npm run build                # out/ に静的ファイル生成
npm run lint                 # ESLint
```

---

## デプロイ

THE WAN STANDARD は **Tachyon Cloud App プラットフォームでデプロイされる**。

- GitHub Actions auto-deploy は **使わない**(削除済み / 削除予定)
- `CLOUDFLARE_API_TOKEN` 等の Cloudflare API クレデンシャルは **不要**
- Cloud App platform 経由で build / deploy が行われる
- Cloudflare Pages の手動 deploy も基本不要(Cloud App が制御)

GitHub Actions workflow に Cloudflare deploy 系が残っている場合は削除対象。具体的には `tachyon-apps/.github/workflows/tws-shop-cloudflare-deploy.yml` が削除候補。

---

## Phase 1 機能(MVP / T+7 日)

### 顧客向けページ
- トップ
- 商品一覧 (`/shop`)
- 商品詳細 (`/shop/[id]`)
- カート (`/shop/cart`)
- チェックアウト (`/shop/checkout`)
- 注文完了
- 注文履歴
- 法務ページ

### 管理機能
- 商品・在庫・注文・クーポン・還元レポート(CSV)
- 期限切れ(7 日)自動キャンセル + 在庫戻し(バッチ)

---

## EC 仕様(bakuure commerce)

### 決済
- **MVP**: 店舗決済(`IN_STORE`)— EC 上は予約注文、受け取り完了で売上確定
- **Phase2**: オンライン決済(Square Web Payments)
- **通貨**: JPY

### 注文ステータス遷移
```
PLACED → READY → PICKED_UP(売上確定)
              ↘ CANCELED(7日期限超過で自動 / 在庫戻し)
PLACED → CANCELED
```

### クーポン(20% OFF)
- チェックアウト画面のみで入力 / 1 注文 1 クーポン / 再利用可(会員特典)
- 端数処理: 切り捨て / 管理画面から disabled 可
- レート制限付き API(ブルートフォース対策)

### バナスク還元(10%)
- 対象: バナスク専用クーポン適用注文の商品小計(税込・割引後、送料除外)
- 集計: 月次(期間指定可)＋ CSV 出力

### RBAC
| ロール | 操作範囲 |
|---|---|
| customer | 商品閲覧・カート・注文作成・注文履歴 |
| store | 受け取り管理(READY / PICKED_UP 更新) |
| admin | 商品・在庫・注文・クーポン・レポート全管理 |

### shop が使う公開ルート

`/v1/public/storefront/{tenant_id}` 配下。すべて無認証で、テナント単位のレート制限がかかる。

| エンドポイント | 説明 |
|---|---|
| `GET products` | 商品一覧(`orderable` を含む) |
| `GET products/{product_id}` | 商品詳細 |
| `GET categories` | カテゴリ一覧 |
| `POST carts` / `GET carts/{id}` / `POST carts/{id}/items` ほか | カート一式 |
| `POST carts/{cart_id}/coupon-preview` | クーポン提示(そのカートの算術のみ) |
| `POST checkout_sessions` | 注文作成(`coupon_code` を受ける。サーバ側金額再計算) |
| `POST orders/lookup` | 電話番号 + 注文番号下4桁 → 短命 lookup token |
| `GET orders/by-token/{lookup_token}` | token による注文再読み取り |

公開面の制約はそのまま UI の制約になる。

- **在庫**は `orderable` の1ビットだけ。残数・予約数・低在庫閾値は出ない。
- **クーポン**はカート識別子を持っている呼び出し側にしか問えない。応答はそのカートの小計・割引額・合計だけで、クーポン ID も割引種別も期限も返らない。存在しない・期限切れ・最低額未満はすべて同じ 404。
- **注文照会**は識別子では引けない。組違いも未使用の電話番号も同じ 404。`GET orders/{id}` は公開面の外。
- クーポン提示と注文照会は 20/min/tenant。明示的な操作でだけ発火させる。

店舗・管理系(`ready` / `pickup` / 還元レポート)は公開面には無い。Bearer を持つ運用画面の担当。

### セキュリティ(MVP)
- クーポン検証 API のレート制限(ブルートフォース対策)
- 注文作成はサーバ側金額確定(クライアント改ざん防止)
- 管理 / 店舗画面は RBAC 保護

### Phase2(MVP 後)
- オンライン決済(Square Web Payments)+ 返金 / キャンセルフロー
- 配送対応(送料計算・追跡・返品)
- 受け取り日時枠・通知強化
- レポートダッシュボード化、監査ログ強化
- 複数クーポン施策(併用ルール・回数制限)

### Phase1 実装状況(参考 / 2026-04 時点)

| Issue | 機能 | 状態 |
|---|---|---|
| PLT-537 | クーポン機能 | ✅ MERGED |
| PLT-538 | BOPIS(店舗受取) | 🔄 CI 修正中 |
| PLT-539 | 注文ステータス管理 | ✅ MERGED |
| PLT-540 | 期限切れ自動キャンセル | 🔄 CI 修正中 |
| PLT-541 | 還元レポート | 📋 Todo |
| PLT-542 | 店舗スタッフ画面 | ✅ MERGED |
| PLT-547 | テスト基盤 | ✅ MERGED |

最新状況は Linear および `~/knowledge/src/projects/tws-ec/overview.md` を参照。

---

## 本番コード変更ルール(最重要)

- **main ブランチへの直 push は絶対禁止**。必ず PR 経由で merge。
  - 違反例: 2026-04-18 別プロジェクトで PR なし push により本番破壊(307 リダイレクト + CSS 崩壊)
- **Done flip 前に本番 E2E 検証必須**: PR merge + CI green では Done にしない。
  1. 本番デプロイ完了を確認(Tachyon Cloud App build)
  2. 影響画面全部を Playwright or ブラウザ手動で E2E 実行
  3. CloudWatch / Sentry / ブラウザ console に新規 error が出ていないこと
  4. 関連 feature flag / env var の本番値が期待通り
- 本番 DML を伴う migration は COO / CEO 承認必須。

---

## リスク

- **クーポン漏洩**: disabled 即停止 / 適用ログ / レート制限で対策
- **オンライン決済**: MVP 導入は遅延要因 → Phase2 推奨
- **受け取りオペ**: 「検索→更新」のみでシンプルに保つ

---

## 関連リソース

### ナレッジベース(stock の正本 / kburl: `https://knowledge-intra.quantum-box.com/`)
- `~/knowledge/src/projects/tws-ec/overview.md` — プロジェクト全体像・実装状況
- `~/knowledge/src/projects/tws-ec/tws-brand-master.md` — ブランド正本
- `~/knowledge/src/projects/tws-ec/wan-selection-for-bernard-square-master.md` — コラボライン正本
- `~/knowledge/src/projects/tws-ec/gw-launch-infra.md` — 4/26 公開向けインフラ設計
- `~/knowledge/src/projects/tws-ec/launch-playbook.md` — ローンチ運用手順

### 関連リポジトリ
- bakuure API 本体: `github.com/quantum-box/tachyon-apps`
- 生成 SDK: `github.com/quantum-box/field-sdk`(`@tachyon-sdk/field` / npm 未公開)
