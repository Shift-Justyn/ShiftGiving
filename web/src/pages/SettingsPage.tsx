import { useState } from 'react';
import styled from 'styled-components';
import { Sidebar } from '../components/Sidebar';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { useFeatureFlags } from '../context/FeatureFlagsContext';

export function SettingsPage() {
  const { user, logout } = useAuth();
  const { mode, toggleTheme } = useTheme();
  const { flags, setFlag } = useFeatureFlags();
  const [notifications, setNotifications] = useState({
    email: true,
    push: false,
    marketing: false,
  });

  const handleLogout = () => {
    logout();
  };

  return (
    <PageContainer>
      <Sidebar />
      <MainContent>
        <Header>
          <PageTitle>Settings</PageTitle>
          <PageSubtitle>Manage your account preferences</PageSubtitle>
        </Header>

        <Section>
          <SectionTitle>Account</SectionTitle>
          <SettingRow>
            <SettingInfo>
              <SettingLabel>Email</SettingLabel>
              <SettingValue>{user?.email}</SettingValue>
            </SettingInfo>
          </SettingRow>
          <SettingRow>
            <SettingInfo>
              <SettingLabel>Name</SettingLabel>
              <SettingValue>
                {user?.firstName} {user?.lastName}
              </SettingValue>
            </SettingInfo>
            <EditButton>Edit</EditButton>
          </SettingRow>
          <SettingRow>
            <SettingInfo>
              <SettingLabel>Account Type</SettingLabel>
              <SettingValue>{user?.userType}</SettingValue>
            </SettingInfo>
          </SettingRow>
        </Section>

        <Section>
          <SectionTitle>Appearance</SectionTitle>
          <SettingRow>
            <SettingInfo>
              <SettingLabel>Theme</SettingLabel>
              <SettingDescription>Choose between light and dark mode</SettingDescription>
            </SettingInfo>
            <ToggleGroup>
              <ToggleButton
                $active={mode === 'light'}
                onClick={() => mode === 'dark' && toggleTheme()}
              >
                <SunIcon />
                Light
              </ToggleButton>
              <ToggleButton
                $active={mode === 'dark'}
                onClick={() => mode === 'light' && toggleTheme()}
              >
                <MoonIcon />
                Dark
              </ToggleButton>
            </ToggleGroup>
          </SettingRow>
        </Section>

        <Section>
          <SectionTitle>Notifications</SectionTitle>
          <SettingRow>
            <SettingInfo>
              <SettingLabel>Email Notifications</SettingLabel>
              <SettingDescription>
                Receive updates about your donations and campaigns
              </SettingDescription>
            </SettingInfo>
            <Switch
              $checked={notifications.email}
              onClick={() => setNotifications((prev) => ({ ...prev, email: !prev.email }))}
            >
              <SwitchThumb $checked={notifications.email} />
            </Switch>
          </SettingRow>
          <SettingRow>
            <SettingInfo>
              <SettingLabel>Push Notifications</SettingLabel>
              <SettingDescription>Get notified on your device</SettingDescription>
            </SettingInfo>
            <Switch
              $checked={notifications.push}
              onClick={() => setNotifications((prev) => ({ ...prev, push: !prev.push }))}
            >
              <SwitchThumb $checked={notifications.push} />
            </Switch>
          </SettingRow>
          <SettingRow>
            <SettingInfo>
              <SettingLabel>Marketing Emails</SettingLabel>
              <SettingDescription>Receive news and promotional content</SettingDescription>
            </SettingInfo>
            <Switch
              $checked={notifications.marketing}
              onClick={() => setNotifications((prev) => ({ ...prev, marketing: !prev.marketing }))}
            >
              <SwitchThumb $checked={notifications.marketing} />
            </Switch>
          </SettingRow>
        </Section>

        <Section>
          <SectionTitle>Features</SectionTitle>
          <SettingDescription style={{ marginBottom: '1rem' }}>
            Enable or disable experimental features
          </SettingDescription>
          <SettingRow>
            <SettingInfo>
              <SettingLabel>Recurring Donations</SettingLabel>
              <SettingDescription>Set up monthly recurring donations</SettingDescription>
            </SettingInfo>
            <Switch
              $checked={flags.RECURRING_DONATIONS}
              onClick={() => setFlag('RECURRING_DONATIONS', !flags.RECURRING_DONATIONS)}
            >
              <SwitchThumb $checked={flags.RECURRING_DONATIONS} />
            </Switch>
          </SettingRow>
          <SettingRow>
            <SettingInfo>
              <SettingLabel>Social Sharing</SettingLabel>
              <SettingDescription>Share your donations on social media</SettingDescription>
            </SettingInfo>
            <Switch
              $checked={flags.SOCIAL_SHARING}
              onClick={() => setFlag('SOCIAL_SHARING', !flags.SOCIAL_SHARING)}
            >
              <SwitchThumb $checked={flags.SOCIAL_SHARING} />
            </Switch>
          </SettingRow>
        </Section>

        <Section>
          <SectionTitle>Security</SectionTitle>
          <SettingRow>
            <SettingInfo>
              <SettingLabel>Change Password</SettingLabel>
              <SettingDescription>Update your account password</SettingDescription>
            </SettingInfo>
            <EditButton>Change</EditButton>
          </SettingRow>
          <SettingRow>
            <SettingInfo>
              <SettingLabel>Two-Factor Authentication</SettingLabel>
              <SettingDescription>Add an extra layer of security</SettingDescription>
            </SettingInfo>
            <EditButton>Enable</EditButton>
          </SettingRow>
        </Section>

        <DangerSection>
          <SectionTitle>Danger Zone</SectionTitle>
          <SettingRow>
            <SettingInfo>
              <SettingLabel>Log Out</SettingLabel>
              <SettingDescription>Sign out of your account on this device</SettingDescription>
            </SettingInfo>
            <LogoutButton onClick={handleLogout}>Log Out</LogoutButton>
          </SettingRow>
          <SettingRow>
            <SettingInfo>
              <SettingLabel>Delete Account</SettingLabel>
              <SettingDescription>Permanently delete your account and all data</SettingDescription>
            </SettingInfo>
            <DeleteButton>Delete</DeleteButton>
          </SettingRow>
        </DangerSection>
      </MainContent>
    </PageContainer>
  );
}

const SunIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <circle cx="12" cy="12" r="5" />
    <line x1="12" y1="1" x2="12" y2="3" />
    <line x1="12" y1="21" x2="12" y2="23" />
    <line x1="4.22" y1="4.22" x2="5.64" y2="5.64" />
    <line x1="18.36" y1="18.36" x2="19.78" y2="19.78" />
    <line x1="1" y1="12" x2="3" y2="12" />
    <line x1="21" y1="12" x2="23" y2="12" />
    <line x1="4.22" y1="19.78" x2="5.64" y2="18.36" />
    <line x1="18.36" y1="5.64" x2="19.78" y2="4.22" />
  </svg>
);

const MoonIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
  </svg>
);

const PageContainer = styled.div`
  display: flex;
  min-height: 100vh;
  background-color: ${(props) => props.theme.colors.background.page};
`;

const MainContent = styled.main`
  flex: 1;
  padding: 2rem;
  overflow-y: auto;
  max-width: 800px;

  @media (max-width: 768px) {
    padding: 1rem;
    padding-top: 4rem;
  }
`;

const Header = styled.header`
  margin-bottom: 2rem;
`;

const PageTitle = styled.h1`
  font-size: 2rem;
  font-weight: 700;
  color: ${(props) => props.theme.colors.text.primary};
  margin: 0 0 0.5rem 0;
`;

const PageSubtitle = styled.p`
  font-size: 1rem;
  color: ${(props) => props.theme.colors.text.secondary};
  margin: 0;
`;

const Section = styled.section`
  background: ${(props) => props.theme.colors.background.card};
  border-radius: 0.75rem;
  padding: 1.5rem;
  margin-bottom: 1.5rem;
  border: 1px solid ${(props) => props.theme.colors.border.light};
`;

const DangerSection = styled(Section)`
  border-color: rgba(239, 68, 68, 0.3);
`;

const SectionTitle = styled.h2`
  font-size: 1.125rem;
  font-weight: 600;
  color: ${(props) => props.theme.colors.text.primary};
  margin: 0 0 1rem 0;
`;

const SettingRow = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem 0;
  border-bottom: 1px solid ${(props) => props.theme.colors.border.light};

  &:last-child {
    border-bottom: none;
    padding-bottom: 0;
  }

  &:first-of-type {
    padding-top: 0;
  }
`;

const SettingInfo = styled.div`
  flex: 1;
`;

const SettingLabel = styled.div`
  font-size: 0.9375rem;
  font-weight: 600;
  color: ${(props) => props.theme.colors.text.primary};
`;

const SettingValue = styled.div`
  font-size: 0.875rem;
  color: ${(props) => props.theme.colors.text.secondary};
  margin-top: 0.25rem;
`;

const SettingDescription = styled.p`
  font-size: 0.8125rem;
  color: ${(props) => props.theme.colors.text.tertiary};
  margin: 0.25rem 0 0 0;
`;

const EditButton = styled.button`
  padding: 0.5rem 1rem;
  background: transparent;
  color: ${(props) => props.theme.colors.primary.main};
  border: 1px solid ${(props) => props.theme.colors.primary.main};
  border-radius: 0.375rem;
  font-size: 0.875rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    background: ${(props) => props.theme.colors.primary.light};
  }
`;

const LogoutButton = styled(EditButton)`
  color: ${(props) => props.theme.colors.text.secondary};
  border-color: ${(props) => props.theme.colors.border.medium};

  &:hover {
    background: ${(props) => props.theme.colors.background.page};
  }
`;

const DeleteButton = styled(EditButton)`
  color: #ef4444;
  border-color: #ef4444;

  &:hover {
    background: rgba(239, 68, 68, 0.1);
  }
`;

const ToggleGroup = styled.div`
  display: flex;
  background: ${(props) => props.theme.colors.background.page};
  border-radius: 0.5rem;
  padding: 0.25rem;
`;

const ToggleButton = styled.button<{ $active: boolean }>`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem 1rem;
  background: ${(props) => (props.$active ? props.theme.colors.background.card : 'transparent')};
  color: ${(props) =>
    props.$active ? props.theme.colors.text.primary : props.theme.colors.text.tertiary};
  border: none;
  border-radius: 0.375rem;
  font-size: 0.875rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
  box-shadow: ${(props) => (props.$active ? '0 1px 3px rgba(0, 0, 0, 0.1)' : 'none')};

  &:hover {
    color: ${(props) => props.theme.colors.text.primary};
  }
`;

const Switch = styled.button<{ $checked: boolean }>`
  position: relative;
  width: 3rem;
  height: 1.5rem;
  background: ${(props) =>
    props.$checked ? props.theme.colors.primary.main : props.theme.colors.border.medium};
  border: none;
  border-radius: 0.75rem;
  cursor: pointer;
  transition: background 0.2s ease;
`;

const SwitchThumb = styled.div<{ $checked: boolean }>`
  position: absolute;
  top: 0.125rem;
  left: ${(props) => (props.$checked ? '1.625rem' : '0.125rem')};
  width: 1.25rem;
  height: 1.25rem;
  background: white;
  border-radius: 50%;
  transition: left 0.2s ease;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.2);
`;
