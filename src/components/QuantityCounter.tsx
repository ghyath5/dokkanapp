import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  GestureResponderEvent,
} from 'react-native';
import FeatherIcon from 'react-native-vector-icons/Feather';
import MaterialCommunityIcon from 'react-native-vector-icons/MaterialCommunityIcons';
import React from 'react';
type Props = {
  increase: (e: GestureResponderEvent) => void;
  decrease: (e: GestureResponderEvent) => void;
  quantity: number;
  iconSize?: number;
};
const QuantityCounter = ({
  increase,
  decrease,
  quantity,
  iconSize = 20,
}: Props) => {
  return (
    <View>
      <View
        style={{
          display: quantity <= 0 ? 'none' : 'flex',
          flexDirection: 'row',
          justifyContent: 'space-around',
          width: '100%',
          alignItems: 'center',
          alignSelf: 'center',
        }}>
        <TouchableOpacity style={{padding: 5}} onPress={increase}>
          <FeatherIcon color={'black'} size={20} name="plus-circle" />
        </TouchableOpacity>
        <Text
          style={{
            color: 'black',
            paddingHorizontal: 10,
            fontSize: 16,
            fontWeight: 'bold',
          }}>
          {quantity}
        </Text>
        <TouchableOpacity
          style={{padding: 5}}
          onPress={decrease}
          disabled={quantity === 0}>
          <FeatherIcon color={'black'} size={20} name="minus-circle" />
        </TouchableOpacity>
      </View>
      {!quantity && (
        <View
          style={{
            width: '100%',
          }}>
          <MaterialCommunityIcon.Button
            size={iconSize}
            onPress={increase}
            name={quantity < 1 ? 'cart-plus' : 'cart-outline'}
            backgroundColor="#007bff"
            iconStyle={{
              textAlign: 'center',
              width: '100%',
            }}
            style={{
              padding: 5,
            }}
          />
        </View>
      )}
    </View>
  );
};

export default QuantityCounter;

const styles = StyleSheet.create({});
