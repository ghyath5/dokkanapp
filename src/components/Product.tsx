import React, {useState, useEffect, useMemo, memo} from 'react';
import {View, Text, Image, TouchableWithoutFeedback} from 'react-native';
import {useCart} from '../context/CartContext';
import {Product} from '../types';
import {GENERATE_IMAGE_URL, baseURL} from '../Constant';
import QuantityCounter from './QuantityCounter';
import {ProductsProps} from '../navigation/AuthStack';
interface Props {
  product: Product;
}
const ProductBox: React.FC<Props & ProductsProps> = ({product, navigation}) => {
  const {addToCart, removeFromCart, cartItems, quantityAction} = useCart();
  const cartProduct = useMemo(
    () => cartItems.find(cartProduct => cartProduct.id == product.id),
    [product.id, cartItems],
  );
  const quantity = useMemo(
    () => cartProduct?.quantity || 0,
    [cartProduct?.quantity],
  );
  const picURL = GENERATE_IMAGE_URL(product.images[0]);
  return (
    <TouchableWithoutFeedback
      onPress={() => {
        navigation.navigate('Product', {product});
      }}>
      <View
        onStartShouldSetResponder={event => true}
        style={{
          flex: 1,
          margin: 5,
          // width: '100%',
          borderTopLeftRadius: 18,
          borderTopRightRadius: 18,
          overflow: 'hidden',
        }}>
        <Image
          source={{uri: picURL}}
          style={{width: '100%', height: 200}}
          resizeMethod="resize"
        />
        <View
          style={{
            backgroundColor: 'white',
            padding: 10,
            borderBottomEndRadius: 10,
            borderBottomStartRadius: 10,
          }}>
          <View
            style={{
              flex: 1,
              justifyContent: 'space-between',
              flexDirection: 'row',
            }}>
            <Text style={{fontSize: 15, fontWeight: 'bold', color: 'green'}}>
              {product.title}
            </Text>

            <Text style={{fontSize: 12, color: 'gray'}}>{product.unit}</Text>
          </View>
          <Text style={{fontWeight: '600', color: 'black'}}>
            ${product.price} د.أ
          </Text>
          <Text style={{color: '#ccc', paddingBottom: 20}} numberOfLines={1}>
            {product.description}
          </Text>
          <QuantityCounter
            decrease={e => quantityAction(product, 'DECREASE')}
            increase={e => quantityAction(product, 'INCREASE')}
            quantity={quantity}
          />
        </View>
      </View>
    </TouchableWithoutFeedback>
  );
};

export default memo(ProductBox);
