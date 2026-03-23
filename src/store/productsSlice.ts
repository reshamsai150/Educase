import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { fetchProductList, searchProductList } from '../api/productApi';
import { Product } from '../types/product';

type ProductsState = {
  items: Product[];
  page: number;
  loading: boolean;
  error: string | null;
  hasMore: boolean;
  query: string;
};

const initialState: ProductsState = {
  items: [],
  page: 1,
  loading: false,
  error: null,
  hasMore: true,
  query: '',
};

const mergeItems = (current: Product[], incoming: Product[]) => {
  const seen = new Set(current.map(item => item.id));
  return [...current, ...incoming.filter(item => !seen.has(item.id))];
};

export const fetchProducts = createAsyncThunk(
  'products/fetchProducts',
  async (page: number, { rejectWithValue }) => {
    try {
      return await fetchProductList(page);
    } catch (error) {
      return rejectWithValue(
        error instanceof Error ? error.message : 'Unable to load products.',
      );
    }
  },
);

export const searchProducts = createAsyncThunk(
  'products/searchProducts',
  async (
    { query, page = 1 }: { query: string; page?: number },
    { rejectWithValue },
  ) => {
    try {
      const response = await searchProductList(query, page);
      return { ...response, query, page };
    } catch (error) {
      return rejectWithValue(
        error instanceof Error ? error.message : 'Unable to search products.',
      );
    }
  },
);

export const refreshProducts = () => fetchProducts(1);

const productsSlice = createSlice({
  name: 'products',
  initialState,
  reducers: {
    setQuery: (state, action: PayloadAction<string>) => {
      state.query = action.payload;
    },
    clearError: state => {
      state.error = null;
    },
    resetProducts: () => initialState,
    hydrateProducts: (state, action: PayloadAction<Product[]>) => {
      if (state.items.length === 0 && state.page === 1 && !state.query) {
        state.items = action.payload;
      }
    },
  },
  extraReducers: builder => {
    builder
      .addCase(fetchProducts.pending, state => {
        state.loading = true;
        state.error = null;
        state.query = '';
      })
      .addCase(fetchProducts.fulfilled, (state, action) => {
        const nextPage = action.meta.arg;
        state.loading = false;
        state.page = nextPage;
        state.items =
          nextPage === 1
            ? action.payload.products
            : mergeItems(state.items, action.payload.products);
        state.hasMore =
          action.payload.skip + action.payload.products.length <
          action.payload.total;
      })
      .addCase(fetchProducts.rejected, (state, action) => {
        state.loading = false;
        state.error = (action.payload as string) ?? 'Unable to load products.';
      })
      .addCase(searchProducts.pending, (state, action) => {
        state.loading = true;
        state.error = null;
        state.query = action.meta.arg.query;
      })
      .addCase(searchProducts.fulfilled, (state, action) => {
        state.loading = false;
        state.page = action.payload.page;
        state.items =
          action.payload.page === 1
            ? action.payload.products
            : mergeItems(state.items, action.payload.products);
        state.hasMore =
          action.payload.skip + action.payload.products.length <
          action.payload.total;
      })
      .addCase(searchProducts.rejected, (state, action) => {
        state.loading = false;
        state.error = (action.payload as string) ?? 'Unable to search products.';
      });
  },
});

export const { setQuery, clearError, resetProducts, hydrateProducts } = productsSlice.actions;
export default productsSlice.reducer;
