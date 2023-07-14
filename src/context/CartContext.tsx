import React, {createContext, useContext, useState, useMemo} from 'react';
import {Text, TouchableOpacity} from 'react-native';
import {Props} from '../types';
import {useAuth} from './AuthContext';
import {supabase} from '../supabase';

export interface CartItem {
  id: number;
  title: string;
  quantity: number;
  price: number;
}

export interface CartContextType {
  cartItems: CartItem[];
  addToCart: (item: CartItem) => void;
  removeFromCart: (productId: number) => void;
  clearCart: () => void;
}

export const CartContext = createContext<CartContextType>({
  cartItems: [],
  addToCart: () => {},
  removeFromCart: () => {},
  clearCart: () => {},
});

// Define props interface for the AppProvider component

export const CartProvider: React.FC<Props> = ({children}) => {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);

  const addToCart = (item: CartItem) => {
    // Check if the item already exists in the cart
    const index = cartItems.findIndex(cartItem => cartItem.id === item.id);
    if (index === -1) {
      // If the item doesn't exist in the cart, add it as a new item
      setCartItems(items => [...items, item]);
    } else {
      // If the item already exists in the cart, update the quantity and price
      const updatedItems = [...cartItems];
      const existingItem = updatedItems[index];
      existingItem.quantity = item.quantity;
      existingItem.price = item.price;
      setCartItems(updatedItems);
    }
  };

  const removeFromCart = (productId: number) => {
    setCartItems(items => items.filter(item => item.id !== productId));
  };

  const clearCart = () => {
    setCartItems([]);
  };
  //   const submitOrder = async () => {
  //     const {error} = await supabase
  //       .from('orders')
  //       .insert({
  //         status: 'in_progress',
  //         products: cartItems.map(cartItem => ({product_id: cartItem})),
  //       });
  //   }
  return (
    <CartContext.Provider
      value={{cartItems, addToCart, removeFromCart, clearCart}}>
      {children}
      <FloatingCartButton />
    </CartContext.Provider>
  );
};

export function useCart(): CartContextType {
  const context = useContext(CartContext);

  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }

  return context;
}

const FloatingCartButton = () => {
  const {cartItems} = useCart();
  const {signOut} = useAuth();
  // Update the quantity when the cartItems change
  const quantity = useMemo(
    () => cartItems.reduce((total, item) => total + item.quantity, 0),
    [cartItems],
  );

  return (
    <TouchableOpacity
      onPress={signOut}
      style={{
        backgroundColor: 'green',
        position: 'absolute',
        top: 120,
        right: 20,
        borderRadius: 25,
        width: 50,
        height: 50,
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 999,
      }}>
      <Text style={{color: '#fff', fontSize: 18}}>{quantity}</Text>
    </TouchableOpacity>
  );
};
