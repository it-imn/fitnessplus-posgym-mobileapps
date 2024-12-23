import { BottomTabScreenProps } from "@react-navigation/bottom-tabs";
import { CompositeScreenProps } from "@react-navigation/native";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import React, { useContext, useEffect, useState } from "react";
import {
  Linking,
  SafeAreaView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import NoData from "../../components/ui/NoData";
import { ThemeContext } from "../../contexts/ThemeContext";
import { RootStackParamList } from "../../lib/routes";
import { colors, convertToRupiah, fonts } from "../../lib/utils";
import { showMessage } from "react-native-flash-message";
import StatusBarComp from "../../components/ui/StatusBarComp";
import Header from "../../components/ui/Header";
import Loading from "../../components/ui/Loading";
import Gap from "../../components/ui/Gap";
import {
  CircleCheckIcon,
  CircleXIcon,
  LoaderCircleIcon,
  ReceiptIcon,
} from "lucide-react-native";
import { IconSuccess } from "../../assets";
import { fetchPaymentPackage } from "../../services/membership";
import { IPaymentPackage } from "../../lib/definition";

export const DetailPaymentPackage = ({
  navigation,
  route,
}: NativeStackScreenProps<RootStackParamList, "DetailPaymentPackage">) => {
  const { id, afterPayment } = route.params;
  const { isDarkMode } = useContext(ThemeContext);
  const [isLoading, setIsLoading] = useState(false);
  const [paymentPackage, setPaymentPackage] = useState<IPaymentPackage | null>(
    null,
  );

  const getPaymentPackage = async () => {
    setIsLoading(true);
    try {
      const { data } = await fetchPaymentPackage(id);
      if (data) {
        setPaymentPackage(data);
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
    getPaymentPackage();
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
        teks="Detail History Payment"
        onPress={() => {
          if (afterPayment) {
            navigation.replace("MainApp");
          } else {
            navigation.goBack();
          }
        }}
      />

      <View style={{ flex: 1, paddingHorizontal: 24 }}>
        <View
          style={{
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
            marginTop: 16,
            marginBottom: 30,
          }}>
          {paymentPackage?.status === "success" ? (
            <CircleCheckIcon size={80} color={colors._green} />
          ) : paymentPackage?.status === "failed" ||
            paymentPackage?.status === "cancel" ||
            paymentPackage?.status === "reject" ? (
            <CircleXIcon size={80} color={colors._red} />
          ) : (
            <LoaderCircleIcon size={80} color={colors._gold} />
          )}
          <Gap height={4} />
          <Text
            style={{
              fontFamily: fonts.primary[400],
              fontSize: 16,
              color: isDarkMode ? colors._white : colors._black,
              padding: 8,
            }}>
            Your payment is {paymentPackage?.status}
          </Text>
        </View>
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
          {paymentPackage?.order_code}
        </Text>
        <Gap height={16} />
        <Text
          style={{
            fontSize: 12,
            color: isDarkMode ? colors._grey4 : colors._grey3,
            fontFamily: fonts.primary[400],
          }}>
          Discount
        </Text>
        <Gap height={4} />
        <Text
          style={{
            fontSize: 12,
            fontFamily: fonts.primary[300],
            color: isDarkMode ? colors._white : colors._black,
            lineHeight: 20,
          }}>
          {paymentPackage?.discount === 0
            ? "-"
            : convertToRupiah(paymentPackage?.discount.toString() || "")}
        </Text>
        <Gap height={16} />
        <Text
          style={{
            fontSize: 12,
            color: isDarkMode ? colors._grey4 : colors._grey3,
            fontFamily: fonts.primary[400],
          }}>
          Total Price
        </Text>
        <Gap height={4} />
        <Text
          style={{
            fontSize: 12,
            fontFamily: fonts.primary[300],
            color: isDarkMode ? colors._white : colors._black,
            lineHeight: 20,
          }}>
          {convertToRupiah(paymentPackage?.total_price.toString() || "")}
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
          {paymentPackage?.membership}
        </Text>
        <Gap height={16} />
        <Text
          style={{
            fontSize: 12,
            color: isDarkMode ? colors._grey4 : colors._grey3,
            fontFamily: fonts.primary[400],
          }}>
          Package Type
        </Text>
        <Gap height={4} />
        <Text
          style={{
            fontSize: 12,
            fontFamily: fonts.primary[300],
            color: isDarkMode ? colors._white : colors._black,
            lineHeight: 20,
          }}>
          {paymentPackage?.package}
        </Text>
        <Gap height={16} />
        <Text
          style={{
            fontSize: 12,
            color: isDarkMode ? colors._grey4 : colors._grey3,
            fontFamily: fonts.primary[400],
          }}>
          Payment Method
        </Text>
        <Gap height={4} />
        <Text
          style={{
            fontSize: 12,
            fontFamily: fonts.primary[300],
            color: isDarkMode ? colors._white : colors._black,
            lineHeight: 20,
          }}>
          {paymentPackage?.payment_method}
        </Text>
        <Gap height={16} />
        <Text
          style={{
            fontSize: 12,
            color: isDarkMode ? colors._grey4 : colors._grey3,
            fontFamily: fonts.primary[400],
          }}>
          Bank Name
        </Text>
        <Gap height={4} />
        <Text
          style={{
            fontSize: 12,
            fontFamily: fonts.primary[300],
            color: isDarkMode ? colors._white : colors._black,
            lineHeight: 20,
          }}>
          {paymentPackage?.bank_name || "-"}
        </Text>
        <Gap height={16} />
        <Text
          style={{
            fontSize: 12,
            color: isDarkMode ? colors._grey4 : colors._grey3,
            fontFamily: fonts.primary[400],
          }}>
          Payment Date
        </Text>
        <Gap height={4} />
        <Text
          style={{
            fontSize: 12,
            fontFamily: fonts.primary[300],
            color: isDarkMode ? colors._white : colors._black,
            lineHeight: 20,
          }}>
          {paymentPackage?.payment_date}
        </Text>
        <Gap height={16} />
        <Text
          style={{
            fontSize: 12,
            color: isDarkMode ? colors._grey4 : colors._grey3,
            fontFamily: fonts.primary[400],
          }}>
          Receipt
        </Text>
        <Gap height={4} />
        <TouchableOpacity
          onPress={() => {
            if (paymentPackage?.receipt)
              Linking.openURL(paymentPackage?.receipt);
          }}
          style={{
            flexDirection: "row",
            alignItems: "center",
          }}>
          <ReceiptIcon size={16} color={colors._blue2} />
          <Gap width={8} />
          <Text
            style={{
              fontSize: 12,
              fontFamily: fonts.primary[300],
              color: colors._blue2,
              lineHeight: 20,
            }}>
            Receipt Link
          </Text>
        </TouchableOpacity>
        <Gap height={16} />
      </View>

      {isLoading && <Loading />}
    </SafeAreaView>
  );
};
