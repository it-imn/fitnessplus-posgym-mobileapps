import { NativeStackScreenProps } from "@react-navigation/native-stack";
import React, { useContext } from "react";
import { SafeAreaView, View } from "react-native";
import Header from "../../components/ui/Header";
import NoData from "../../components/ui/NoData";
import StatusBarComp from "../../components/ui/StatusBarComp";
import { ThemeContext } from "../../contexts/ThemeContext";
import { ThemeType } from "../../lib/definition";
import { RootStackParamList } from "../../lib/routes";
import { colors } from "../../lib/utils";

export const SubmissionPackage = ({
  navigation,
}: NativeStackScreenProps<RootStackParamList, "SubmissionPackage">) => {
  const { isDarkMode } = useContext(ThemeContext);

  return (
    <SafeAreaView
      style={{
        flex: 1,
        backgroundColor: isDarkMode ? colors._black2 : colors._white,
      }}>
      <StatusBarComp />
      <Header teks="Submission Package" onPress={() => navigation.goBack()} />
      <View
        style={{
          flex: 1,
          alignContent: "center",
          justifyContent: "center",
        }}>
        <NoData text="No Data Available" />
      </View>
    </SafeAreaView>
  );
};
