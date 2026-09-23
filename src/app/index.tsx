import { StyleSheet, Text, View } from "react-native";

// This is the home screen (route "/").
// Week 1: change the two lines marked 👇, run the app, commit, push.
export default function Index() {
  // 👇 Week 1: replace with your name
  const studentName = "Your Name";
  // 👇 Week 1: replace with something you want to build this quarter
  const appIdea = "an app idea I have";

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
