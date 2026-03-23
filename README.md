
# Product Explorer App

A React Native CLI mobile app for browsing products, searching quickly, and saving favorites with a production-style structure.

## App Functionality

- Browse a paginated product catalog from a public API
- Search products with instant local filtering and debounced API search
- Open a product detail screen
- Add and remove favorites
- Persist favorites and product cache across app restarts
- Refresh data when the app returns from background

## Tech Stack

- React Native CLI
- TypeScript
- Redux Toolkit
- React Redux
- React Navigation
- AsyncStorage

## Project Structure

```text
src/
  api/
    productApi.ts
  screens/
    ProductListScreen.tsx
    ProductDetailScreen.tsx
    FavoritesScreen.tsx
  components/
    ProductCard.tsx
    SearchBar.tsx
    Loader.tsx
    EmptyState.tsx
  store/
    store.ts
    productsSlice.ts
    favoritesSlice.ts
  hooks/
    useDebounce.ts
  types/
    product.ts
```

## How To Run

### Prerequisites

- Node.js 22+
- Android Studio with SDK, emulator, and NDK installed for Android
- Xcode and CocoaPods for iOS builds on macOS

### Install Dependencies

```bash
npm install
```

### Start Metro

```bash
npm start
```

### Run On Android

```bash
npm run android
```

### Run On iOS

```bash
npx pod-install ios
npm run ios
```

## Key Technical Decisions

- `productApi.ts` is the single place for network requests to keep API logic isolated.
- Redux Toolkit manages product list state, pagination, search state, and favorites state.
- AsyncStorage persists both favorites and a small product cache so the app restores content quickly after restart.
- `App.tsx` coordinates persistence and app lifecycle handling with `AppState`.
- Search uses a hybrid approach: instant local filtering for responsiveness, then debounced API search for fresher results.
- `FlatList` is used for scalable rendering and infinite scroll.

## Performance Notes

- `FlatList` handles large lists efficiently.
- Search is debounced to reduce unnecessary API calls.
- Cached product data is restored before the next network refresh to reduce perceived load time.
- Infinite scrolling appends data instead of replacing the list for normal browse mode.

## Improvements With More Time

- Add reducer and API tests
- Add image placeholders and better retry UX for network errors
- Add richer favorites hydration for full offline favorite cards on cold start
- Add icons and slightly more polished UI details
- Verify and polish the iOS experience on device/simulator

## Submission Note

This project is a native mobile app built with React Native CLI, so it does not have a browser deployment URL like a web app. For submission, the recommended proof is the GitHub repository plus a demo video and, if needed, an APK build.
