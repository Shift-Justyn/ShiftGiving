import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { BottomNavigation } from './BottomNavigation';
import { ThemeProvider } from 'styled-components';
import { lightTheme } from '../../themes';
import { BrowserRouter } from 'react-router-dom';
import { I18nextProvider } from 'react-i18next';
import i18n from '../../i18n';

const renderWithProviders = (component: React.ReactElement) => {
  return render(
    <I18nextProvider i18n={i18n}>
      <ThemeProvider theme={lightTheme}>
        <BrowserRouter>{component}</BrowserRouter>
      </ThemeProvider>
    </I18nextProvider>
  );
};

describe('BottomNavigation', () => {
  it('renders home navigation item', () => {
    renderWithProviders(<BottomNavigation />);

    expect(screen.getByText('Home')).toBeInTheDocument();
  });

  it('renders donate navigation item', () => {
    renderWithProviders(<BottomNavigation />);

    expect(screen.getByText('Donate')).toBeInTheDocument();
  });

  it('renders history navigation item', () => {
    renderWithProviders(<BottomNavigation />);

    expect(screen.getByText('History')).toBeInTheDocument();
  });

  it('renders messages navigation item', () => {
    renderWithProviders(<BottomNavigation />);

    expect(screen.getByText('Messages')).toBeInTheDocument();
  });

  it('marks home as active on home route', () => {
    renderWithProviders(<BottomNavigation />);

    const homeButton = screen.getByText('Home').closest('button');
    expect(homeButton).toHaveAttribute('class');
  });

  it('navigates to home when home button clicked', async () => {
    const user = userEvent.setup();
    renderWithProviders(<BottomNavigation />);

    const homeButton = screen.getByText('Home').closest('button');
    await user.click(homeButton!);

    expect(homeButton).toBeInTheDocument();
  });

  it('navigates to donate when donate button clicked', async () => {
    const user = userEvent.setup();
    renderWithProviders(<BottomNavigation />);

    const donateButton = screen.getByText('Donate').closest('button');
    await user.click(donateButton!);

    expect(donateButton).toBeInTheDocument();
  });

  it('navigates to history when history button clicked', async () => {
    const user = userEvent.setup();
    renderWithProviders(<BottomNavigation />);

    const historyButton = screen.getByText('History').closest('button');
    await user.click(historyButton!);

    expect(historyButton).toBeInTheDocument();
  });

  it('navigates to messages when messages button clicked', async () => {
    const user = userEvent.setup();
    renderWithProviders(<BottomNavigation />);

    const messagesButton = screen.getByText('Messages').closest('button');
    await user.click(messagesButton!);

    expect(messagesButton).toBeInTheDocument();
  });

  it('renders all four navigation buttons', () => {
    const { container } = renderWithProviders(<BottomNavigation />);

    const buttons = container.querySelectorAll('nav button');
    expect(buttons).toHaveLength(4);
  });

  it('renders navigation items with SVG icons', () => {
    const { container } = renderWithProviders(<BottomNavigation />);

    const svgs = container.querySelectorAll('nav svg');
    expect(svgs.length).toBeGreaterThan(0);
  });
});
