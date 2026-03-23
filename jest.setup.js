/* eslint-env jest */

jest.mock('@react-native-async-storage/async-storage', () => ({
  setItem: jest.fn(() => Promise.resolve()),
  getItem: jest.fn(() => Promise.resolve(null)),
  removeItem: jest.fn(() => Promise.resolve()),
  clear: jest.fn(() => Promise.resolve()),
}));

jest.mock('react-native-screens', () => {
  const {View} = require('react-native');

  return {
    enableScreens: jest.fn(),
    Screen: View,
    ScreenContainer: View,
    NativeScreen: View,
    NativeScreenContainer: View,
  };
});
