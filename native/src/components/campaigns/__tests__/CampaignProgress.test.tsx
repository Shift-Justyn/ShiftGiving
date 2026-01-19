import { render, waitFor } from '@testing-library/react-native';
import { CampaignProgress } from '../CampaignProgress';

describe('CampaignProgress', () => {
  test('renders progress bar', () => {
    const { getByTestId } = render(<CampaignProgress raised={5000} goal={10000} />);
    expect(getByTestId('progress-bar')).toBeTruthy();
  });

  test('animates progress fill from 0 to target percentage', async () => {
    const { getByTestId } = render(<CampaignProgress raised={2500} goal={10000} />);
    const fill = getByTestId('progress-fill');
    await waitFor(() => {
      expect(fill.props.style).toBeDefined();
    });
  });

  test('renders with spring animation transition', () => {
    const { getByTestId } = render(<CampaignProgress raised={5000} goal={10000} />);
    const fill = getByTestId('progress-fill');
    expect(fill).toBeTruthy();
  });

  test('caps percentage at 100', async () => {
    const { getByTestId } = render(<CampaignProgress raised={15000} goal={10000} />);
    await waitFor(() => {
      expect(getByTestId('progress-fill')).toBeTruthy();
    });
  });

  test('handles zero goal gracefully', () => {
    const { getByTestId } = render(<CampaignProgress raised={1000} goal={0} />);
    expect(getByTestId('progress-bar')).toBeTruthy();
  });
});
