jest.mock('tamagui', () => {
  const React = require('react');
  const RN = require('react-native');

  const createMockComponent = (Component) => {
    return React.forwardRef(({ children, ...props }, ref) =>
      React.createElement(Component, { ...props, ref }, children)
    );
  };

  return {
    Text: createMockComponent(RN.Text),
    View: createMockComponent(RN.View),
    XStack: createMockComponent(RN.View),
    YStack: createMockComponent(RN.View),
    Input: createMockComponent(RN.TextInput),
    Button: createMockComponent(RN.TouchableOpacity),
    Image: createMockComponent(RN.Image),
    ScrollView: createMockComponent(RN.ScrollView),
    Spinner: createMockComponent(RN.ActivityIndicator),
    TamaguiProvider: ({ children }) => children,
    styled: (Component) => Component,
    createTamagui: (config) => config,
    useTheme: () => ({}),
  };
});

jest.mock('moti', () => ({
  MotiView: require('react-native').View,
  MotiText: require('react-native').Text,
  AnimatePresence: ({ children }) => children,
}));

jest.mock('@stripe/stripe-react-native', () => {
  const React = require('react');
  const RN = require('react-native');

  const CardFieldMock = React.forwardRef(({ onCardChange, ...props }, ref) => {
    const handleChange = React.useCallback(() => {
      if (onCardChange) {
        onCardChange({
          complete: true,
          cardDetails: {
            number: '4242 4242 4242 4242',
            expMonth: 12,
            expYear: 2026,
            cvc: '123',
            postalCode: '12345',
          },
        });
      }
    }, [onCardChange]);

    return React.createElement(RN.TextInput, {
      ...props,
      ref,
      placeholder: 'Card Field',
      testID: 'card-field',
      onChangeText: handleChange,
    });
  });

  return {
    StripeProvider: ({ children }) => children,
    useStripe: () => ({
      initPaymentSheet: jest.fn().mockResolvedValue({ error: null }),
      presentPaymentSheet: jest.fn().mockResolvedValue({ error: null }),
      createPaymentMethod: jest.fn(),
      confirmPaymentSheetPayment: jest.fn(),
      confirmPayment: jest.fn(),
    }),
    CardField: CardFieldMock,
    ApplePay: {
      isApplePaySupported: jest.fn().mockResolvedValue(true),
      presentApplePay: jest.fn().mockResolvedValue({
        paymentMethod: { id: 'pm_test' },
      }),
    },
    GooglePay: {
      isGooglePaySupported: jest.fn().mockResolvedValue(true),
      presentGooglePay: jest.fn().mockResolvedValue({
        paymentMethod: { id: 'pm_test' },
      }),
    },
    initStripe: jest.fn().mockResolvedValue(true),
    stripe: jest.fn(),
    StripeError: class {
      constructor(message) {
        this.message = message;
        this.code = 'card_error';
      }
    },
  };
});
