import { test, expect } from '@playwright/test';

const API_BASE = 'http://localhost:5237';

test('health endpoint returns 200 status', async ({ request }) => {
  const response = await request.get(`${API_BASE}/health`);
  expect(response.status()).toBe(200);
});

test('health endpoint returns healthy status', async ({ request }) => {
  const response = await request.get(`${API_BASE}/health`);
  const body = await response.json();
  expect(body.status).toBe('healthy');
});

test('health endpoint returns database status', async ({ request }) => {
  const response = await request.get(`${API_BASE}/health`);
  const body = await response.json();
  expect(body.database).toBeDefined();
});
