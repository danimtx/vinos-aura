// src/context/CartContext.tsx
'use client';

import { createContext, useContext, useState, ReactNode, useEffect, useCallback } from 'react';
import { toast } from 'react-hot-toast'; // Nota las llaves {}

interface CartItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  img?: string;
}

interface CartContextType {
  cart: CartItem[];
  addToCart: (item: { id: string; name: string; price: number; img?: string; quantity?: number }) => void;
  increaseQuantity: (id: string) => void;
  decreaseQuantity: (id: string) => void;
  removeFromCart: (id: string) => void;
  clearCart: () => void; // Nueva función para vaciar el carrito
  total: number;
}

export const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: ReactNode }) {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [total, setTotal] = useState(0);

  // Efecto para calcular el total del carrito
  useEffect(() => {
    const newTotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
    setTotal(newTotal);
  }, [cart]);

  const addToCart = useCallback((itemToAdd: { id: string; name: string; price: number; img?: string; quantity?: number }) => {
    const quantityToAdd = itemToAdd.quantity !== undefined ? itemToAdd.quantity : 1;
    
    setCart((prevCart) => {
      const existingItemIndex = prevCart.findIndex((item) => item.id === itemToAdd.id);

      if (existingItemIndex > -1) {
        const updatedCart = [...prevCart];
        updatedCart[existingItemIndex] = {
          ...updatedCart[existingItemIndex],
          quantity: updatedCart[existingItemIndex].quantity + quantityToAdd
        };
        toast.success(`"${itemToAdd.name}" actualizado en el carrito.`, {
          style: {
            background: '#D9C3A3', // warmBeige
            color: '#3E3E3E', // darkText
          },
          iconTheme: {
            primary: '#3E3E3E',
            secondary: '#FFFFFF',
          },
        });
        return updatedCart;
      } else {
        toast.success(`"${itemToAdd.name}" agregado al carrito.`, {
          style: {
            background: '#B31B1B', // crimson
            color: '#FFFFFF', // white
          },
          iconTheme: {
            primary: '#FFFFFF',
            secondary: '#B31B1B',
          },
        });
        return [...prevCart, { ...itemToAdd, quantity: quantityToAdd }];
      }
    });
  }, []);

  const increaseQuantity = useCallback((id: string) => {
    setCart((prevCart) =>
      prevCart.map((item) =>
        item.id === id ? { ...item, quantity: item.quantity + 1 } : item
      )
    );
  }, []);

  const decreaseQuantity = useCallback((id: string) => {
    setCart((prevCart) =>
      prevCart.map((item) =>
        item.id === id ? { ...item, quantity: Math.max(1, item.quantity - 1) } : item
      ).filter(item => item.quantity > 0)
    );
  }, []);

  const removeFromCart = useCallback((id: string) => {
    setCart((prevCart) => prevCart.filter((item) => item.id !== id));
    toast.error('Producto eliminado del carrito.', {
      style: {
        background: '#DC3545', // Un rojo estándar para error
        color: '#FFFFFF',
      },
      iconTheme: {
        primary: '#FFFFFF',
        secondary: '#DC3545',
      },
    });
  }, []);

  const clearCart = useCallback(() => {
    setCart([]);
  }, []);

  return (
    <CartContext.Provider value={{ cart, addToCart, increaseQuantity, decreaseQuantity, removeFromCart, clearCart, total }}>
      {children}
    </CartContext.Provider>
  );
}

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart debe usarse dentro de un CartProvider');
  }
  return context;
};