// AppNavigator.tsx

import React from 'react';
import {createNativeStackNavigator} from '@react-navigation/native-stack';

import AuthStack from './AuthStack';
import GuestStack from './GuestStack';
import {CartProvider} from '../context/CartContext';
import {AppContext, AppProvider} from '../context/AppContext';
import {AuthContext, AuthProvider} from '../context/AuthContext';

const Stack = createNativeStackNavigator();

const AppNavigator = () => {
  return (
    <AppProvider>
      <AppContext.Consumer>
        {({isLoggedIn}) => (
          <AuthProvider>
            <AuthContext.Consumer>
              {({token}) => (
                <Stack.Navigator>
                  {isLoggedIn ? (
                    <Stack.Screen
                      name="AuthStack"
                      options={{headerShown: false}}>
                      {props => (
                        <CartProvider {...props}>
                          <AuthStack {...props} />
                        </CartProvider>
                      )}
                    </Stack.Screen>
                  ) : (
                    <Stack.Screen
                      name="GuestStack"
                      component={GuestStack}
                      options={{headerShown: false}}
                    />
                  )}
                </Stack.Navigator>
              )}
            </AuthContext.Consumer>
          </AuthProvider>
        )}
      </AppContext.Consumer>
    </AppProvider>
  );
};

export default AppNavigator;
