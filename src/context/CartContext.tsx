import React, { useState, useCallback, useEffect } from 'react';
import { CartItem } from '../types/types';

type Props = {
  children: React.ReactNode;
};

type ContextType = {
  cartItems: CartItem[] | null;
  updateCartItems: (values: CartItem[]) => void;
};

export const CartContext = React.createContext<ContextType>({
  cartItems: null,
  updateCartItems: () => {},
});

export const CartProvider: React.FC<Props> = ({ children }) => {
  const [cartItems, setCartItems] = useState<CartItem[] | null>(() => {
    const savedCart = localStorage.getItem('cartItems');
    return savedCart ? JSON.parse(savedCart) : null;
  });

  const updateCartItems = useCallback((data: CartItem[]) => {
    if (data) {
      setCartItems(data);
      localStorage.setItem('cartItems', JSON.stringify(data));
    }
  }, []);

  useEffect(() => {
    const savedCart = localStorage.getItem('cartItems');
    if (savedCart) {
      setCartItems(JSON.parse(savedCart));
    }
  }, []);

  return (
    <CartContext.Provider value={{ cartItems, updateCartItems }}>
      {children}
    </CartContext.Provider>
  );
};
