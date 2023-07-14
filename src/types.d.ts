import {ParamListBase, RouteProp} from '@react-navigation/native';

interface ScreenProps {
  route: RouteProp<ParamListBase, 'AuthStack'>;
  navigation: any;
}

interface Props {
  children: React.ReactNode;
}
