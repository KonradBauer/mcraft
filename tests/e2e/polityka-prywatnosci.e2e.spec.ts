import { test, expect } from '@playwright/test'

test.describe('Polityka prywatności', () => {
  test('shows English headings and content with locale=en cookie', async ({ page, context }) => {
    await context.addCookies([{ name: 'locale', value: 'en', domain: 'localhost', path: '/' }])
    await page.goto('http://localhost:3000/polityka-prywatnosci')

    await expect(page.getByRole('heading', { name: 'Privacy Policy' })).toBeVisible()
    await expect(page.getByText('1. Data Controller')).toBeVisible()
    await expect(page.getByText('Polityka prywatności')).toHaveCount(0)
  })

  test('footer link to privacy policy leads to the same URL regardless of language', async ({ page, context }) => {
    await page.goto('http://localhost:3000')
    const plHref = await page.getByRole('link', { name: 'Polityka prywatności' }).getAttribute('href')

    await context.addCookies([{ name: 'locale', value: 'en', domain: 'localhost', path: '/' }])
    await page.goto('http://localhost:3000')
    const enHref = await page.getByRole('link', { name: 'Privacy policy' }).getAttribute('href')

    expect(plHref).toBe('/polityka-prywatnosci')
    expect(enHref).toBe('/polityka-prywatnosci')
  })
})
