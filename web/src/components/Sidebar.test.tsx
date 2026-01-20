import { render, screen } from '@testing-library/react';
import { Sidebar } from './Sidebar';
import { ThemeProvider as StyledThemeProvider } from 'styled-components';
import { lightTheme } from '../themes';
import { BrowserRouter } from 'react-router-dom';
import { I18nextProvider } from 'react-i18next';
import i18n from '../i18n';
import { AuthProvider } from '../context/AuthContext';
import { ThemeProvider } from '../context/ThemeContext';

const renderWithProviders = (component: React.ReactElement) => {
  return render(
    <I18nextProvider i18n={i18n}>
      <StyledThemeProvider theme={lightTheme}>
        <ThemeProvider>
          <BrowserRouter>
            <AuthProvider>{component}</AuthProvider>
          </BrowserRouter>
        </ThemeProvider>
      </StyledThemeProvider>
    </I18nextProvider>
  );
};

describe('Sidebar', () => {
  it('renders create campaign navigation item', () => {
    renderWithProviders(<Sidebar />);

    expect(screen.getByText('Create Campaign')).toBeInTheDocument();
  });

  it('renders discover campaigns navigation item', () => {
    renderWithProviders(<Sidebar />);

    expect(screen.getByText('Discover Campaigns')).toBeInTheDocument();
  });

  it('renders my impact navigation item', () => {
    renderWithProviders(<Sidebar />);

    expect(screen.getByText('My Impact')).toBeInTheDocument();
  });

  it('renders history navigation item', () => {
    renderWithProviders(<Sidebar />);

    expect(screen.getByText('History')).toBeInTheDocument();
  });

  it('renders messages navigation item', () => {
    renderWithProviders(<Sidebar />);

    expect(screen.getByText('Messages')).toBeInTheDocument();
  });

  it('renders settings navigation item', () => {
    renderWithProviders(<Sidebar />);

    expect(screen.getByText('Settings')).toBeInTheDocument();
  });
});
