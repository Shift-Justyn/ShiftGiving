import { test, expect } from '@playwright/test';

test('homepage loads successfully', async ({ page }) => {
  const response = await page.goto('/');
  expect(response?.status()).toBe(200);
});

test('homepage displays hello world text', async ({ page }) => {
  await page.goto('/');
  const content = await page.textContent('body');
  expect(content).toContain('Hello World');
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
