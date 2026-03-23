import React, {useCallback, useEffect, useRef, useState} from 'react';
import {
  ActivityIndicator,
  Animated,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import {RouteProp, useRoute} from '@react-navigation/native';
import {useDispatch, useSelector} from 'react-redux';
import {fetchProductDetail} from '../api/productApi';
import {toggleFavorite} from '../store/favoritesSlice';
import {AppDispatch, RootState} from '../store/store';
import {Product, RootStackParamList} from '../types/product';

type DetailRoute = RouteProp<RootStackParamList, 'ProductDetail'>;

const stars = ['★', '★', '★', '★', '★'];

export default function ProductDetailScreen() {
  const route = useRoute<DetailRoute>();
  const dispatch = useDispatch<AppDispatch>();
  const favoriteIds = useSelector(
    (state: RootState) => state.favorites.favoriteIds,
  );
  const products = useSelector((state: RootState) => state.products.items);
  const [product, setProduct] = useState<Product | undefined>(
    route.params.product ?? products.find(item => item.id === route.params.productId),
  );
  const [loading, setLoading] = useState(!product);
  const [error, setError] = useState<string | null>(null);
  const fade = useRef(new Animated.Value(0)).current;
  const pulse = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    if (product) {
      Animated.timing(fade, {
        toValue: 1,
        duration: 320,
        useNativeDriver: true,
      }).start();
      return;
    }

    fetchProductDetail(route.params.productId)
      .then(result => {
        setProduct(result);
        Animated.timing(fade, {
          toValue: 1,
          duration: 320,
          useNativeDriver: true,
        }).start();
      })
      .catch(() => {
        setError('We could not load this product right now.');
      })
      .finally(() => {
        setLoading(false);
      });
  }, [fade, product, route.params.productId]);

  const isFavorite = product ? favoriteIds.includes(product.id) : false;

  const handleToggleFavorite = useCallback(() => {
    if (!product) {
      return;
    }

    Animated.sequence([
      Animated.timing(pulse, {
        toValue: 0.92,
        duration: 90,
        useNativeDriver: true,
      }),
      Animated.timing(pulse, {
        toValue: 1.08,
        duration: 120,
        useNativeDriver: true,
      }),
      Animated.spring(pulse, {
        toValue: 1,
        friction: 4,
        tension: 140,
        useNativeDriver: true,
      }),
    ]).start();

    dispatch(toggleFavorite(product.id));
  }, [dispatch, product, pulse]);

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator color="#1F6B5C" size="large" />
      </View>
    );
  }

  if (error || !product) {
    return (
      <View style={styles.center}>
        <Text style={styles.errorTitle}>Product unavailable</Text>
        <Text style={styles.errorText}>{error ?? 'Please try again later.'}</Text>
      </View>
    );
  }

  return (
    <Animated.View style={[styles.screen, {opacity: fade}]}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.content}>
        <Image
          source={{uri: product.images[0] ?? product.thumbnail}}
          style={styles.hero}
          resizeMode="cover"
        />
        <View style={styles.card}>
          <View style={styles.headerRow}>
            <View style={styles.headerText}>
              <Text style={styles.category}>{product.category}</Text>
              <Text style={styles.title}>{product.title}</Text>
            </View>
            <Animated.View style={{transform: [{scale: pulse}]}}>
              <TouchableOpacity
                style={[
                  styles.favoriteButton,
                  isFavorite && styles.favoriteButtonActive,
                ]}
                onPress={handleToggleFavorite}
                activeOpacity={0.9}>
                <Text
                  style={[
                    styles.favoriteLabel,
                    isFavorite && styles.favoriteLabelActive,
                  ]}>
                  {isFavorite ? 'Saved' : 'Save'}
                </Text>
              </TouchableOpacity>
            </Animated.View>
          </View>
          <Text style={styles.price}>${product.price}</Text>
          <View style={styles.ratingRow}>
            <Text style={styles.stars}>
              {stars
                .map((star, index) =>
                  index < Math.round(product.rating / 1.1) ? star : '☆',
                )
                .join(' ')}
            </Text>
            <Text style={styles.ratingText}>{product.rating.toFixed(1)} / 5</Text>
          </View>
          <Text style={styles.description}>{product.description}</Text>
        </View>
      </ScrollView>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: '#F4F1EA',
  },
  content: {
    padding: 16,
    paddingBottom: 28,
  },
  center: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 28,
    backgroundColor: '#F4F1EA',
  },
  hero: {
    width: '100%',
    height: 320,
    borderRadius: 28,
    backgroundColor: '#E8DFD2',
  },
  card: {
    marginTop: -32,
    backgroundColor: '#FFFCF7',
    borderRadius: 28,
    padding: 22,
    shadowColor: '#7C6F5D',
    shadowOpacity: 0.16,
    shadowRadius: 16,
    shadowOffset: {width: 0, height: 8},
    elevation: 4,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  headerText: {
    flex: 1,
    paddingRight: 12,
  },
  category: {
    color: '#1F6B5C',
    textTransform: 'capitalize',
    fontWeight: '700',
    marginBottom: 8,
  },
  title: {
    color: '#1D2A24',
    fontSize: 28,
    lineHeight: 34,
    fontWeight: '800',
  },
  favoriteButton: {
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 999,
    backgroundColor: '#F2E9DE',
  },
  favoriteButtonActive: {
    backgroundColor: '#D95D39',
  },
  favoriteLabel: {
    color: '#655E56',
    fontWeight: '700',
  },
  favoriteLabelActive: {
    color: '#FFFFFF',
  },
  price: {
    marginTop: 20,
    color: '#1D2A24',
    fontSize: 32,
    fontWeight: '800',
  },
  ratingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 16,
  },
  stars: {
    color: '#D95D39',
    fontSize: 18,
    marginRight: 10,
  },
  ratingText: {
    color: '#6F695F',
    fontWeight: '600',
  },
  description: {
    marginTop: 20,
    color: '#4F4A43',
    fontSize: 16,
    lineHeight: 26,
  },
  errorTitle: {
    fontSize: 24,
    fontWeight: '800',
    color: '#1D2A24',
    marginBottom: 10,
  },
  errorText: {
    color: '#6F695F',
    textAlign: 'center',
    fontSize: 15,
    lineHeight: 22,
  },
});
