# Homepage art direction

## Scope

2026-09-05: refine `/` around quiet editorial typography, warm paper, dark brown,
clear shopping paths and Shiba Inu / Siberian Husky / Saint Bernard imagery.
Keep THE WAN STANDARD in full capitals and reuse the official brand lockup.

The homepage has its own scoped CSS and header; shared navigation, product pages,
cart, checkout, storefront API and deployment settings are unchanged. The old
homepage's 300vh scroll-driven scene component and mock-price product grid are no
longer rendered on `/`. Their component files are left intact for other callers.
Guide cards use brand imagery, not invented products, prices, stock or sizing
claims. Store pickup remains the primary fulfillment story.

## Image provenance

All photographs are editorial mood imagery, not representations of a product for
sale, an endorsement, or a claim about a photographed dog's identity.

| Placement | Asset / source | Credit |
| --- | --- | --- |
| Hero / Shiba Inu | Existing `public/assets/tws-hero/tws-hero-grok-2-shiba-goldenhour.jpeg` | Existing repository asset; unchanged |
| Siberian Husky | https://unsplash.com/photos/siberian-husky-dog-lying-on-brown-floor-3kH6J3oFfbA | Regular Man / Unsplash |
| Saint Bernard | https://unsplash.com/photos/brown-and-white-saint-bernard-rAU1LXDvN_M | Vlad Rudkov / Unsplash |
| Guide cards | Existing natural-light, ceramic-bowl and texture-collection images | Existing repository assets; unchanged |

The two Unsplash photos are published under the free Unsplash License:
https://unsplash.com/license (checked 2026-09-05). The photo page titles identify
the breeds. No Unsplash+ / Getty / scraped search thumbnails are used.

External image URLs are centralized in `src/lib/homepage-content.ts`. They request
at most 1200px width with automatic format selection and quality 80. They use
native lazy loading and `referrerPolicy="no-referrer"`; only the local Shiba hero
is preloaded. External requests still depend on Unsplash availability and expose
the visitor's IP address to that host. Replace these with licensed, self-hosted
brand photography when available; preserve the credit and update the image alt
text to match the replacement. Source licensing does not establish endorsement.

## Review

```sh
npm ci
npm run lint
npm run build
npx playwright install chromium
npx playwright test --config playwright.home.config.ts
```

The UI suite serves the actual `out/` static export on localhost using Python 3.
It checks links, keyboard skip navigation, the three dog image loads, reduced
motion, and horizontal overflow at 320 / 390 / 600 / 768 / 1024 / 1440px. Full-page
390px and 1440px screenshots are attached to the Playwright report. Remote image
checks intentionally fail if the images do not load; they are not mocked.

The PR-only `Homepage review` workflow runs lint, the existing build/test/security
scan pipeline, then these UI tests and uploads the reports. It has read-only
repository permissions, no secrets and no deployment step. Review the actual
screenshots for breed identity and cropping before merge. A passing image load
assertion alone is not a visual breed check. A PR/CI pass is not production E2E;
production verification still follows AGENTS.md after an authorized merge/deploy.
