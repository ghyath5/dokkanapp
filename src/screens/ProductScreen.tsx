import React, {useEffect, useMemo} from 'react';
import {View, Text, StyleSheet, Image, ScrollView, Button} from 'react-native';
import {ProductProps} from '../navigation/AuthStack';
import {GENERATE_IMAGE_URL} from '../Constant';
import {useCart} from '../context/CartContext';
import QuantityCounter from '../components/QuantityCounter';
import {globalStyles} from '../GlobalStyes';

const ProductScreen: React.FC<ProductProps> = ({navigation, route}) => {
  const {product} = route.params;
  const productId = product.id;
  const {cartItems, quantityAction} = useCart();

  const oneProductState = useMemo(
    () => cartItems.find(item => item.id == productId),
    [productId, cartItems],
  );
  const quantity = useMemo(
    () => oneProductState?.quantity || 0,
    [productId, oneProductState?.quantity],
  );

  useEffect(() => {
    navigation.setOptions({title: product.title});
  }, []);
  return (
    <ScrollView contentContainerStyle={styles.container} horizontal={false}>
      <ScrollView horizontal={true}>
        <View style={styles.imagesContainer}>
          {product.images.map((image, index) => (
            <Image
              key={image}
              source={{uri: GENERATE_IMAGE_URL(image)}}
              style={styles.image}
            />
          ))}
        </View>
      </ScrollView>
      <View
        style={{
          justifyContent: 'space-between',
          alignItems: 'center',
          flexDirection: 'row',
        }}>
        <Text style={styles.title}>{product.title}</Text>
        <Text style={styles.unit}>{product.unit}</Text>
      </View>
      <Text style={{...styles.price}}>${product.price}</Text>
      <Text style={{...styles.description, ...globalStyles.centerText}}>
        {product.description}
      </Text>
      <View style={{marginTop: 40}}>
        <QuantityCounter
          iconSize={35}
          decrease={() => quantityAction(product, 'DECREASE')}
          increase={() => quantityAction(product, 'INCREASE')}
          quantity={quantity}
        />
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
    color: 'black',
  },
  unit: {
    color: 'gray',
    fontSize: 16,
    marginBottom: 8,
  },
  price: {
    color: 'black',
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  description: {
    color: 'gray',
    fontSize: 14,
  },
});

export default ProductScreen;
