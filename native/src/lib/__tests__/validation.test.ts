import { donationAmountSchema, paymentCardSchema } from '../validation';

describe('donationAmountSchema', () => {
  it('validates valid amount', () => {
    expect(donationAmountSchema.parse({ amount: 25 })).toEqual({ amount: 25 });
  });
});

describe('donationAmountSchema min validation', () => {
  it('rejects amount below minimum', () => {
    expect(() => donationAmountSchema.parse({ amount: 4 })).toThrow();
  });
});

describe('donationAmountSchema max validation', () => {
  it('rejects amount above maximum', () => {
    expect(() => donationAmountSchema.parse({ amount: 10001 })).toThrow();
  });
});

describe('paymentCardSchema', () => {
  it('validates valid card data', () => {
    const validCard = {
      cardNumber: '4111111111111111',
      expiryDate: '12/30',
      cvv: '123',
      cardholderName: 'John Doe',
    };
    expect(paymentCardSchema.parse(validCard)).toEqual(validCard);
  });
});

describe('paymentCardSchema cardNumber validation', () => {
  it('rejects invalid card number', () => {
    const invalidCard = {
      cardNumber: '1234',
      expiryDate: '12/30',
      cvv: '123',
      cardholderName: 'John Doe',
    };
    expect(() => paymentCardSchema.parse(invalidCard)).toThrow();
  });
});

describe('paymentCardSchema expiryDate validation', () => {
  it('rejects invalid expiry format', () => {
    const invalidCard = {
      cardNumber: '4111111111111111',
      expiryDate: '13/30',
      cvv: '123',
      cardholderName: 'John Doe',
    };
    expect(() => paymentCardSchema.parse(invalidCard)).toThrow();
  });
});

describe('paymentCardSchema cvv validation', () => {
  it('rejects invalid cvv', () => {
    const invalidCard = {
      cardNumber: '4111111111111111',
      expiryDate: '12/30',
      cvv: '12',
      cardholderName: 'John Doe',
    };
    expect(() => paymentCardSchema.parse(invalidCard)).toThrow();
  });
});
