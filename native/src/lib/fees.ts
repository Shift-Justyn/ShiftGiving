export const calculateTransactionFee = (amount: number): number => {
  return amount * 0.029 + 0.3;
};

export const calculateTotal = (amount: number, includeFees: boolean): number => {
  if (!includeFees) return amount;
  return amount + calculateTransactionFee(amount);
};

export const formatCurrency = (value: number): string => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(value);
};
