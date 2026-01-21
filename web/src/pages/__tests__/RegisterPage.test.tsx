import { render, screen, waitFor, cleanup } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { RegisterPage } from '../RegisterPage';
import { AuthProvider } from '../../context/AuthContext';
import { ThemeProvider } from '../../context/ThemeContext';
import { BrowserRouter } from 'react-router-dom';
import * as authApi from '../../api/auth';

jest.mock('../../api/auth');

const mockAuthApi = authApi as jest.Mocked<typeof authApi>;

const mockNavigate = jest.fn();
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => mockNavigate,
}));

beforeEach(() => {
  jest.clearAllMocks();
  mockNavigate.mockClear();
});

afterEach(() => {
  cleanup();
});

const renderRegisterPage = () => {
  return render(
    <BrowserRouter>
      <ThemeProvider>
        <AuthProvider>
          <RegisterPage />
        </AuthProvider>
      </ThemeProvider>
    </BrowserRouter>
  );
};

describe('RegisterPage rendering', () => {
  it('renders sign up title', () => {
    renderRegisterPage();
    expect(screen.getByText('Sign Up')).toBeInTheDocument();
  });

  it('renders user type toggle', () => {
    renderRegisterPage();
    expect(screen.getByRole('button', { name: /individual/i })).toBeInTheDocument();
  });

  it('renders first name field for individual', () => {
    renderRegisterPage();
    expect(screen.getByLabelText(/first name/i)).toBeInTheDocument();
  });

  it('renders last name field for individual', () => {
    renderRegisterPage();
    expect(screen.getByLabelText(/last name/i)).toBeInTheDocument();
  });

  it('renders email field', () => {
    renderRegisterPage();
    expect(screen.getByLabelText(/email address/i)).toBeInTheDocument();
  });

  it('renders password field for individual', () => {
    renderRegisterPage();
    expect(screen.getByLabelText(/^password/i)).toBeInTheDocument();
  });

  it('renders password hint', () => {
    renderRegisterPage();
    expect(screen.getByText('Must be at least 8 characters')).toBeInTheDocument();
  });

  it('renders continue button', () => {
    renderRegisterPage();
    expect(screen.getByRole('button', { name: /continue/i })).toBeInTheDocument();
  });

  it('renders login link', () => {
    renderRegisterPage();
    expect(screen.getByText(/have an account/i)).toBeInTheDocument();
  });
});

describe('RegisterPage user type toggle', () => {
  it('shows business name field when charity selected', async () => {
    const user = userEvent.setup();
    renderRegisterPage();

    const charityButton = screen.getByRole('button', { name: /charity/i });
    await user.click(charityButton);

    expect(screen.getByLabelText(/business name/i)).toBeInTheDocument();
  });

  it('shows tax id field when charity selected', async () => {
    const user = userEvent.setup();
    renderRegisterPage();

    const charityButton = screen.getByRole('button', { name: /charity/i });
    await user.click(charityButton);

    expect(screen.getByLabelText(/501\(c\)3 number/i)).toBeInTheDocument();
  });

  it('shows about field when charity selected', async () => {
    const user = userEvent.setup();
    renderRegisterPage();

    const charityButton = screen.getByRole('button', { name: /charity/i });
    await user.click(charityButton);

    expect(screen.getByLabelText(/about/i)).toBeInTheDocument();
  });

  it('hides first name field when charity selected', async () => {
    const user = userEvent.setup();
    renderRegisterPage();

    const charityButton = screen.getByRole('button', { name: /charity/i });
    await user.click(charityButton);

    expect(screen.queryByLabelText(/first name/i)).not.toBeInTheDocument();
  });

  it('hides password field when charity selected', async () => {
    const user = userEvent.setup();
    renderRegisterPage();

    const charityButton = screen.getByRole('button', { name: /charity/i });
    await user.click(charityButton);

    expect(screen.queryByLabelText(/^password/i)).not.toBeInTheDocument();
  });
});

describe('RegisterPage validation', () => {
  it('requires first name field', () => {
    renderRegisterPage();
    const firstNameInput = screen.getByLabelText(/first name/i);
    expect(firstNameInput).toBeRequired();
  });

  it('requires last name field', () => {
    renderRegisterPage();
    const lastNameInput = screen.getByLabelText(/last name/i);
    expect(lastNameInput).toBeRequired();
  });

  it('requires business name field for charity', async () => {
    const user = userEvent.setup();
    renderRegisterPage();

    const charityButton = screen.getByRole('button', { name: /charity/i });
    await user.click(charityButton);

    const businessNameInput = screen.getByLabelText(/business name/i);
    expect(businessNameInput).toBeRequired();
  });

  it('requires email field', () => {
    renderRegisterPage();
    const emailInput = screen.getByLabelText(/email address/i);
    expect(emailInput).toBeRequired();
  });

  it('requires password field for individual', () => {
    renderRegisterPage();
    const passwordInput = screen.getByLabelText(/^password/i);
    expect(passwordInput).toBeRequired();
  });

  it('has email type for email field', () => {
    renderRegisterPage();
    const emailInput = screen.getByLabelText(/email address/i);
    expect(emailInput).toHaveAttribute('type', 'email');
  });

  it('shows error for short password', async () => {
    const user = userEvent.setup();
    renderRegisterPage();

    const firstNameInput = screen.getByLabelText(/first name/i);
    const lastNameInput = screen.getByLabelText(/last name/i);
    const emailInput = screen.getByLabelText(/email address/i);
    const passwordInput = screen.getByLabelText(/^password/i);
    const submitButton = screen.getByRole('button', { name: /continue/i });

    await user.type(firstNameInput, 'John');
    await user.type(lastNameInput, 'Doe');
    await user.type(emailInput, 'test@example.com');
    await user.type(passwordInput, 'short');
    await user.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText(/password must be at least 8 characters/i)).toBeInTheDocument();
    });
  });
});

describe('RegisterPage successful registration', () => {
  it('calls register API with correct data', async () => {
    const user = userEvent.setup();
    mockAuthApi.register.mockResolvedValue();
    renderRegisterPage();

    const firstNameInput = screen.getByLabelText(/first name/i);
    const lastNameInput = screen.getByLabelText(/last name/i);
    const emailInput = screen.getByLabelText(/email address/i);
    const passwordInput = screen.getByLabelText(/^password/i);
    const submitButton = screen.getByRole('button', { name: /continue/i });

    await user.type(firstNameInput, 'John');
    await user.type(lastNameInput, 'Doe');
    await user.type(emailInput, 'test@example.com');
    await user.type(passwordInput, 'password123');
    await user.click(submitButton);

    await waitFor(() => {
      expect(mockAuthApi.register).toHaveBeenCalledWith({
        email: 'test@example.com',
        password: 'password123',
        firstName: 'John',
        lastName: 'Doe',
      });
    });
  });

  it('navigates to login on successful registration', async () => {
    const user = userEvent.setup();
    mockAuthApi.register.mockResolvedValue();
    renderRegisterPage();

    const firstNameInput = screen.getByLabelText(/first name/i);
    const lastNameInput = screen.getByLabelText(/last name/i);
    const emailInput = screen.getByLabelText(/email address/i);
    const passwordInput = screen.getByLabelText(/^password/i);
    const submitButton = screen.getByRole('button', { name: /continue/i });

    await user.type(firstNameInput, 'John');
    await user.type(lastNameInput, 'Doe');
    await user.type(emailInput, 'test@example.com');
    await user.type(passwordInput, 'password123');
    await user.click(submitButton);

    await waitFor(() => {
      expect(mockNavigate).toHaveBeenCalledWith('/login');
    });
  });

  it('shows loading state during registration', async () => {
    const user = userEvent.setup();
    mockAuthApi.register.mockImplementation(
      () => new Promise((resolve) => setTimeout(resolve, 100))
    );
    renderRegisterPage();

    const firstNameInput = screen.getByLabelText(/first name/i);
    const lastNameInput = screen.getByLabelText(/last name/i);
    const emailInput = screen.getByLabelText(/email address/i);
    const passwordInput = screen.getByLabelText(/^password/i);
    const submitButton = screen.getByRole('button', { name: /continue/i });

    await user.type(firstNameInput, 'John');
    await user.type(lastNameInput, 'Doe');
    await user.type(emailInput, 'test@example.com');
    await user.type(passwordInput, 'password123');
    await user.click(submitButton);

    expect(screen.getByText(/creating account/i)).toBeInTheDocument();
  });

  it('disables submit button during registration', async () => {
    const user = userEvent.setup();
    mockAuthApi.register.mockImplementation(
      () => new Promise((resolve) => setTimeout(resolve, 100))
    );
    renderRegisterPage();

    const firstNameInput = screen.getByLabelText(/first name/i);
    const lastNameInput = screen.getByLabelText(/last name/i);
    const emailInput = screen.getByLabelText(/email address/i);
    const passwordInput = screen.getByLabelText(/^password/i);
    const submitButton = screen.getByRole('button', { name: /continue/i });

    await user.type(firstNameInput, 'John');
    await user.type(lastNameInput, 'Doe');
    await user.type(emailInput, 'test@example.com');
    await user.type(passwordInput, 'password123');
    await user.click(submitButton);

    expect(screen.getByRole('button', { name: /creating account/i })).toBeDisabled();
  });
});

describe('RegisterPage failed registration', () => {
  it('shows error message on registration failure', async () => {
    const user = userEvent.setup();
    mockAuthApi.register.mockRejectedValue(new Error('Registration failed'));
    renderRegisterPage();

    const firstNameInput = screen.getByLabelText(/first name/i);
    const lastNameInput = screen.getByLabelText(/last name/i);
    const emailInput = screen.getByLabelText(/email address/i);
    const passwordInput = screen.getByLabelText(/^password/i);
    const submitButton = screen.getByRole('button', { name: /continue/i });

    await user.type(firstNameInput, 'John');
    await user.type(lastNameInput, 'Doe');
    await user.type(emailInput, 'test@example.com');
    await user.type(passwordInput, 'password123');
    await user.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText(/registration failed/i)).toBeInTheDocument();
    });
  });

  it('enables submit button after registration failure', async () => {
    const user = userEvent.setup();
    mockAuthApi.register.mockRejectedValue(new Error('Registration failed'));
    renderRegisterPage();

    const firstNameInput = screen.getByLabelText(/first name/i);
    const lastNameInput = screen.getByLabelText(/last name/i);
    const emailInput = screen.getByLabelText(/email address/i);
    const passwordInput = screen.getByLabelText(/^password/i);
    const submitButton = screen.getByRole('button', { name: /continue/i });

    await user.type(firstNameInput, 'John');
    await user.type(lastNameInput, 'Doe');
    await user.type(emailInput, 'test@example.com');
    await user.type(passwordInput, 'password123');
    await user.click(submitButton);

    await waitFor(() => {
      expect(screen.getByRole('button', { name: /continue/i })).not.toBeDisabled();
    });
  });

  it('does not navigate on registration failure', async () => {
    const user = userEvent.setup();
    mockAuthApi.register.mockRejectedValue(new Error('Registration failed'));
    renderRegisterPage();

    const firstNameInput = screen.getByLabelText(/first name/i);
    const lastNameInput = screen.getByLabelText(/last name/i);
    const emailInput = screen.getByLabelText(/email address/i);
    const passwordInput = screen.getByLabelText(/^password/i);
    const submitButton = screen.getByRole('button', { name: /continue/i });

    await user.type(firstNameInput, 'John');
    await user.type(lastNameInput, 'Doe');
    await user.type(emailInput, 'test@example.com');
    await user.type(passwordInput, 'password123');
    await user.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText(/registration failed/i)).toBeInTheDocument();
    });

    expect(mockNavigate).not.toHaveBeenCalled();
  });
});

describe('RegisterPage link to login', () => {
  it('has link to login page', () => {
    renderRegisterPage();
    const loginLink = screen.getByRole('link', { name: /log in/i });
    expect(loginLink).toHaveAttribute('href', '/login');
  });
});
