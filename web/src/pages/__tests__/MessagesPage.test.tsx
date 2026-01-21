import { render, screen, fireEvent } from '@testing-library/react';
import { MessagesPage } from '../MessagesPage';
import { ThemeProvider } from '../../context/ThemeContext';
import { AuthProvider } from '../../context/AuthContext';
import { BrowserRouter } from 'react-router-dom';

const renderWithProviders = (ui: React.ReactElement) => {
  return render(
    <BrowserRouter>
      <ThemeProvider>
        <AuthProvider>{ui}</AuthProvider>
      </ThemeProvider>
    </BrowserRouter>
  );
};

describe('MessagesPage', () => {
  it('renders page title', () => {
    renderWithProviders(<MessagesPage />);
    expect(screen.getAllByText('Messages')[0]).toBeInTheDocument();
  });

  it('renders empty state when no messages', () => {
    renderWithProviders(<MessagesPage />);
    expect(screen.getByText('No messages yet')).toBeInTheDocument();
  });

  it('renders sidebar navigation', () => {
    renderWithProviders(<MessagesPage />);
    expect(screen.getAllByRole('navigation').length).toBeGreaterThan(0);
  });

  it('renders empty state description', () => {
    renderWithProviders(<MessagesPage />);
    expect(screen.getByText(/When organizations send updates/)).toBeInTheDocument();
  });

  it('renders refresh button', () => {
    renderWithProviders(<MessagesPage />);
    const refreshButtons = screen.getAllByRole('button');
    expect(refreshButtons.length).toBeGreaterThan(0);
  });

  it('loads messages when refresh button clicked', () => {
    renderWithProviders(<MessagesPage />);
    const buttons = screen.getAllByRole('button');
    const refreshButton = buttons.find(
      (btn) => btn.getAttribute('aria-label') === 'Refresh messages'
    );
    if (refreshButton) {
      fireEvent.click(refreshButton);
      expect(screen.getByText('City Food Bank')).toBeInTheDocument();
    }
  });

  it('displays message preview text', () => {
    renderWithProviders(<MessagesPage />);
    const buttons = screen.getAllByRole('button');
    const refreshButton = buttons.find(
      (btn) => btn.getAttribute('aria-label') === 'Refresh messages'
    );
    if (refreshButton) {
      fireEvent.click(refreshButton);
      expect(screen.getByText(/urgent need in our food bank/)).toBeInTheDocument();
    }
  });
});
