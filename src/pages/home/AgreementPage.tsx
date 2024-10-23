import { Theme } from "@react-navigation/native";
import React, { useContext } from "react";
import { SafeAreaView } from "react-native";
import { WebView } from "react-native-webview";

import StatusBarComp from "../../components/ui/StatusBarComp";
import { ThemeContext } from "../../contexts/ThemeContext";
import { ThemeType } from "../../lib/definition";
import { colors } from "../../lib/utils";
import Header from "../../components/ui/Header";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { RootStackParamList } from "../../lib/routes";

const Agreement = ({
  navigation,
}: NativeStackScreenProps<RootStackParamList, "Agreement">) => {
  const { isDarkMode } = useContext(ThemeContext);
  return (
    <SafeAreaView style={styles.container(isDarkMode)}>
      <StatusBarComp />
      <Header teks="Terms and Conditions" onPress={() => navigation.goBack()} />
      <WebView
        source={{
          uri: "https://positive-gym.com/contract_membership_agreement",
        }}
      />
    </SafeAreaView>
  );
};

const styles = {
  container: (isDarkMode: boolean) => ({
    flex: 1,
    backgroundColor: isDarkMode ? colors._black2 : colors._white,
  }),
};

export default Agreement;
