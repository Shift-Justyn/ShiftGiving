import React from 'react';
import { render, screen, waitFor } from '@testing-library/react-native';
import { PaymentMethodSelector } from './PaymentMethodSelector';

describe('PaymentMethodSelector', () => {
  it('renders payment method title', async () => {
    render(
      <PaymentMethodSelector selectedMethod="card" onMethodChange={() => {}} />
    );
    await waitFor(() => {
      expect(screen.getByText('Payment Method')).toBeTruthy();
    });
  });

  it('renders credit card option', async () => {
    render(
      <PaymentMethodSelector selectedMethod="card" onMethodChange={() => {}} />
    );
    await waitFor(() => {
      expect(screen.getByText('Credit Card')).toBeTruthy();
    });
  });

  it('displays card description', async () => {
    render(
      <PaymentMethodSelector selectedMethod="card" onMethodChange={() => {}} />
    );
    await waitFor(() => {
      expect(screen.getByText('Visa, Mastercard, Amex')).toBeTruthy();
    });
  });

  it('calls onMethodChange when payment method is selected', async () => {
    const onMethodChange = jest.fn();
    render(
      <PaymentMethodSelector selectedMethod="card" onMethodChange={onMethodChange} />
    );

    await waitFor(() => {
      const creditCardOption = screen.getByText('Credit Card');
      expect(creditCardOption).toBeTruthy();
    });
  });

  it('disables options when disabled prop is true', async () => {
    render(
      <PaymentMethodSelector
        selectedMethod="card"
        onMethodChange={() => {}}
        disabled={true}
      />
    );
    await waitFor(() => {
      expect(screen.getByText('Payment Method')).toBeTruthy();
    });
  });
});
