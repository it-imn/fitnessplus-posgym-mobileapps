import { Theme } from "@react-navigation/native";
import React, { useContext, useEffect } from "react";
import {
  Platform,
  SafeAreaView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { WebView } from "react-native-webview";

import StatusBarComp from "../../components/ui/StatusBarComp";
import { ThemeContext } from "../../contexts/ThemeContext";
import { ThemeType } from "../../lib/definition";
import { colors, fonts } from "../../lib/utils";
import Header from "../../components/ui/Header";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { RootStackParamList } from "../../lib/routes";
import {
  fetchContractAgreementDownload,
  fetchContractAgreementView,
} from "../../services/membership";
import { showMessage } from "react-native-flash-message";
import {
  ArrowWhite,
  ArrowBlack,
  IconDown,
  IconArrowDown,
  IconDocument,
} from "../../assets";
import ReactNativeBlobUtil from "react-native-blob-util";

const MembershipAgreement = ({
  navigation,
}: NativeStackScreenProps<RootStackParamList, "MembershipAgreement">) => {
  const { isDarkMode } = useContext(ThemeContext);

  const [url, setUrl] = React.useState<string>("");
  const [download, setDownload] = React.useState<string>("");

  const getMembershipAgreement = async () => {
    try {
      const { data } = await fetchContractAgreementView();
      if (data) {
        setUrl(data);
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

  const getMembershipAgreementDownload = async () => {
    try {
      const { data } = await fetchContractAgreementDownload();
      if (data) {
        setDownload(data);
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

  const handleDownload = async () => {
    try {
      const dir = ReactNativeBlobUtil.fs.dirs.DownloadDir;
      const fileName = download.split("/").pop();
      const path = `${dir}/${fileName}`;

      ReactNativeBlobUtil.config({
        fileCache: true,
        path: path,
        addAndroidDownloads: {
          useDownloadManager: true,
          notification: true,
          title: 'Membership Agreement downloaded successfully! Click to view',
          description: 'Membership Agreement',
          mime: 'application/pdf',
        },        
      })
        .fetch("GET", download)
        .then(async res => {
          if (Platform.OS === "ios") {
            ReactNativeBlobUtil.ios.previewDocument(path)
          } 
        });
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
    Promise.all([getMembershipAgreement(), getMembershipAgreementDownload()]);
  });

  return (
    <SafeAreaView style={styles.container(isDarkMode)}>
      <StatusBarComp />
      <View
        style={{
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "center",
          padding: 16,
        }}>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={{
            width: 24,
            height: 24,
            borderRadius: 8,
            justifyContent: "center",
            alignItems: "center",
          }}>
          {isDarkMode ? <ArrowWhite /> : <ArrowBlack />}
        </TouchableOpacity>
        <Text
          style={{
            color: isDarkMode ? colors._white : colors._black,
            fontFamily: fonts.primary[600],
            fontSize: 20,
            textAlign: "center",
          }}>
          Membership Agreement
        </Text>
        <TouchableOpacity
          onPress={handleDownload}
          style={{
            width: 24,
            height: 24,
            borderRadius: 8,
            justifyContent: "center",
            alignItems: "center",
          }}>
          {isDarkMode ? <IconDocument /> : <IconDocument />}
        </TouchableOpacity>
      </View>
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

export default MembershipAgreement;
