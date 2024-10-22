/* eslint-disable react-native/no-inline-styles */
import { Theme } from "@react-navigation/native";
import React, { useContext } from "react";
import {
  StyleProp,
  Text,
  TouchableOpacity,
  View,
  ViewStyle,
} from "react-native";
import { ArrowWhite, ArrowBlack } from "../../assets";
import { ThemeContext } from "../../contexts/ThemeContext";
import { ThemeType } from "../../lib/definition";
import { colors, fonts } from "../../lib/utils";

const Header = ({ teks, onPress }: { teks: string; onPress: () => void }) => {
  const { isDarkMode } = useContext(ThemeContext);

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.btnBack} onPress={onPress}>
        {isDarkMode ? <ArrowWhite /> : <ArrowBlack />}
      </TouchableOpacity>
      <Text style={styles.teks(isDarkMode)}>{teks}</Text>
      <View style={{ width: 24, height: 24 }} />
    </View>
  );
};

const styles = {
  container: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 16,
  } as StyleProp<ViewStyle>,
  btnBack: {
    width: 24,
    height: 24,
    borderRadius: 8,
    justifyContent: "center",
    alignItems: "center",
  } as StyleProp<ViewStyle>,
  teks: (isDarkMode: boolean) =>
    ({
      color: isDarkMode ? colors._white : colors._black,
      fontFamily: fonts.primary[600],
      fontSize: 20,
      textAlign: "center",
    } as StyleProp<ViewStyle>),
};

export default Header;
