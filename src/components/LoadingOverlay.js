import React from "react";
import { View, Text, StyleSheet, ActivityIndicator } from "react-native";

const LoadingOverlay = ({ message }) => {
  return (
    <View style={styles.container} pointerEvents="none">
      <ActivityIndicator size="large" color="#fff" />
      {message ? <Text style={styles.message}>{message}</Text> : null}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(0,0,0,0.7)",
    justifyContent: "center",
    alignItems: "center",
  },
  message: {
    color: "#fff",
    fontSize: 16,
    marginTop: 10,
    textAlign: "center",
  },
});

export default LoadingOverlay;
