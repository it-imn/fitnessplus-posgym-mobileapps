import React, { useContext, useEffect, useState } from "react";
import {
  Modal,
  SafeAreaView,
  ScrollView,
  StyleProp,
  Text,
  TouchableOpacity,
  View,
  ViewStyle,
} from "react-native";
import { IconCash, IconDown, RightArrow } from "../../assets/index.js";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { fetchMembershipPackageDetail } from "../../services/membership";
import {
  MembershipReq,
  PTReq,
  TransactionType,
  useTransactionStore,
} from "../../stores/useTransactionStore";
import { fetchPersonalTrainerDetailPackage } from "../../services/personal_trainer";
import Header from "../../components/ui/Header";
import Gap from "../../components/ui/Gap";
import StatusBarComp from "../../components/ui/StatusBarComp";
import { ThemeContext } from "../../contexts/ThemeContext";
import { RootStackParamList } from "../../lib/routes";
import { colors, fonts } from "../../lib/utils";
import { showMessage } from "react-native-flash-message";

export interface PaymentType {
  id: 1 | 0;
  label: string;
}

const paymentTypes: PaymentType[] = [
  {
    id: 0,
    label: "Full Payment",
  },
  {
    id: 1,
    label: "Down Payment",
  },
];

const PaymentMethod = ({
  navigation,
}: NativeStackScreenProps<RootStackParamList, "PaymentMethod">) => {
  const { isDarkMode } = useContext(ThemeContext);
  // const [labelDp, setLabelDp] = useState('Select full payment');
  const [paymentType, setPaymentType] = useState<PaymentType>(paymentTypes[0]);
  const [modalDp, setModalDp] = useState(false);
  const [dpPrice, setDpPrice] = useState<number | null>(null);

  const { transaction, update } = useTransactionStore();

  //   const gotoDigiPayment = () => {
  //     const params = {
  //       id: id,
  //       iduser: iduser,
  //       item_name: item_name,
  //       item_price: item_price,
  //       item_count: item_count,
  //       name: name,
  //       email: email,
  //       phone: phone,
  //       type: type,
  //       signature: signature,
  //       sales_id: sales_id,
  //       down_pay: down_pay,
  //       index: index,
  //       seat_number: seat_number,
  //       token: token,
  //       isDarkMode: boolean,
  //     };
  //     navigation.navigate('DigitalPayment', params);
  //   };
  const gotoCash = () => {
    if (paymentType.id === 1 && !transaction.voucher && dpPrice) {
      update({
        final_price: dpPrice,
      });
    } else if (paymentType.id === 0) {
      if (transaction.voucher) {
        update({
          final_price: transaction.voucher.total_price,
        });
      } else if (paymentType.id === 0) {
        update({
          final_price: transaction.normal_price,
        });
      }
    }

    update({
      transaction: {
        ...transaction.transaction,
        down_payment_membership: paymentType.id,
      },
      payment_method: "cash",
    });
    navigation.navigate("WillTransactionCash");
  };

  const selectDp = (selectedPaymentType: PaymentType) => {
    setPaymentType(selectedPaymentType);
    setModalDp(!modalDp);
  };

  const getHasDp = async () => {
    try {
      if (transaction.type === TransactionType.MEMBERSHIP) {
        const { membership_id } = transaction.transaction as MembershipReq;
        const { data } = await fetchMembershipPackageDetail(membership_id!);
        setDpPrice(data.installment_first_pay.total_price);
      } else if (transaction.type === TransactionType.PT) {
        const { package_id } = transaction.transaction as PTReq;
        const { data } = await fetchPersonalTrainerDetailPackage(package_id!);
        setDpPrice(data.installment_first_pay.total_price);
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
    getHasDp();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <SafeAreaView style={styles.container(isDarkMode)}>
      <StatusBarComp />
      <Header teks="Payment Method" onPress={() => navigation.goBack()} />
      <View style={{ paddingHorizontal: 24, paddingVertical: 12 }}>
        {dpPrice && (
          <>
            <Text style={styles.teks(isDarkMode)}>Select Payment Type</Text>
            <Gap height={16} />
            <View>
              <TouchableOpacity
                style={styles.button(isDarkMode)}
                onPress={() => setModalDp(!modalDp)}>
                <Text style={styles.teks5}>
                  {paymentType?.label || "Select Payment Type"}
                </Text>
              </TouchableOpacity>
              <View style={{ position: "absolute", right: 12, top: 12 }}>
                <IconDown />
              </View>
            </View>
            <Gap height={16} />
          </>
        )}
        <Text style={styles.teks(isDarkMode)}>Select Payment Method</Text>
        <Gap height={16} />
        <TouchableOpacity style={styles.button(isDarkMode)} onPress={gotoCash}>
          <IconCash />
          <Gap width={4} />
          <Text style={styles.teks2(isDarkMode)}>CASH</Text>
          <RightArrow />
        </TouchableOpacity>
        <Gap height={12} />
        {/* <TouchableOpacity style={styles.button(isDarkMode)} onPress={gotoDigiPayment}>
                    <IconDigitalPayment />
                    <Gap width={4} />
                    <Text style={styles.teks2(isDarkMode)}>DIGITAL PAYMENT</Text>
                    <RightArrow />
                </TouchableOpacity> */}
      </View>

      <Modal
        animationType="fade"
        transparent={true}
        visible={modalDp}
        onRequestClose={() => {
          setModalDp(!modalDp);
        }}>
        <View style={styles.centeredView}>
          <View style={styles.modalView}>
            <ScrollView>
              {paymentTypes.map(data => {
                return (
                  <TouchableOpacity
                    key={data.id}
                    style={styles.buttonDrop}
                    onPress={() =>
                      selectDp({
                        id: data.id,
                        label: data.label,
                      })
                    }>
                    <Text style={styles.teks5}>{data.label}</Text>
                  </TouchableOpacity>
                );
              })}
            </ScrollView>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
};

const styles = {
  container: (isDarkMode: boolean) => ({
    flex: 1,
    backgroundColor: isDarkMode ? colors._black2 : colors._white,
  }),
  teks: (isDarkMode: boolean) => ({
    fontSize: 14,
    fontFamily: fonts.primary[400],
    color: isDarkMode ? colors._grey2 : colors._black,
  }),
  teks2: (isDarkMode: boolean) => ({
    fontSize: 14,
    fontFamily: fonts.primary[400],
    color: isDarkMode ? colors._grey2 : colors._black,
    flex: 1,
  }),
  button: (isDarkMode: boolean) =>
    ({
      backgroundColor: isDarkMode ? colors._black : colors._grey2,
      padding: 12,
      borderRadius: 8,
      flexDirection: "row",
      alignItems: "center",
    } as StyleProp<ViewStyle>),
  teks5: {
    fontSize: 14,
    fontFamily: fonts.primary[300],
    color: colors._black,
  },
  centeredView: {
    // width: '100%',
    // height: '100%',
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: colors._black3,
  } as StyleProp<ViewStyle>,
  modalView: {
    backgroundColor: colors._white,
    padding: 12,
    width: "90%",
    borderRadius: 8,
  } as StyleProp<ViewStyle>,
  buttonDrop: {
    padding: 8,
  },
};

export default PaymentMethod;
