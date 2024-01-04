import { StyleSheet } from "react-native";
export const darkMode = StyleSheet.create({
  container: {
    backgroundColor: "#181818",
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  content: {
    flex: 1,
    flexDirection: "column",
    justifyContent: "center",
  },
  baseText: {
    color: "white",
    fontSize: 20,
  },
  titleText: {
    color: "white",
    fontSize: 20,
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
});
