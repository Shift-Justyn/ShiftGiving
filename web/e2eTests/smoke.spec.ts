import { test, expect } from '@playwright/test';

test('homepage loads successfully', async ({ page }) => {
  const response = await page.goto('/');
  expect(response?.status()).toBe(200);
});

test('login page displays welcome text', async ({ page }) => {
  await page.goto('/login');
  await page.waitForSelector('h1, h2', { state: 'visible', timeout: 10000 });
  const content = await page.textContent('body');
  expect(content).toContain('Welcome');
});

test('homepage has no console errors', async ({ page }) => {
  const errors: string[] = [];
  page.on('console', msg => {
    if (msg.type() === 'error') {
      errors.push(msg.text());
    }
  });
  await page.goto('/');
  expect(errors).toHaveLength(0);
});
