// GuestStack.tsx

import React from 'react';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import LoginScreen from '../screens/LoginScreen';
import {Text} from 'react-native';

const Stack = createNativeStackNavigator();

const GuestStack = () => {
  return (
    <Stack.Navigator>
      <Stack.Screen
        options={{
          headerTitleAlign: 'center',
        }}
        name="تسجيل الدخول"
        component={LoginScreen}
      />
    </Stack.Navigator>
  );
};

export default GuestStack;
