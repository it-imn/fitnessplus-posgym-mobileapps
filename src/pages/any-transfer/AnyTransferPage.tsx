import { BottomTabScreenProps } from "@react-navigation/bottom-tabs";
import { CompositeScreenProps } from "@react-navigation/native";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import React, { useContext } from "react";
import { SafeAreaView } from "react-native";
import { ThemeContext } from "../../contexts/ThemeContext";
import { ThemeType } from "../../lib/definition";
import { RootStackParamList, TabParamList } from "../../lib/routes";
import { colors } from "../../lib/utils";
import NoData from "../../components/ui/NoData";

export const AnyTransfer = ({}: CompositeScreenProps<
  BottomTabScreenProps<TabParamList, "AnyTransfer">,
  NativeStackScreenProps<RootStackParamList, "MainApp">
>) => {
  const { isDarkMode } = useContext(ThemeContext);

  return (
    <SafeAreaView
      style={{
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: isDarkMode ? colors._black2 : colors._white,
      }}>
      <NoData text="No Data Available" />
    </SafeAreaView>
  );
};
