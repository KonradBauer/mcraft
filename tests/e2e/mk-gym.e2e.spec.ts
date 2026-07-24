import { test, expect } from '@playwright/test'

test.describe('MK Gym - hidden page', () => {
  test('loads directly at /mk-gym with expected content', async ({ page }) => {
    await page.goto('http://localhost:3000/mk-gym')
    await expect(page).toHaveTitle(/MK Gym/)
    const heading = page.locator('h1').first()
    await expect(heading).toContainText('MK Gym')
    await expect(page.getByRole('heading', { name: 'Zakres' })).toBeVisible()
  })

  test('topbar shows the MK Gym logo image instead of the MCRAFT wordmark', async ({ page }) => {
    await page.goto('http://localhost:3000/mk-gym')
    const topbar = page.locator('nav').first()
    await expect(topbar.getByRole('img', { name: 'MK Gym' })).toBeVisible()
  })

  test('topbar has no standard nav links, shows a back link to mcraft.com.pl, and keeps the language switcher', async ({ page }) => {
    await page.goto('http://localhost:3000/mk-gym')
    const topbar = page.locator('nav').first()

    await expect(topbar.getByRole('link', { name: 'O mnie' })).toHaveCount(0)
    await expect(topbar.getByRole('link', { name: 'Obszary' })).toHaveCount(0)
    await expect(topbar.getByText('Realizacje')).toHaveCount(0)

    const backLink = topbar.getByRole('link', { name: 'Powrót na mcraft.com.pl' })
    await expect(backLink).toBeVisible()
    await expect(backLink).toHaveAttribute('href', 'https://mcraft.com.pl')

    await expect(page.getByRole('button', { name: 'PL', exact: true }).first()).toBeVisible()
  })

  test('logo link points to mcraft.com.pl', async ({ page }) => {
    await page.goto('http://localhost:3000/mk-gym')
    const logoLink = page.locator('nav a').first()
    await expect(logoLink).toHaveAttribute('href', 'https://mcraft.com.pl')
  })

  test('mobile menu shows only the back link and the language toggle', async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 })
    await page.goto('http://localhost:3000/mk-gym')

    await page.getByLabel('Otwórz menu').click()
    const dialog = page.getByRole('dialog')
    await expect(dialog).toBeVisible()
    await expect(dialog.getByRole('link', { name: 'Powrót na mcraft.com.pl' })).toBeVisible()
    await expect(dialog.getByRole('link', { name: 'O mnie' })).toHaveCount(0)
    await expect(dialog.getByText('PL', { exact: true })).toBeVisible()
  })

  test('regression: /meble-premium keeps the MCRAFT wordmark, standard nav and logo link to "/"', async ({ page }) => {
    await page.goto('http://localhost:3000/meble-premium')
    const topbar = page.locator('nav').first()

    await expect(topbar.getByText('MCRAFT', { exact: true }).first()).toBeVisible()
    await expect(topbar.getByRole('link', { name: 'O mnie' })).toBeVisible()

    const logoLink = topbar.locator('a').first()
    await expect(logoLink).toHaveAttribute('href', '/')
  })

  test('homepage shows exactly 3 area tiles and no link to /mk-gym anywhere', async ({ page }) => {
    await page.goto('http://localhost:3000')
    const tiles = page.locator('#areas a')
    await expect(tiles).toHaveCount(3)

    const mkGymLinks = page.locator('a[href*="mk-gym"]')
    await expect(mkGymLinks).toHaveCount(0)
  })
})
