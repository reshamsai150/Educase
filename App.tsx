import React, { useEffect, useRef } from 'react';
import { AppState, AppStateStatus, StatusBar } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { NavigationContainer, DefaultTheme } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { Provider, useDispatch, useSelector } from 'react-redux';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import FavoritesScreen from './src/screens/FavoritesScreen';
import ProductDetailScreen from './src/screens/ProductDetailScreen';
import ProductListScreen from './src/screens/ProductListScreen';
import { loadFavorites } from './src/store/favoritesSlice';
import { hydrateProducts, refreshProducts } from './src/store/productsSlice';
import { AppDispatch, RootState, store } from './src/store/store';
import {
  FAVORITES_STORAGE_KEY,
  PRODUCTS_STORAGE_KEY,
  RootStackParamList,
  RootTabParamList,
} from './src/types/product';

const RootStack = createNativeStackNavigator<RootStackParamList>();
const ProductsStack = createNativeStackNavigator();
const Tab = createBottomTabNavigator<RootTabParamList>();

const navigationTheme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    background: '#F4F1EA',
    card: '#FFFCF7',
    border: '#E6DDCF',
    primary: '#1F6B5C',
    text: '#1D2A24',
  },
};

function MainTabs() {
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: '#1F6B5C',
        tabBarInactiveTintColor: '#7A756B',
        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: '700',
        },
        tabBarStyle: {
          height: 64,
          paddingBottom: 8,
          paddingTop: 8,
          backgroundColor: '#FFFCF7',
          borderTopColor: '#E6DDCF',
        },
      }}>
      <Tab.Screen name="Products" component={ProductsStackScreen} />
      <Tab.Screen name="Favorites" component={FavoritesScreen} />
    </Tab.Navigator>
  );
}

function ProductsStackScreen() {
  return (
    <ProductsStack.Navigator
      screenOptions={{
        headerShown: false,
      }}>
      <ProductsStack.Screen name="ProductListScreen" component={ProductListScreen} />
    </ProductsStack.Navigator>
  );
}

function AppShell() {
  const dispatch = useDispatch<AppDispatch>();
  const favoriteIds = useSelector(
    (state: RootState) => state.favorites.favoriteIds,
  );
  const products = useSelector((state: RootState) => state.products.items);
  const hydratedRef = useRef(false);
  const productsHydratedRef = useRef(false);

  useEffect(() => {
    dispatch(loadFavorites()).finally(() => {
      hydratedRef.current = true;
    });

    AsyncStorage.getItem(PRODUCTS_STORAGE_KEY)
      .then(stored => {
        if (stored) {
          const parsed = JSON.parse(stored);
          if (Array.isArray(parsed) && parsed.length > 0) {
            dispatch(hydrateProducts(parsed));
          }
        }
      })
      .catch(() => { })
      .finally(() => {
        productsHydratedRef.current = true;
      });
  }, [dispatch]);

  useEffect(() => {
    if (!productsHydratedRef.current || products.length === 0) {
      return;
    }

    AsyncStorage.setItem(
      PRODUCTS_STORAGE_KEY,
      JSON.stringify(products.slice(0, 20)),
    ).catch(() => { });
  }, [products]);

  useEffect(() => {
    if (!hydratedRef.current) {
      return;
    }

    AsyncStorage.setItem(FAVORITES_STORAGE_KEY, JSON.stringify(favoriteIds)).catch(
      () => { },
    );
  }, [favoriteIds]);

  useEffect(() => {
    const handleAppStateChange = (nextAppState: AppStateStatus) => {
      if (nextAppState === 'active') {
        dispatch(refreshProducts());
      }
    };

    const subscription = AppState.addEventListener('change', handleAppStateChange);
    return () => {
      subscription.remove();
    };
  }, [dispatch]);

  return (
    <SafeAreaProvider>
      <StatusBar backgroundColor="#F4F1EA" barStyle="dark-content" />
      <NavigationContainer theme={navigationTheme}>
        <RootStack.Navigator
          screenOptions={{
            headerTintColor: '#1D2A24',
            headerTitleStyle: {
              fontWeight: '700',
            },
            headerShadowVisible: false,
            headerStyle: {
              backgroundColor: '#F4F1EA',
            },
            contentStyle: {
              backgroundColor: '#F4F1EA',
            },
          }}>
          <RootStack.Screen
            name="MainTabs"
            component={MainTabs}
            options={{ headerShown: false }}
          />
          <RootStack.Screen
            name="ProductDetail"
            component={ProductDetailScreen}
            options={({ route }) => ({
              title: route.params.product?.title ?? 'Product details',
            })}
          />
        </RootStack.Navigator>
      </NavigationContainer>
    </SafeAreaProvider>
  );
}

export default function App() {
  return (
    <Provider store={store}>
      <AppShell />
    </Provider>
  );
}
