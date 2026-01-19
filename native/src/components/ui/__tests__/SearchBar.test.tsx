import { render, fireEvent } from '@testing-library/react-native';
import { SearchBar } from '../SearchBar';

describe('SearchBar', () => {
  test('renders with placeholder', () => {
    const { getByPlaceholderText } = render(
      <SearchBar placeholder="Search charities" value="" onChangeText={jest.fn()} />
    );
    expect(getByPlaceholderText('Search charities')).toBeTruthy();
  });

  test('calls onChangeText when text changes', () => {
    const onChangeText = jest.fn();
    const { getByTestId } = render(
      <SearchBar placeholder="Search" value="" onChangeText={onChangeText} />
    );
    fireEvent.changeText(getByTestId('search-input'), 'test query');
    expect(onChangeText).toHaveBeenCalledWith('test query');
  });

  test('displays current value', () => {
    const { getByDisplayValue } = render(
      <SearchBar placeholder="Search" value="current search" onChangeText={jest.fn()} />
    );
    expect(getByDisplayValue('current search')).toBeTruthy();
  });

  test('renders search icon', () => {
    const { getByTestId } = render(
      <SearchBar placeholder="Search" value="" onChangeText={jest.fn()} />
    );
    expect(getByTestId('search-icon')).toBeTruthy();
  });
});
