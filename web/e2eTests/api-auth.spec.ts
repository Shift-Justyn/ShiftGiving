import { test, expect } from '@playwright/test';

const API_BASE = 'http://localhost:5237';

test('register creates new user', async ({ request }) => {
  const timestamp = Date.now();
  const response = await request.post(`${API_BASE}/api/auth/register`, {
    data: {
      email: `test${timestamp}@example.com`,
      password: 'SecurePass123!',
      name: 'Test User',
    },
  });
  expect(response.status()).toBe(201);
});

test('login returns token for valid credentials', async ({ request }) => {
  const timestamp = Date.now();
  await request.post(`${API_BASE}/api/auth/register`, {
    data: {
      email: `test${timestamp}@example.com`,
      password: 'SecurePass123!',
      name: 'Test User',
    },
  });
  const response = await request.post(`${API_BASE}/api/auth/login`, {
    data: {
      email: `test${timestamp}@example.com`,
      password: 'SecurePass123!',
    },
  });
  const body = await response.json();
  expect(body.token).toBeDefined();
});

test('login returns 401 for invalid credentials', async ({ request }) => {
  const response = await request.post(`${API_BASE}/api/auth/login`, {
    data: {
      email: 'nonexistent@example.com',
      password: 'WrongPassword123!',
    },
  });
  expect(response.status()).toBe(401);
});
