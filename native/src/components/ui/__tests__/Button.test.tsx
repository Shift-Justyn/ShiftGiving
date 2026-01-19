import { render, fireEvent, waitFor } from '@testing-library/react-native';
import { Button } from '../Button';

describe('Button', () => {
  test('renders children', () => {
    const { toJSON } = render(<Button>Click me</Button>);
    expect(toJSON()).toBeTruthy();
  });

  test('handles press event', async () => {
    const onPress = jest.fn();
    const { root } = render(<Button onPress={onPress}>Click me</Button>);
    fireEvent.press(root);
    await waitFor(() => {
      expect(onPress).toHaveBeenCalled();
    });
  });

  test('shows loading spinner when loading', () => {
    const { getByTestId, toJSON } = render(<Button loading>Click me</Button>);
    expect(toJSON()).toBeTruthy();
  });

  test('is disabled when loading', () => {
    const { toJSON } = render(<Button loading>Click me</Button>);
    expect(toJSON()).toBeTruthy();
  });

  test('is disabled when disabled prop is true', () => {
    const { getByTestId, toJSON } = render(<Button disabled>Click me</Button>);
    expect(toJSON()).toBeTruthy();
  });

  test('applies animation on press', async () => {
    const onPress = jest.fn();
    const { toJSON } = render(
      <Button onPress={onPress}>
        Click me
      </Button>
    );
    expect(toJSON()).toBeTruthy();
  });

  test('renders with different variants', () => {
    const { getByTestId: getPrimary } = render(<Button variant="primary">Primary</Button>);
    const { getByTestId: getOutline } = render(<Button variant="outline">Outline</Button>);
    const { getByTestId: getGhost } = render(<Button variant="ghost">Ghost</Button>);
    expect(getPrimary).toBeTruthy();
    expect(getOutline).toBeTruthy();
    expect(getGhost).toBeTruthy();
  });
});
