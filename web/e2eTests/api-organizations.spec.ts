import { test, expect } from '@playwright/test';

const API_BASE = 'http://localhost:5237';

test('organizations endpoint returns 200 status', async ({ request }) => {
  const response = await request.get(`${API_BASE}/api/organizations`);
  expect(response.status()).toBe(200);
});

test('organizations endpoint returns array', async ({ request }) => {
  const response = await request.get(`${API_BASE}/api/organizations`);
  const body = await response.json();
  expect(Array.isArray(body.data || body)).toBe(true);
});
