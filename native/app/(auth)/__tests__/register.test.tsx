import { render, fireEvent, waitFor, act } from '@testing-library/react-native';
import RegisterScreen from '../register';
import { useAuthStore } from '../../../src/store/authStore';

const mockReplace = jest.fn();
jest.mock('expo-router', () => ({
  useRouter: () => ({ replace: mockReplace }),
  Link: ({ children, href, asChild }: { children: React.ReactNode; href?: string; asChild?: boolean }) => children,
}));

jest.mock('../../../src/store/authStore');

describe('RegisterScreen', () => {
  test('renders register form', () => {
    (useAuthStore as unknown as jest.Mock).mockReturnValue({ register: jest.fn() });
    const { getByText } = render(<RegisterScreen />);
    expect(getByText('Sign Up')).toBeTruthy();
  });

  test('validates required fields', async () => {
    (useAuthStore as unknown as jest.Mock).mockReturnValue({ register: jest.fn() });
    const { getByText, getByTestId } = render(<RegisterScreen />);

    fireEvent.press(getByTestId('register-button'));

    await waitFor(() => {
      expect(getByText('First name is required')).toBeTruthy();
    });
  });

  test('validates password match', async () => {
    (useAuthStore as unknown as jest.Mock).mockReturnValue({ register: jest.fn() });
    const { getByLabelText, getByText, getByTestId } = render(<RegisterScreen />);

    fireEvent.changeText(getByLabelText('First Name'), 'John');
    fireEvent.changeText(getByLabelText('Last Name'), 'Doe');
    fireEvent.changeText(getByLabelText('Email'), 'john@example.com');
    fireEvent.changeText(getByLabelText('Password'), 'password123');
    fireEvent.changeText(getByLabelText('Confirm Password'), 'different');
    fireEvent.press(getByTestId('register-button'));

    await waitFor(() => {
      expect(getByText('Passwords do not match')).toBeTruthy();
    });
  });


});
