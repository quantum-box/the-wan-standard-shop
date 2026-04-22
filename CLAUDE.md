@AGENTS.md

## デプロイ

THE WAN STANDARD は **Tachyon Cloud App プラットフォームでデプロイされる**。

- GitHub Actions auto-deploy は **使わない** (削除済み / 削除予定)
- `CLOUDFLARE_API_TOKEN` 等の Cloudflare API クレデンシャルは **不要**
- Cloud App platform 経由で build / deploy が行われる
- Cloudflare Pages の手動 deploy も基本不要 (Cloud App が制御)

GitHub Actions workflow に Cloudflare deploy 系が残っている場合は削除対象。
具体的には `tachyon-apps/.github/workflows/tws-shop-cloudflare-deploy.yml` が削除候補。
