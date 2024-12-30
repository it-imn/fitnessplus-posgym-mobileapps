import { BottomTabScreenProps } from "@react-navigation/bottom-tabs";
import { CompositeScreenProps } from "@react-navigation/native";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import React, { Fragment, useContext, useEffect, useState } from "react";
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
import { StatusIcon } from "../../components/ui/StatusIcon";

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
          <StatusIcon status={paymentPackage?.status} />
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
          {paymentPackage?.package_discount === 0
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
          Voucher
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
        {paymentPackage?.receipt && (
          <Fragment>
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
          </Fragment>
        )}
      </View>
      {paymentPackage?.payment_url && (
        <View
          style={{
            paddingHorizontal: 24,
            paddingVertical: 12,
            flexDirection: "row",
            borderTopColor: colors._grey3,
            borderTopWidth: 0.5,
          }}>
          <View
            style={{
              flex: 1,
              alignItems: "flex-end",
              justifyContent: "center",
            }}>
            <Text
              style={{
                fontSize: 12,
                fontFamily: fonts.primary[400],
                color: isDarkMode ? colors._white : colors._black,
              }}>
              Total
            </Text>
            <Text
              style={{
                fontSize: 16,
                fontFamily: fonts.primary[400],
                color: isDarkMode ? colors._white : colors._black,
              }}>
              {convertToRupiah(paymentPackage.total_price.toString())}
            </Text>
          </View>
          <Gap width={16} />
          <TouchableOpacity
            style={{
              justifyContent: "center",
              alignItems: "center",
              backgroundColor: colors._blue2,
              borderRadius: 10,
              padding: 16,
            }}
            onPress={() => {
              navigation.replace("PaymentGateway", {
                id: id,
                url: paymentPackage.payment_url || "",
              });
              return;
            }}>
            <Text
              style={{
                fontSize: 12,
                color: colors._white,
                fontFamily: fonts.primary[400],
              }}>
              Pay
            </Text>
          </TouchableOpacity>
        </View>
      )}

      {isLoading && <Loading />}
    </SafeAreaView>
  );
};
