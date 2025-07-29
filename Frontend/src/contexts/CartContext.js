import React, { createContext, useState, useContext, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

const CartContext = createContext();

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState([]);

  useEffect(() => {
    loadCartFromStorage();
  }, []);

  useEffect(() => {
    saveCartToStorage();
  }, [cartItems]);

  const loadCartFromStorage = async () => {
    try {
      const savedCart = await AsyncStorage.getItem('cart');
      if (savedCart) {
        setCartItems(JSON.parse(savedCart));
      }
    } catch (error) {
      console.error('Error loading cart:', error);
    }
  };

  const saveCartToStorage = async () => {
    try {
      await AsyncStorage.setItem('cart', JSON.stringify(cartItems));
    } catch (error) {
      console.error('Error saving cart:', error);
    }
  };

  const addToCart = (product) => {
    setCartItems(prevItems => {
      const existingItem = prevItems.find(
        item => item.object_id === product.id && item.content_type === product.type
      );

      if (existingItem) {
        return prevItems.map(item =>
          item.object_id === product.id && item.content_type === product.type
            ? { ...item, quantity: item.quantity + (product.quantity || 1) }
            : item
        );
      } else {
        return [...prevItems, {
          object_id: product.id,
          content_type: product.type,
          quantity: product.quantity || 1,
          name: product.name,
          price: product.price,
        }];
      }
    });
  };

  const removeFromCart = (productId, contentType) => {
    setCartItems(prevItems =>
      prevItems.filter(
        item => !(item.object_id === productId && item.content_type === contentType)
      )
    );
  };

  const updateQuantity = (productId, contentType, quantity) => {
    if (quantity <= 0) {
      removeFromCart(productId, contentType);
      return;
    }

    setCartItems(prevItems =>
      prevItems.map(item =>
        item.object_id === productId && item.content_type === contentType
          ? { ...item, quantity }
          : item
      )
    );
  };

  const clearCart = () => {
    setCartItems([]);
  };

  const getCartTotal = () => {
    return cartItems.reduce((total, item) => total + (item.price * item.quantity), 0);
  };

  const getCartCount = () => {
    return cartItems.reduce((count, item) => count + item.quantity, 0);
  };

  const getCartItemsForOrder = () => {
    return cartItems.map(item => ({
      quantity: item.quantity,
      content_type: item.content_type,
      object_id: item.object_id,
    }));
  };

  const value = {
    cartItems,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    getCartTotal,
    getCartCount,
    getCartItemsForOrder,
  };

  return (
    <CartContext.Provider value={value}>
      {children}
    </CartContext.Provider>
  );
}; 