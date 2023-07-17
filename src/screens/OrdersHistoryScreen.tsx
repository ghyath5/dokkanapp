import React, {useEffect, useState} from 'react';
import {View, Text, StyleSheet, ActivityIndicator} from 'react-native';
import TheText from '../components/TheText';
import {FlatList} from 'react-native-gesture-handler';
import {supabase} from '../supabase';
import moment from 'moment';
import 'moment/locale/ar';
import {globalStyles} from '../GlobalStyes';
moment.locale('ar');
const getStatusColor = (state: string) => {
  switch (state) {
    case 'completed':
      return '#4CAF50'; // Green color for completed state
    case 'in_progress':
      return '#FFC107'; // Orange color for in progress state
    case 'canceled':
      return '#F44336'; // Red color for canceled state
    default:
      return '#000000'; // Default color
  }
};
const getStatus = (state: string) => {
  switch (state) {
    case 'completed':
      return 'مكتمل'; // Green color for completed state
    case 'in_progress':
      return 'في التجهيز'; // Orange color for in progress state
    case 'canceled':
      return 'ملغى'; // Red color for canceled state
    default:
      return '#000000'; // Default color
  }
};
type Order = {
  id: number;
  price: number;
  created_at: Date;
  state: string;
};
const OrdersHistoryScreen: React.FC = () => {
  const [ordersHistory, setOrdersHistory] = useState<Order[]>([]);
  const [loading, setLoading] = useState<boolean>();
  const [isRefreshing, setIsRefreshing] = useState<boolean>();

  const fetchOrders = async () => {
    try {
      setIsRefreshing(true);
      setLoading(true);
      const {data} = await supabase
        .from('orders')
        .select('id, created_at, price, state')
        .order('created_at', {ascending: false});
      if (!data?.length) return;
      setOrdersHistory(data || []);
    } finally {
      setIsRefreshing(false);
      setLoading(false);
    }
  };
  useEffect(() => {
    fetchOrders();
  }, []);

  return (
    <View style={styles.container}>
      <TheText style={styles.title}>طلباتي</TheText>
      {loading && <ActivityIndicator size={30} color={'blue'} />}
      <FlatList
        data={ordersHistory}
        initialNumToRender={8}
        onRefresh={fetchOrders}
        refreshing={isRefreshing}
        renderItem={({item: order}) => {
          return (
            <View key={order.id} style={styles.orderContainer}>
              <TheText style={styles.orderId}>رقم الطلب: {order.id}</TheText>
              <TheText style={styles.orderDate}>
                الطلب: {moment(order.created_at).fromNow()}
              </TheText>
              <TheText style={[styles.orderStatus]}>
                حالة الطلب:{' '}
                <Text style={{color: getStatusColor(order.state)}}>
                  {getStatus(order.state)}
                </Text>
              </TheText>
              <TheText style={styles.orderTotal}>
                المجموع: {order.price.toFixed(2)}$
              </TheText>
            </View>
          );
        }}
        keyExtractor={item => item.id.toString()}
        ListEmptyComponent={
          !loading && ordersHistory.length === 0 ? (
            <TheText style={{...globalStyles.centerText}}>
              No products found.
            </TheText>
          ) : (
            <></>
          )
        }
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  orderContainer: {
    backgroundColor: 'white',
    borderWidth: 1,
    borderColor: '#DDDDDD',
    borderRadius: 8,
    padding: 16,
    marginBottom: 16,
  },
  orderId: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  orderDate: {
    fontSize: 16,
    marginBottom: 8,
  },
  orderStatus: {
    fontSize: 16,
    marginBottom: 8,
    fontWeight: 'bold',
  },
  orderTotal: {
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default OrdersHistoryScreen;
