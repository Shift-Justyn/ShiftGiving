import { render, screen, act, fireEvent } from '@testing-library/react';
import { FeatureFlagsProvider, useFeatureFlags } from './FeatureFlagsContext';
import { FEATURE_FLAGS_STORAGE_KEY } from '../config/featureFlags';

const TestComponent = () => {
  const { flags, isEnabled, toggleFlag, resetFlags, canToggle } = useFeatureFlags();
  return (
    <div>
      <span data-testid="social-sharing">{String(flags.SOCIAL_SHARING)}</span>
      <span data-testid="recurring">{String(flags.RECURRING_DONATIONS)}</span>
      <span data-testid="is-enabled">{String(isEnabled('SOCIAL_SHARING'))}</span>
      <span data-testid="can-toggle">{String(canToggle)}</span>
      <button onClick={() => toggleFlag('SOCIAL_SHARING')}>Toggle Social</button>
      <button onClick={() => toggleFlag('RECURRING_DONATIONS')}>Toggle Recurring</button>
      <button onClick={resetFlags}>Reset</button>
    </div>
  );
};

describe('FeatureFlagsContext', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('provides default flag values', () => {
    render(
      <FeatureFlagsProvider>
        <TestComponent />
      </FeatureFlagsProvider>
    );

    expect(screen.getByTestId('social-sharing')).toHaveTextContent('true');
    expect(screen.getByTestId('recurring')).toHaveTextContent('false');
  });

  it('isEnabled returns correct value for flag', () => {
    render(
      <FeatureFlagsProvider>
        <TestComponent />
      </FeatureFlagsProvider>
    );

    expect(screen.getByTestId('is-enabled')).toHaveTextContent('true');
  });

  it('toggleFlag updates flag state', () => {
    render(
      <FeatureFlagsProvider>
        <TestComponent />
      </FeatureFlagsProvider>
    );

    expect(screen.getByTestId('social-sharing')).toHaveTextContent('true');

    fireEvent.click(screen.getByText('Toggle Social'));

    expect(screen.getByTestId('social-sharing')).toHaveTextContent('false');
  });

  it('toggleFlag persists to localStorage', () => {
    render(
      <FeatureFlagsProvider>
        <TestComponent />
      </FeatureFlagsProvider>
    );

    fireEvent.click(screen.getByText('Toggle Recurring'));

    const stored = JSON.parse(localStorage.getItem(FEATURE_FLAGS_STORAGE_KEY) || '{}');
    expect(stored.RECURRING_DONATIONS).toBe(true);
  });

  it('resetFlags restores defaults', () => {
    render(
      <FeatureFlagsProvider>
        <TestComponent />
      </FeatureFlagsProvider>
    );

    fireEvent.click(screen.getByText('Toggle Social'));
    expect(screen.getByTestId('social-sharing')).toHaveTextContent('false');

    fireEvent.click(screen.getByText('Reset'));
    expect(screen.getByTestId('social-sharing')).toHaveTextContent('true');
  });

  it('loads stored flags from localStorage', async () => {
    localStorage.setItem(FEATURE_FLAGS_STORAGE_KEY, JSON.stringify({ RECURRING_DONATIONS: true }));

    await act(async () => {
      render(
        <FeatureFlagsProvider>
          <TestComponent />
        </FeatureFlagsProvider>
      );
    });

    expect(screen.getByTestId('recurring')).toHaveTextContent('true');
  });

  it('throws error when useFeatureFlags used outside provider', () => {
    const consoleError = jest.spyOn(console, 'error').mockImplementation(() => {});

    expect(() => render(<TestComponent />)).toThrow(
      'useFeatureFlags must be used within a FeatureFlagsProvider'
    );

    consoleError.mockRestore();
  });

  it('canToggle is true in development', () => {
    render(
      <FeatureFlagsProvider>
        <TestComponent />
      </FeatureFlagsProvider>
    );

    expect(screen.getByTestId('can-toggle')).toHaveTextContent('true');
  });
});
