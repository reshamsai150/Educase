import React, {useCallback, useMemo} from 'react';
import {FlatList, ListRenderItem, StyleSheet, View} from 'react-native';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {useNavigation} from '@react-navigation/native';
import {useDispatch, useSelector} from 'react-redux';
import EmptyState from '../components/EmptyState';
import ProductCard from '../components/ProductCard';
import {toggleFavorite} from '../store/favoritesSlice';
import {AppDispatch, RootState} from '../store/store';
import {Product, RootStackParamList} from '../types/product';

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

export default function FavoritesScreen() {
  const navigation = useNavigation<NavigationProp>();
  const dispatch = useDispatch<AppDispatch>();
  const favoriteIds = useSelector(
    (state: RootState) => state.favorites.favoriteIds,
  );
  const products = useSelector((state: RootState) => state.products.items);

  const favoriteProducts = useMemo(
    () => products.filter(product => favoriteIds.includes(product.id)),
    [favoriteIds, products],
  );

  const handleOpenProduct = useCallback(
    (product: Product) => {
      navigation.navigate('ProductDetail', {
        productId: product.id,
        product,
      });
    },
    [navigation],
  );

  const handleToggleFavorite = useCallback(
    (productId: number) => {
      dispatch(toggleFavorite(productId));
    },
    [dispatch],
  );

  const renderItem = useCallback<ListRenderItem<Product>>(
    ({item}) => (
      <ProductCard
        product={item}
        isFavorite
        onPress={handleOpenProduct}
        onToggleFavorite={handleToggleFavorite}
      />
    ),
    [handleOpenProduct, handleToggleFavorite],
  );

  return (
    <View style={styles.screen}>
      <FlatList
        data={favoriteProducts}
        renderItem={renderItem}
        keyExtractor={item => String(item.id)}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <EmptyState
            title="Nothing saved yet"
            description="Tap Save on any product card and your favorites will live here."
          />
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: '#F4F1EA',
  },
  content: {
    paddingTop: 16,
    paddingBottom: 28,
    flexGrow: 1,
  },
});
