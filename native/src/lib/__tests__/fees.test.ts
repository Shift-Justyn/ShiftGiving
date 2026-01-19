import { calculateTransactionFee, calculateTotal, formatCurrency } from '../fees';

describe('calculateTransactionFee', () => {
  it('calculates correct fee for amount', () => {
    expect(calculateTransactionFee(100)).toBe(3.2);
  });
});

describe('calculateTotal', () => {
  it('returns amount when fees not included', () => {
    expect(calculateTotal(100, false)).toBe(100);
  });
});

describe('calculateTotal with fees', () => {
  it('adds fee to amount when fees included', () => {
    expect(calculateTotal(100, true)).toBe(103.2);
  });
});

describe('formatCurrency', () => {
  it('formats number as US currency', () => {
    expect(formatCurrency(100)).toBe('$100.00');
  });
});
