import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { LoginPage } from '../LoginPage';
import { BrowserRouter } from 'react-router-dom';
import { AuthProvider } from '../../context/AuthContext';
import { ThemeProvider } from '../../context/ThemeContext';
import * as authApi from '../../api/auth';

jest.mock('../../api/auth');

const mockAuthApi = authApi as jest.Mocked<typeof authApi>;

const mockNavigate = jest.fn();

jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => mockNavigate,
}));

const renderLoginPage = () => {
  return render(
    <BrowserRouter>
      <ThemeProvider>
        <AuthProvider>
          <LoginPage />
        </AuthProvider>
      </ThemeProvider>
    </BrowserRouter>
  );
};

beforeEach(() => {
  jest.clearAllMocks();
  mockNavigate.mockClear();
  localStorage.clear();
});

describe('LoginPage rendering', () => {
  it('renders email input field', () => {
    renderLoginPage();
    expect(screen.getByLabelText('Email')).toBeInTheDocument();
  });

  it('renders password input field', () => {
    renderLoginPage();
    expect(screen.getByLabelText('Password')).toBeInTheDocument();
  });

  it('renders submit button', () => {
    renderLoginPage();
    expect(screen.getByRole('button', { name: 'Continue' })).toBeInTheDocument();
  });

  it('renders welcome back title', () => {
    renderLoginPage();
    expect(screen.getByText('Welcome Back')).toBeInTheDocument();
  });

  it('renders tagline', () => {
    renderLoginPage();
    expect(screen.getByText('Sign in to continue making a difference')).toBeInTheDocument();
  });

  it('renders forgot password link', () => {
    renderLoginPage();
    expect(screen.getByText('Forgot password?')).toBeInTheDocument();
  });

  it('renders password toggle button', () => {
    renderLoginPage();
    expect(screen.getByLabelText('Show password')).toBeInTheDocument();
  });

  it('renders email placeholder', () => {
    renderLoginPage();
    expect(screen.getByPlaceholderText('you@example.com')).toBeInTheDocument();
  });

  it('renders password placeholder', () => {
    renderLoginPage();
    expect(screen.getByPlaceholderText('Enter your password')).toBeInTheDocument();
  });

  it('renders trust badge for secure login', () => {
    renderLoginPage();
    expect(screen.getByText('Secure Login')).toBeInTheDocument();
  });

  it('renders trust badge for no spam', () => {
    renderLoginPage();
    expect(screen.getByText('No Spam, Ever')).toBeInTheDocument();
  });

  it('renders trust badge for setup time', () => {
    renderLoginPage();
    expect(screen.getByText('2 Min Setup')).toBeInTheDocument();
  });
});

describe('LoginPage form validation', () => {
  it('shows error for invalid email format', async () => {
    renderLoginPage();

    const emailInput = screen.getByLabelText('Email');
    const passwordInput = screen.getByLabelText('Password');
    const form = emailInput.closest('form');

    fireEvent.change(emailInput, { target: { value: 'invalid-email' } });
    fireEvent.change(passwordInput, { target: { value: 'password123' } });

    if (form) {
      fireEvent.submit(form);
    }

    await waitFor(() => {
      expect(screen.getByText('Please enter a valid email address')).toBeInTheDocument();
    });
  });

  it('shows error for empty password', async () => {
    renderLoginPage();

    const emailInput = screen.getByLabelText('Email');
    const passwordInput = screen.getByLabelText('Password');
    const form = emailInput.closest('form');

    fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
    fireEvent.change(passwordInput, { target: { value: '' } });

    if (form) {
      fireEvent.submit(form);
    }

    await waitFor(() => {
      expect(screen.getByText('Password is required')).toBeInTheDocument();
    });
  });

  it('does not show error for valid email', async () => {
    mockAuthApi.login.mockResolvedValue({
      token: 'test-token',
      refreshToken: 'test-refresh',
      user: {
        id: 'test-user-id',
        email: 'test@example.com',
        firstName: 'Test',
        lastName: 'User',
        userType: 'donor',
        avatarUrl: null,
      },
    });

    renderLoginPage();

    const emailInput = screen.getByLabelText('Email');
    const passwordInput = screen.getByLabelText('Password');
    const submitButton = screen.getByRole('button', { name: 'Continue' });

    fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
    fireEvent.change(passwordInput, { target: { value: 'password123' } });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(screen.queryByText('Please enter a valid email address')).not.toBeInTheDocument();
    });
  });
});

describe('LoginPage successful login', () => {
  it('calls login with correct credentials', async () => {
    mockAuthApi.login.mockResolvedValue({
      token: 'test-token',
      refreshToken: 'test-refresh',
      user: {
        id: 'test-user-id',
        email: 'test@example.com',
        firstName: 'Test',
        lastName: 'User',
        userType: 'donor',
        avatarUrl: null,
      },
    });

    renderLoginPage();

    const emailInput = screen.getByLabelText('Email');
    const passwordInput = screen.getByLabelText('Password');
    const submitButton = screen.getByRole('button', { name: 'Continue' });

    fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
    fireEvent.change(passwordInput, { target: { value: 'password123' } });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(mockAuthApi.login).toHaveBeenCalledWith({
        email: 'test@example.com',
        password: 'password123',
      });
    });
  });

  it('navigates to home page after successful login', async () => {
    mockAuthApi.login.mockResolvedValue({
      token: 'test-token',
      refreshToken: 'test-refresh',
      user: {
        id: 'test-user-id',
        email: 'test@example.com',
        firstName: 'Test',
        lastName: 'User',
        userType: 'donor',
        avatarUrl: null,
      },
    });

    renderLoginPage();

    const emailInput = screen.getByLabelText('Email');
    const passwordInput = screen.getByLabelText('Password');
    const submitButton = screen.getByRole('button', { name: 'Continue' });

    fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
    fireEvent.change(passwordInput, { target: { value: 'password123' } });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(mockNavigate).toHaveBeenCalledWith('/');
    });
  });

  it('shows signing in text during login', async () => {
    mockAuthApi.login.mockImplementation(
      () =>
        new Promise((resolve) =>
          setTimeout(
            () =>
              resolve({
                token: 'test-token',
                refreshToken: 'test-refresh',
                user: {
                  id: 'test-user-id',
                  email: 'test@example.com',
                  firstName: 'Test',
                  lastName: 'User',
                  userType: 'donor',
                  avatarUrl: null,
                },
              }),
            100
          )
        )
    );

    renderLoginPage();

    const emailInput = screen.getByLabelText('Email');
    const passwordInput = screen.getByLabelText('Password');
    const submitButton = screen.getByRole('button', { name: 'Continue' });

    fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
    fireEvent.change(passwordInput, { target: { value: 'password123' } });
    fireEvent.click(submitButton);

    expect(screen.getByText('Signing in...')).toBeInTheDocument();
  });

  it('disables form during login', async () => {
    mockAuthApi.login.mockImplementation(
      () =>
        new Promise((resolve) =>
          setTimeout(
            () =>
              resolve({
                token: 'test-token',
                refreshToken: 'test-refresh',
                user: {
                  id: 'test-user-id',
                  email: 'test@example.com',
                  firstName: 'Test',
                  lastName: 'User',
                  userType: 'donor',
                  avatarUrl: null,
                },
              }),
            100
          )
        )
    );

    renderLoginPage();

    const emailInput = screen.getByLabelText('Email') as HTMLInputElement;
    const passwordInput = screen.getByLabelText('Password') as HTMLInputElement;
    const submitButton = screen.getByRole('button', { name: 'Continue' }) as HTMLButtonElement;

    fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
    fireEvent.change(passwordInput, { target: { value: 'password123' } });
    fireEvent.click(submitButton);

    expect(submitButton.disabled).toBe(true);
  });

  it('disables email input during login', async () => {
    mockAuthApi.login.mockImplementation(
      () =>
        new Promise((resolve) =>
          setTimeout(
            () =>
              resolve({
                token: 'test-token',
                refreshToken: 'test-refresh',
                user: {
                  id: 'test-user-id',
                  email: 'test@example.com',
                  firstName: 'Test',
                  lastName: 'User',
                  userType: 'donor',
                  avatarUrl: null,
                },
              }),
            100
          )
        )
    );

    renderLoginPage();

    const emailInput = screen.getByLabelText('Email') as HTMLInputElement;
    const passwordInput = screen.getByLabelText('Password') as HTMLInputElement;
    const submitButton = screen.getByRole('button', { name: 'Continue' }) as HTMLButtonElement;

    fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
    fireEvent.change(passwordInput, { target: { value: 'password123' } });
    fireEvent.click(submitButton);

    expect(emailInput.disabled).toBe(true);
  });

  it('disables password input during login', async () => {
    mockAuthApi.login.mockImplementation(
      () =>
        new Promise((resolve) =>
          setTimeout(
            () =>
              resolve({
                token: 'test-token',
                refreshToken: 'test-refresh',
                user: {
                  id: 'test-user-id',
                  email: 'test@example.com',
                  firstName: 'Test',
                  lastName: 'User',
                  userType: 'donor',
                  avatarUrl: null,
                },
              }),
            100
          )
        )
    );

    renderLoginPage();

    const emailInput = screen.getByLabelText('Email') as HTMLInputElement;
    const passwordInput = screen.getByLabelText('Password') as HTMLInputElement;
    const submitButton = screen.getByRole('button', { name: 'Continue' }) as HTMLButtonElement;

    fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
    fireEvent.change(passwordInput, { target: { value: 'password123' } });
    fireEvent.click(submitButton);

    expect(passwordInput.disabled).toBe(true);
  });
});

describe('LoginPage failed login', () => {
  it('shows error message on failed login', async () => {
    mockAuthApi.login.mockRejectedValue(new Error('Invalid credentials'));

    renderLoginPage();

    const emailInput = screen.getByLabelText('Email');
    const passwordInput = screen.getByLabelText('Password');
    const submitButton = screen.getByRole('button', { name: 'Continue' });

    fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
    fireEvent.change(passwordInput, { target: { value: 'wrongpassword' } });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText('Invalid email or password')).toBeInTheDocument();
    });
  });

  it('does not navigate on failed login', async () => {
    mockAuthApi.login.mockRejectedValue(new Error('Invalid credentials'));

    renderLoginPage();

    const emailInput = screen.getByLabelText('Email');
    const passwordInput = screen.getByLabelText('Password');
    const submitButton = screen.getByRole('button', { name: 'Continue' });

    fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
    fireEvent.change(passwordInput, { target: { value: 'wrongpassword' } });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText('Invalid email or password')).toBeInTheDocument();
    });

    expect(mockNavigate).not.toHaveBeenCalled();
  });

  it('re-enables form after failed login', async () => {
    mockAuthApi.login.mockRejectedValue(new Error('Invalid credentials'));

    renderLoginPage();

    const emailInput = screen.getByLabelText('Email') as HTMLInputElement;
    const passwordInput = screen.getByLabelText('Password') as HTMLInputElement;
    const submitButton = screen.getByRole('button', { name: 'Continue' }) as HTMLButtonElement;

    fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
    fireEvent.change(passwordInput, { target: { value: 'wrongpassword' } });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText('Invalid email or password')).toBeInTheDocument();
    });

    expect(submitButton.disabled).toBe(false);
  });

  it('clears error on new form submission', async () => {
    mockAuthApi.login.mockRejectedValue(new Error('Invalid credentials'));

    renderLoginPage();

    const emailInput = screen.getByLabelText('Email');
    const passwordInput = screen.getByLabelText('Password');
    const submitButton = screen.getByRole('button', { name: 'Continue' });

    fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
    fireEvent.change(passwordInput, { target: { value: 'wrongpassword' } });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText('Invalid email or password')).toBeInTheDocument();
    });

    mockAuthApi.login.mockResolvedValue({
      token: 'test-token',
      refreshToken: 'test-refresh',
      user: {
        id: 'test-user-id',
        email: 'test@example.com',
        firstName: 'Test',
        lastName: 'User',
        userType: 'donor',
        avatarUrl: null,
      },
    });

    fireEvent.change(passwordInput, { target: { value: 'correctpassword' } });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(screen.queryByText('Invalid email or password')).not.toBeInTheDocument();
    });
  });
});

describe('LoginPage password visibility toggle', () => {
  it('password input type is password by default', () => {
    renderLoginPage();
    const passwordInput = screen.getByLabelText('Password') as HTMLInputElement;
    expect(passwordInput.type).toBe('password');
  });

  it('changes password input type to text when toggle clicked', () => {
    renderLoginPage();
    const passwordInput = screen.getByLabelText('Password') as HTMLInputElement;
    const toggleButton = screen.getByLabelText('Show password');

    fireEvent.click(toggleButton);

    expect(passwordInput.type).toBe('text');
  });

  it('changes password input type back to password when toggle clicked again', () => {
    renderLoginPage();
    const passwordInput = screen.getByLabelText('Password') as HTMLInputElement;
    const toggleButton = screen.getByLabelText('Show password');

    fireEvent.click(toggleButton);
    expect(passwordInput.type).toBe('text');

    const hideToggleButton = screen.getByLabelText('Hide password');
    fireEvent.click(hideToggleButton);

    expect(passwordInput.type).toBe('password');
  });

  it('updates toggle button aria label when password is visible', () => {
    renderLoginPage();
    const toggleButton = screen.getByLabelText('Show password');

    fireEvent.click(toggleButton);

    expect(screen.getByLabelText('Hide password')).toBeInTheDocument();
  });
});

describe('LoginPage form inputs', () => {
  it('updates email input value when typed', () => {
    renderLoginPage();
    const emailInput = screen.getByLabelText('Email') as HTMLInputElement;

    fireEvent.change(emailInput, { target: { value: 'test@example.com' } });

    expect(emailInput.value).toBe('test@example.com');
  });

  it('updates password input value when typed', () => {
    renderLoginPage();
    const passwordInput = screen.getByLabelText('Password') as HTMLInputElement;

    fireEvent.change(passwordInput, { target: { value: 'password123' } });

    expect(passwordInput.value).toBe('password123');
  });

  it('email input has email type', () => {
    renderLoginPage();
    const emailInput = screen.getByLabelText('Email') as HTMLInputElement;

    expect(emailInput.type).toBe('email');
  });

  it('email input is required', () => {
    renderLoginPage();
    const emailInput = screen.getByLabelText('Email') as HTMLInputElement;

    expect(emailInput.required).toBe(true);
  });

  it('password input is required', () => {
    renderLoginPage();
    const passwordInput = screen.getByLabelText('Password') as HTMLInputElement;

    expect(passwordInput.required).toBe(true);
  });
});
