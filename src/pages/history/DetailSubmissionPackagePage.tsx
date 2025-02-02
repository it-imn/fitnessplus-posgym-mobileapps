import { BottomTabScreenProps } from "@react-navigation/bottom-tabs";
import { CompositeScreenProps } from "@react-navigation/native";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import React, { Fragment, useContext, useEffect, useState } from "react";
import {
  Linking,
  SafeAreaView,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import NoData from "../../components/ui/NoData";
import { ThemeContext } from "../../contexts/ThemeContext";
import { ISubmissionPackage, ThemeType } from "../../lib/definition";
import { TabParamList, RootStackParamList } from "../../lib/routes";
import { colors, fonts } from "../../lib/utils";
import { fetchSubmissionPackage } from "../../services/membership";
import { showMessage } from "react-native-flash-message";
import StatusBarComp from "../../components/ui/StatusBarComp";
import Header from "../../components/ui/Header";
import Loading from "../../components/ui/Loading";
import Gap from "../../components/ui/Gap";
import { StickyNote } from "lucide-react-native";
import { IconDocument } from "../../assets";

export const DetailSubmissionPackage = ({
  navigation,
  route,
}: NativeStackScreenProps<RootStackParamList, "DetailSubmissionPackage">) => {
  const { id } = route.params;
  const { isDarkMode } = useContext(ThemeContext);
  const [isLoading, setIsLoading] = useState(false);
  const [submissionPackage, setSubmissionPackage] =
    useState<ISubmissionPackage | null>(null);
  const [name, setName] = useState("");

  const getSubmissionPackage = async () => {
    setIsLoading(true);
    try {
      const { data, member } = await fetchSubmissionPackage(id);
      if (data) {
        setSubmissionPackage(data);
        setName(member.name);
      }
    } catch (error: any) {
      showMessage({
        message: error.message || "An error occurred",
        type: "warning",
        icon: "warning",
        backgroundColor: colors._red,
        color: colors._white,
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    getSubmissionPackage();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <SafeAreaView
      style={{
        flex: 1,
        backgroundColor: isDarkMode ? colors._black2 : colors._white,
      }}>
      <StatusBarComp />
      <Header
        teks="Detail Submission Package"
        onPress={() => navigation.goBack()}
      />

      <ScrollView style={{ flex: 1, padding: 24 }}>
        <Text
          style={{
            fontSize: 12,
            color: isDarkMode ? colors._grey4 : colors._grey3,
            fontFamily: fonts.primary[400],
          }}>
          Code
        </Text>
        <Gap height={4} />
        <Text
          style={{
            fontSize: 12,
            fontFamily: fonts.primary[300],
            color: isDarkMode ? colors._white : colors._black,
            lineHeight: 20,
          }}>
          {submissionPackage?.payment_order_code}
        </Text>
        <Gap height={16} />
        <Text
          style={{
            fontSize: 12,
            color: isDarkMode ? colors._grey4 : colors._grey3,
            fontFamily: fonts.primary[400],
          }}>
          Name
        </Text>
        <Gap height={4} />
        <Text
          style={{
            fontSize: 12,
            fontFamily: fonts.primary[300],
            color: isDarkMode ? colors._white : colors._black,
            lineHeight: 20,
          }}>
          {name}
        </Text>
        <Gap height={16} />
        <Text
          style={{
            fontSize: 12,
            color: isDarkMode ? colors._grey4 : colors._grey3,
            fontFamily: fonts.primary[400],
          }}>
          Package Name
        </Text>
        <Gap height={4} />
        <Text
          style={{
            fontSize: 12,
            fontFamily: fonts.primary[300],
            color: isDarkMode ? colors._white : colors._black,
            lineHeight: 20,
          }}>
          {submissionPackage?.membership}
        </Text>
        <Gap height={16} />
        <Text
          style={{
            fontSize: 12,
            color: isDarkMode ? colors._grey4 : colors._grey3,
            fontFamily: fonts.primary[400],
          }}>
          Start Date
        </Text>
        <Gap height={4} />
        <Text
          style={{
            fontSize: 12,
            fontFamily: fonts.primary[300],
            color: isDarkMode ? colors._white : colors._black,
            lineHeight: 20,
          }}>
          {submissionPackage?.started_at}
        </Text>
        <Gap height={16} />
        <Text
          style={{
            fontSize: 12,
            color: isDarkMode ? colors._grey4 : colors._grey3,
            fontFamily: fonts.primary[400],
          }}>
          Expired Date
        </Text>
        <Gap height={4} />
        <Text
          style={{
            fontSize: 12,
            fontFamily: fonts.primary[300],
            color: isDarkMode ? colors._white : colors._black,
            lineHeight: 20,
          }}>
          {submissionPackage?.expired_at}
        </Text>
        <Gap height={16} />
        <Text
          style={{
            fontSize: 12,
            color: isDarkMode ? colors._grey4 : colors._grey3,
            fontFamily: fonts.primary[400],
          }}>
          Status
        </Text>
        <Gap height={4} />
        <Text
          style={{
            fontSize: 12,
            fontFamily: fonts.primary[300],
            color: isDarkMode ? colors._white : colors._black,
            lineHeight: 20,
          }}>
          {submissionPackage?.status}
        </Text>
        <Gap height={16} />
        <Text
          style={{
            fontSize: 12,
            color: isDarkMode ? colors._grey4 : colors._grey3,
            fontFamily: fonts.primary[400],
          }}>
          Sales Name
        </Text>
        <Gap height={4} />
        <Text
          style={{
            fontSize: 12,
            fontFamily: fonts.primary[300],
            color: isDarkMode ? colors._white : colors._black,
            lineHeight: 20,
          }}>
          {submissionPackage?.sales_name}
        </Text>
        <Gap height={16} />
        {submissionPackage?.contract_view && (
          <Fragment>
            <Text
              style={{
                fontSize: 12,
                color: isDarkMode ? colors._grey4 : colors._grey3,
                fontFamily: fonts.primary[400],
              }}>
              Agreement
            </Text>
            <Gap height={4} />
            <TouchableOpacity
              onPress={() => {
                if (submissionPackage?.contract_view)
                  Linking.openURL(submissionPackage?.contract_view);
              }}
              style={{
                flexDirection: "row",
                alignItems: "center",
              }}>
              <IconDocument width={16} height={16} />
              <Gap width={8} />
              <Text
                style={{
                  fontSize: 12,
                  fontFamily: fonts.primary[300],
                  color: colors._blue2,
                  lineHeight: 20,
                }}>
                Show Agreement
              </Text>
            </TouchableOpacity>
            <Gap height={16} />
          </Fragment>
        )}
      </ScrollView>

      {isLoading && <Loading />}
    </SafeAreaView>
  );
};
