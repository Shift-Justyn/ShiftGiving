import { z } from 'zod';

const emailValidation = z.string().email('Invalid email address');
const passwordValidation = z.string().min(6, 'Password must be at least 6 characters');

export const loginSchema = z.object({
  email: emailValidation,
  password: passwordValidation,
});

export const registerSchema = z
  .object({
    firstName: z.string().min(1, 'First name is required'),
    lastName: z.string().min(1, 'Last name is required'),
    email: emailValidation,
    password: passwordValidation,
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'Passwords do not match',
    path: ['confirmPassword'],
  });

export type LoginFormData = z.infer<typeof loginSchema>;
export type RegisterFormData = z.infer<typeof registerSchema>;

export const donationAmountSchema = z.object({
  amount: z
    .number()
    .min(5, 'Minimum donation is $5')
    .max(10000, 'Maximum donation is $10,000'),
});

export const paymentCardSchema = z.object({
  cardNumber: z
    .string()
    .min(13, 'Invalid card number')
    .max(19, 'Invalid card number')
    .regex(/^\d{13,19}$/, 'Card number must contain only digits'),
  expiryDate: z
    .string()
    .regex(/^(0[1-9]|1[0-2])\/\d{2}$/, 'Expiry date must be in MM/YY format')
    .refine((val) => {
      const [month, year] = val.split('/').map(Number);
      const expiry = new Date(2000 + year, month - 1);
      return expiry > new Date();
    }, 'Card has expired'),
  cvv: z
    .string()
    .min(3, 'CVV must be 3 or 4 digits')
    .max(4, 'CVV must be 3 or 4 digits')
    .regex(/^\d{3,4}$/, 'CVV must contain only digits'),
  cardholderName: z.string().min(1, 'Cardholder name is required'),
});

export type DonationAmountData = z.infer<typeof donationAmountSchema>;
export type PaymentCardData = z.infer<typeof paymentCardSchema>;
