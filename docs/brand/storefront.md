# Storefront editorial system

PR #77 extends the homepage direction to the remaining customer-facing routes.

## Design

- Ecru paper, deep brown ink, restrained serif headings and generous spacing.
- `PageShell` gives each non-home route one header, main landmark, skip link and footer. Its document, narrow, editorial and commerce variants share `storefront.module.css`.
- Editorial heroes separate photography from text. Body copy stays readable without image overlays. Images are illustrative, not a representation of the pickup venue or the products for sale.
- Dog imagery reuses `homeDogImages`: Shiba Inu, Siberian Husky and Saint Bernard. Sources and external-host considerations remain in `homepage.md`.
- Catalog and cart imagery comes only from the actual product API; missing/broken images show a neutral placeholder, never an invented substitute product.
- Product filters expose their selected state. Form labels, keyboard focus, scrollable size tables, purchase progress and responsive navigation are accessible without a pointer.
- A product cannot be added twice concurrently. Cart edits serialize while pending; transient loading failures preserve the cart identifier and offer retry. Server-priced totals remain authoritative.

## Scope and verification

Includes about, the three use-case pages, guides, pickup, FAQ/contact/legal, order help, catalog/detail/cart, checkout and order-status screens, the legacy QR thank-you route and error/404 presentation. The homepage keeps its existing design.

`playwright.home.config.ts` runs both home and storefront UI suites against the real static export. The storefront suite intercepts all commerce endpoints, fails closed for unhandled endpoints and uses explicitly labeled test products. No test creates a real order, sends a real coupon lookup or initiates a payment. Screenshots of commerce screens contain test products, not a claim about the live assortment.

The review workflow performs lint, existing unit tests, production build, artifact surface scans and browser tests. Record the actual run and results in the PR after completion; no production deployment or production E2E is implied.

## Content and remaining work

- Legal text and commercial policies are preserved, not revalidated as legal advice.
- The legacy `/thanks` promotion expiring June 30, 2026 was removed (including metadata); it is no longer advertised as active.
- Existing guide/pickup prose emphasizes store pickup and payment, whereas checkout offers delivery/online payment. Confirm operational policy separately before rewriting these terms; this design change does not enable or disable fulfillment/payment modes.
- The legacy QR `/thanks` page still emits its existing zero-value `purchase` analytics event on visit. That pre-existing measurement issue is outside this visual change and should be reviewed separately.
- Dependency audit alerts reported in the initial homepage review are not resolved by this PR. No dependencies, API contracts, credentials or deployment settings are changed.

## Review

Do not merge without owner review. Actual production E2E remains necessary after a separately authorized deployment.
