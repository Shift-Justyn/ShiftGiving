import { render } from '@testing-library/react-native';
import { Avatar } from '../Avatar';

describe('Avatar', () => {
  test('renders with image url', () => {
    const { getByTestId } = render(<Avatar imageUrl="https://example.com/avatar.jpg" />);
    expect(getByTestId('avatar-image')).toBeTruthy();
  });

  test('renders initials when no image', () => {
    const { getByText } = render(<Avatar firstName="John" lastName="Doe" />);
    expect(getByText('JD')).toBeTruthy();
  });

  test('renders default initials when no name provided', () => {
    const { getByText } = render(<Avatar />);
    expect(getByText('?')).toBeTruthy();
  });

  test('renders with small size', () => {
    const { getByTestId } = render(<Avatar size="sm" firstName="Jane" lastName="Smith" />);
    const container = getByTestId('avatar-container');
    expect(container.props.style.width).toBe(32);
  });

  test('renders with large size', () => {
    const { getByTestId } = render(<Avatar size="lg" firstName="Jane" lastName="Smith" />);
    const container = getByTestId('avatar-container');
    expect(container.props.style.width).toBe(56);
  });
});
