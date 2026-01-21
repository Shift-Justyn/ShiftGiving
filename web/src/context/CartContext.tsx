import { createContext, useContext, useState, useCallback, ReactNode } from 'react';
import { Campaign } from '../api/types';

export interface CartItem {
  id: string;
  campaign: Campaign;
  quantity: number;
  pricePerUnit: number;
  totalCost: number;
  addedAt: Date;
}

interface CartContextType {
  items: CartItem[];
  addToCart: (campaign: Campaign, amount: number, quantity?: number) => void;
  removeFromCart: (itemId: string) => void;
  updateQuantity: (itemId: string, quantity: number) => void;
  clearCart: () => void;
  totalItems: number;
  subtotal: number;
  isRecurring: boolean;
  setIsRecurring: (value: boolean) => void;
  coverTransactionFees: boolean;
  setCoverTransactionFees: (value: boolean) => void;
  transactionFee: number;
  totalCost: number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

interface CartProviderProps {
  children: ReactNode;
}

export function CartProvider({ children }: CartProviderProps) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [isRecurring, setIsRecurring] = useState(false);
  const [coverTransactionFees, setCoverTransactionFees] = useState(false);

  const addToCart = useCallback((campaign: Campaign, amount: number, quantity: number = 1) => {
    setItems((prev) => {
      const existingItem = prev.find((item) => item.campaign.id === campaign.id);

      if (existingItem) {
        return prev.map((item) =>
          item.campaign.id === campaign.id
            ? {
                ...item,
                quantity: item.quantity + quantity,
                totalCost: item.totalCost + amount,
              }
            : item
        );
      }

      const pricePerUnit = campaign.unitPrice || amount / quantity;
      return [
        ...prev,
        {
          id: `cart-${Date.now()}-${campaign.id}`,
          campaign,
          quantity,
          pricePerUnit,
          totalCost: amount,
          addedAt: new Date(),
        },
      ];
    });
  }, []);

  const removeFromCart = useCallback((itemId: string) => {
    setItems((prev) => prev.filter((item) => item.id !== itemId));
  }, []);

  const updateQuantity = useCallback(
    (itemId: string, quantity: number) => {
      if (quantity <= 0) {
        removeFromCart(itemId);
        return;
      }

      setItems((prev) =>
        prev.map((item) =>
          item.id === itemId
            ? {
                ...item,
                quantity,
                totalCost: quantity * item.pricePerUnit,
              }
            : item
        )
      );
    },
    [removeFromCart]
  );

  const clearCart = useCallback(() => {
    setItems([]);
  }, []);

  const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);
  const subtotal = items.reduce((sum, item) => sum + item.totalCost, 0);
  const transactionFee = coverTransactionFees ? subtotal * 0.029 : 0;
  const totalCost = subtotal + transactionFee;

  return (
    <CartContext.Provider
      value={{
        items,
        addToCart,
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
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
}
