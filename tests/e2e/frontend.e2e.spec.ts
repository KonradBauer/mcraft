import { test, expect } from '@playwright/test'

test.describe('Frontend', () => {
  test('homepage loads with correct title', async ({ page }) => {
    await page.goto('http://localhost:3000')
    await expect(page).toHaveTitle(/MCRAFT/)
  })

  test('homepage renders hero heading', async ({ page }) => {
    await page.goto('http://localhost:3000')
    const heading = page.locator('h1').first()
    await expect(heading).toContainText('Macherzyński')
  })

  test('subpage nadzor-spawalniczy loads', async ({ page }) => {
    await page.goto('http://localhost:3000/nadzor-spawalniczy')
    await expect(page).toHaveTitle(/Nadzór spawalniczy/)
    const heading = page.locator('h1').first()
    await expect(heading).toContainText('Nadzór')
  })

  test('subpage nadzor-spawalniczy has no Realizacje section', async ({ page }) => {
    await page.goto('http://localhost:3000/nadzor-spawalniczy')
    await expect(page.getByRole('heading', { name: 'Realizacje' })).toHaveCount(0)
  })

  test('subpage konstrukcje-stalowe loads', async ({ page }) => {
    await page.goto('http://localhost:3000/konstrukcje-stalowe')
    await expect(page).toHaveTitle(/Konstrukcje stalowe/)
  })

  test('subpage meble-premium loads', async ({ page }) => {
    await page.goto('http://localhost:3000/meble-premium')
    await expect(page).toHaveTitle(/Meble premium/)
  })
})
