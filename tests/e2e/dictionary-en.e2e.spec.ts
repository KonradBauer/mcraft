import { test, expect } from '@playwright/test'

const PAGES = ['/', '/nadzor-spawalniczy', '/konstrukcje-stalowe', '/meble-premium']

test.describe('Static UI text in EN mode', () => {
  for (const path of PAGES) {
    test(`${path} shows English nav/footer chrome with locale=en cookie`, async ({ page, context }) => {
      await context.addCookies([{ name: 'locale', value: 'en', domain: 'localhost', path: '/' }])
      await page.goto(`http://localhost:3000${path}`)

      await expect(page.locator('html')).toHaveAttribute('lang', 'en')
      await expect(page.getByText('Get in touch').first()).toBeVisible()
      await expect(page.getByText('Privacy policy')).toBeVisible()
      await expect(page.getByText('All rights reserved.')).toBeVisible()
    })
  }

  test('mobile nav aria-labels are in English with locale=en cookie', async ({ page, context }) => {
    await context.addCookies([{ name: 'locale', value: 'en', domain: 'localhost', path: '/' }])
    await page.setViewportSize({ width: 375, height: 812 })
    await page.goto('http://localhost:3000')

    await page.getByRole('button', { name: 'Open menu' }).click()
    await expect(page.getByRole('dialog', { name: 'Navigation menu' })).toBeVisible()
    await expect(page.getByRole('button', { name: 'Close menu' })).toBeVisible()
  })
})
