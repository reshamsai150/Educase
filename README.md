# Product Explorer App

A React Native CLI mobile app for browsing products, searching quickly, and saving favorites with a clean production-style architecture.

## Features

- Product list with infinite scroll
- Sticky search bar with instant local filtering
- Debounced API search
- Pull to refresh
- Skeleton loading state
- Product detail screen with favorite toggle
- Favorites tab with AsyncStorage persistence
- Redux Toolkit state management

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

## Setup

### Prerequisites

- Node.js 22+
- Android Studio for Android builds
- Xcode and CocoaPods for iOS builds on macOS

### Install

```bash
npm install
```

### Start Metro

```bash
npm start
```

### Run Android

```bash
npm run android
```

### Run iOS

```bash
npx pod-install ios
npm run ios
```

## Architecture Notes

- `productApi.ts` owns all network calls.
- Redux keeps product pagination/search state and favorite ids.
- Products and Favorites persist through AsyncStorage for quick offline access.
- `App.tsx` wires the provider, navigation, persistence sync, and handles AppState lifecycle to refresh data on foreground.
- The UI stays intentionally lean while keeping the product list performant and polished.

## Key Decisions

- Bottom tabs make the app feel like a real product instead of a demo flow.
- The search experience is hybrid: local filtering is instant, then API results refine the list after debounce.
- Product list data is persisted (up to 20 items) locally, allowing instant restore before the API fetch completes.
- Favorites store ids only, reducing duplication. App lifecycle actively fetches updates on active transition.

## Trade-offs

- Product details can fetch live data if a screen opens without full product context.
- The app avoids additional UI dependencies to keep the dependency footprint small.

## Future Improvements

- Add dedicated tab icons
- Improve favorites hydration with product lookups for cold starts
- Add unit tests for slice reducers and async thunks
- Add image placeholders and offline-aware retry messaging
