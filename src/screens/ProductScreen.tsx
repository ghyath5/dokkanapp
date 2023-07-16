import React, {useEffect, useMemo} from 'react';
import {View, Text, StyleSheet, Image, ScrollView} from 'react-native';
import {ProductProps} from '../navigation/AuthStack';
import {GENERATE_IMAGE_URL, baseURL} from '../Constant';
import {useCart} from '../context/CartContext';
import MaterialCommunityIcon from 'react-native-vector-icons/MaterialCommunityIcons';
import QuantityCounter from '../components/QuantityCounter';

const ProductScreen: React.FC<ProductProps> = ({navigation, route}) => {
  const {product} = route.params;
  const productId = product.id;
  const {cartItems, addToCart, quantityAction} = useCart();

  const oneProductState = useMemo(
    () => cartItems.find(item => item.id == productId),
    [productId],
  );
  useEffect(() => {
    navigation.setOptions({title: product.title});
  });
  return (
    <ScrollView contentContainerStyle={styles.container} horizontal={false}>
      <ScrollView horizontal={true}>
        <View style={styles.imagesContainer}>
          {product.images.map((image, index) => (
            <Image
              key={index}
              source={{uri: GENERATE_IMAGE_URL(image)}}
              style={styles.image}
            />
          ))}
        </View>
      </ScrollView>
      <View style={{alignItems: 'flex-start'}}>
        <Text style={styles.title}>{product.title}</Text>
        <Text style={styles.unit}>{product.unit}</Text>
        <Text style={{...styles.price}}>${product.price}</Text>
        <Text style={styles.description}>{product.description}</Text>
      </View>
      <View>
        <QuantityCounter
          decrease={() => quantityAction(product, 'DECREASE')}
          increase={() => quantityAction(product, 'INCREASE')}
          quantity={oneProductState?.quantity || 0}
        />
        {/* <MaterialCommunityIcon.Button
          onPress={(handleAddToCart)}
          name={quantity < 1 ? 'cart-plus' : 'cart-outline'}
          backgroundColor="#007bff"
          style={{
            justifyContent: 'center',
            padding: 5,
          }}
        /> */}
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 16,
  },
  imagesContainer: {
    flexDirection: 'row',
    marginBottom: 16,
  },
  image: {
    width: 170,
    height: 170,
    marginRight: 8,
    borderRadius: 8,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  unit: {
    fontSize: 16,
    marginBottom: 8,
  },
  price: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  description: {
    fontSize: 14,
  },
});

export default ProductScreen;
