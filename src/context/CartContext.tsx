import React, {
  createContext,
  useContext,
  useState,
  useMemo,
  useEffect,
} from 'react';
import {Alert, Text, TouchableOpacity} from 'react-native';
import {Product, ScreenProps} from '../types';
import {useAuth} from './AuthContext';
import {supabase} from '../supabase';
import MaterialCommunityIcon from 'react-native-vector-icons/MaterialCommunityIcons';
import {useRoute} from '@react-navigation/native';
import {useApp} from './AppContext';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {AuthStackParamList, CartProps} from '../navigation/AuthStack';
import AsyncStorage from '@react-native-async-storage/async-storage';

export interface CartItem {
  id: number;
  title: string;
  quantity: number;
  price: number;
  images: string[];
  unit: string;
  description: string;
}

export interface CartContextType {
  cartItems: CartItem[];
  addToCart: (item: CartItem) => void;
  removeFromCart: (productId: number) => void;
  clearCart: () => void;
  quantityAction: (item: Product, action: 'INCREASE' | 'DECREASE') => void;
  submitOrder: () => void;
}

export const CartContext = createContext<CartContextType>({
  cartItems: [],
  addToCart: () => {},
  removeFromCart: () => {},
  clearCart: () => {},
  quantityAction: () => {},
  submitOrder: () => {},
});
type Props = NativeStackScreenProps<AuthStackParamList> & {
  children?: React.ReactNode;
};
export const CartProvider = ({children, navigation, route}: Props) => {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [sendingOrder, setSendingOrder] = useState<boolean>(false);
  const [checking, setChecking] = useState(true);
  const {signOut} = useAuth();
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
  const quantityAction = (item: Product, action: 'INCREASE' | 'DECREASE') => {
    const index = cartItems.findIndex(cartItem => cartItem.id === item.id);
    if (index === -1 && action == 'INCREASE') {
      setCartItems(items => [...items, {...item, quantity: 1}]);
      return;
    }
    const updatedItems = [...cartItems];
    const existingItem = updatedItems[index];
    action == 'DECREASE' ? existingItem.quantity-- : existingItem.quantity++;
    if (!existingItem.quantity) {
      removeFromCart(existingItem.id);
      return;
    }
    setCartItems(updatedItems);
  };
  const removeFromCart = (productId: number) => {
    setCartItems(items => items.filter(item => item.id !== productId));
  };

  const clearCart = () => {
    setCartItems([]);
  };
  const submitOrder = async () => {
    if (sendingOrder) return;
    if (!cartItems.length) return navigation.navigate('Products');
    setSendingOrder(true);
    try {
      const {error, status} = await supabase.from('orders').insert({
        state: 'in_progress',
        products: cartItems.map(product => ({
          // price: product.price,
          // quantity: product.quantity,
          ...product,
          product_id: product.id,
        })),
      });
      if (error?.code == '42501' || status == 403) {
        Alert.alert('حسابك معطل، راسل المشرف');
        return signOut();
      }
      if (!error?.message && status > 199 && status < 400) {
        Alert.alert('تم ارسال طلبك إلى المسؤول');
        clearCart();
        navigation.navigate('Products');
      }
    } finally {
      setSendingOrder(false);
    }
  };
  useEffect(() => {
    AsyncStorage.getItem('cart').then(cart => {
      try {
        const savedCartItems = JSON.parse(cart ?? '[]');
        setCartItems(savedCartItems);
      } catch {
        setCartItems([]);
      } finally {
        setChecking(false);
      }
    });
  }, []);

  useEffect(() => {
    if (!checking) AsyncStorage.setItem('cart', JSON.stringify(cartItems));
  }, [cartItems, checking]);
  return (
    <CartContext.Provider
      value={{
        cartItems,
        addToCart,
        removeFromCart,
        clearCart,
        quantityAction,
        submitOrder,
      }}>
      {children}
      <FloatingCartButton navigation={navigation} route={route} />
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

const FloatingCartButton = (props: Props) => {
  const {cartItems} = useCart();
  const {activeScreen} = useApp();
  // Update the quantity when the cartItems change
  const quantity = useMemo(
    () => cartItems.reduce((total, item) => total + item.quantity, 0),
    [cartItems],
  );

  return (
    <TouchableOpacity
      onPress={() => props.navigation.navigate('Cart')}
      style={{
        display: quantity && activeScreen != 'Cart' ? 'flex' : 'none',
        backgroundColor: 'green',
        position: 'absolute',
        bottom: 50,
        left: 18,
        borderRadius: 15,
        padding: 10,
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 999,
        flexDirection: 'row',
        alignContent: 'center',
      }}>
      <Text style={{color: '#fff', fontSize: 14}}>{quantity}</Text>
      <MaterialCommunityIcon
        size={20}
        name={quantity < 1 ? 'cart-plus' : 'cart-outline'}
        style={{
          color: 'white',
          padding: 1,
        }}
      />
    </TouchableOpacity>
  );
};
