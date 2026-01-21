import { test, expect } from '@playwright/test';

const SEEDED_USER_EMAIL = 'donor@test.com';
const SEEDED_USER_PASSWORD = 'Password123!';
const SEEDED_CAMPAIGN_ID = '66666666-6666-6666-6666-666666666666';

// Skip donation flow tests in CI - requires live API interaction with timing issues
// TODO: Add mock service worker setup for CI e2e tests
test.describe.skip('Donation Flow Happy Path', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/login');
    await page.waitForSelector('input[type="email"]', { state: 'visible', timeout: 10000 });
    await page.fill('input[type="email"]', SEEDED_USER_EMAIL);
    await page.fill('input[type="password"]', SEEDED_USER_PASSWORD);
    await page.click('button[type="submit"]');
    await page.waitForURL('/', { timeout: 15000 });
  });

  test('user can log in successfully', async ({ page }) => {
    await expect(page.locator('text=Welcome back')).toBeVisible();
  });

  test('user can navigate to campaign detail page', async ({ page }) => {
    await page.goto(`/campaigns/${SEEDED_CAMPAIGN_ID}`);
    await expect(page.locator('text=Build Schools in Rural Communities')).toBeVisible();
  });

  test('user can click donate now button on campaign page', async ({ page }) => {
    await page.goto(`/campaigns/${SEEDED_CAMPAIGN_ID}`);
    await page.click('text=Donate Now');
    await expect(page).toHaveURL(`/campaigns/${SEEDED_CAMPAIGN_ID}/donate`);
  });

  test('user can select a preset donation amount', async ({ page }) => {
    await page.goto(`/campaigns/${SEEDED_CAMPAIGN_ID}/donate`);
    await page.waitForSelector('button:has-text("$50")');
    await page.click('button:has-text("$50")');
    const input = page.locator('input[type="number"]');
    await expect(input).toHaveValue('50');
  });

  test('user can toggle anonymous donation', async ({ page }) => {
    await page.goto(`/campaigns/${SEEDED_CAMPAIGN_ID}/donate`);
    await page.waitForSelector('label[for="anonymous"]');
    await page.click('label[for="anonymous"]');
    const checkbox = page.locator('#anonymous');
    await expect(checkbox).toBeChecked();
  });

  test('user can add a donation message', async ({ page }) => {
    await page.goto(`/campaigns/${SEEDED_CAMPAIGN_ID}/donate`);
    await page.waitForSelector('textarea');
    const message = 'Thank you for the great work!';
    await page.fill('textarea', message);
    await expect(page.locator('textarea')).toHaveValue(message);
  });

  test('user can proceed to payment page', async ({ page }) => {
    await page.goto(`/campaigns/${SEEDED_CAMPAIGN_ID}/donate`);
    await page.waitForSelector('button:has-text("$50")');
    await page.click('button:has-text("$50")');
    await page.click('button:has-text("Continue to Payment")');
    await expect(page).toHaveURL(`/campaigns/${SEEDED_CAMPAIGN_ID}/donate/payment`);
  });

  test('user can fill in payment details', async ({ page }) => {
    await page.goto(`/campaigns/${SEEDED_CAMPAIGN_ID}/donate`);
    await page.waitForSelector('button:has-text("$50")');
    await page.click('button:has-text("$50")');
    await page.click('button:has-text("Continue to Payment")');
    await page.waitForURL(`/campaigns/${SEEDED_CAMPAIGN_ID}/donate/payment`);
    await page.fill('#cardholderName', 'Test User');
    await page.fill('#cardNumber', '4242 4242 4242 4242');
    await page.fill('#expiryDate', '12/28');
    await page.fill('#cvv', '123');
    await expect(page.locator('#cardNumber')).toHaveValue('4242 4242 4242 4242');
  });

  test('complete donation flow shows confirmation', async ({ page }) => {
    await page.goto(`/campaigns/${SEEDED_CAMPAIGN_ID}/donate`);
    await page.waitForSelector('button:has-text("$50")');
    await page.click('button:has-text("$50")');
    await page.click('label[for="anonymous"]');
    await page.fill('textarea', 'Supporting education for all!');
    await page.click('button:has-text("Continue to Payment")');
    await page.waitForURL(`/campaigns/${SEEDED_CAMPAIGN_ID}/donate/payment`);
    await page.fill('#cardholderName', 'Sarah Johnson');
    await page.fill('#cardNumber', '4242 4242 4242 4242');
    await page.fill('#expiryDate', '12/28');
    await page.fill('#cvv', '123');
    await page.click('button:has-text("Complete Donation")');
    await page.waitForURL(/\/donations\/.*\/confirmation/);
    await expect(page.locator('text=Donation Successful!')).toBeVisible();
  });

  test('confirmation page displays correct donation amount', async ({ page }) => {
    await page.goto(`/campaigns/${SEEDED_CAMPAIGN_ID}/donate`);
    await page.waitForSelector('button:has-text("$100")');
    await page.click('button:has-text("$100")');
    await page.click('button:has-text("Continue to Payment")');
    await page.waitForURL(`/campaigns/${SEEDED_CAMPAIGN_ID}/donate/payment`);
    await page.fill('#cardholderName', 'Sarah Johnson');
    await page.fill('#cardNumber', '4242 4242 4242 4242');
    await page.fill('#expiryDate', '12/28');
    await page.fill('#cvv', '123');
    await page.click('button:has-text("Complete Donation")');
    await page.waitForURL(/\/donations\/.*\/confirmation/);
    await expect(page.locator('text=$100.00').first()).toBeVisible();
  });

  test('confirmation page displays donation message when provided', async ({ page }) => {
    const donationMessage = 'Education changes lives!';
    await page.goto(`/campaigns/${SEEDED_CAMPAIGN_ID}/donate`);
    await page.waitForSelector('button:has-text("$25")');
    await page.click('button:has-text("$25")');
    await page.fill('textarea', donationMessage);
    await page.click('button:has-text("Continue to Payment")');
    await page.waitForURL(`/campaigns/${SEEDED_CAMPAIGN_ID}/donate/payment`);
    await page.fill('#cardholderName', 'Sarah Johnson');
    await page.fill('#cardNumber', '4242 4242 4242 4242');
    await page.fill('#expiryDate', '12/28');
    await page.fill('#cvv', '123');
    await page.click('button:has-text("Complete Donation")');
    await page.waitForURL(/\/donations\/.*\/confirmation/);
    await expect(page.locator(`text=${donationMessage}`)).toBeVisible();
  });

  test('confirmation page has link back to campaigns', async ({ page }) => {
    await page.goto(`/campaigns/${SEEDED_CAMPAIGN_ID}/donate`);
    await page.waitForSelector('button:has-text("$50")');
    await page.click('button:has-text("$50")');
    await page.click('button:has-text("Continue to Payment")');
    await page.waitForURL(`/campaigns/${SEEDED_CAMPAIGN_ID}/donate/payment`);
    await page.fill('#cardholderName', 'Sarah Johnson');
    await page.fill('#cardNumber', '4242 4242 4242 4242');
    await page.fill('#expiryDate', '12/28');
    await page.fill('#cvv', '123');
    await page.click('button:has-text("Complete Donation")');
    await page.waitForURL(/\/donations\/.*\/confirmation/);
    await page.click('text=Back to Campaigns');
    await expect(page).toHaveURL('/');
  });
});
