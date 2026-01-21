import { useState, useCallback } from 'react';
import styled from 'styled-components';
import { motion, AnimatePresence } from 'framer-motion';
import { ShoppingBasket, X, Plus, Minus, Trash2, CreditCard, RefreshCw, Check } from 'lucide-react';
import { useCart } from '../../context/CartContext';

type PaymentMethod = 'saved' | 'apple-pay';

const FloatingButton = styled(motion.button)<{ $hasItems: boolean }>`
  position: fixed;
  bottom: 6rem;
  right: 1.5rem;
  width: 3.5rem;
  height: 3.5rem;
  border-radius: 50%;
  background: ${(props) => (props.$hasItems ? '#00a0c4' : props.theme.colors.text.tertiary)};
  border: none;
  color: #ffffff;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  box-shadow: 0 0.25rem 1rem rgba(0, 160, 196, 0.4);
  z-index: 1000;
  transition: background 0.2s ease;

  &:hover {
    background: ${(props) => (props.$hasItems ? '#008ca8' : props.theme.colors.text.secondary)};
    transform: scale(1.05);
  }

  svg {
    width: 1.5rem;
    height: 1.5rem;
  }

  @media (min-width: 48rem) {
    bottom: 2rem;
    right: 2rem;
  }
`;

const Badge = styled.div`
  position: absolute;
  top: -0.25rem;
  right: -0.25rem;
  min-width: 1.25rem;
  height: 1.25rem;
  background: #ef4444;
  border-radius: 0.625rem;
  color: #ffffff;
  font-size: 0.75rem;
  font-weight: 700;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0 0.25rem;
`;

const Overlay = styled(motion.div)`
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.5);
  z-index: 9998;
`;

const CartDrawer = styled(motion.div)`
  position: fixed;
  top: 0;
  right: 0;
  bottom: 0;
  width: 100%;
  max-width: 24rem;
  background: ${(props) => props.theme.colors.background.card};
  box-shadow: -0.5rem 0 2rem rgba(0, 0, 0, 0.2);
  z-index: 9999;
  display: flex;
  flex-direction: column;
`;

const DrawerHeader = styled.div`
  padding: 1.25rem 1.5rem;
  background: linear-gradient(135deg, #00a0c4 0%, #0077b6 100%);
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const DrawerTitle = styled.h2`
  margin: 0;
  font-size: 1.25rem;
  font-weight: 700;
  color: #ffffff;
  display: flex;
  align-items: center;
  gap: 0.5rem;

  svg {
    width: 1.25rem;
    height: 1.25rem;
  }
`;

const CloseButton = styled.button`
  background: rgba(255, 255, 255, 0.15);
  border: none;
  cursor: pointer;
  padding: 0.5rem;
  color: #ffffff;
  border-radius: 50%;
  transition: all 0.2s ease;

  &:hover {
    background: rgba(255, 255, 255, 0.25);
  }

  svg {
    width: 1.25rem;
    height: 1.25rem;
  }
`;

const CartContent = styled.div`
  flex: 1;
  overflow-y: auto;
  padding: 1rem;
`;

const EmptyCart = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100%;
  padding: 2rem;
  text-align: center;

  svg {
    width: 4rem;
    height: 4rem;
    color: ${(props) => props.theme.colors.text.tertiary};
    margin-bottom: 1rem;
  }

  p {
    color: ${(props) => props.theme.colors.text.secondary};
    margin: 0;
  }
`;

const CartItem = styled.div`
  background: ${(props) => props.theme.colors.background.page};
  border-radius: 0.5rem;
  padding: 1rem;
  margin-bottom: 0.75rem;
  border: 1px solid ${(props) => props.theme.colors.border.light};
`;

const ItemHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 0.75rem;
`;

const ItemTitle = styled.h4`
  margin: 0;
  font-size: 0.875rem;
  font-weight: 600;
  color: ${(props) => props.theme.colors.text.primary};
  flex: 1;
  padding-right: 0.5rem;
`;

const ItemDescription = styled.p`
  margin: 0 0 0.5rem 0;
  font-size: 0.75rem;
  color: ${(props) => props.theme.colors.text.secondary};
  line-height: 1.4;
`;

const ItemUnitInfo = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-bottom: 0.5rem;
  font-size: 0.75rem;
  color: ${(props) => props.theme.colors.text.tertiary};
`;

const UnitBadge = styled.span`
  background: ${(props) => props.theme.colors.primary.light}20;
  color: #00a0c4;
  padding: 0.125rem 0.375rem;
  border-radius: 0.25rem;
  font-weight: 600;
  font-size: 0.6875rem;
`;

const DeleteButton = styled.button`
  background: none;
  border: none;
  cursor: pointer;
  padding: 0.25rem;
  color: ${(props) => props.theme.colors.text.tertiary};
  transition: color 0.2s ease;

  &:hover {
    color: #ef4444;
  }

  svg {
    width: 1rem;
    height: 1rem;
  }
`;

const ItemDetails = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const QuantityControls = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

const QuantityButton = styled.button`
  width: 1.75rem;
  height: 1.75rem;
  border-radius: 0.25rem;
  border: 1px solid ${(props) => props.theme.colors.border.light};
  background: ${(props) => props.theme.colors.background.card};
  color: ${(props) => props.theme.colors.text.primary};
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    border-color: #00a0c4;
    color: #00a0c4;
  }

  svg {
    width: 0.75rem;
    height: 0.75rem;
  }
`;

const QuantityValue = styled.span`
  min-width: 1.5rem;
  text-align: center;
  font-weight: 600;
  font-size: 0.875rem;
  color: ${(props) => props.theme.colors.text.primary};
`;

const ItemPrice = styled.span`
  font-weight: 700;
  font-size: 0.9375rem;
  color: #00a0c4;
`;

const CartFooter = styled.div`
  padding: 1.25rem;
  border-top: 1px solid ${(props) => props.theme.colors.border.light};
  background: ${(props) => props.theme.colors.background.card};
`;

const SummaryRow = styled.div<{ $total?: boolean }>`
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: ${(props) => (props.$total ? '1rem' : '0.875rem')};
  font-weight: ${(props) => (props.$total ? '700' : '400')};
  color: ${(props) =>
    props.$total ? props.theme.colors.text.primary : props.theme.colors.text.secondary};
  margin-bottom: ${(props) => (props.$total ? '1rem' : '0.5rem')};

  span:last-child {
    color: ${(props) => (props.$total ? '#00a0c4' : 'inherit')};
  }
`;

const CheckboxRow = styled.label`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.8125rem;
  color: ${(props) => props.theme.colors.text.secondary};
  cursor: pointer;
  margin-bottom: 0.75rem;

  input {
    width: 1rem;
    height: 1rem;
    accent-color: #00a0c4;
  }
`;

const ButtonRow = styled.div`
  display: flex;
  gap: 0.75rem;
`;

const ClearButton = styled.button`
  flex: 0 0 auto;
  padding: 0.75rem;
  background: transparent;
  border: 1px solid ${(props) => props.theme.colors.border.light};
  border-radius: 0.5rem;
  color: ${(props) => props.theme.colors.text.secondary};
  font-size: 0.875rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    border-color: #ef4444;
    color: #ef4444;
    background: rgba(239, 68, 68, 0.1);
  }

  svg {
    width: 1rem;
    height: 1rem;
  }
`;

const CheckoutButton = styled.button`
  flex: 1;
  padding: 0.875rem;
  background: #00a0c4;
  border: none;
  border-radius: 0.5rem;
  color: #ffffff;
  font-size: 0.9375rem;
  font-weight: 700;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  transition: all 0.2s ease;

  &:hover {
    background: #008ca8;
  }

  svg {
    width: 1.125rem;
    height: 1.125rem;
  }
`;

const PaymentMethodSection = styled.div`
  margin-bottom: 1rem;
  padding-bottom: 1rem;
  border-bottom: 1px solid ${(props) => props.theme.colors.border.light};
`;

const PaymentSectionLabel = styled.div`
  font-size: 0.8125rem;
  font-weight: 600;
  color: ${(props) => props.theme.colors.text.primary};
  margin-bottom: 0.75rem;
`;

const PaymentOptions = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
`;

const PaymentOption = styled.div<{ $selected?: boolean }>`
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.75rem;
  border: 2px solid ${({ $selected, theme }) => ($selected ? '#00a0c4' : theme.colors.border.light)};
  border-radius: 0.5rem;
  background: ${({ $selected }) => ($selected ? 'rgba(0, 160, 196, 0.04)' : 'transparent')};
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    border-color: #00a0c4;
  }
`;

const PaymentRadio = styled.input`
  width: 1rem;
  height: 1rem;
  cursor: pointer;
  accent-color: #00a0c4;
  flex-shrink: 0;
`;

const SavedCardIconBox = styled.div`
  width: 2.5rem;
  height: 1.5rem;
  background: linear-gradient(135deg, #1a1f71 0%, #2b38a0 100%);
  border-radius: 0.1875rem;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
`;

const VisaText = styled.span`
  color: white;
  font-size: 0.5rem;
  font-weight: 700;
  letter-spacing: 0.03em;
`;

const ApplePayBox = styled.div`
  width: 2.5rem;
  height: 1.5rem;
  background: black;
  border-radius: 0.1875rem;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
`;

const ApplePayText = styled.span`
  color: white;
  font-size: 0.625rem;
  font-weight: 500;
`;

const PaymentDetails = styled.div`
  flex: 1;
  min-width: 0;
`;

const PaymentTitle = styled.div`
  font-size: 0.8125rem;
  font-weight: 600;
  color: ${(props) => props.theme.colors.text.primary};
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;

const PaymentSubtitle = styled.div`
  font-size: 0.6875rem;
  color: ${(props) => props.theme.colors.text.secondary};
`;

const SelectedMark = styled.div`
  color: #00a0c4;
  flex-shrink: 0;
`;

const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount);
};

export function CartIcon() {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState<PaymentMethod>('saved');
  const {
    items,
    removeFromCart,
    updateQuantity,
    clearCart,
    totalItems,
    subtotal,
    isRecurring,
    setIsRecurring,
    coverTransactionFees,
    setCoverTransactionFees,
    transactionFee,
    totalCost,
  } = useCart();

  const savedCard = {
    last4: '4242',
    brand: 'Visa',
    expiry: '12/26',
  };

  const handleOpen = useCallback(() => setIsOpen(true), []);
  const handleClose = useCallback(() => setIsOpen(false), []);

  const handleCheckout = useCallback(() => {
    const description = isRecurring
      ? `Monthly subscription for ${formatCurrency(totalCost)}/month`
      : `One-time purchase of ${formatCurrency(totalCost)}`;

    alert(
      `Demo Checkout:\n\n${description}\n\nIn production, this would proceed to Stripe payment.`
    );

    setTimeout(() => {
      clearCart();
      setIsOpen(false);
    }, 500);
  }, [isRecurring, totalCost, clearCart]);

  return (
    <>
      <FloatingButton
        $hasItems={totalItems > 0}
        onClick={handleOpen}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        <ShoppingBasket />
        {totalItems > 0 && <Badge>{totalItems}</Badge>}
      </FloatingButton>

      <AnimatePresence>
        {isOpen && (
          <>
            <Overlay
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={handleClose}
            />
            <CartDrawer
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            >
              <DrawerHeader>
                <DrawerTitle>
                  <ShoppingBasket />
                  Your Basket ({totalItems})
                </DrawerTitle>
                <CloseButton onClick={handleClose}>
                  <X />
                </CloseButton>
              </DrawerHeader>

              <CartContent>
                {items.length === 0 ? (
                  <EmptyCart>
                    <ShoppingBasket />
                    <p>Your basket is empty</p>
                  </EmptyCart>
                ) : (
                  items.map((item) => {
                    const unitLabel = item.campaign.unitLabel || 'Donation';
                    const unitPrice = item.pricePerUnit;
                    return (
                      <CartItem key={item.id}>
                        <ItemHeader>
                          <ItemTitle>{item.campaign.title}</ItemTitle>
                          <DeleteButton onClick={() => removeFromCart(item.id)}>
                            <Trash2 />
                          </DeleteButton>
                        </ItemHeader>
                        <ItemDescription>{item.campaign.shortDescription}</ItemDescription>
                        <ItemUnitInfo>
                          <UnitBadge>{unitLabel}</UnitBadge>
                          <span>{formatCurrency(unitPrice)} each</span>
                        </ItemUnitInfo>
                        <ItemDetails>
                          <QuantityControls>
                            <QuantityButton
                              onClick={() => updateQuantity(item.id, item.quantity - 1)}
                            >
                              <Minus />
                            </QuantityButton>
                            <QuantityValue>{item.quantity}</QuantityValue>
                            <QuantityButton
                              onClick={() => updateQuantity(item.id, item.quantity + 1)}
                            >
                              <Plus />
                            </QuantityButton>
                          </QuantityControls>
                          <ItemPrice>{formatCurrency(item.totalCost)}</ItemPrice>
                        </ItemDetails>
                      </CartItem>
                    );
                  })
                )}
              </CartContent>

              {items.length > 0 && (
                <CartFooter>
                  <SummaryRow>
                    <span>Subtotal</span>
                    <span>{formatCurrency(subtotal)}</span>
                  </SummaryRow>
                  {coverTransactionFees && (
                    <SummaryRow>
                      <span>Transaction Fee (2.9%)</span>
                      <span>{formatCurrency(transactionFee)}</span>
                    </SummaryRow>
                  )}
                  <SummaryRow $total>
                    <span>Total</span>
                    <span>{formatCurrency(totalCost)}</span>
                  </SummaryRow>

                  <PaymentMethodSection>
                    <PaymentSectionLabel>Payment Method</PaymentSectionLabel>
                    <PaymentOptions>
                      <PaymentOption
                        $selected={selectedPaymentMethod === 'saved'}
                        onClick={() => setSelectedPaymentMethod('saved')}
                      >
                        <PaymentRadio
                          type="radio"
                          name="cartPaymentMethod"
                          checked={selectedPaymentMethod === 'saved'}
                          onChange={() => setSelectedPaymentMethod('saved')}
                        />
                        <SavedCardIconBox>
                          <VisaText>VISA</VisaText>
                        </SavedCardIconBox>
                        <PaymentDetails>
                          <PaymentTitle>Visa ending in {savedCard.last4}</PaymentTitle>
                          <PaymentSubtitle>Expires {savedCard.expiry}</PaymentSubtitle>
                        </PaymentDetails>
                        {selectedPaymentMethod === 'saved' && (
                          <SelectedMark>
                            <Check size={14} />
                          </SelectedMark>
                        )}
                      </PaymentOption>

                      <PaymentOption
                        $selected={selectedPaymentMethod === 'apple-pay'}
                        onClick={() => setSelectedPaymentMethod('apple-pay')}
                      >
                        <PaymentRadio
                          type="radio"
                          name="cartPaymentMethod"
                          checked={selectedPaymentMethod === 'apple-pay'}
                          onChange={() => setSelectedPaymentMethod('apple-pay')}
                        />
                        <ApplePayBox>
                          <ApplePayText> Pay</ApplePayText>
                        </ApplePayBox>
                        <PaymentDetails>
                          <PaymentTitle>Apple Pay</PaymentTitle>
                          <PaymentSubtitle>Pay with Touch ID or Face ID</PaymentSubtitle>
                        </PaymentDetails>
                        {selectedPaymentMethod === 'apple-pay' && (
                          <SelectedMark>
                            <Check size={14} />
                          </SelectedMark>
                        )}
                      </PaymentOption>
                    </PaymentOptions>
                  </PaymentMethodSection>

                  <CheckboxRow>
                    <input
                      type="checkbox"
                      checked={coverTransactionFees}
                      onChange={(e) => setCoverTransactionFees(e.target.checked)}
                    />
                    Cover credit card transaction fees (2.9%)
                  </CheckboxRow>

                  <CheckboxRow>
                    <input
                      type="checkbox"
                      checked={isRecurring}
                      onChange={(e) => setIsRecurring(e.target.checked)}
                    />
                    <RefreshCw size={14} />
                    Make this a recurring monthly donation
                  </CheckboxRow>

                  <ButtonRow>
                    <ClearButton onClick={clearCart}>
                      <Trash2 />
                    </ClearButton>
                    <CheckoutButton onClick={handleCheckout}>
                      <CreditCard />
                      Checkout
                    </CheckoutButton>
                  </ButtonRow>
                </CartFooter>
              )}
            </CartDrawer>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
