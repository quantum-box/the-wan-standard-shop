# PET-739 — /my-orders 404 暫定対応

- **Linear**: PET-739
- **Priority**: Urgent
- **Due**: 2026-04-25 夕
- **Branch**: `feature/pet-739-myorders-workaround`
- **Worktree**: `~/the-wan-standard-shop.pet-739`
- **Owner**: leader-pet739
- **Reports to**: PdM-Pet (tmux `work:pdm-pet`)

## 背景

`/my-orders` ルートは未実装。直リンク等で到達すると 404 になるが、本体実装は Phase2 送り。
4/26 ソフトオープンまでに 404 露出を抑え、注文履歴／受取問い合わせの導線を「店舗直電」に寄せる暫定対応。

PLT-824（注文確認メール）も未実装のため、**メール案内は明記禁止**。電話のみに限定する。

## スコープ

1. ヘッダー／フッター／ナビ／サイドバー全箇所から `/my-orders` リンク削除
2. `/my-orders` ルート本体は放置（404 のまま）
3. `/shop/checkout/thanks` 等の thanks ページに以下を表示
   - 「注文履歴・受取に関するお問い合わせは店舗までお電話ください」notice
   - 店舗直電電話番号（PdM-Pet → COO → CEO 確認値）
   - 営業時間（同上）
4. PR → CI green → admin merge → 本番反映 → Playwright で E2E
   - `/shop/checkout/thanks` に notice + TEL + 営業時間が表示されること
   - 既存の `/my-orders` リンクが残っていないこと

## 監査結果（初回）

- `grep -rn -i my-orders src docs public` → **該当なし**
- `grep -rn -i 注文履歴` → **該当なし**
- `src/components/Nav.tsx` — Top / About / Shop のみ
- `src/components/ui/Header.tsx` — ホーム / ショップ / カート のみ
- `src/components/ui/Footer.tsx` — 特定商取引法 / プライバシーポリシー のみ

→ スコープ (1) のリンク削除対象は存在せず。no-op。PR description で明示する。

## 確認メール問題（スコープ 3 で回収）

- `src/app/shop/checkout/thanks/page.tsx:13` に `確認メールをお送りします。しばらくお待ちください。` あり
- PLT-824 未実装のため削除し、phone-only 文言に差し替える

## PdM-Pet 依頼事項

- 店舗直電電話番号
- 営業時間表記

値確定までは placeholder `TEL_TBD` / `HOURS_TBD` で実装継続。CI green まで進め、値 return 後に swap commit。

## 制約

- `apps/bakuure-ui` 配下は触らない
- `repo = the-wan-standard-shop` 単独
- bakuure-ui 流用禁止ルール遵守
- `main` 直 push 禁止。PR 経由のみ

## 完了条件

- PR merged
- Tachyon Cloud App で本番デプロイ完了
- Playwright E2E で
  - `/shop/checkout/thanks` の phone notice 確認
  - ヘッダー／フッター／ナビの `/my-orders` リンク不在確認
- CloudWatch / Sentry / console に新規エラー無し
- PdM-Pet へ完了報告

## 後始末

- 完了後 `tmux kill-window -t work:$(tmux display-message -p '#W')`
- **`work:0` / `coo:0` は絶対 kill しない**
