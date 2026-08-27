# THE WAN STANDARD icon

更新日: 2026-08-26

## Status

2026-08-26 に、椀を正面やや上方から見た透過アイコンを一旦の正式版として採用した。
対外表記が必要な場合は、略称を使わず `THE WAN STANDARD` と表記する。

## Canonical assets

| File | Role |
|---|---|
| `public/assets/tws-icons/tws-icon-official-master.png` | 採用した生成画像の原本。1536 x 1024、RGBA |
| `public/assets/tws-icons/tws-icon-official-square.png` | 円形クロップと小サイズ表示向けの正方形透過版。1024 x 1024、RGBA |
| `src/app/icon.png` | Next.js app icon。512 x 512、透過 PNG |
| `src/app/apple-icon.png` | Apple touch icon。180 x 180、生成り背景 PNG |
| `src/app/favicon.ico` | ブラウザタブ用 favicon。32 x 32 |

## Usage

- 小サイズでは細かい陶器テクスチャに依存せず、椀の輪郭と内側の開口部を優先する。
- 通常のWebアイコンには正方形透過版を使う。
- 背景を制御できないApple touch iconでは、ブランドカラーの生成り `#F5EFE6` を敷く。
- 新しいアイコンへ更新するときは、canonical masterと各Next.js派生を同じ変更で更新する。
