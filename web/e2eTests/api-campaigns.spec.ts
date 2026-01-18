import { test, expect } from '@playwright/test';

const API_BASE = 'http://localhost:5237';

test('campaigns endpoint returns 200 status', async ({ request }) => {
  const response = await request.get(`${API_BASE}/api/campaigns`);
  expect(response.status()).toBe(200);
});

test('campaigns endpoint returns array', async ({ request }) => {
  const response = await request.get(`${API_BASE}/api/campaigns`);
  const body = await response.json();
  expect(Array.isArray(body.data || body)).toBe(true);
});

test('campaigns endpoint has pagination metadata', async ({ request }) => {
  const response = await request.get(`${API_BASE}/api/campaigns`);
  const body = await response.json();
  expect(body.meta || body.pagination).toBeDefined();
});
