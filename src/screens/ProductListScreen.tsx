import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
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
  const browseItemsRef = useRef<Product[]>([]);

  useEffect(() => {
    if (items.length === 0 && !query && !loading) {
      dispatch(fetchProducts(1));
    }
  }, [dispatch, items.length, loading, query]);

  useEffect(() => {
    if (!query) {
      browseItemsRef.current = items;
    }
  }, [items, query]);

  const activeSearch = searchText.trim();
  const hasTypedSearch = searchText.trim().length > 0;
  const browseItems =
    browseItemsRef.current.length > 0 ? browseItemsRef.current : items;
  const localMatches = useMemo(() => {
    const normalized = activeSearch.toLowerCase();

    if (!normalized) {
      return browseItems;
    }

    return browseItems.filter(product =>
      `${product.title} ${product.category} ${product.brand ?? ''}`
        .toLowerCase()
        .includes(normalized),
    );
  }, [activeSearch, browseItems]);
  const showingRemoteSearchResults =
    hasTypedSearch && Boolean(query) && query === activeSearch;
  const restoringBrowse = !hasTypedSearch && Boolean(query);
  const visibleItems = restoringBrowse
    ? browseItems
    : showingRemoteSearchResults
      ? items
      : activeSearch
      ? localMatches
      : items;
  const showingSearchLoader =
    loading &&
    query === activeSearch &&
    hasTypedSearch &&
    visibleItems.length === 0;

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
    if (query) {
      dispatch(searchProducts({query, page: 1}));
      return;
    }

    dispatch(refreshProducts());
  }, [dispatch, query]);

  const handleEndReached = useCallback(() => {
    if (loading || !hasMore) {
      return;
    }

    if (query) {
      dispatch(searchProducts({query, page: page + 1}));
      return;
    }

    dispatch(fetchProducts(page + 1));
  }, [dispatch, hasMore, loading, page, query]);

  const handleClear = useCallback(() => {
    setSearchText('');
    dispatch(clearError());
    if (query) {
      dispatch(setQuery(''));
      dispatch(refreshProducts());
    }
  }, [dispatch, query]);

  const handleSubmitSearch = useCallback(() => {
    const nextQuery = searchText.trim();

    dispatch(clearError());
    if (!nextQuery) {
      if (query) {
        dispatch(setQuery(''));
        dispatch(refreshProducts());
      }
      return;
    }

    dispatch(searchProducts({query: nextQuery, page: 1}));
  }, [dispatch, query, searchText]);

  const handleSearchTextChange = useCallback((value: string) => {
    setSearchText(value);
  }, []);

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

  return (
    <View style={styles.screen}>
      <SearchBar
        value={searchText}
        onChangeText={handleSearchTextChange}
        onClear={handleClear}
        onSubmit={handleSubmitSearch}
      />
      {loading && items.length === 0 && !hasTypedSearch ? <Loader /> : null}
      {error && items.length === 0 && !hasTypedSearch ? (
        <EmptyState
          title="We hit a loading snag"
          description="Try again and we will pull the latest products back in."
          actionLabel="Retry"
          onAction={handleRefresh}
        />
      ) : null}
      {!((loading && items.length === 0 && !hasTypedSearch) || (error && items.length === 0 && !hasTypedSearch)) ? (
        <FlatList
          data={visibleItems}
          renderItem={renderItem}
          keyExtractor={item => String(item.id)}
          ListFooterComponent={footer}
          ListEmptyComponent={
            showingSearchLoader ? (
              <View style={styles.searchLoaderWrap}>
                <ActivityIndicator color="#1F6B5C" size="large" />
                <Text style={styles.searchLoaderText}>Searching products...</Text>
              </View>
            ) : (
              <EmptyState
                title={hasTypedSearch ? 'No products found' : 'No products yet'}
                description={
                  hasTypedSearch
                    ? `We could not find any products for "${searchText.trim()}". Try another search term.`
                    : 'Pull to refresh or retry to bring products back.'
                }
                actionLabel={error ? 'Retry' : undefined}
                onAction={error ? handleRefresh : undefined}
              />
            )
          }
          refreshControl={
            <RefreshControl
              refreshing={loading && !hasTypedSearch}
              onRefresh={handleRefresh}
              tintColor="#1F6B5C"
            />
          }
          onEndReached={handleEndReached}
          onEndReachedThreshold={0.45}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="always"
          keyboardDismissMode="on-drag"
          contentContainerStyle={styles.content}
        />
      ) : null}
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
  searchLoaderWrap: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: 48,
    paddingHorizontal: 24,
  },
  searchLoaderText: {
    marginTop: 12,
    color: '#6F695F',
    fontSize: 15,
    fontWeight: '600',
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
