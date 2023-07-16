import React, {useCallback, useEffect, useMemo, useState} from 'react';
import {
  View,
  Text,
  ActivityIndicator,
  Dimensions,
  TextInput,
  StyleSheet,
  FlatList,
  Alert,
} from 'react-native';
import ProductBox from '../components/Product';
import {supabase} from '../supabase';
import {globalStyles} from '../GlobalStyes';
import debounce from 'lodash/debounce';
import {uniqBy} from 'lodash';
import {TouchableWithoutFeedback} from 'react-native-gesture-handler';
import {Product} from '../types';
import {ProductsProps} from '../navigation/AuthStack';

const PAGE_SIZE = 8;
const HomeScreen: React.FC<ProductsProps> = props => {
  const {width} = Dimensions.get('screen');
  const [page, setPage] = useState<number>(0);
  const [productsCount, setProductsCount] = useState<number>(0);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [searchText, setSearchText] = useState<string>('');

  const [isRefreshing, setIsRefreshing] = useState(false);
  const hasNext = useMemo(
    () => productsCount < products.length,
    [products.length, productsCount],
  );
  const getProducts = async ({loadMore = false, text = ''}): Promise<void> => {
    setLoading(true);
    // Simulate loading products from an API
    const [productsResponse, {count}] = await Promise.all([
      supabase
        .from('products')
        .select('*')
        .eq('active', true)
        .or(`title.ilike.${text}%,description.ilike.${text}%`)
        .range(page * PAGE_SIZE, PAGE_SIZE),
      supabase
        .from('products')
        .select('*', {count: 'exact', head: true})
        .eq('active', true)
        .or(`title.ilike.${text}%,description.ilike.${text}%`),
    ]);
    setLoading(false);
    setIsRefreshing(false);
    if (loadMore) {
      setProducts(products =>
        uniqBy([...products, ...(productsResponse.data ?? [])], 'id'),
      );
    } else {
      setProducts(
        uniqBy([...(productsResponse.data ?? [])], function (e) {
          return e.id;
        }),
      );
    }
    setProductsCount(count ?? 0);
  };
  const debouncedGetProducts = useCallback(debounce(getProducts, 500), [page]);
  useEffect(() => {
    debouncedGetProducts({text: searchText});
  }, [searchText]);

  const handleRefresh = () => {
    setLoading(true);
    debouncedGetProducts({text: searchText});
    setPage(0);
    setProducts([]);
  };
  const keyExtractor = (item: Product) => String(item.id);

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TextInput
          style={styles.searchInput}
          placeholderTextColor={'grey'}
          placeholder="بحث"
          value={searchText}
          onChangeText={text => setSearchText(text)}
        />
      </View>

      <FlatList
        numColumns={Math.floor(width / 150)}
        data={products}
        renderItem={({item}) => (
          // <View style={{flex: 1}}>
          <ProductBox {...props} product={item} />
          // </View>
          // </View>
        )}
        keyExtractor={keyExtractor}
        contentContainerStyle={styles.contentContainer}
        onEndReached={() => {
          if (!loading && products.length && hasNext) {
            // console.log('loainggg');
            debouncedGetProducts({text: searchText, loadMore: true});
          }
        }}
        // onStartReachedThreshold={0}
        onEndReachedThreshold={0.3}
        refreshing={isRefreshing}
        onRefresh={handleRefresh}
        ListFooterComponent={
          loading ? <ActivityIndicator size="large" color="blue" /> : <></>
        }
        ListEmptyComponent={
          !loading && products.length === 0 ? (
            <Text style={{...globalStyles.centerText}}>No products found.</Text>
          ) : (
            <></>
          )
        }
      />
      {/* </View> */}
    </View>
  );
};

export default HomeScreen;
const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 5,
    // paddingTop: 24,
  },
  contentContainer: {
    paddingBottom: 16,
  },
  productContainer: {
    width: '48%',
    marginBottom: 16,
  },
  productBox: {
    backgroundColor: '#F8F8F8',
    borderRadius: 8,
    padding: 16,
  },
  image: {
    width: '100%',
    height: 150,
    marginBottom: 8,
    borderRadius: 8,
  },
  productDetails: {
    flex: 1,
  },
  name: {
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'right',
    marginBottom: 8,
  },
  unit: {
    fontSize: 14,
    textAlign: 'right',
    marginBottom: 4,
  },
  price: {
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'right',
    marginBottom: 4,
  },
  description: {
    fontSize: 14,
    textAlign: 'right',
  },
  header: {
    padding: 10,
    backgroundColor: '#ffffff00',
    alignItems: 'center',
    justifyContent: 'center',
  },
  searchInput: {
    height: 40,
    width: '95%',
    borderColor: '#ccc',
    borderWidth: 0.2,
    borderRadius: 20,
    paddingLeft: 20,
    paddingRight: 20,
    backgroundColor: '#fff',
  },
});
