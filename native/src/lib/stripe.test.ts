import {
  createPaymentIntent,
  checkApplePayAvailability,
  checkGooglePayAvailability,
  handlePaymentError,
} from './stripe';

jest.mock('@stripe/stripe-react-native', () => ({
  initStripe: jest.fn().mockResolvedValue(true),
  ApplePay: {
    isApplePaySupported: jest.fn().mockResolvedValue(true),
  },
  GooglePay: {
    isGooglePaySupported: jest.fn().mockResolvedValue(true),
  },
}));

global.fetch = jest.fn();

describe('Stripe Service', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('createPaymentIntent', () => {
    it('creates payment intent with correct parameters', async () => {
      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          clientSecret: 'pi_test_secret',
          publishableKey: 'pk_test',
        }),
      });

      const result = await createPaymentIntent(10, 'USD', 'token_test');

      expect(global.fetch).toHaveBeenCalledWith('/api/payments/intent', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: 'Bearer token_test',
        },
        body: JSON.stringify({
          amount: 1000,
          currency: 'USD',
        }),
      });

      expect(result.clientSecret).toBe('pi_test_secret');
    });

    it('throws error on failed payment intent creation', async () => {
      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: false,
        statusText: 'Bad Request',
      });

      await expect(createPaymentIntent(10, 'USD', 'token_test')).rejects.toThrow();
    });
  });

  describe('checkApplePayAvailability', () => {
    it('returns true when Apple Pay is supported', async () => {
      const available = await checkApplePayAvailability();
      expect(available).toBe(true);
    });

    it('returns false on error', async () => {
      const { ApplePay } = require('@stripe/stripe-react-native');
      ApplePay.isApplePaySupported.mockRejectedValueOnce(new Error('Check failed'));

      const available = await checkApplePayAvailability();
      expect(available).toBe(false);
    });
  });

  describe('checkGooglePayAvailability', () => {
    it('returns true when Google Pay is supported', async () => {
      const available = await checkGooglePayAvailability();
      expect(available).toBe(true);
    });

    it('returns false on error', async () => {
      const { GooglePay } = require('@stripe/stripe-react-native');
      GooglePay.isGooglePaySupported.mockRejectedValueOnce(new Error('Check failed'));

      const available = await checkGooglePayAvailability();
      expect(available).toBe(false);
    });
  });

  describe('handlePaymentError', () => {
    it('returns Stripe error message', () => {
      const stripeError = {
        code: 'card_error',
        message: 'Your card was declined',
      };

      const result = handlePaymentError(stripeError as any);
      expect(result).toBe('Your card was declined');
    });

    it('returns generic error message for standard Error', () => {
      const error = new Error('Generic error');

      const result = handlePaymentError(error);
      expect(result).toBe('Generic error');
    });

    it('returns fallback message when error has no message', () => {
      const result = handlePaymentError(new Error(''));
      expect(result).toBe('An unknown error occurred');
    });
  });
});
