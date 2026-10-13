import { colors } from "@/constants/colors";
import { useColorScheme } from "react-native";


export function usePalette() {
  const c = colors[useColorScheme() === "dark" ? "dark" : "light"];
  return c;
}