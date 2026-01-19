import { render, fireEvent, waitFor, act } from '@testing-library/react-native';
import LoginScreen from '../login';
import { useAuthStore } from '../../../src/store/authStore';

const mockReplace = jest.fn();
jest.mock('expo-router', () => ({
  useRouter: () => ({ replace: mockReplace }),
  Link: ({ children, href, asChild }: { children: React.ReactNode; href?: string; asChild?: boolean }) => children,
}));

jest.mock('../../../src/store/authStore');

describe('LoginScreen', () => {
  test('renders login form', () => {
    (useAuthStore as unknown as jest.Mock).mockReturnValue({ login: jest.fn() });
    const { getByText } = render(<LoginScreen />);
    expect(getByText('Log In')).toBeTruthy();
  });

  test('validates email format', async () => {
    (useAuthStore as unknown as jest.Mock).mockReturnValue({ login: jest.fn() });
    const { getByLabelText, getByText, getByTestId } = render(<LoginScreen />);

    fireEvent.changeText(getByLabelText('Email'), 'invalid-email');
    fireEvent.press(getByTestId('login-button'));

    await waitFor(() => {
      expect(getByText('Invalid email address')).toBeTruthy();
    });
  });

  test('validates password length', async () => {
    (useAuthStore as unknown as jest.Mock).mockReturnValue({ login: jest.fn() });
    const { getByLabelText, getByText, getByTestId } = render(<LoginScreen />);

    fireEvent.changeText(getByLabelText('Email'), 'test@example.com');
    fireEvent.changeText(getByLabelText('Password'), '123');
    fireEvent.press(getByTestId('login-button'));

    await waitFor(() => {
      expect(getByText('Password must be at least 6 characters')).toBeTruthy();
    });
  });


});
