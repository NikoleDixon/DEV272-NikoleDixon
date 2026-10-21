// import AsyncStorage from "@react-native-async-storage/async-storage";
// import { createClient } from "@supabase/supabase-js";

// const url = process.env.EXPO_PUBLIC_SUPABASE_URL;
// const key = process.env.EXPO_PUBLIC_SUPABASE_KEY;

// if (!url || !key) {
//   throw new Error("Missing EXPO_PUBLIC_SUPABASE_URL or EXPO_PUBLIC_SUPABASE_KEY in .env");
// }

// export const supabase = createClient(url, key, {
//   auth: {
//     storage: AsyncStorage,       // where a session would live (unused until you add auth)
//     autoRefreshToken: true,
//     persistSession: true,
//     detectSessionInUrl: false,   // no browser redirects on mobile
//   },
// });