import {ParamListBase, RouteProp} from '@react-navigation/native';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';

interface ScreenProps {
  route: RouteProp<ParamListBase, 'AuthStack'>;
  navigation: NativeStackNavigationProp;
}

interface Props {
  children: React.ReactNode;
}

interface Product {
  id: number;
  title: string;
  unit: string;
  price: number;
  images: string[];
  description: string;
}
