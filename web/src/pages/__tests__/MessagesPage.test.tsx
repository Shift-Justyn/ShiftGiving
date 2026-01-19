import { render, screen, fireEvent } from '@testing-library/react';
import { MessagesPage } from '../MessagesPage';
import { ThemeProvider } from '../../context/ThemeContext';
import { BrowserRouter } from 'react-router-dom';

describe('MessagesPage', () => {
  it('renders page title', () => {
    render(
      <BrowserRouter>
        <ThemeProvider>
          <MessagesPage />
        </ThemeProvider>
      </BrowserRouter>
    );

    expect(screen.getAllByText('Messages')[0]).toBeInTheDocument();
  });

  it('renders empty state when no messages', () => {
    render(
      <BrowserRouter>
        <ThemeProvider>
          <MessagesPage />
        </ThemeProvider>
      </BrowserRouter>
    );

    expect(screen.getByText('No messages yet')).toBeInTheDocument();
  });

  it('renders bottom navigation', () => {
    render(
      <BrowserRouter>
        <ThemeProvider>
          <MessagesPage />
        </ThemeProvider>
      </BrowserRouter>
    );

    expect(screen.getAllByText('Messages')[1]).toBeInTheDocument();
  });

  it('renders empty state description', () => {
    render(
      <BrowserRouter>
        <ThemeProvider>
          <MessagesPage />
        </ThemeProvider>
      </BrowserRouter>
    );

    expect(screen.getByText(/When organizations send updates/)).toBeInTheDocument();
  });

  it('renders refresh button', () => {
    render(
      <BrowserRouter>
        <ThemeProvider>
          <MessagesPage />
        </ThemeProvider>
      </BrowserRouter>
    );

    const refreshButton = screen.getByRole('button', { name: '' });
    expect(refreshButton).toBeInTheDocument();
  });

  it('loads messages when refresh button clicked', () => {
    render(
      <BrowserRouter>
        <ThemeProvider>
          <MessagesPage />
        </ThemeProvider>
      </BrowserRouter>
    );

    const refreshButton = screen.getByRole('button', { name: '' });
    fireEvent.click(refreshButton);

    expect(screen.getByText('City Food Bank')).toBeInTheDocument();
  });

  it('displays message preview text', () => {
    render(
      <BrowserRouter>
        <ThemeProvider>
          <MessagesPage />
        </ThemeProvider>
      </BrowserRouter>
    );

    const refreshButton = screen.getByRole('button', { name: '' });
    fireEvent.click(refreshButton);

    expect(screen.getByText(/urgent need in our food bank/)).toBeInTheDocument();
  });
});
