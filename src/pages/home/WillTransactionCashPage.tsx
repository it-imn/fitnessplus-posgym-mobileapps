import { BottomTabScreenProps } from "@react-navigation/bottom-tabs";
import { CompositeScreenProps } from "@react-navigation/native";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import React, { useContext } from "react";
import { SafeAreaView, Text, View } from "react-native";
import { buyMembership } from "../../services/membership";
import {
  MembershipReq,
  PTReq,
  TransactionType,
  useTransactionStore,
} from "../../stores/useTransactionStore";
import { buyPersonalTrainerPackage } from "../../services/personal_trainer";
import Header from "../../components/ui/Header";
import Gap from "../../components/ui/Gap";
import StatusBarComp from "../../components/ui/StatusBarComp";
import { ThemeContext } from "../../contexts/ThemeContext";
import { RootStackParamList, TabParamList } from "../../lib/routes";
import { colors, convertToRupiah, fonts } from "../../lib/utils";
import { showMessage } from "react-native-flash-message";
import { Button, ButtonColor } from "../../components/ui/Button";

const WillTransactionCash = ({
  navigation,
}: CompositeScreenProps<
  NativeStackScreenProps<RootStackParamList, "WillTransactionCash">,
  BottomTabScreenProps<TabParamList, "Home">
>) => {
  const { isDarkMode } = useContext(ThemeContext);
  const { transaction, reset } = useTransactionStore();

  const gotoWaitingPage = async () => {
    try {
      if (transaction.type === TransactionType.MEMBERSHIP) {
        const { sales_id, membership_id, down_payment_membership, startDate } =
          transaction.transaction as MembershipReq;

        const { data } = await buyMembership(
          sales_id,
          membership_id,
          "cash",
          transaction.signature,
          transaction.voucher_code,
          down_payment_membership,
          startDate.toISOString().slice(0, 10),
        );

        showMessage({
          message: data.message,
          type: "success",
          icon: "success",
          backgroundColor: colors._green,
          color: colors._white,
        });

        reset();

        navigation.replace("MainApp");
      } else if (transaction.type === TransactionType.PT) {
        const { package_pt_id, pt_id, down_payment_membership } =
          transaction.transaction as PTReq;

        const { data } = await buyPersonalTrainerPackage(
          package_pt_id,
          pt_id,
          transaction.signature,
          transaction.voucher_code,
          down_payment_membership,
        );

        showMessage({
          message: data.message,
          type: "success",
          icon: "success",
          backgroundColor: colors._green,
          color: colors._white,
        });

        reset();

        navigation.replace("MainApp");
      }
      //  else if (type === 'SC') {
      //   // const data = {
      //   //   sclass_id: id,
      //   //   seat_number: seat_number,
      //   //   down_pay: down_pay,
      //   // };
      //   // const response = await Api.buySClassCash(data, token);
      //   // const params = {
      //   //   isDarkMode: boolean,
      //   // };
      //   // // notification.localNotification('Transaction successful', 'Your transaction is being processed')
      //   // navigation.replace('WaitingPage', params);
      // } else if (type === 'PRD') {
      //   // const data = {
      //   //   items: [
      //   //     {
      //   //       item_id: id,
      //   //       item_qty: item_count,
      //   //     },
      //   //   ],
      //   // };
      //   // const response = await Api.buyProductCash(data, token);
      //   // const params = {
      //   //   isDarkMode: boolean,
      //   // };
      //   // // notification.localNotification('Transaction successful', 'Your transaction is being processed')
      //   // navigation.replace('WaitingPage', params);
      // }
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

  return (
    <SafeAreaView style={styles.container(isDarkMode)}>
      <StatusBarComp />
      <Header teks="Cash" onPress={() => navigation.goBack()} />
      <View style={styles.content(isDarkMode)}>
        <Text style={styles.teks(isDarkMode)}>Your order</Text>
        <Gap height={2} />
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "space-between",
          }}>
          <Text style={styles.teks3(isDarkMode)}>
            {transaction.name} x {1}
          </Text>
          <Text style={styles.teks3(isDarkMode)}>
            {convertToRupiah(transaction.normal_price.toString())}
          </Text>
        </View>
        <Gap height={12} />
        <View
          style={{ width: "100%", height: 1, backgroundColor: colors._grey3 }}
        />
        {transaction.voucher_code !== "" && (
          <>
            <Gap height={12} />
            <Text style={styles.teks(isDarkMode)}>Voucher</Text>
            <Gap height={2} />
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "space-between",
              }}>
              <Text style={styles.teks3(isDarkMode)}>
                {transaction.voucher?.name}
              </Text>
              <Text style={styles.teks3(isDarkMode)}>
                {convertToRupiah(
                  transaction.voucher?.discount.toString() || "",
                )}
              </Text>
            </View>
            <Gap height={12} />
            <View
              style={{
                width: "100%",
                height: 1,
                backgroundColor: colors._grey3,
              }}
            />
          </>
        )}
        {transaction.type === TransactionType.MEMBERSHIP && (
          <>
            <Gap height={12} />
            <Text style={styles.teks(isDarkMode)}>Consultant Member</Text>
            <Gap height={2} />
            <Text style={styles.teks3(isDarkMode)}>
              {(transaction.transaction as MembershipReq).sales_name}
            </Text>
            <Gap height={2} />
            <Text style={styles.teks3(isDarkMode)}>
              {(transaction.transaction as MembershipReq).sales_email}
            </Text>
            <Gap height={12} />
            <View
              style={{
                width: "100%",
                height: 1,
                backgroundColor: colors._grey3,
              }}
            />
          </>
        )}
        <Gap height={12} />
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "space-between",
          }}>
          <Text style={styles.teks(isDarkMode)}>Total</Text>
          <Gap height={2} />
          <Text style={styles.teks2(isDarkMode)}>
            {convertToRupiah(transaction.final_price.toString())}
          </Text>
        </View>
        <Gap height={12} />
        <View
          style={{
            width: "100%",
            height: 1,
            backgroundColor: colors._grey3,
          }}
        />
        {transaction.type === TransactionType.MEMBERSHIP &&
          (transaction.transaction as MembershipReq).down_payment_membership ===
            1 && (
            <>
              <Gap height={12} />
              <Text style={styles.teks(isDarkMode)}>Feature</Text>
              <Gap height={2} />
              <Text style={styles.teks3(isDarkMode)}>
                {(transaction.transaction as MembershipReq).down_payment_label}
              </Text>
            </>
          )}
        {transaction.type === TransactionType.PT &&
          (transaction.transaction as PTReq).down_payment_membership === 1 && (
            <>
              <Gap height={12} />
              <Text style={styles.teks(isDarkMode)}>Feature</Text>
              <Gap height={2} />
              <Text style={styles.teks3(isDarkMode)}>
                {(transaction.transaction as PTReq).down_payment_label}
              </Text>
            </>
          )}
      </View>
      <View style={{ flex: 1 }} />
      <View style={{ padding: 24 }}>
        <ButtonColor
          teks="Buy Now"
          onPress={gotoWaitingPage}
          backColor={colors._blue2}
          textColor={colors._white}
        />
      </View>
    </SafeAreaView>
  );
};
const styles = {
  container: (isDarkMode: boolean) => ({
    flex: 1,
    backgroundColor: isDarkMode ? colors._black2 : colors._white,
  }),
  content: (isDarkMode: boolean) => ({
    backgroundColor: isDarkMode ? colors._black : colors._grey2,
    padding: 12,
    marginHorizontal: 16,
    borderRadius: 8,
  }),
  teks: (isDarkMode: boolean) => ({
    fontSize: 12,
    fontFamily: fonts.primary[400],
    color: isDarkMode ? colors._white : colors._black,
  }),
  teks2: (isDarkMode: boolean) => ({
    fontSize: 16,
    fontFamily: fonts.primary[400],
    color: isDarkMode ? colors._white : colors._black,
  }),
  teks3: (isDarkMode: boolean) => ({
    fontSize: 12,
    fontFamily: fonts.primary[400],
    color: isDarkMode ? colors._grey4 : colors._grey3,
  }),
};

export default WillTransactionCash;
