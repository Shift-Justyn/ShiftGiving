import { render, fireEvent } from '@testing-library/react-native';
import { Input } from '../Input';

describe('Input', () => {
  test('renders with label', () => {
    const { getByText } = render(<Input label="Email" />);
    expect(getByText('Email')).toBeTruthy();
  });

  test('handles text change', () => {
    const onChangeText = jest.fn();
    const { getByPlaceholderText } = render(<Input placeholder="Enter text" onChangeText={onChangeText} />);
    fireEvent.changeText(getByPlaceholderText('Enter text'), 'test@example.com');
    expect(onChangeText).toHaveBeenCalledWith('test@example.com');
  });

  test('shows error message', () => {
    const { getByText } = render(<Input error="This field is required" />);
    expect(getByText('This field is required')).toBeTruthy();
  });

  test('toggles password visibility', () => {
    const { getByTestId } = render(<Input secureTextEntry />);
    const input = getByTestId('input');
    expect(input.props.secureTextEntry).toBe(true);

    const toggle = getByTestId('password-toggle');
    fireEvent.press(toggle);
    expect(input.props.secureTextEntry).toBe(false);
  });

  test('renders without label', () => {
    const { queryByText } = render(<Input placeholder="Enter text" />);
    expect(queryByText('Email')).toBeFalsy();
  });
});
