import { Theme } from "@react-navigation/native";
import React, { useContext } from "react";
import {
  Dimensions,
  Image,
  StyleProp,
  Text,
  View,
  ViewStyle,
} from "react-native";
import { ImageNotFound } from "../../assets";
import { ThemeContext } from "../../contexts/ThemeContext";
import { ThemeType } from "../../lib/definition";
import { fonts, colors } from "../../lib/utils";
import Gap from "./Gap";

const width = Dimensions.get("window").width;

const NoData = ({ text }: { text: string }) => {
  const { isDarkMode } = useContext(ThemeContext);

  return (
    <View style={styles.container}>
      <Image
        source={ImageNotFound}
        style={{ width: width / 2.4, height: width / 2.4 }}
      />
      <Gap height={16} />
      <Text style={styles.text(isDarkMode)}>{text}</Text>
    </View>
  );
};

const styles = {
  container: {
    alignItems: "center",
    justifyContent: "center",
    flex: 1,
  } as StyleProp<ViewStyle>,
  text: (isDarkMode: boolean) => ({
    fontSize: 12,
    fontFamily: fonts.primary[300],
    color: isDarkMode ? colors._white : colors._black,
  }),
};

export default NoData;
