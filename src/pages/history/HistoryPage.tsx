import { BottomTabScreenProps } from "@react-navigation/bottom-tabs";
import { CompositeScreenProps } from "@react-navigation/native";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import React, { useContext } from "react";
import { SafeAreaView, Text, View } from "react-native";
import { ButtonIconTeks } from "../../components/ui/Button";
import Gap from "../../components/ui/Gap";
import StatusBarComp from "../../components/ui/StatusBarComp";
import { ThemeContext } from "../../contexts/ThemeContext";
import { TabParamList, RootStackParamList } from "../../lib/routes";
import { colors, fonts } from "../../lib/utils";

export const History = ({
  navigation,
}: CompositeScreenProps<
  BottomTabScreenProps<TabParamList, "History">,
  NativeStackScreenProps<RootStackParamList, "MainApp">
>) => {
  const { isDarkMode } = useContext(ThemeContext);

  return (
    <SafeAreaView
      style={{
        flex: 1,
        backgroundColor: isDarkMode ? colors._black2 : colors._white,
      }}>
      <StatusBarComp />
      <Text
        style={{
          color: isDarkMode ? colors._white : colors._black,
          fontFamily: fonts.primary[600],
          fontSize: 22,
          textAlign: "center",
          padding: 20,
        }}>
        History Transaction
      </Text>
      <Gap height={24} />
      <View style={{ paddingHorizontal: 24 }}>
        <ButtonIconTeks
          teksColor={isDarkMode ? colors._white : colors._black}
          backColor={isDarkMode ? colors._black : colors._grey2}
          teks="Submission Package"
          type="approval"
          onPress={() => {
            navigation.navigate("SubmissionPackage");
          }}
        />
        <Gap height={12} />
        <ButtonIconTeks
          teksColor={isDarkMode ? colors._white : colors._black}
          backColor={isDarkMode ? colors._black : colors._grey2}
          teks="Installment Package"
          type="approval"
          onPress={() => {
            navigation.navigate("InstallmentPackage");
          }}
        />
      </View>
    </SafeAreaView>
  );
};
