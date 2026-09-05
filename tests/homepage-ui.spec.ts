import { expect, test } from '@playwright/test'

const widths = [320, 390, 600, 768, 1024, 1440]

test('homepage has clear landmarks, working guide links and keyboard access', async ({ page, request }) => {
  const errors: string[] = []
  page.on('pageerror', (error) => errors.push(error.message))
  await page.goto('/')
  await expect(page.getByRole('main')).toHaveCount(1)
  await expect(page.getByRole('heading', { level: 1 })).toHaveText('愛犬のための、新しい基準。')
  await expect(page.getByRole('link', { name: '一椀を探す', exact: true })).toHaveAttribute('href', /^\/shop\/?$/)
  await expect(page.getByRole('navigation', { name: 'メインナビゲーション' })).toBeVisible()
  await expect(page.getByRole('link', { name: 'カートを見る', exact: true })).toBeVisible()

  // Resolve all home links against the real exported routes, without submitting anything.
  const paths = await page.locator('a[href^="/"]').evaluateAll((anchors) =>
    [...new Set(anchors.map((anchor) => anchor.getAttribute('href')!))],
  )
  for (const path of paths) {
    const response = await request.get(path)
    expect(response.ok(), `${path} should resolve`).toBeTruthy()
  }

  await page.keyboard.press('Tab')
  await expect(page.getByRole('link', { name: '本文へスキップ' })).toBeFocused()
  await page.keyboard.press('Enter')
  await expect(page.getByRole('main')).toBeFocused()
  await expect(page.getByRole('main')).not.toContainText(/¥[\d,]+|Concept \d|コンセプト表示/)
  expect(errors).toEqual([])
})

for (const width of widths) {
  test(`homepage fits a ${width}px viewport`, async ({ page }, testInfo) => {
    await page.setViewportSize({ width, height: 900 })
    await page.goto('/')
    await page.evaluate(() => document.fonts.ready)
    await expect(page.getByRole('heading', { level: 1 })).toBeVisible()
    const dimensions = await page.evaluate(() => ({
      pageWidth: document.documentElement.scrollWidth,
      viewportWidth: document.documentElement.clientWidth,
    }))
    expect(dimensions.pageWidth).toBeLessThanOrEqual(dimensions.viewportWidth + 1)

    if (width === 390 || width === 1440) {
      // Scroll each image into view so native lazy loading runs before capture.
      for (const image of await page.locator('main img').all()) {
        await image.scrollIntoViewIfNeeded()
        await expect(image).toHaveJSProperty('complete', true)
        await expect.poll(() => image.evaluate((node) => (node as HTMLImageElement).naturalWidth)).toBeGreaterThan(0)
      }
      await page.evaluate(() => window.scrollTo(0, 0))
      await testInfo.attach(`homepage-${width}`, {
        body: await page.screenshot({ fullPage: true }),
        contentType: 'image/png',
      })
    }
  })
}

test('the three requested breeds load and reduced motion disables image transitions', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'reduce' })
  await page.goto('/')
  const dogs = page.locator('img[data-breed]')
  await expect(dogs).toHaveCount(3)
  for (const breed of ['柴犬', 'ハスキー', 'セントバーナード']) {
    const image = page.locator(`img[data-breed="${breed}"]`)
    await image.scrollIntoViewIfNeeded()
    await expect(image).toBeVisible()
    await expect(image).toHaveAttribute('alt', /.+/)
    await expect.poll(() => image.evaluate((node) => (node as HTMLImageElement).naturalWidth)).toBeGreaterThan(0)
  }
  const guideImage = page.getByRole('link', { name: /はじめての一椀/ }).locator('img')
  await expect(guideImage).toHaveCSS('transition-duration', '0s')
})
