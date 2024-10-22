import React from "react";
import { View } from "react-native";

export default function Gap({
  width,
  height,
}: {
  width?: number;
  height?: number;
}): React.JSX.Element {
  return <View style={{ width: width, height: height }} />;
}
