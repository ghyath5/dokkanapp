import React from 'react';
import {
  View,
  Alert,
  Text,
  StyleSheet,
  Image,
  FlatList,
  TouchableWithoutFeedback,
  TouchableHighlight,
} from 'react-native';
import {GENERATE_IMAGE_URL} from '../Constant';
import {CartItem, useCart} from '../context/CartContext';
import {CartProps} from '../navigation/AuthStack';
import QuantityCounter from '../components/QuantityCounter';
import {globalStyles} from '../GlobalStyes';
import TheText from '../components/TheText';
import MaterialIcon from 'react-native-vector-icons/MaterialCommunityIcons';

const CartScreen: React.FC<CartProps> = ({navigation}) => {
  const {cartItems, submitOrder, quantityAction, clearCart} = useCart();
  const renderItem = ({item}: {item: CartItem}) => {
    const productId = item.id;
    const oneProductState = cartItems.find(item => item.id == productId);
    const quantity = oneProductState?.quantity || 0;
    return (
      <View style={styles.itemContainer}>
        <Image
          source={{uri: GENERATE_IMAGE_URL(item.images[0])}}
          style={styles.image}
        />
        <View style={styles.detailsContainer}>
          <View style={styles.rowContainer}>
            <Text style={styles.title}>{item.title}</Text>
            <Text style={styles.price}>${item.price}</Text>
          </View>
          <View style={styles.rowContainer}>
            <Text style={styles.unit}>{item.unit}</Text>
            <Text style={styles.quantity}>عدد: {item.quantity}</Text>
          </View>
          <View style={{marginTop: 5}}>
            <QuantityCounter
              iconSize={0}
              decrease={() => quantityAction(item, 'DECREASE')}
              increase={() => quantityAction(item, 'INCREASE')}
              quantity={quantity}
            />
          </View>
          {/* <Text style={styles.total}>Total: ${item.quantity * item.price}</Text> */}
        </View>
      </View>
    );
  };

  const totalPrice = cartItems.reduce(
    (sum, item) => sum + item.quantity * item.price,
    0,
  );

  return (
    <View style={styles.container}>
      <FlatList
        data={cartItems}
        renderItem={renderItem}
        keyExtractor={item => item.id.toString()}
        contentContainerStyle={styles.listContainer}
      />
      <View style={{flexDirection: 'row', justifyContent: 'space-around'}}>
        <TouchableHighlight
          underlayColor="#eee"
          onPress={() => {
            navigation.navigate('Products');
          }}
          style={{
            //   position: 'absolute',
            //   bottom: 65,
            justifyContent: 'center',
            alignItems: 'center',
            paddingVertical: 10,
            marginVertical: 10,
            width: 200,
            backgroundColor: '#fffffff0',
            alignSelf: 'center',
            borderColor: 'gray',
            borderWidth: 0.2,
            borderRadius: 20,
          }}>
          <TheText
            style={{
              fontSize: 15,
              justifyContent: 'center',
              alignItems: 'center',
              textAlign: 'center',
            }}>
            <MaterialIcon
              name="plus"
              size={20}
              color={'black'}
              style={{padding: 10}}
            />
            اضف منتجات اخرى
          </TheText>
        </TouchableHighlight>
        {cartItems.length ? (
          <TouchableHighlight
            underlayColor="#eee"
            onPress={() => {
              Alert.alert('حذف المنتجات', 'سيتم حذف المنتجات من السلة', [
                {
                  onPress: () => {
                    clearCart();
                  },
                  text: 'موافق',
                },
                {
                  text: 'تراجع',
                },
              ]);
            }}
            style={{
              //   position: 'absolute',
              //   bottom: 65,
              justifyContent: 'center',
              alignItems: 'center',
              paddingVertical: 10,
              marginVertical: 10,
              width: 130,
              backgroundColor: '#fffffff0',
              alignSelf: 'center',
              borderColor: 'red',
              borderWidth: 0.3,
              borderRadius: 20,
            }}>
            <TheText style={{fontSize: 15}}>
              افراغ السلة{' '}
              <MaterialIcon
                name="delete-outline"
                size={20}
                color={'red'}
                style={{padding: 10}}
              />
            </TheText>
          </TouchableHighlight>
        ) : (
          <></>
        )}
      </View>
      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-around',
          backgroundColor: 'white',
          padding: 18,
        }}>
        <TouchableWithoutFeedback
          onPress={() => {
            Alert.alert(
              'متأكد',
              `هل انت متأكد من ارسال هذا الطلب (${totalPrice}$)`,
              [
                {
                  text: 'ارسال',
                  onPress: () => {
                    submitOrder();
                  },
                },
                {text: 'الغاء'},
              ],
              {cancelable: true},
            );
          }}>
          <Text
            style={{
              color: 'white',
              ...globalStyles.primaryBg,
              padding: 8,
              paddingHorizontal: 15,
              borderRadius: 10,
            }}>
            اطلب الان
          </Text>
        </TouchableWithoutFeedback>
        <Text style={styles.totalPrice}>المجموع: {totalPrice}$</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  rowContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  container: {
    flex: 1,
    // paddingVertical: 10,

    paddingTop: 10,
  },
  listContainer: {
    paddingBottom: 25,
    paddingHorizontal: 8,
  },
  itemContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
    backgroundColor: 'white',
    padding: 5,
    borderRadius: 10,
    paddingHorizontal: 10,
  },
  image: {
    width: 100,
    height: 120,
    borderRadius: 8,
    marginRight: 10,
  },
  detailsContainer: {
    flex: 1,
  },
  title: {
    color: 'black',
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 6,
  },
  unit: {
    color: 'gray',
    fontSize: 14,
    marginBottom: 4,
  },
  quantity: {
    color: 'gray',
    fontSize: 14,
    marginBottom: 4,
  },
  price: {
    fontSize: 14,
    marginBottom: 4,
    color: 'black',
  },
  total: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  totalPrice: {
    color: 'black',
    fontSize: 18,
    fontWeight: 'bold',
    // textAlign: 'left',
    // marginTop: 10,
  },
});

export default CartScreen;
