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
import {Text, View, Dimensions, StyleSheet} from 'react-native';
import MaterialIcon from 'react-native-vector-icons/MaterialCommunityIcons';
import ProductScreen from '../screens/ProductScreen';
type AuthStackParamList = {
  Product: {product: Product};
  Products: undefined;
};
const Stack = createNativeStackNavigator<AuthStackParamList>();

const AuthStack = () => {
  const {width, height} = Dimensions.get('screen');
  const [open, setOpen] = React.useState<boolean>(false);
  return (
    <Drawer
      drawerType="back"
      drawerStyle={{padding: 10}}
      drawerPosition="right"
      overlayStyle={{backgroundColor: 'transparent'}}
      layout={{height, width: width / 1.5}}
      open={open}
      onOpen={() => setOpen(true)}
      onClose={() => setOpen(false)}
      renderDrawerContent={() => {
        return (
          <View style={styles.container}>
            <View style={styles.circle}>
              <MaterialIcon name="account-circle" size={90} color="black" />
            </View>
            <Text style={styles.username}>ابو خالد حبنكة</Text>
          </View>
        );
      }}>
      <Stack.Navigator
        screenOptions={{
          headerRight: () => (
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
export default AuthStack;

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
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
