import { test, expect } from '@playwright/test'
import { getPayload, Payload } from 'payload'
import config from '../../src/payload.config.js'

test.describe('MK Gym - hidden page', () => {
  test('loads directly at /mk-gym with expected content', async ({ page }) => {
    await page.goto('http://localhost:3000/mk-gym')
    await expect(page).toHaveTitle(/MK Gym/)
    const heading = page.locator('h1').first()
    await expect(heading).toContainText('MK Gym')
    await expect(page.getByRole('heading', { name: 'Zakres' })).toBeVisible()
  })

  test('browser tab title is exactly "MK Gym", without the " | MCRAFT" suffix', async ({ page }) => {
    await page.goto('http://localhost:3000/mk-gym')
    await expect(page).toHaveTitle('MK Gym')
  })

  test('favicon is overridden for /mk-gym (does not use the site-wide favicon.png)', async ({ page }) => {
    await page.goto('http://localhost:3000/mk-gym')
    const iconHref = await page.locator('link[rel="icon"]').first().getAttribute('href')
    expect(iconHref).toBeTruthy()
    expect(iconHref).not.toBe('/favicon.png')
  })

  test('does not show the branded MCRAFT loading splash', async ({ page }) => {
    await page.goto('http://localhost:3000/mk-gym')
    await expect(page.locator('.weld-fill')).toHaveCount(0)
  })

  test('topbar shows the MK Gym logo image instead of the MCRAFT wordmark, on a white background, at 3x the base size', async ({ page }) => {
    await page.goto('http://localhost:3000/mk-gym')
    const topbar = page.locator('nav').first()
    const logo = topbar.getByRole('img', { name: 'MK Gym' })
    await expect(logo).toBeVisible()

    const box = await logo.boundingBox()
    expect(box?.height).toBeGreaterThanOrEqual(95)

    const wrapperBg = await logo.evaluate((el) => getComputedStyle(el.parentElement as Element).backgroundColor)
    expect(wrapperBg).toBe('rgb(255, 255, 255)')
  })

  test('topbar has no standard nav links, shows a back link to mkcraft.com.pl, and keeps the language switcher', async ({ page }) => {
    await page.goto('http://localhost:3000/mk-gym')
    const topbar = page.locator('nav').first()

    await expect(topbar.getByRole('link', { name: 'O mnie' })).toHaveCount(0)
    await expect(topbar.getByRole('link', { name: 'Obszary' })).toHaveCount(0)
    await expect(topbar.getByText('Realizacje')).toHaveCount(0)

    const backLink = topbar.getByRole('link', { name: 'Powrót na mkcraft.com.pl' })
    await expect(backLink).toBeVisible()
    await expect(backLink).toHaveAttribute('href', 'https://mkcraft.com.pl')

    await expect(page.getByRole('button', { name: 'PL', exact: true }).first()).toBeVisible()
  })

  test('logo link points to mkcraft.com.pl', async ({ page }) => {
    await page.goto('http://localhost:3000/mk-gym')
    const logoLink = page.locator('nav a').first()
    await expect(logoLink).toHaveAttribute('href', 'https://mkcraft.com.pl')
  })

  test('mobile menu shows only the back link and the language toggle', async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 })
    await page.goto('http://localhost:3000/mk-gym')

    await page.getByLabel('Otwórz menu').click()
    const dialog = page.getByRole('dialog')
    await expect(dialog).toBeVisible()
    await expect(dialog.getByRole('link', { name: 'Powrót na mkcraft.com.pl' })).toBeVisible()
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

test.describe('MK Gym - realizacja detail page', () => {
  const slug = '__e2e-test-mk-gym-realizacja'
  let payload: Payload
  let portfolioId: string | undefined

  test.beforeAll(async () => {
    const payloadConfig = await config
    payload = await getPayload({ config: payloadConfig })

    const { docs } = await payload.find({
      collection: 'service-pages',
      where: { slug: { equals: 'mk-gym' } },
      limit: 1,
    })
    const servicePageId = docs[0].id

    const created = await payload.create({
      collection: 'portfolio-projects',
      data: { title: 'E2E Test Realizacja', slug, servicePage: servicePageId },
    })
    portfolioId = created.id
  })

  test.afterAll(async () => {
    if (portfolioId) {
      await payload.delete({ collection: 'portfolio-projects', id: portfolioId })
    }
  })

  test('renders directly and its breadcrumb back link points to /mk-gym, not the homepage', async ({ page }) => {
    await page.goto(`http://localhost:3000/mk-gym/realizacje/${slug}`)
    await expect(page.locator('h1').first()).toContainText('E2E Test Realizacja')

    const breadcrumbLink = page.locator('header').getByRole('link', { name: /MK Gym/i })
    await expect(breadcrumbLink).toHaveAttribute('href', '/mk-gym')
  })

  test('browser tab title is "MK Gym | <nazwa realizacji>" and favicon is the MK Gym one', async ({ page }) => {
    await page.goto(`http://localhost:3000/mk-gym/realizacje/${slug}`)
    await expect(page).toHaveTitle('MK Gym | E2E Test Realizacja')

    const iconHref = await page.locator('link[rel="icon"]').first().getAttribute('href')
    expect(iconHref).toBeTruthy()
    expect(iconHref).not.toBe('/favicon.png')
  })

  test('mobile menu shows the MK Gym logo instead of the MCRAFT wordmark', async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 })
    await page.goto(`http://localhost:3000/mk-gym/realizacje/${slug}`)

    await page.getByLabel('Otwórz menu').click()
    const dialog = page.getByRole('dialog')
    await expect(dialog).toBeVisible()
    await expect(dialog.getByRole('img', { name: 'MK Gym' })).toBeVisible()
    await expect(dialog.getByText('MCRAFT', { exact: true })).toHaveCount(0)
  })

  test('topbar shows the MK Gym logo and a single mkcraft.com.pl link, not the standard MCRAFT nav', async ({ page }) => {
    await page.goto(`http://localhost:3000/mk-gym/realizacje/${slug}`)
    const topbar = page.locator('nav').first()

    await expect(topbar.getByRole('img', { name: 'MK Gym' })).toBeVisible()
    await expect(topbar.getByRole('link', { name: 'O mnie' })).toHaveCount(0)

    const backLink = topbar.getByRole('link', { name: 'Powrót na mkcraft.com.pl' })
    await expect(backLink).toBeVisible()
    await expect(backLink).toHaveAttribute('href', 'https://mkcraft.com.pl')

    const logoLink = topbar.locator('a').first()
    await expect(logoLink).toHaveAttribute('href', 'https://mkcraft.com.pl')
  })
})
