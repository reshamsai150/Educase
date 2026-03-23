module.exports = {
  preset: 'react-native',
  setupFiles: [
    '<rootDir>/jest.setup.js',
    './node_modules/react-native-gesture-handler/jestSetup.js',
  ],
  transformIgnorePatterns: [
    'node_modules/(?!(@react-native|react-native|@react-navigation|react-native-safe-area-context|@react-native-async-storage|react-redux|@reduxjs/toolkit|immer|redux|reselect)/)',
  ],
};
