import { test, expect, Page } from "@playwright/test";
import * as fs from "fs";
import * as path from "path";

const BASE_URL = "https://thewanstandard.jp";
const API_HOST = "bakuure.api.n1.tachy.one";
const MOCK_OOS_PRODUCT_ID = "pd_01kpx25jdx1z5h7y38s7h83a35";

const EVIDENCE_DIR = path.resolve(__dirname, "../evidence");
const SCREENSHOT_DIR = path.join(EVIDENCE_DIR, "screenshots");
const LOG_DIR = path.join(EVIDENCE_DIR, "logs");

for (const d of [SCREENSHOT_DIR, LOG_DIR]) {
  fs.mkdirSync(d, { recursive: true });
}

interface ConsoleEntry {
  type: string;
  text: string;
  url: string;
}

function captureConsole(page: Page, sink: ConsoleEntry[]) {
  page.on("console", (msg) => {
    sink.push({
      type: msg.type(),
      text: msg.text(),
      url: page.url(),
    });
  });
  page.on("pageerror", (err) => {
    sink.push({
      type: "pageerror",
      text: `${err.name}: ${err.message}`,
      url: page.url(),
    });
  });
  page.on("requestfailed", (req) => {
    const errText = req.failure()?.errorText ?? "unknown";
    // net::ERR_ABORTED fires for in-flight requests that the browser cancels when
    // navigation starts (Next.js <Link> HEAD prefetch, Cloudflare RUM beacon,
    // client-side GraphQL calls that race the next page). Not a real failure.
    if (errText === "net::ERR_ABORTED") return;
    sink.push({
      type: "requestfailed",
      text: `${req.method()} ${req.url()} -> ${errText}`,
      url: page.url(),
    });
  });
}

async function installOosMock(page: Page) {
  await page.route(`https://${API_HOST}/v1/graphql`, async (route) => {
    const req = route.request();
    let body: Record<string, unknown> = {};
    try {
      body = req.postDataJSON();
    } catch {
      return route.continue();
    }
    const query = typeof body.query === "string" ? body.query : "";
    const variables = (body.variables ?? {}) as Record<string, unknown>;

    if (query.includes("productStock(productId:") && variables.productId === MOCK_OOS_PRODUCT_ID) {
      const upstream = await route.fetch();
      const json = (await upstream.json()) as {
        data?: { productStock?: { quantityAvailable?: number; trackInventory?: boolean } };
      };
      if (json.data?.productStock) {
        json.data.productStock.quantityAvailable = 0;
        json.data.productStock.trackInventory = true;
      } else {
        json.data = {
          productStock: { quantityAvailable: 0, trackInventory: true },
        };
      }
      return route.fulfill({
        response: upstream,
        contentType: "application/json",
        body: JSON.stringify(json),
      });
    }
    return route.continue();
  });
}

test.describe("PET-740 mock E2E — quantityAvailable=0 injected for pd_01kpx25jdx1z5h7y38s7h83a35", () => {
  test("(1) listing shows 在庫切れ overlay badge on injected product", async ({ page }) => {
    const logs: ConsoleEntry[] = [];
    captureConsole(page, logs);
    await installOosMock(page);

    await page.goto(`${BASE_URL}/shop/`, { waitUntil: "networkidle" });
    await expect(page.getByText("読み込み中...")).toHaveCount(0, { timeout: 15000 });

    const targetCard = page.locator(`a[href="/shop/${MOCK_OOS_PRODUCT_ID}/"]`);
    await expect(targetCard).toBeVisible();

    const overlay = targetCard.locator("text=在庫切れ");
    await expect(overlay).toBeVisible();

    const cards = page.locator('a[href^="/shop/pd_"]');
    const total = await cards.count();
    let oosCount = 0;
    for (let i = 0; i < total; i++) {
      const c = cards.nth(i);
      if ((await c.locator("text=在庫切れ").count()) > 0) oosCount++;
    }
    expect(oosCount).toBe(1);

    await page.screenshot({
      path: path.join(SCREENSHOT_DIR, "01-listing-oos-overlay.png"),
      fullPage: true,
    });
    fs.writeFileSync(path.join(LOG_DIR, "01-listing-console.json"), JSON.stringify(logs, null, 2));

    const errors = logs.filter((l) => l.type === "error" || l.type === "pageerror" || l.type === "requestfailed");
    expect(errors).toEqual([]);
  });

  test("(2) detail of injected product: badge + add-to-cart disabled + quantity select disabled", async ({ page }) => {
    const logs: ConsoleEntry[] = [];
    captureConsole(page, logs);
    await installOosMock(page);

    await page.goto(`${BASE_URL}/shop/${MOCK_OOS_PRODUCT_ID}/`, { waitUntil: "networkidle" });
    await expect(page.getByText("読み込み中...")).toHaveCount(0, { timeout: 15000 });

    await expect(page.getByText("在庫切れ", { exact: true }).first()).toBeVisible();

    const addButton = page.getByRole("button", { name: /在庫切れ|カートに追加|追加中/ });
    await expect(addButton).toBeDisabled();
    await expect(addButton).toHaveText(/在庫切れ/);

    const quantitySelect = page.locator("select");
    await expect(quantitySelect).toBeDisabled();

    let cartAddFired = false;
    page.on("request", (req) => {
      if (req.url().includes("/v1/graphql") && req.method() === "POST") {
        const d = req.postData() ?? "";
        if (d.includes("addCartItem")) cartAddFired = true;
      }
    });

    await addButton.click({ force: true, trial: true }).catch(() => undefined);

    await page.screenshot({
      path: path.join(SCREENSHOT_DIR, "02-detail-oos-disabled.png"),
      fullPage: true,
    });
    fs.writeFileSync(path.join(LOG_DIR, "02-detail-console.json"), JSON.stringify(logs, null, 2));

    expect(cartAddFired).toBe(false);

    const errors = logs.filter((l) => l.type === "error" || l.type === "pageerror" || l.type === "requestfailed");
    expect(errors).toEqual([]);
  });

  test("(3) in-stock regression — detail → cart → checkout flow works", async ({ page }) => {
    const logs: ConsoleEntry[] = [];
    captureConsole(page, logs);

    await page.goto(`${BASE_URL}/shop/`, { waitUntil: "networkidle" });
    await expect(page.getByText("読み込み中...")).toHaveCount(0, { timeout: 15000 });

    const cards = page.locator('a[href^="/shop/pd_"]');
    await expect(cards.first()).toBeVisible({ timeout: 15000 });
    const total = await cards.count();
    expect(total).toBeGreaterThan(0);

    let chosenHref: string | null = null;
    for (let i = 0; i < total; i++) {
      const c = cards.nth(i);
      const href = await c.getAttribute("href");
      if (!href) continue;
      if (href.includes(MOCK_OOS_PRODUCT_ID)) continue;
      chosenHref = href;
      break;
    }
    expect(chosenHref).not.toBeNull();

    await page.goto(`${BASE_URL}${chosenHref}`, { waitUntil: "networkidle" });
    await expect(page.getByText("読み込み中...")).toHaveCount(0, { timeout: 15000 });

    await expect(page.getByText("在庫切れ", { exact: true })).toHaveCount(0);
    const addButton = page.getByRole("button", { name: /カートに追加/ });
    await expect(addButton).toBeEnabled();

    const optionCount = await page.locator("select option").count();
    expect(optionCount).toBeGreaterThanOrEqual(1);
    expect(optionCount).toBeLessThanOrEqual(10);

    await page.screenshot({
      path: path.join(SCREENSHOT_DIR, "03a-detail-in-stock.png"),
      fullPage: true,
    });

    await Promise.all([
      page.waitForURL(/\/shop\/cart\/?$/, { timeout: 30000, waitUntil: "domcontentloaded" }),
      addButton.click(),
    ]);

    // Wait for cart page to finish loading (getCart mutation resolved).
    await expect(page.getByText("読み込み中...")).toHaveCount(0, { timeout: 30000 });
    // Cart must not be empty — empty state would show カートは空です.
    await expect(page.getByText("カートは空です")).toHaveCount(0);
    // Assert at least one item rendered by presence of the checkout CTA
    // which only renders when cart.items.length > 0.
    const checkoutButton = page.getByRole("button", { name: /レジに進む/ });
    await expect(checkoutButton).toBeVisible({ timeout: 15000 });
    // Assert total price row rendered.
    await expect(page.getByText("合計", { exact: true })).toBeVisible();

    await page.screenshot({
      path: path.join(SCREENSHOT_DIR, "03b-cart-after-add.png"),
      fullPage: true,
    });

    await Promise.all([
      page.waitForURL(/\/shop\/checkout\/?$/, { timeout: 30000, waitUntil: "domcontentloaded" }),
      checkoutButton.click(),
    ]);
    await expect(page.getByText("読み込み中...")).toHaveCount(0, { timeout: 30000 });
    await page.screenshot({
      path: path.join(SCREENSHOT_DIR, "03c-checkout-landed.png"),
      fullPage: true,
    });

    fs.writeFileSync(path.join(LOG_DIR, "03-regression-console.json"), JSON.stringify(logs, null, 2));

    const errors = logs.filter((l) => l.type === "error" || l.type === "pageerror" || l.type === "requestfailed");
    expect(errors).toEqual([]);
  });
});
