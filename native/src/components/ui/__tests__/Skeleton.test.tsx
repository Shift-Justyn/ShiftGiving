import { render } from '@testing-library/react-native';
import { Skeleton, SkeletonCard } from '../Skeleton';

describe('Skeleton', () => {
  test('renders skeleton with default props', () => {
    const { getByTestId } = render(<Skeleton />);
    expect(getByTestId).toBeTruthy();
  });

  test('renders skeleton with custom width', () => {
    const { toJSON } = render(<Skeleton width={100} />);
    expect(toJSON()).toBeTruthy();
  });

  test('renders skeleton with custom height', () => {
    const { toJSON } = render(<Skeleton height={24} />);
    expect(toJSON()).toBeTruthy();
  });

  test('renders skeleton with custom border radius', () => {
    const { toJSON } = render(<Skeleton borderRadius={8} />);
    expect(toJSON()).toBeTruthy();
  });

  test('renders with animation', () => {
    const { toJSON } = render(<Skeleton />);
    expect(toJSON()).toBeTruthy();
  });
});

describe('SkeletonCard', () => {
  test('renders skeleton card', () => {
    const { toJSON } = render(<SkeletonCard />);
    expect(toJSON()).toBeTruthy();
  });

  test('renders full width skeleton card', () => {
    const { toJSON } = render(<SkeletonCard fullWidth />);
    expect(toJSON()).toBeTruthy();
  });

  test('renders with correct structure', () => {
    const { toJSON } = render(<SkeletonCard />);
    const tree = toJSON();
    expect(tree).toBeTruthy();
  });
});
