import { expect, test, type Page, type TestInfo } from '@playwright/test'

const productId = 'pd_01kpx25jdxawpstd6mtt8f2bhd'
const secondId = 'pd_01kpx25jdx9jdjqp1zszbrtff8'
const photo = '/assets/tws-hero/tws-hero-grok-1-overhead-ceramic-bowl.jpeg'
const products = [
  { id: productId, name: 'テスト商品・陶器の一椀', description: '画面検証専用の商品です。販売商品ではありません。', price: 4800, imageUrl: photo, orderable: true, category: 'ceramic' },
  { id: secondId, name: 'テスト商品・深い一椀', description: '画面検証専用の在庫切れ商品です。', price: 6200, imageUrl: null, orderable: false, category: 'deep' },
]
const categories = [{ id: 'ceramic', name: '陶器', slug: 'ceramic', sort_order: 1 }, { id: 'deep', name: '深型', slug: 'deep', sort_order: 2 }]

/** Every commerce request is intercepted. Unhandled endpoints fail closed. */
async function storefront(page: Page, withCart = false) {
  const state = { quantity: 1, failCart: false, failProducts: false, empty: false, soldOut: false, lookupStatus: 404, calls: [] as string[] }
  if (withCart) await page.addInitScript(() => localStorage.setItem('tws_cart_id', 'review-cart'))
  const cart = () => ({ id: 'review-cart', status: 'open', items: state.quantity ? [{ id: 'review-item', product_id: productId, quantity: state.quantity, unit_price_nanodollar: 4800e9, subtotal_nanodollar: state.quantity * 4800e9 }] : [], subtotal_nanodollar: state.quantity * 4800e9, created_at: '2026-09-05T00:00:00Z', updated_at: '2026-09-05T00:00:00Z' })
  await page.route(/\/api\/storefront\/|\/v1\/public\/storefront\//, async (route) => {
    const request = route.request()
    const path = new URL(request.url()).pathname
    const method = request.method()
    state.calls.push(`${method} ${path}`)
    const json = (body: unknown, status = 200) => route.fulfill({ status, json: body })
    if (path === '/api/storefront/products') return json(state.failProducts ? { error: 'review outage' } : { products: state.empty ? [] : products }, state.failProducts ? 503 : 200)
    if (path.endsWith('/categories')) return json(categories)
    if (path.includes('/products/')) {
      const product = products.find((item) => path.endsWith(item.id))
      if (!product) return json({}, 404)
      return json({ id: product.id, name: product.name, description: product.description, list_price: product.price, image_ids: product.imageUrl ? [`http://127.0.0.1:4173${photo}`] : [], orderable: state.soldOut ? false : product.orderable, category_id: product.category, kind: 'physical', billing_cycle: 'one_time' })
    }
    if (path.endsWith('/orders/lookup')) return json({ message: 'review response' }, state.lookupStatus)
    if (path.endsWith('/coupon-preview')) return json({ code: 'REVIEW', subtotal_nanodollar: 4800e9, discount_nanodollar: 960e9, total_nanodollar: 3840e9 })
    if (path.endsWith('/carts') && method === 'POST') { state.quantity = 0; return json(cart()) }
    if (path.endsWith('/items/review-item')) {
      state.quantity = method === 'DELETE' ? 0 : request.postDataJSON().quantity
      return json(method === 'DELETE' ? { ok: true } : cart())
    }
    if (path.endsWith('/items') && method === 'POST') { state.quantity = request.postDataJSON().quantity; return json(cart()) }
    if (path.endsWith('/carts/review-cart')) return json(state.failCart ? {} : cart(), state.failCart ? 503 : 200)
    // Never create orders or initiate real payments, even accidentally.
    return route.abort('blockedbyclient')
  })
  return state
}

async function noOverflow(page: Page) {
  const size = await page.evaluate(() => ({ content: document.documentElement.scrollWidth, viewport: document.documentElement.clientWidth }))
  expect(size.content, page.url()).toBeLessThanOrEqual(size.viewport + 1)
}

async function capture(page: Page, info: TestInfo, name: string) {
  await page.evaluate(() => document.fonts.ready)
  for (const image of await page.locator('main img').all()) {
    await image.scrollIntoViewIfNeeded()
    await expect.poll(() => image.evaluate((node) => (node as HTMLImageElement).naturalWidth)).toBeGreaterThan(0)
  }
  await page.evaluate(() => window.scrollTo(0, 0))
  await noOverflow(page)
  await info.attach(name, { body: await page.screenshot({ fullPage: true }), contentType: 'image/png' })
}

const routes = ['/about', '/contact', '/faq', '/guide', '/guide/cancel', '/guide/gift', '/guide/receipt', '/guide/size', '/legal/commercial-transactions', '/legal/privacy', '/legal/terms', '/my-orders', '/pickup', '/use/first-bowl', '/use/everyday', '/use/gift', '/shop', `/shop/${productId}`, '/shop/cart', '/shop/checkout', '/shop/checkout/confirm', '/shop/checkout/payment', '/shop/checkout/thanks', '/shop/orders/lookup', '/shop/orders/detail', '/shop/orders/delivery', '/thanks', '/404.html']
for (const width of [320, 390, 768, 1440]) {
  test(`all storefront routes fit ${width}px and preserve landmarks`, async ({ page }) => {
    test.setTimeout(180_000)
    await storefront(page)
    await page.setViewportSize({ width, height: 900 })
    const errors: string[] = []
    page.on('pageerror', (error) => errors.push(error.message))
    for (const path of routes) {
      await page.goto(path)
      await expect(page.getByRole('main')).toHaveCount(1)
      await expect(page.getByRole('banner')).toHaveCount(1)
      await expect(page.getByRole('contentinfo')).toHaveCount(1)
      await expect(page.getByRole('heading', { level: 1 })).toHaveCount(1)
      await expect(page.getByRole('banner')).toContainText('THE WAN STANDARD')
      if (path === '/shop') await expect(page.getByRole('heading', { name: products[0].name })).toBeVisible()
      if (path === `/shop/${productId}`) await expect(page.getByRole('heading', { level: 1 })).toHaveText(products[0].name)
      await page.evaluate(() => document.fonts.ready)
      await noOverflow(page)
    }
    expect(errors).toEqual([])
  })
}

for (const width of [390, 1440]) {
  test(`editorial and commerce screenshots at ${width}px`, async ({ page }, info) => {
    test.setTimeout(180_000)
    await storefront(page, true)
    await page.setViewportSize({ width, height: 900 })
    for (const path of ['/about', '/guide/size', '/pickup', '/faq', '/shop', `/shop/${productId}`, '/shop/cart', '/shop/checkout']) {
      await page.goto(path)
      if (path === '/shop') await expect(page.getByRole('heading', { name: products[0].name })).toBeVisible()
      if (path === `/shop/${productId}`) await expect(page.getByRole('heading', { level: 1 })).toHaveText(products[0].name)
      if (path === '/shop/cart') await expect(page.getByRole('button', { name: 'レジに進む' })).toBeVisible()
      await capture(page, info, `${path.replaceAll('/', '-').slice(1)}-${width}`)
    }
  })
}

test('keyboard access, FAQ and scrollable size table', async ({ page }) => {
  await storefront(page)
  await page.goto('/faq')
  await page.keyboard.press('Tab')
  await expect(page.getByRole('link', { name: '本文へスキップ' })).toBeFocused()
  await page.keyboard.press('Enter')
  await expect(page.getByRole('main')).toBeFocused()
  const question = page.locator('summary').first()
  await question.focus()
  await page.keyboard.press('Enter')
  await expect(page.locator('details').first()).toHaveAttribute('open', '')
  await page.setViewportSize({ width: 320, height: 900 })
  await page.goto('/guide/size')
  await expect(page.getByRole('region', { name: /サイズ/ })).toHaveAttribute('tabindex', '0')
  await noOverflow(page)
})

test('catalog search, categories, empty results and image fallback', async ({ page }) => {
  await storefront(page)
  await page.goto('/shop?category=deep')
  await expect(page.getByRole('button', { name: '深型', exact: true })).toHaveAttribute('aria-pressed', 'true')
  await expect(page.getByRole('heading', { name: products[1].name })).toBeVisible()
  await expect(page.getByText('商品画像準備中')).toBeVisible()
  await page.getByRole('button', { name: 'すべて', exact: true }).click()
  await page.getByLabel('商品を検索').fill('存在しない商品')
  await expect(page.getByRole('heading', { name: '条件に一致する商品はありませんでした。' })).toBeVisible()
  await page.getByRole('button', { name: 'すべての商品を見る' }).click()
  await expect(page.getByRole('status')).toHaveText('2件の商品')
})

test('catalog error retries and empty state is not an error', async ({ page }) => {
  const api = await storefront(page)
  api.failProducts = true
  await page.goto('/shop')
  await expect(page.getByRole('alert')).toContainText('読み込めませんでした')
  api.failProducts = false
  api.empty = true
  await page.getByRole('button', { name: '再読み込み' }).click()
  await expect(page.getByRole('heading', { name: '現在、購入できる商品はありません。' })).toBeVisible()
})

test('product quantity, add, cart update and removal use only mocked APIs', async ({ page }) => {
  const api = await storefront(page)
  await page.goto(`/shop/${productId}`)
  await page.getByLabel('数量', { exact: true }).selectOption('2')
  await page.getByRole('button', { name: 'カートに追加', exact: true }).click()
  await expect(page).toHaveURL(/\/shop\/cart\/?$/)
  await expect(page.getByRole('complementary')).toContainText('¥9,600')
  await page.getByLabel(`${products[0].name}の数量`).selectOption('3')
  await expect(page.getByRole('complementary')).toContainText('¥14,400')
  await page.getByRole('button', { name: `${products[0].name}を削除` }).click()
  await expect(page.getByRole('heading', { name: 'カートは空です。' })).toBeVisible()
  expect(api.calls.some((call) => call.startsWith('DELETE'))).toBeTruthy()
  expect(api.calls.some((call) => call.includes('checkout_sessions'))).toBeFalsy()
})

test('cart preserves its identifier on outage; unavailable items block checkout', async ({ page }) => {
  const api = await storefront(page, true)
  api.failCart = true
  await page.goto('/shop/cart')
  await expect(page.getByRole('alert')).toContainText('カートを読み込めませんでした')
  expect(await page.evaluate(() => localStorage.getItem('tws_cart_id'))).toBe('review-cart')
  api.failCart = false
  api.soldOut = true
  await page.getByRole('button', { name: '再読み込み' }).click()
  await expect(page.getByRole('button', { name: 'レジに進む' })).toBeDisabled()
  await expect(page.getByRole('alert')).toContainText('在庫切れの商品')
})

test('checkout labels, fulfillment, explicit coupon and confirmation retain behavior', async ({ page }, info) => {
  const api = await storefront(page, true)
  await page.goto('/shop/checkout')
  await expect(page.getByRole('navigation', { name: 'お買い物の進み方' }).locator('[aria-current=step]')).toContainText('ご入力')
  await page.getByLabel('お名前 *', { exact: true }).fill('画面検証')
  await page.getByLabel('電話番号 *', { exact: true }).fill('09000000000')
  await page.getByRole('radio', { name: /配送/ }).locator('..').click()
  await expect(page.getByLabel('郵便番号 *', { exact: true })).toBeRequired()
  await expect(page.getByLabel('メールアドレス *', { exact: true })).toBeRequired()
  await page.getByRole('radio', { name: /店舗受け取り/ }).locator('..').click()
  await page.getByLabel('クーポンコード', { exact: true }).fill('REVIEW')
  expect(api.calls.filter((call) => call.includes('coupon-preview'))).toHaveLength(0)
  await page.getByRole('button', { name: '適用する', exact: true }).click()
  await expect(page.getByText('¥3,840', { exact: true })).toBeVisible()
  await page.getByRole('button', { name: '注文内容を確認する', exact: true }).click()
  await expect(page).toHaveURL(/\/shop\/checkout\/confirm\/?$/)
  await expect(page.getByRole('main')).toContainText('画面検証')
  await capture(page, info, 'checkout-confirm-fixture')
  expect(api.calls.some((call) => call.includes('checkout_sessions'))).toBeFalsy()
})

test('lookup only submits explicitly, with non-disclosing errors and rate limiting', async ({ page }) => {
  const api = await storefront(page)
  await page.goto('/shop/orders/lookup')
  await page.getByLabel('電話番号', { exact: true }).fill('09000000000')
  await page.getByLabel('注文番号の下4桁', { exact: true }).fill('TEST')
  expect(api.calls.filter((call) => call.includes('orders/lookup'))).toHaveLength(0)
  await page.getByRole('button', { name: '注文を確認する', exact: true }).click()
  await expect(page.getByRole('alert')).toContainText('該当する注文が見つかりませんでした')
  api.lookupStatus = 429
  await page.getByRole('button', { name: '注文を確認する', exact: true }).click()
  await expect(page.getByRole('alert')).toContainText('混み合っています')
})

test('lifestyle dog images use the approved breeds; receipt-free thanks is neutral', async ({ page }) => {
  await storefront(page)
  await page.emulateMedia({ reducedMotion: 'reduce' })
  await page.goto('/about')
  const breeds = await page.locator('img[data-breed]').evaluateAll((images) => images.map((image) => image.getAttribute('data-breed')))
  expect([...new Set(breeds)].sort()).toEqual(['柴犬', 'ハスキー', 'セントバーナード'].sort())
  await page.goto('/shop/checkout/thanks')
  await expect(page.getByRole('heading', { level: 1 })).toHaveText('ご注文の確認')
  await page.goto('/thanks')
  await expect(page.getByRole('main')).not.toContainText(/5%OFF|2026年6月30日/)
})
