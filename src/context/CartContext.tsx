import React, { createContext, useContext, useState, useCallback, useMemo } from 'react';
import type { Manual, CartItem, Cart } from '@/types';
import { toast } from 'sonner';

interface CartContextType {
  cart: Cart;
  addToCart: (manual: Manual) => void;
  removeFromCart: (manualId: string) => void;
  updateQuantity: (manualId: string, quantity: number) => void;
  clearCart: () => void;
  isInCart: (manualId: string) => boolean;
  itemCount: number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);

  const addToCart = useCallback((manual: Manual) => {
    setItems(prevItems => {
      const existingItem = prevItems.find(item => item.manual.id === manual.id);
      
      if (existingItem) {
        toast.info('Este manual já está no carrinho');
        return prevItems;
      }

      toast.success(`${manual.title} adicionado ao carrinho!`);
      return [
        ...prevItems,
        {
          manual,
          quantity: 1,
          addedAt: new Date().toISOString(),
        }
      ];
    });
  }, []);

  const removeFromCart = useCallback((manualId: string) => {
    setItems(prevItems => {
      const item = prevItems.find(i => i.manual.id === manualId);
      if (item) {
        toast.info(`${item.manual.title} removido do carrinho`);
      }
      return prevItems.filter(item => item.manual.id !== manualId);
    });
  }, []);

  const updateQuantity = useCallback((manualId: string, quantity: number) => {
    if (quantity < 1) {
      removeFromCart(manualId);
      return;
    }

    setItems(prevItems =>
      prevItems.map(item =>
        item.manual.id === manualId
          ? { ...item, quantity }
          : item
      )
    );
  }, [removeFromCart]);

  const clearCart = useCallback(() => {
    setItems([]);
    toast.info('Carrinho esvaziado');
  }, []);

  const isInCart = useCallback((manualId: string) => {
    return items.some(item => item.manual.id === manualId);
  }, [items]);

  const cart = useMemo<Cart>(() => {
    const total = items.reduce((sum, item) => sum + (item.manual.price * item.quantity), 0);
    const itemCount = items.reduce((count, item) => count + item.quantity, 0);
    
    return {
      items,
      total,
      itemCount,
    };
  }, [items]);

  const value = useMemo(() => ({
    cart,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    isInCart,
    itemCount: cart.itemCount,
  }), [cart, addToCart, removeFromCart, updateQuantity, clearCart, isInCart]);

  return (
    <CartContext.Provider value={value}>
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
