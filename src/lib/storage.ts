// import AsyncStorage from "@react-native-async-storage/async-storage";

// export async function loadJson<T>(key: string, fallback: T): Promise<T> {
//   try {
//     const raw = await AsyncStorage.getItem(key);
//     return raw === null ? fallback : (JSON.parse(raw) as T);
//   } catch (e) {
//     console.warn(`loadJson(${key}) failed`, e);
//     return fallback;
//   }
// }

// export async function saveJson<T>(key: string, value: T): Promise<void> {
//   try {
//     await AsyncStorage.setItem(key, JSON.stringify(value));
//   } catch (e) {
//     console.warn(`saveJson(${key}) failed`, e);
//   }
// }

// // Version the key: when the shape changes, bump it instead of migrating.
// // replace <your-item-key> with a value representing your app 
// export const STORAGE_KEYS = {
//   <your-item-key>: "<your-item-key>.v1",
// } as const;
