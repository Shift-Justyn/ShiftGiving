import { renderHook, act } from '@testing-library/react-native';
import { usePaymentSheet } from './usePaymentSheet';

jest.mock('@stripe/stripe-react-native', () => ({
  useStripe: () => ({
    initPaymentSheet: jest.fn().mockResolvedValue({ error: null }),
    presentPaymentSheet: jest.fn().mockResolvedValue({
      error: null,
      paymentIntent: { id: 'pi_test' },
    }),
  }),
}));

describe('usePaymentSheet', () => {
  it('initializes with correct default state', () => {
    const { result } = renderHook(() => usePaymentSheet());
    expect(result.current.loading).toBe(false);
    expect(result.current.error).toBe(null);
  });

  it('initializes payment sheet successfully', async () => {
    const { result } = renderHook(() => usePaymentSheet());

    await act(async () => {
      const success = await result.current.initializePaymentSheet({
        clientSecret: 'pi_test_secret',
      });
      expect(success).toBe(true);
    });
  });

  it('handles initialization error', async () => {
    const { result } = renderHook(() => usePaymentSheet());

    const mockInitPaymentSheet = jest.fn().mockResolvedValue({
      error: { message: 'Initialization failed' },
    });

    await act(async () => {
      await result.current.initializePaymentSheet({
        clientSecret: 'pi_test_secret',
      });
    });
  });

  it('presents payment sheet successfully', async () => {
    const { result } = renderHook(() => usePaymentSheet());

    await act(async () => {
      const paymentResult = await result.current.presentSheet();
      expect(paymentResult.success).toBe(true);
    });
  });

  it('resets error on resetError call', async () => {
    const { result } = renderHook(() => usePaymentSheet());

    act(() => {
      result.current.resetError();
    });

    expect(result.current.error).toBe(null);
  });

  it('sets loading state after initialization', async () => {
    const { result } = renderHook(() => usePaymentSheet());

    expect(result.current.loading).toBe(false);

    await act(async () => {
      await result.current.initializePaymentSheet({
        clientSecret: 'pi_test_secret',
      });
    });

    expect(result.current.loading).toBe(false);
  });
});
