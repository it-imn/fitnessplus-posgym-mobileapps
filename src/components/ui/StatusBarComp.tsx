import React, { useContext } from "react";
import { StatusBar } from "react-native";
import { ThemeContext } from "../../contexts/ThemeContext";
import { colors } from "../../lib/utils";

const StatusBarComp = () => {
  const { isDarkMode } = useContext(ThemeContext);

  return (
    <StatusBar
      barStyle={isDarkMode ? "default" : "dark-content"}
      backgroundColor={isDarkMode ? colors._black2 : colors._white}
      hidden={false}
      translucent={false}
    />
  );
};

export default StatusBarComp;
