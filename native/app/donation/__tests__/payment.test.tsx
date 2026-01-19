import { render, fireEvent } from '@testing-library/react-native';
import React from 'react';
import PaymentScreen from '../payment';
import * as useDonation from '@/src/hooks/useDonation';
import * as useAuthStore from '@/src/store/authStore';

jest.mock('@/src/hooks/useDonation');
jest.mock('@/src/store/authStore');
jest.mock('expo-router', () => ({
  useRouter: () => ({ back: jest.fn(), push: jest.fn() }),
  useLocalSearchParams: () => ({
    campaignId: '1',
    amount: '100',
    coverFees: '0',
    organizationId: 'org1',
  }),
}));

describe('PaymentScreen', () => {
  beforeEach(() => {
    (useDonation.useDonation as jest.Mock).mockReturnValue({
      mutate: jest.fn(),
      isPending: false,
    });
    (useAuthStore.useAuthStore as jest.Mock).mockImplementation((selector) =>
      selector({ token: 'test-token' })
    );
  });

  it('renders payment form', () => {
    const { getByTestId } = render(<PaymentScreen />);
    expect(getByTestId('card-number-input')).toBeTruthy();
  });
});

describe('PaymentScreen form validation', () => {
  beforeEach(() => {
    (useDonation.useDonation as jest.Mock).mockReturnValue({
      mutate: jest.fn(),
      isPending: false,
    });
    (useAuthStore.useAuthStore as jest.Mock).mockImplementation((selector) =>
      selector({ token: 'test-token' })
    );
  });

  it('formats card number input', () => {
    const { getByTestId } = render(<PaymentScreen />);
    const input = getByTestId('card-number-input');
    fireEvent.changeText(input, '4111111111111111');
    expect(input.props.value).toContain(' ');
  });
});
