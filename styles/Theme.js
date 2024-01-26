import { StyleSheet, Appearance } from "react-native";
const darkMode = StyleSheet.create({
  container: {
    backgroundColor: "#181818",
    flex: 1,
  },
  content: {
    flex: 1,
    flexDirection: "column",
  },
  baseText: {
    color: "white",
    fontSize: 20,
  },
  titleText: {
    color: "white",
    fontSize: 24,
    fontWeight: "bold",
  },
  logoText: {
    color: "#3490de",
    fontSize: 50,
  },
  input: {
    color: "white",
    height: 40,
    margin: 12,
    borderWidth: 1,
    borderColor: "white",
    padding: 10,
  },
  setRow: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 8,
  },
});
const lightMode = StyleSheet.create({
  container: {
    backgroundColor: "white",
    flex: 1,
  },
  content: {
    flex: 1,
    flexDirection: "column",
  },
  baseText: {
    fontSize: 20,
  },
  titleText: {
    fontSize: 24,
    fontWeight: "bold",
  },
  logoText: {
    color: "#3490de",
    fontSize: 50,
  },
  input: {
    height: 40,
    margin: 12,
    borderWidth: 1,
    padding: 10,
  },
  setRow: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 8,
  },
});

export const theme = { lightMode, darkMode };
