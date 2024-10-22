import React from "react";
import { ActivityIndicator, StyleSheet, View } from "react-native";
import { colors } from "../../lib/utils";

const Loading = () => {
  return (
    <View style={styles.container}>
      <View style={styles.card}>
        <ActivityIndicator size="large" color={colors._white} />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    position: "absolute",
    alignItems: "center",
    justifyContent: "center",
    height: "100%",
    width: "100%",
  },
  card: {
    padding: 12,
    backgroundColor: colors._grey4,
    borderRadius: 48,
  },
});
export default Loading;
