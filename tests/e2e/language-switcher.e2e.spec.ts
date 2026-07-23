import { test, expect } from '@playwright/test'

test.describe('LanguageSwitcher', () => {
  test('switching to EN does not change the URL and updates <html lang>', async ({ page }) => {
    await page.goto('http://localhost:3000')
    const url = page.url()

    await page.getByRole('button', { name: 'PL', exact: true }).first().click()
    await page.getByRole('button', { name: 'EN', exact: true }).click()

    await expect(page).toHaveURL(url)
    await expect(page.locator('html')).toHaveAttribute('lang', 'en')

    const cookies = await page.context().cookies()
    const localeCookie = cookies.find((c) => c.name === 'locale')
    expect(localeCookie?.value).toBe('en')
  })

  test('closes an open CV modal before switching language', async ({ page }) => {
    await page.goto('http://localhost:3000')

    await page.getByText('Dowiedz się więcej').first().click()
    await expect(page.getByRole('dialog')).toBeVisible()

    await page.getByRole('button', { name: 'PL', exact: true }).first().click()
    await page.getByRole('button', { name: 'EN', exact: true }).click()

    await expect(page.getByRole('dialog')).toBeHidden()
  })
})
