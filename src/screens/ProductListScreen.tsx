import React, {useCallback, useEffect, useMemo, useRef, useState} from 'react';
import {
  ActivityIndicator,
  FlatList,
  ListRenderItem,
  RefreshControl,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {useNavigation} from '@react-navigation/native';
import {useDispatch, useSelector} from 'react-redux';
import EmptyState from '../components/EmptyState';
import Loader from '../components/Loader';
import ProductCard from '../components/ProductCard';
import SearchBar from '../components/SearchBar';
import useDebounce from '../hooks/useDebounce';
import {toggleFavorite} from '../store/favoritesSlice';
import {
  clearError,
  fetchProducts,
  refreshProducts,
  searchProducts,
  setQuery,
} from '../store/productsSlice';
import {AppDispatch, RootState} from '../store/store';
import {Product, RootStackParamList} from '../types/product';

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

export default function ProductListScreen() {
  const dispatch = useDispatch<AppDispatch>();
  const navigation = useNavigation<NavigationProp>();
  const {items, page, loading, error, hasMore, query} = useSelector(
    (state: RootState) => state.products,
  );
  const favoriteIds = useSelector(
    (state: RootState) => state.favorites.favoriteIds,
  );
  const [searchText, setSearchText] = useState('');
  const debouncedSearch = useDebounce(searchText.trim(), 400);
  const browseItemsRef = useRef<Product[]>([]);
  const lastSearchRef = useRef('');

  useEffect(() => {
    if (items.length === 0) {
      dispatch(fetchProducts(1));
    }
  }, [dispatch, items.length]);

  useEffect(() => {
    if (!query) {
      browseItemsRef.current = items;
    }
  }, [items, query]);

  useEffect(() => {
    const nextQuery = debouncedSearch.trim();

    if (!nextQuery) {
      lastSearchRef.current = '';
      if (query) {
        dispatch(setQuery(''));
        dispatch(refreshProducts());
      }
      return;
    }

    if (lastSearchRef.current === nextQuery) {
      return;
    }

    lastSearchRef.current = nextQuery;
    dispatch(searchProducts({query: nextQuery, page: 1}));
  }, [debouncedSearch, dispatch, query]);

  const localMatches = useMemo(() => {
    const trimmed = searchText.trim().toLowerCase();

    if (!trimmed) {
      return browseItemsRef.current;
    }

    return browseItemsRef.current.filter(product =>
      `${product.title} ${product.category} ${product.brand ?? ''}`
        .toLowerCase()
        .includes(trimmed),
    );
  }, [searchText]);

  const showingSearchPreview =
    searchText.trim().length > 0 && (loading || query !== searchText.trim());
  const restoringBrowse = !searchText.trim() && Boolean(query);
  const visibleItems = restoringBrowse
    ? browseItemsRef.current
    : showingSearchPreview
      ? localMatches
      : items;

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
        isFavorite={favoriteIds.includes(item.id)}
        onPress={handleOpenProduct}
        onToggleFavorite={handleToggleFavorite}
      />
    ),
    [favoriteIds, handleOpenProduct, handleToggleFavorite],
  );

  const handleRefresh = useCallback(() => {
    dispatch(clearError());
    if (searchText.trim()) {
      dispatch(searchProducts({query: searchText.trim(), page: 1}));
      return;
    }

    dispatch(refreshProducts());
  }, [dispatch, searchText]);

  const handleEndReached = useCallback(() => {
    if (loading || !hasMore) {
      return;
    }

    if (searchText.trim()) {
      dispatch(searchProducts({query: searchText.trim(), page: page + 1}));
      return;
    }

    dispatch(fetchProducts(page + 1));
  }, [dispatch, hasMore, loading, page, searchText]);

  const handleClear = useCallback(() => {
    setSearchText('');
  }, []);

  const listHeader = useMemo(
    () => (
      <SearchBar
        value={searchText}
        onChangeText={setSearchText}
        onClear={handleClear}
      />
    ),
    [handleClear, searchText],
  );

  const footer = useMemo(() => {
    if (!loading || visibleItems.length === 0) {
      return <View style={styles.footerGap} />;
    }

    return (
      <View style={styles.footerLoader}>
        <ActivityIndicator color="#1F6B5C" />
      </View>
    );
  }, [loading, visibleItems.length]);

  if (loading && items.length === 0 && !searchText.trim()) {
    return (
      <View style={styles.screen}>
        {listHeader}
        <Loader />
      </View>
    );
  }

  if (error && items.length === 0 && !searchText.trim()) {
    return (
      <View style={styles.screen}>
        {listHeader}
        <EmptyState
          title="We hit a loading snag"
          description="Try again and we will pull the latest products back in."
          actionLabel="Retry"
          onAction={handleRefresh}
        />
      </View>
    );
  }

  return (
    <View style={styles.screen}>
      <FlatList
        data={visibleItems}
        renderItem={renderItem}
        keyExtractor={item => String(item.id)}
        stickyHeaderIndices={[0]}
        ListHeaderComponent={listHeader}
        ListFooterComponent={footer}
        ListEmptyComponent={
          <EmptyState
            title={searchText.trim() ? 'No products match yet' : 'No products yet'}
            description={
              searchText.trim()
                ? 'Try a shorter phrase or clear the search to explore everything.'
                : 'Pull to refresh or retry to bring products back.'
            }
            actionLabel={error ? 'Retry' : undefined}
            onAction={error ? handleRefresh : undefined}
          />
        }
        refreshControl={
          <RefreshControl
            refreshing={loading && !showingSearchPreview}
            onRefresh={handleRefresh}
            tintColor="#1F6B5C"
          />
        }
        onEndReached={handleEndReached}
        onEndReachedThreshold={0.45}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.content}
      />
      {error && visibleItems.length > 0 ? (
        <View style={styles.inlineError}>
          <Text style={styles.inlineErrorText}>{error}</Text>
          <Text
            onPress={handleRefresh}
            style={styles.inlineRetry}>
            Retry
          </Text>
        </View>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: '#F4F1EA',
  },
  content: {
    paddingBottom: 28,
    flexGrow: 1,
  },
  footerLoader: {
    paddingVertical: 18,
  },
  footerGap: {
    height: 18,
  },
  inlineError: {
    position: 'absolute',
    left: 16,
    right: 16,
    bottom: 18,
    borderRadius: 16,
    backgroundColor: '#322D29',
    paddingHorizontal: 16,
    paddingVertical: 14,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  inlineErrorText: {
    flex: 1,
    color: '#FFF8F0',
    marginRight: 12,
  },
  inlineRetry: {
    color: '#F8B35A',
    fontWeight: '700',
  },
});
