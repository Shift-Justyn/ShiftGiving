import { render, screen, fireEvent } from '@testing-library/react';
import { SettingsPage } from '../SettingsPage';
import { ThemeProvider } from '../../context/ThemeContext';
import { FeatureFlagsProvider } from '../../context/FeatureFlagsContext';
import { AuthProvider } from '../../context/AuthContext';
import { BrowserRouter } from 'react-router-dom';

jest.mock('../../components/Sidebar', () => ({
  Sidebar: () => <div data-testid="sidebar">Sidebar</div>,
}));

describe('SettingsPage', () => {
  it('renders page title', () => {
    render(
      <BrowserRouter>
        <ThemeProvider>
          <FeatureFlagsProvider>
            <AuthProvider>
              <SettingsPage />
            </AuthProvider>
          </FeatureFlagsProvider>
        </ThemeProvider>
      </BrowserRouter>
    );

    expect(screen.getByText('Settings')).toBeInTheDocument();
  });

  it('renders page subtitle', () => {
    render(
      <BrowserRouter>
        <ThemeProvider>
          <FeatureFlagsProvider>
            <AuthProvider>
              <SettingsPage />
            </AuthProvider>
          </FeatureFlagsProvider>
        </ThemeProvider>
      </BrowserRouter>
    );

    expect(screen.getByText('Manage your account preferences')).toBeInTheDocument();
  });

  it('renders sidebar', () => {
    render(
      <BrowserRouter>
        <ThemeProvider>
          <FeatureFlagsProvider>
            <AuthProvider>
              <SettingsPage />
            </AuthProvider>
          </FeatureFlagsProvider>
        </ThemeProvider>
      </BrowserRouter>
    );

    expect(screen.getByTestId('sidebar')).toBeInTheDocument();
  });

  it('renders account section', () => {
    render(
      <BrowserRouter>
        <ThemeProvider>
          <FeatureFlagsProvider>
            <AuthProvider>
              <SettingsPage />
            </AuthProvider>
          </FeatureFlagsProvider>
        </ThemeProvider>
      </BrowserRouter>
    );

    expect(screen.getByText('Account')).toBeInTheDocument();
  });

  it('renders appearance section', () => {
    render(
      <BrowserRouter>
        <ThemeProvider>
          <FeatureFlagsProvider>
            <AuthProvider>
              <SettingsPage />
            </AuthProvider>
          </FeatureFlagsProvider>
        </ThemeProvider>
      </BrowserRouter>
    );

    expect(screen.getByText('Appearance')).toBeInTheDocument();
  });

  it('renders notifications section', () => {
    render(
      <BrowserRouter>
        <ThemeProvider>
          <FeatureFlagsProvider>
            <AuthProvider>
              <SettingsPage />
            </AuthProvider>
          </FeatureFlagsProvider>
        </ThemeProvider>
      </BrowserRouter>
    );

    expect(screen.getByText('Notifications')).toBeInTheDocument();
  });

  it('renders features section', () => {
    render(
      <BrowserRouter>
        <ThemeProvider>
          <FeatureFlagsProvider>
            <AuthProvider>
              <SettingsPage />
            </AuthProvider>
          </FeatureFlagsProvider>
        </ThemeProvider>
      </BrowserRouter>
    );

    expect(screen.getByText('Features')).toBeInTheDocument();
  });

  it('renders security section', () => {
    render(
      <BrowserRouter>
        <ThemeProvider>
          <FeatureFlagsProvider>
            <AuthProvider>
              <SettingsPage />
            </AuthProvider>
          </FeatureFlagsProvider>
        </ThemeProvider>
      </BrowserRouter>
    );

    expect(screen.getByText('Security')).toBeInTheDocument();
  });

  it('renders danger zone section', () => {
    render(
      <BrowserRouter>
        <ThemeProvider>
          <FeatureFlagsProvider>
            <AuthProvider>
              <SettingsPage />
            </AuthProvider>
          </FeatureFlagsProvider>
        </ThemeProvider>
      </BrowserRouter>
    );

    expect(screen.getByText('Danger Zone')).toBeInTheDocument();
  });

  it('renders light theme button', () => {
    render(
      <BrowserRouter>
        <ThemeProvider>
          <FeatureFlagsProvider>
            <AuthProvider>
              <SettingsPage />
            </AuthProvider>
          </FeatureFlagsProvider>
        </ThemeProvider>
      </BrowserRouter>
    );

    expect(screen.getByText('Light')).toBeInTheDocument();
  });

  it('renders dark theme button', () => {
    render(
      <BrowserRouter>
        <ThemeProvider>
          <FeatureFlagsProvider>
            <AuthProvider>
              <SettingsPage />
            </AuthProvider>
          </FeatureFlagsProvider>
        </ThemeProvider>
      </BrowserRouter>
    );

    expect(screen.getByText('Dark')).toBeInTheDocument();
  });

  it('renders email notifications label', () => {
    render(
      <BrowserRouter>
        <ThemeProvider>
          <FeatureFlagsProvider>
            <AuthProvider>
              <SettingsPage />
            </AuthProvider>
          </FeatureFlagsProvider>
        </ThemeProvider>
      </BrowserRouter>
    );

    expect(screen.getByText('Email Notifications')).toBeInTheDocument();
  });

  it('renders email notifications description', () => {
    render(
      <BrowserRouter>
        <ThemeProvider>
          <FeatureFlagsProvider>
            <AuthProvider>
              <SettingsPage />
            </AuthProvider>
          </FeatureFlagsProvider>
        </ThemeProvider>
      </BrowserRouter>
    );

    expect(
      screen.getByText('Receive updates about your donations and campaigns')
    ).toBeInTheDocument();
  });

  it('renders push notifications label', () => {
    render(
      <BrowserRouter>
        <ThemeProvider>
          <FeatureFlagsProvider>
            <AuthProvider>
              <SettingsPage />
            </AuthProvider>
          </FeatureFlagsProvider>
        </ThemeProvider>
      </BrowserRouter>
    );

    expect(screen.getByText('Push Notifications')).toBeInTheDocument();
  });

  it('renders push notifications description', () => {
    render(
      <BrowserRouter>
        <ThemeProvider>
          <FeatureFlagsProvider>
            <AuthProvider>
              <SettingsPage />
            </AuthProvider>
          </FeatureFlagsProvider>
        </ThemeProvider>
      </BrowserRouter>
    );

    expect(screen.getByText('Get notified on your device')).toBeInTheDocument();
  });

  it('renders marketing emails label', () => {
    render(
      <BrowserRouter>
        <ThemeProvider>
          <FeatureFlagsProvider>
            <AuthProvider>
              <SettingsPage />
            </AuthProvider>
          </FeatureFlagsProvider>
        </ThemeProvider>
      </BrowserRouter>
    );

    expect(screen.getByText('Marketing Emails')).toBeInTheDocument();
  });

  it('renders marketing emails description', () => {
    render(
      <BrowserRouter>
        <ThemeProvider>
          <FeatureFlagsProvider>
            <AuthProvider>
              <SettingsPage />
            </AuthProvider>
          </FeatureFlagsProvider>
        </ThemeProvider>
      </BrowserRouter>
    );

    expect(screen.getByText('Receive news and promotional content')).toBeInTheDocument();
  });

  it('renders recurring donations label', () => {
    render(
      <BrowserRouter>
        <ThemeProvider>
          <FeatureFlagsProvider>
            <AuthProvider>
              <SettingsPage />
            </AuthProvider>
          </FeatureFlagsProvider>
        </ThemeProvider>
      </BrowserRouter>
    );

    expect(screen.getByText('Recurring Donations')).toBeInTheDocument();
  });

  it('renders recurring donations description', () => {
    render(
      <BrowserRouter>
        <ThemeProvider>
          <FeatureFlagsProvider>
            <AuthProvider>
              <SettingsPage />
            </AuthProvider>
          </FeatureFlagsProvider>
        </ThemeProvider>
      </BrowserRouter>
    );

    expect(screen.getByText('Set up monthly recurring donations')).toBeInTheDocument();
  });

  it('renders social sharing label', () => {
    render(
      <BrowserRouter>
        <ThemeProvider>
          <FeatureFlagsProvider>
            <AuthProvider>
              <SettingsPage />
            </AuthProvider>
          </FeatureFlagsProvider>
        </ThemeProvider>
      </BrowserRouter>
    );

    expect(screen.getByText('Social Sharing')).toBeInTheDocument();
  });

  it('renders social sharing description', () => {
    render(
      <BrowserRouter>
        <ThemeProvider>
          <FeatureFlagsProvider>
            <AuthProvider>
              <SettingsPage />
            </AuthProvider>
          </FeatureFlagsProvider>
        </ThemeProvider>
      </BrowserRouter>
    );

    expect(screen.getByText('Share your donations on social media')).toBeInTheDocument();
  });

  it('renders change password label', () => {
    render(
      <BrowserRouter>
        <ThemeProvider>
          <FeatureFlagsProvider>
            <AuthProvider>
              <SettingsPage />
            </AuthProvider>
          </FeatureFlagsProvider>
        </ThemeProvider>
      </BrowserRouter>
    );

    expect(screen.getByText('Change Password')).toBeInTheDocument();
  });

  it('renders change password button', () => {
    render(
      <BrowserRouter>
        <ThemeProvider>
          <FeatureFlagsProvider>
            <AuthProvider>
              <SettingsPage />
            </AuthProvider>
          </FeatureFlagsProvider>
        </ThemeProvider>
      </BrowserRouter>
    );

    expect(screen.getByRole('button', { name: 'Change' })).toBeInTheDocument();
  });

  it('renders two factor authentication label', () => {
    render(
      <BrowserRouter>
        <ThemeProvider>
          <FeatureFlagsProvider>
            <AuthProvider>
              <SettingsPage />
            </AuthProvider>
          </FeatureFlagsProvider>
        </ThemeProvider>
      </BrowserRouter>
    );

    expect(screen.getByText('Two-Factor Authentication')).toBeInTheDocument();
  });

  it('renders two factor authentication button', () => {
    render(
      <BrowserRouter>
        <ThemeProvider>
          <FeatureFlagsProvider>
            <AuthProvider>
              <SettingsPage />
            </AuthProvider>
          </FeatureFlagsProvider>
        </ThemeProvider>
      </BrowserRouter>
    );

    expect(screen.getByRole('button', { name: 'Enable' })).toBeInTheDocument();
  });

  it('renders log out label', () => {
    render(
      <BrowserRouter>
        <ThemeProvider>
          <FeatureFlagsProvider>
            <AuthProvider>
              <SettingsPage />
            </AuthProvider>
          </FeatureFlagsProvider>
        </ThemeProvider>
      </BrowserRouter>
    );

    expect(screen.getAllByText('Log Out').length).toBeGreaterThan(0);
  });

  it('renders log out button', () => {
    render(
      <BrowserRouter>
        <ThemeProvider>
          <FeatureFlagsProvider>
            <AuthProvider>
              <SettingsPage />
            </AuthProvider>
          </FeatureFlagsProvider>
        </ThemeProvider>
      </BrowserRouter>
    );

    expect(screen.getByRole('button', { name: 'Log Out' })).toBeInTheDocument();
  });

  it('renders delete account label', () => {
    render(
      <BrowserRouter>
        <ThemeProvider>
          <FeatureFlagsProvider>
            <AuthProvider>
              <SettingsPage />
            </AuthProvider>
          </FeatureFlagsProvider>
        </ThemeProvider>
      </BrowserRouter>
    );

    expect(screen.getByText('Delete Account')).toBeInTheDocument();
  });

  it('renders delete account button', () => {
    render(
      <BrowserRouter>
        <ThemeProvider>
          <FeatureFlagsProvider>
            <AuthProvider>
              <SettingsPage />
            </AuthProvider>
          </FeatureFlagsProvider>
        </ThemeProvider>
      </BrowserRouter>
    );

    expect(screen.getByRole('button', { name: 'Delete' })).toBeInTheDocument();
  });

  it('toggles email notifications when clicked', () => {
    render(
      <BrowserRouter>
        <ThemeProvider>
          <FeatureFlagsProvider>
            <AuthProvider>
              <SettingsPage />
            </AuthProvider>
          </FeatureFlagsProvider>
        </ThemeProvider>
      </BrowserRouter>
    );

    const switches = screen.getAllByRole('button');
    const emailSwitch = switches.find((button) =>
      button.parentElement?.textContent?.includes('Email Notifications')
    );

    fireEvent.click(emailSwitch!);

    expect(emailSwitch).toBeInTheDocument();
  });

  it('toggles push notifications when clicked', () => {
    render(
      <BrowserRouter>
        <ThemeProvider>
          <FeatureFlagsProvider>
            <AuthProvider>
              <SettingsPage />
            </AuthProvider>
          </FeatureFlagsProvider>
        </ThemeProvider>
      </BrowserRouter>
    );

    const switches = screen.getAllByRole('button');
    const pushSwitch = switches.find((button) =>
      button.parentElement?.textContent?.includes('Push Notifications')
    );

    fireEvent.click(pushSwitch!);

    expect(pushSwitch).toBeInTheDocument();
  });

  it('toggles marketing emails when clicked', () => {
    render(
      <BrowserRouter>
        <ThemeProvider>
          <FeatureFlagsProvider>
            <AuthProvider>
              <SettingsPage />
            </AuthProvider>
          </FeatureFlagsProvider>
        </ThemeProvider>
      </BrowserRouter>
    );

    const switches = screen.getAllByRole('button');
    const marketingSwitch = switches.find((button) =>
      button.parentElement?.textContent?.includes('Marketing Emails')
    );

    fireEvent.click(marketingSwitch!);

    expect(marketingSwitch).toBeInTheDocument();
  });
});
