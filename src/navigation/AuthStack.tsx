// AuthStack.tsx

import React from 'react';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import HomeScreen from '../screens/HomeScreen';
import {ScreenProps} from '../types';
import {Drawer} from 'react-native-drawer-layout';
import {Text, Dimensions} from 'react-native';
import MaterialIcon from 'react-native-vector-icons/MaterialCommunityIcons';
const Stack = createNativeStackNavigator();

const AuthStack = (props: ScreenProps) => {
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
        return <Text>Drawer content</Text>;
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
        <Stack.Screen name="المنتجات" component={HomeScreen} />
      </Stack.Navigator>
    </Drawer>
  );
};

export default AuthStack;
