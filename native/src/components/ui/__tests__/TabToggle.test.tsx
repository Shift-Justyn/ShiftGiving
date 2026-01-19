import { render, screen, fireEvent } from '@testing-library/react-native';
import { TabToggle } from '../TabToggle';

describe('TabToggle', () => {
  it('renders all tabs', () => {
    const handleTabChange = jest.fn();
    render(
      <TabToggle tabs={['Overview', 'Posts']} activeTab="Overview" onTabChange={handleTabChange} />
    );

    expect(screen.getByText('Overview')).toBeTruthy();
    expect(screen.getByText('Posts')).toBeTruthy();
  });

  it('calls onTabChange when a tab is pressed', () => {
    const handleTabChange = jest.fn();
    render(
      <TabToggle tabs={['Overview', 'Posts']} activeTab="Overview" onTabChange={handleTabChange} />
    );

    fireEvent.press(screen.getByText('Posts'));

    expect(handleTabChange).toHaveBeenCalledWith('Posts');
  });

  it('highlights the active tab', () => {
    const { rerender } = render(
      <TabToggle tabs={['Overview', 'Posts']} activeTab="Overview" onTabChange={jest.fn()} />
    );

    rerender(
      <TabToggle tabs={['Overview', 'Posts']} activeTab="Posts" onTabChange={jest.fn()} />
    );

    expect(screen.getByText('Posts')).toBeTruthy();
  });
});
