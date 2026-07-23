import { test, expect } from '@playwright/test'

test.describe('CMS content locale', () => {
  test('visiting /konstrukcje-stalowe with locale=en cookie shows title/description (EN translation or PL fallback), never empty', async ({ page, context }) => {
    await context.addCookies([
      { name: 'locale', value: 'en', domain: 'localhost', path: '/' },
    ])

    await page.goto('http://localhost:3000/konstrukcje-stalowe')

    const heading = page.locator('h1').first()
    await expect(heading).not.toBeEmpty()

    const description = page.locator('header p').first()
    await expect(description).not.toBeEmpty()
  })
})
