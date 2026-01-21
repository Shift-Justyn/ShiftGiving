import { defineConfig, devices } from '@playwright/test';

const isCI = !!process.env.CI;

export default defineConfig({
  testDir: './e2eTests',
  fullyParallel: true,
  forbidOnly: isCI,
  retries: isCI ? 1 : 0,
  workers: isCI ? 1 : undefined,
  reporter: isCI ? 'list' : 'html',
  use: {
    baseURL: 'http://localhost:5500',
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
  },

  projects: isCI
    ? [
        {
          name: 'chromium',
          use: { ...devices['Desktop Chrome'] },
        },
      ]
    : [
        {
          name: 'chromium',
          use: { ...devices['Desktop Chrome'] },
        },
        {
          name: 'firefox',
          use: { ...devices['Desktop Firefox'] },
        },
        {
          name: 'webkit',
          use: { ...devices['Desktop Safari'] },
        },
      ],

  webServer: {
    command: 'npm run preview -- --port 5500',
    url: 'http://localhost:5500',
    reuseExistingServer: true,
    timeout: 120000,
  },
});
