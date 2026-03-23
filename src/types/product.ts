export interface Product {
  id: number;
  title: string;
  description: string;
  price: number;
  rating: number;
  thumbnail: string;
  images: string[];
  brand?: string;
  category: string;
}

export interface ProductsResponse {
  products: Product[];
  total: number;
  skip: number;
  limit: number;
}

export type RootStackParamList = {
  MainTabs: undefined;
  ProductDetail: {
    productId: number;
    product?: Product;
  };
};

export type RootTabParamList = {
  Products: undefined;
  Favorites: undefined;
};

export const PAGE_SIZE = 10;
export const FAVORITES_STORAGE_KEY = '@product-explorer/favorite-ids';
export const PRODUCTS_STORAGE_KEY = '@product-explorer/products';
