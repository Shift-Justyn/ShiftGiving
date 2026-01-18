import { render, screen } from '@testing-library/react';
import { FeatureFlag } from './FeatureFlag';
import { FeatureFlagsProvider } from '../context/FeatureFlagsContext';
import { FEATURE_FLAGS_STORAGE_KEY } from '../config/featureFlags';

describe('FeatureFlag', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('renders children when flag is enabled', () => {
    render(
      <FeatureFlagsProvider>
        <FeatureFlag name="SOCIAL_SHARING">
          <span>Social Sharing Content</span>
        </FeatureFlag>
      </FeatureFlagsProvider>
    );

    expect(screen.getByText('Social Sharing Content')).toBeInTheDocument();
  });

  it('does not render children when flag is disabled', () => {
    render(
      <FeatureFlagsProvider>
        <FeatureFlag name="RECURRING_DONATIONS">
          <span>Recurring Donations Content</span>
        </FeatureFlag>
      </FeatureFlagsProvider>
    );

    expect(screen.queryByText('Recurring Donations Content')).not.toBeInTheDocument();
  });

  it('renders fallback when flag is disabled', () => {
    render(
      <FeatureFlagsProvider>
        <FeatureFlag name="RECURRING_DONATIONS" fallback={<span>Coming Soon</span>}>
          <span>Recurring Donations Content</span>
        </FeatureFlag>
      </FeatureFlagsProvider>
    );

    expect(screen.queryByText('Recurring Donations Content')).not.toBeInTheDocument();
    expect(screen.getByText('Coming Soon')).toBeInTheDocument();
  });

  it('respects localStorage overrides', () => {
    localStorage.setItem(FEATURE_FLAGS_STORAGE_KEY, JSON.stringify({ RECURRING_DONATIONS: true }));

    render(
      <FeatureFlagsProvider>
        <FeatureFlag name="RECURRING_DONATIONS">
          <span>Recurring Donations Content</span>
        </FeatureFlag>
      </FeatureFlagsProvider>
    );

    expect(screen.getByText('Recurring Donations Content')).toBeInTheDocument();
  });

  it('renders nothing when flag is disabled and no fallback provided', () => {
    const { container } = render(
      <FeatureFlagsProvider>
        <FeatureFlag name="RECURRING_DONATIONS">
          <span>Recurring Donations Content</span>
        </FeatureFlag>
      </FeatureFlagsProvider>
    );

    expect(container.textContent).toBe('');
  });
});
