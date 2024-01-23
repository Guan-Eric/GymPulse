import { StyleSheet } from "react-native";
export const darkMode = StyleSheet.create({
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
    fontSize: 14,
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
  setRow: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 8,
  },
});
