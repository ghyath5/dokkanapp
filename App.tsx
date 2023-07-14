/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import React from 'react';
// import type {PropsWithChildren} from 'react';
// import {StyleSheet, useColorScheme} from 'react-native';

import {NavigationContainer} from '@react-navigation/native';
import AppNavigator from './src/navigation/AppNavigator';

import {I18nManager} from 'react-native';
I18nManager.forceRTL(true);
function App(): JSX.Element {
  return (
    <NavigationContainer>
      <AppNavigator />
    </NavigationContainer>
  );
}

export default App;
