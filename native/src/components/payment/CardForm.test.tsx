import React from 'react';
import { render, screen, waitFor } from '@testing-library/react-native';
import { CardForm } from './CardForm';

describe('CardForm', () => {
  it('renders card field', () => {
    render(<CardForm />);
    expect(screen.getByTestId('card-field')).toBeTruthy();
  });

  it('calls onCardChange when card validity changes', () => {
    const onCardChange = jest.fn();
    render(<CardForm onCardChange={onCardChange} />);

    const cardField = screen.getByTestId('card-field');
    cardField.props.onChangeText?.();

    expect(onCardChange).toHaveBeenCalledWith(true);
  });

  it('calls onCardDataChange with card details', () => {
    const onCardDataChange = jest.fn();
    render(<CardForm onCardDataChange={onCardDataChange} />);

    const cardField = screen.getByTestId('card-field');
    cardField.props.onChangeText?.();

    expect(onCardDataChange).toHaveBeenCalled();
  });

  it('displays valid card indicator when card is valid', async () => {
    render(<CardForm />);

    const cardField = screen.getByTestId('card-field');
    cardField.props.onChangeText?.();

    await waitFor(() => {
      expect(screen.queryByText('Card is valid')).toBeTruthy();
    });
  });

  it('disables card field when disabled prop is true', () => {
    render(<CardForm disabled={true} />);
    const cardField = screen.getByTestId('card-field');
    expect(cardField.props.disabled).toBe(true);
  });
});
