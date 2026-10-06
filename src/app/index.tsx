import { StyleSheet, Text, View } from "react-native";

export default function Index() {
  const studentName = "Nikole Dixon";
  const appIdea = "a bullet journaling app. (or an app for a pool service company)";

  return (
    <View style={styles.container}>
      <Text style={styles.title}>DEV 272 · Mobile Application Development</Text>
      <Text style={styles.body}>Hello, I am {studentName}.</Text>
      <Text style={styles.body}>This quarter I want to build {appIdea}.</Text>
      <Text style={styles.hint}>Edit src/app/index.tsx to change this screen.</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: 24,
    gap: 12,
  },
  title: {
    fontSize: 20,
    fontWeight: "600",
    textAlign: "center",
  },
  body: {
    fontSize: 16,
    textAlign: "center",
  },
  hint: {
    marginTop: 24,
    fontSize: 12,
    color: "#6b7280",
    textAlign: "center",
  },
});
