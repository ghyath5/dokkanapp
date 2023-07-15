import React, {useEffect, useState} from 'react';
import {
  View,
  Text,
  ActivityIndicator,
  ScrollView,
  TextInput,
  StyleSheet,
} from 'react-native';
import ProductBox from '../components/Product';
import {supabase} from '../supabase';
export interface Product {
  id: number;
  title: string;
  unit: string;
  price: number;
  images: string[];
  description: string;
}

const productsPerPage = 8; // Number of products to show per page
const HomeScreen: React.FC = () => {
  const [page, setPage] = useState<number>(0);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [searchText, setSearchText] = useState<string>('');

  useEffect(() => {
    const fetch = () => {
      console.log(page);

      getProducts(page).then(loadedProducts =>
        setProducts(products => [...products, ...loadedProducts]),
      );
    };
    fetch();
  }, [page]);

  const loadMoreProducts = (): void => {
    setPage(page + 1);
  };

  const getProducts = async (page: number): Promise<Product[]> => {
    setLoading(true);
    // Simulate loading products from an API
    const {data} = await supabase
      .from('products')
      .select('*')
      .eq('active', true)
      .range(page * productsPerPage, productsPerPage);
    setLoading(false);

    return data ?? [];
  };
  return (
    <View style={{flex: 1}}>
      <View style={styles.header}>
        <TextInput
          style={styles.searchInput}
          placeholderTextColor={'grey'}
          placeholder="بحث"
          value={searchText}
          onChangeText={text => setSearchText(text)}
        />
      </View>
      <ScrollView
        onScroll={({nativeEvent}) => {
          if (
            Number(nativeEvent.contentOffset.y.toFixed(2)) >=
              Number(
                (
                  nativeEvent.contentSize.height -
                  nativeEvent.layoutMeasurement.height
                ).toFixed(2),
              ) &&
            !loading
          ) {
            loadMoreProducts();
          }
        }}
        // style={{flex: 1}}
        contentContainerStyle={{padding: 10}}>
        {products.map((product, index) => {
          if (index % 2 === 0) {
            return (
              <View key={index} style={{flexDirection: 'row'}}>
                <ProductBox product={product} />
                {products[index + 1] && (
                  <ProductBox product={products[index + 1]} />
                )}
              </View>
            );
          }
        })}
        {loading && <ActivityIndicator size="large" color="blue" />}
      </ScrollView>
    </View>
  );
};

export default HomeScreen;
const styles = StyleSheet.create({
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
