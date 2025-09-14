// src/test-utils/setup.ts
import 'react-native-gesture-handler/jestSetup';

// Mock expo-router
jest.mock('expo-router', () => ({
  useRouter: () => ({
    push: jest.fn(),
    back: jest.fn(),
  }),
  useLocalSearchParams: () => ({}),
  Stack: {
    Screen: 'Stack.Screen',
  },
}));

// Mock expo modules
jest.mock('expo-constants', () => ({
  default: {
    expoConfig: {
      name: 'countries-explorer',
    },
  },
}));
