// jest.setup.ts: runs before every test file (see "setupFiles" under "jest"
// in package.json). Tests run in Node on your computer, not on a phone, so
// native code and secrets get stand-ins here.

// AsyncStorage is native code. Use the in-memory fake the library ships for Jest.
import mockAsyncStorage from "@react-native-async-storage/async-storage/jest/async-storage-mock";

declare const jest: any;

jest.mock("@react-native-async-storage/async-storage", () => mockAsyncStorage);

// src/lib/supabase.ts throws when these are missing. They are fake values:
// tests mock the API and never contact Supabase. Your real keys stay in .env.
process.env.EXPO_PUBLIC_SUPABASE_URL = "https://test.supabase.co";
process.env.EXPO_PUBLIC_SUPABASE_KEY = "sb_publishable_test";

// Mock icon font loading doesn't fail in tests
jest.mock("@expo/vector-icons", () => {
  const { View } = require("react-native");
  return {
    __esModule: true,
    default: View,
    Ionicons: View,
  };
});

jest.mock("@expo/vector-icons/Ionicons", () => {
  const { View } = require("react-native");
  return {
    __esModule: true,
    default: View,
  };
});
