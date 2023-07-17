// AuthStack.tsx

import React from 'react';
import {
  NativeStackNavigationProp,
  NativeStackScreenProps,
  createNativeStackNavigator,
} from '@react-navigation/native-stack';
import HomeScreen from '../screens/HomeScreen';
import {Product, Props, ScreenProps} from '../types';
import {Drawer} from 'react-native-drawer-layout';
import {
  Text,
  View,
  Dimensions,
  StyleSheet,
  TouchableHighlight,
  Linking,
} from 'react-native';
import MaterialIcon from 'react-native-vector-icons/MaterialCommunityIcons';
import ProductScreen from '../screens/ProductScreen';
import CartScreen from '../screens/CartScreen';
import {useApp} from '../context/AppContext';
import {useAuth} from '../context/AuthContext';
import TheText from '../components/TheText';
import OrdersHistoryScreen from '../screens/OrdersHistoryScreen';
export type AuthStackParamList = {
  Product: {product: Product};
  Cart: undefined;
  Products: undefined;
  MyOrders: undefined;
};
const Stack = createNativeStackNavigator<AuthStackParamList>();

const AuthStack = (props: NativeStackScreenProps<AuthStackParamList>) => {
  const {width, height} = Dimensions.get('screen');
  const {setActiveScreen} = useApp();
  const [open, setOpen] = React.useState<boolean>(false);

  const {user} = useAuth();
  return (
    <Drawer
      drawerType="slide"
      drawerStyle={{padding: 10}}
      drawerPosition="right"
      overlayStyle={{backgroundColor: 'transparent'}}
      layout={{height, width: width / 1.4}}
      open={open}
      onOpen={() => setOpen(true)}
      onClose={() => setOpen(false)}
      renderDrawerContent={() => {
        return (
          <View style={styles.container}>
            <View
              style={{justifyContent: 'space-between', alignItems: 'center'}}>
              <View style={styles.circle}>
                <MaterialIcon name="account-circle" size={90} color="black" />
              </View>
              <Text style={styles.username}>{user?.name || ''}</Text>
              <Text
                style={{
                  color: 'gray',
                  fontSize: 13,
                  padding: 14,
                  textAlign: 'center',
                }}>
                {user?.address || ''}
              </Text>
              <TouchableHighlight
                onPress={() => {
                  setOpen(false);
                  props.navigation.navigate('MyOrders');
                }}
                underlayColor={'#ccc'}>
                <TheText style={{color: 'blue'}}>عرض طلباتي</TheText>
              </TouchableHighlight>
            </View>
            <View style={{justifyContent: 'space-between', height: 120}}>
              <View
                style={{
                  justifyContent: 'center',
                  alignItems: 'center',
                }}>
                <TheText style={{fontSize: 16, fontWeight: '600'}}>
                  تواصل معنا
                </TheText>
                <MaterialIcon.Button
                  underlayColor={'transparent'}
                  onPress={() => {
                    Linking.openURL(
                      `whatsapp://send?text=مرحبا انا المستخدم ${user?.name} وأحتاح المساعدة&phone=+84763815244`,
                    );
                  }}
                  backgroundColor={'transparent'}
                  name="whatsapp"
                  size={40}
                  color={'green'}></MaterialIcon.Button>
              </View>
              <TheText style={{fontSize: 12, color: 'gray'}}>
                SuperDar ©{new Date().getFullYear()}
              </TheText>
            </View>
          </View>
        );
      }}>
      <Stack.Navigator
        screenListeners={{
          state: (e: any) => {
            const routes = e.data?.state?.routes;
            setActiveScreen(routes?.[routes?.length - 1].name ?? '');
          },
        }}
        screenOptions={{
          headerBackVisible: false,
          headerLeft: () => (
            <MaterialIcon
              name={open ? 'menu-open' : 'menu'}
              size={28}
              color="black"
              style={{marginRight: 10}}
              onPress={() => setOpen(isOpen => !isOpen)}
            />
          ),
          headerTitleAlign: 'center',
        }}>
        <Stack.Screen
          name="Products"
          navigationKey="Products"
          options={{
            title: 'المنتجات',
          }}
          component={HomeScreen}
        />
        <Stack.Screen
          name="Product"
          navigationKey="Product"
          component={ProductScreen}
        />
        <Stack.Screen
          name="Cart"
          key={'Cart'}
          navigationKey="Cart"
          options={{
            title: 'السلة',
          }}
          component={CartScreen}
        />
        <Stack.Screen
          name="MyOrders"
          navigationKey="MyOrders"
          options={{
            title: 'طلباتي',
          }}
          component={OrdersHistoryScreen}
        />
      </Stack.Navigator>
    </Drawer>
  );
};
export type ProductsProps = NativeStackScreenProps<
  AuthStackParamList,
  'Products'
>;
export type ProductProps = NativeStackScreenProps<
  AuthStackParamList,
  'Product'
>;
export type CartProps = NativeStackScreenProps<AuthStackParamList, 'Cart'> & {
  children?: React.ReactNode;
};
export type MyOrdersProps = NativeStackScreenProps<
  AuthStackParamList,
  'MyOrders'
>;
export default AuthStack;

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'space-between',
    flex: 1,
  },
  circle: {
    width: 100,
    height: 100,
    borderRadius: 50,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 10,
  },
  username: {
    fontSize: 15,
    fontWeight: 'bold',
    color: 'gray',
  },
});
