// AuthStack.tsx

import React from 'react';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import HomeScreen from '../screens/HomeScreen';
import {ScreenProps} from '../types';

const Stack = createNativeStackNavigator();

const AuthStack = (props: ScreenProps) => {
  return (
    <Stack.Navigator>
      <Stack.Screen
        options={{
          headerTitleAlign: 'center',
        }}
        name="المنتجات"
        component={HomeScreen}
      />
    </Stack.Navigator>
  );
};

export default AuthStack;
