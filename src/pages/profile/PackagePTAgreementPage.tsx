import { Theme } from "@react-navigation/native";
import React, { useContext, useEffect } from "react";
import { SafeAreaView } from "react-native";
import { WebView } from "react-native-webview";

import StatusBarComp from "../../components/ui/StatusBarComp";
import { ThemeContext } from "../../contexts/ThemeContext";
import { ThemeType } from "../../lib/definition";
import { colors } from "../../lib/utils";
import Header from "../../components/ui/Header";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { RootStackParamList } from "../../lib/routes";
import { fetchContractAgreementView } from "../../services/personal_trainer";
import { showMessage } from "react-native-flash-message";

const PackagePTAgreement = ({
  navigation,
}: NativeStackScreenProps<RootStackParamList, "PackagePTAgreement">) => {
  const { isDarkMode } = useContext(ThemeContext);

  const [url, setUrl] = React.useState<string>("");

  const getPackagePTAgreement = async () => {
    try {
      const { data } = await fetchContractAgreementView();
      if (data) {
        setUrl(data.result);
      }
    } catch (error: any) {
      showMessage({
        message: error.message || "An error occurred",
        type: "warning",
        icon: "warning",
        backgroundColor: colors._red,
        color: colors._white,
      });
    }
  };

  useEffect(() => {
    getPackagePTAgreement();
  });


  return (
    <SafeAreaView style={styles.container(isDarkMode)}>
      <StatusBarComp />
      <Header teks="PT Agreement" onPress={() => navigation.goBack()} />
      <WebView
        source={{
          uri: url,
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

export default PackagePTAgreement;
