import AsyncStorage from '@react-native-async-storage/async-storage';
import {createAsyncThunk, createSlice, PayloadAction} from '@reduxjs/toolkit';
import {FAVORITES_STORAGE_KEY} from '../types/product';

type FavoritesState = {
  favoriteIds: number[];
};

const initialState: FavoritesState = {
  favoriteIds: [],
};

export const loadFavorites = createAsyncThunk(
  'favorites/loadFavorites',
  async () => {
    const stored = await AsyncStorage.getItem(FAVORITES_STORAGE_KEY);
    return stored ? (JSON.parse(stored) as number[]) : [];
  },
);

const favoritesSlice = createSlice({
  name: 'favorites',
  initialState,
  reducers: {
    toggleFavorite: (state, action: PayloadAction<number>) => {
      const productId = action.payload;
      state.favoriteIds = state.favoriteIds.includes(productId)
        ? state.favoriteIds.filter(id => id !== productId)
        : [...state.favoriteIds, productId];
    },
  },
  extraReducers: builder => {
    builder.addCase(loadFavorites.fulfilled, (state, action) => {
      state.favoriteIds = action.payload;
    });
  },
});

export const {toggleFavorite} = favoritesSlice.actions;
export default favoritesSlice.reducer;
