import React, {useState, useEffect} from 'react';
import {View, Text, Image, TouchableOpacity} from 'react-native';
import {Product} from '../screens/HomeScreen';
import MaterialCommunityIcon from 'react-native-vector-icons/MaterialCommunityIcons';
import FeatherIcon from 'react-native-vector-icons/Feather';
import {useCart} from '../context/CartContext';
interface Props {
  product: Product;
}
const baseURL =
  'https://crkrfubycchydiwccztq.supabase.co/storage/v1/object/public';
const ProductBox: React.FC<Props> = ({product}) => {
  const [quantity, setQuantity] = useState<number>(0);
  const {addToCart, removeFromCart} = useCart();

  const handleAddToCart = () => {
    // Code to add the product to the cart with the selected quantity
    if (quantity >= 1) {
      addToCart({...product, quantity});
    } else {
      setQuantity(1);
    }
    console.log(`Added ${quantity} ${product.title} to cart.`);
  };
  useEffect(() => {
    if (quantity >= 1) {
      addToCart({...product, quantity});
    } else {
      removeFromCart(product.id);
    }
  }, [quantity]);

  return (
    <View
      style={{
        flex: 1,
        margin: 5,
        borderTopLeftRadius: 18,
        borderTopRightRadius: 18,
        overflow: 'hidden',
      }}>
      <Image
        source={{uri: `${baseURL}/${product.images[0]}`}}
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
        <Text style={{color: '#ccc', paddingBottom: 5}}>
          {product.description}
        </Text>
        <View
          style={{
            display: quantity <= 0 ? 'none' : 'flex',
            flexDirection: 'row',
            justifyContent: 'space-around',
          }}>
          <TouchableOpacity
            style={{padding: 5}}
            onPress={() => {
              setQuantity(quantity + 1);
            }}>
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
            onPress={() => {
              setQuantity(quantity - 1);
            }}
            disabled={quantity === 0}>
            <FeatherIcon color={'black'} size={20} name="minus-circle" />
          </TouchableOpacity>
        </View>
        {!quantity && (
          <MaterialCommunityIcon.Button
            onPress={handleAddToCart}
            name={quantity < 1 ? 'cart-plus' : 'cart-outline'}
            backgroundColor="#007bff"
            style={{justifyContent: 'center'}}></MaterialCommunityIcon.Button>
        )}
      </View>
    </View>
  );
};

export default ProductBox;
