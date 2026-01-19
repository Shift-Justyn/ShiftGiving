import { render, fireEvent } from '@testing-library/react-native';
import React from 'react';
import DonationAmountScreen from '../[campaignId]';
import * as useOneCampaign from '@/src/hooks/useOneCampaign';

jest.mock('@/src/hooks/useOneCampaign');
jest.mock('expo-router', () => ({
  useRouter: () => ({ back: jest.fn(), push: jest.fn() }),
  useLocalSearchParams: () => ({ campaignId: '1' }),
}));

describe('DonationAmountScreen', () => {
  beforeEach(() => {
    (useOneCampaign.useOneCampaign as jest.Mock).mockReturnValue({
      data: {
        id: '1',
        title: 'Test Campaign',
        organization: { id: 'org1', name: 'Test Org' },
      },
    });
  });

  it('renders preset amount buttons', () => {
    const { getByTestId } = render(<DonationAmountScreen />);
    expect(getByTestId('preset-25')).toBeTruthy();
  });
});

describe('DonationAmountScreen amount validation', () => {
  beforeEach(() => {
    (useOneCampaign.useOneCampaign as jest.Mock).mockReturnValue({
      data: {
        id: '1',
        title: 'Test Campaign',
        organization: { id: 'org1', name: 'Test Org' },
      },
    });
  });

  it('shows error for invalid amount', () => {
    const { getByTestId, getByText } = render(<DonationAmountScreen />);
    const input = getByTestId('custom-amount-input');
    fireEvent.changeText(input, '3');
    expect(getByText(/Amount must be between/)).toBeTruthy();
  });
});
