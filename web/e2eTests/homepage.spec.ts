import { test, expect } from '@playwright/test';

test.describe('Homepage', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('displays page title and welcome message', async ({ page }) => {
    await page.waitForSelector('h1', { state: 'visible', timeout: 15000 });
    const heading = page.locator('h1');
    await expect(heading).toContainText(/Welcome|Friend/i);
  });

  test('displays sidebar navigation', async ({ page }) => {
    await page.waitForSelector('nav', { state: 'visible', timeout: 15000 });
    const sidebar = page.locator('nav').first();
    await expect(sidebar).toBeVisible();
  });

  test('displays search bar', async ({ page }) => {
    await page.waitForSelector('input[type="text"]', { state: 'visible', timeout: 15000 });
    const searchInput = page.locator('input[type="text"]').first();
    await expect(searchInput).toBeVisible();
  });

  test('displays campaign cards section', async ({ page }) => {
    await page.waitForSelector('section', { state: 'visible', timeout: 15000 });
    const campaignsSection = page.locator('text=Campaigns').first();
    await expect(campaignsSection).toBeVisible();
  });

  test('displays organization cards section', async ({ page }) => {
    await page.waitForSelector('section', { state: 'visible', timeout: 15000 });
    const orgsSection = page.locator('text=Organizations').first();
    await expect(orgsSection).toBeVisible();
  });

  test('displays metrics dashboard with donation stats', async ({ page }) => {
    await page.waitForSelector('[class*="metric"], [class*="dashboard"], [class*="stat"]', {
      state: 'visible',
      timeout: 15000,
    });
    const metricsArea = page.locator('text=/donated|raised|supported/i').first();
    await expect(metricsArea).toBeVisible();
  });

  test('search bar accepts input', async ({ page }) => {
    await page.waitForSelector('input[type="text"]', { state: 'visible', timeout: 15000 });
    const searchInput = page.locator('input[type="text"]').first();
    await searchInput.fill('food bank');
    await expect(searchInput).toHaveValue('food bank');
  });

  test('map section is visible', async ({ page }) => {
    await page.waitForSelector('[class*="map"], [class*="Map"]', {
      state: 'visible',
      timeout: 15000,
    });
    const mapArea = page.locator('[class*="map"], [class*="Map"]').first();
    await expect(mapArea).toBeVisible();
  });

  test('sidebar contains navigation links', async ({ page }) => {
    await page.waitForSelector('nav', { state: 'visible', timeout: 15000 });
    const homeLink = page.locator('nav >> text=/home/i').first();
    await expect(homeLink).toBeVisible();
  });

  test('sidebar shows logo', async ({ page }) => {
    await page.waitForSelector('nav', { state: 'visible', timeout: 15000 });
    const logo = page.locator('nav >> img, nav >> svg').first();
    await expect(logo).toBeVisible();
  });
});
