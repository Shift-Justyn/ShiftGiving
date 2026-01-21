import { render, screen } from '@testing-library/react';
import { HistoryPage } from '../HistoryPage';
import { AuthProvider } from '../../context/AuthContext';
import { ThemeProvider } from '../../context/ThemeContext';
import { BrowserRouter } from 'react-router-dom';

describe('HistoryPage', () => {
  it('renders history title', () => {
    render(
      <BrowserRouter>
        <ThemeProvider>
          <AuthProvider>
            <HistoryPage />
          </AuthProvider>
        </ThemeProvider>
      </BrowserRouter>
    );

    expect(screen.getByRole('heading', { name: 'History' })).toBeInTheDocument();
  });

  it('renders user avatar', () => {
    render(
      <BrowserRouter>
        <ThemeProvider>
          <AuthProvider>
            <HistoryPage />
          </AuthProvider>
        </ThemeProvider>
      </BrowserRouter>
    );

    expect(screen.getByRole('button', { name: /user avatar/i })).toBeInTheDocument();
  });

  it('renders add icon button', () => {
    render(
      <BrowserRouter>
        <ThemeProvider>
          <AuthProvider>
            <HistoryPage />
          </AuthProvider>
        </ThemeProvider>
      </BrowserRouter>
    );

    expect(screen.getByLabelText('Add')).toBeInTheDocument();
  });

  it('renders export icon button', () => {
    render(
      <BrowserRouter>
        <ThemeProvider>
          <AuthProvider>
            <HistoryPage />
          </AuthProvider>
        </ThemeProvider>
      </BrowserRouter>
    );

    expect(screen.getByLabelText('Export')).toBeInTheDocument();
  });

  it('renders print icon button', () => {
    render(
      <BrowserRouter>
        <ThemeProvider>
          <AuthProvider>
            <HistoryPage />
          </AuthProvider>
        </ThemeProvider>
      </BrowserRouter>
    );

    expect(screen.getByLabelText('Print')).toBeInTheDocument();
  });

  it('renders search input', () => {
    render(
      <BrowserRouter>
        <ThemeProvider>
          <AuthProvider>
            <HistoryPage />
          </AuthProvider>
        </ThemeProvider>
      </BrowserRouter>
    );

    expect(screen.getByPlaceholderText('Search for a charity or nonprofit')).toBeInTheDocument();
  });

  it('renders bottom navigation', () => {
    render(
      <BrowserRouter>
        <ThemeProvider>
          <AuthProvider>
            <HistoryPage />
          </AuthProvider>
        </ThemeProvider>
      </BrowserRouter>
    );

    expect(screen.getAllByRole('navigation').length).toBeGreaterThan(0);
  });

  it('renders donation list', () => {
    render(
      <BrowserRouter>
        <ThemeProvider>
          <AuthProvider>
            <HistoryPage />
          </AuthProvider>
        </ThemeProvider>
      </BrowserRouter>
    );

    expect(screen.getByRole('list')).toBeInTheDocument();
  });
});
