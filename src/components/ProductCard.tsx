import React, {memo, useCallback, useRef} from 'react';
import {
  Animated,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import {Product} from '../types/product';

type ProductCardProps = {
  product: Product;
  isFavorite: boolean;
  onPress: (product: Product) => void;
  onToggleFavorite: (productId: number) => void;
};

function ProductCard({
  product,
  isFavorite,
  onPress,
  onToggleFavorite,
}: ProductCardProps) {
  const scale = useRef(new Animated.Value(1)).current;

  const handleFavoritePress = useCallback(() => {
    Animated.sequence([
      Animated.timing(scale, {
        toValue: 0.92,
        duration: 90,
        useNativeDriver: true,
      }),
      Animated.timing(scale, {
        toValue: 1.08,
        duration: 120,
        useNativeDriver: true,
      }),
      Animated.spring(scale, {
        toValue: 1,
        friction: 4,
        tension: 140,
        useNativeDriver: true,
      }),
    ]).start();

    onToggleFavorite(product.id);
  }, [onToggleFavorite, product.id, scale]);

  const handleOpen = useCallback(() => {
    onPress(product);
  }, [onPress, product]);

  return (
    <TouchableOpacity
      activeOpacity={0.92}
      onPress={handleOpen}
      style={styles.card}>
      <Image
        source={{uri: product.thumbnail}}
        resizeMode="cover"
        style={styles.image}
      />
      <View style={styles.content}>
        <View style={styles.topRow}>
          <Text
            numberOfLines={2}
            style={styles.title}>
            {product.title}
          </Text>
          <Animated.View style={{transform: [{scale}]}}>
            <TouchableOpacity
              onPress={handleFavoritePress}
              activeOpacity={0.85}
              style={[
                styles.favoriteButton,
                isFavorite && styles.favoriteButtonActive,
              ]}>
              <Text
                style={[
                  styles.favoriteText,
                  isFavorite && styles.favoriteTextActive,
                ]}>
                {isFavorite ? 'Saved' : 'Save'}
              </Text>
            </TouchableOpacity>
          </Animated.View>
        </View>
        <Text style={styles.category}>{product.category}</Text>
        <View style={styles.bottomRow}>
          <Text style={styles.price}>${product.price}</Text>
          <Text style={styles.rating}>Star {product.rating.toFixed(1)}</Text>
        </View>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    padding: 14,
    borderRadius: 18,
    backgroundColor: '#FFFCF7',
    marginHorizontal: 16,
    marginBottom: 14,
    shadowColor: '#7C6F5D',
    shadowOpacity: 0.12,
    shadowRadius: 14,
    shadowOffset: {width: 0, height: 5},
    elevation: 4,
  },
  image: {
    width: 108,
    height: 108,
    borderRadius: 16,
    backgroundColor: '#E8DFD2',
  },
  content: {
    flex: 1,
    marginLeft: 14,
    justifyContent: 'space-between',
  },
  topRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  title: {
    flex: 1,
    color: '#1D2A24',
    fontSize: 17,
    lineHeight: 22,
    fontWeight: '700',
    paddingRight: 10,
  },
  favoriteButton: {
    minWidth: 58,
    paddingHorizontal: 10,
    paddingVertical: 8,
    borderRadius: 999,
    backgroundColor: '#F2E9DE',
    alignItems: 'center',
  },
  favoriteButtonActive: {
    backgroundColor: '#D95D39',
  },
  favoriteText: {
    color: '#6B6259',
    fontWeight: '700',
    fontSize: 12,
  },
  favoriteTextActive: {
    color: '#FFFFFF',
  },
  category: {
    marginTop: 8,
    color: '#857D70',
    fontSize: 13,
    textTransform: 'capitalize',
  },
  bottomRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 16,
  },
  price: {
    color: '#1D2A24',
    fontSize: 20,
    fontWeight: '800',
  },
  rating: {
    color: '#1F6B5C',
    fontWeight: '700',
    fontSize: 13,
  },
});

export default memo(ProductCard);
