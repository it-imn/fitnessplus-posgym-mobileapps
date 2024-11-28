import React, { useContext, useEffect, useState } from "react";
import {
  SafeAreaView,
  StyleProp,
  Text,
  TouchableOpacity,
  View,
  ViewStyle,
} from "react-native";
import LinearGradient from "react-native-linear-gradient";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import {
  MembershipReq,
  PTReq,
  TransactionType,
  useTransactionStore,
} from "../../stores/useTransactionStore";
import Header from "../../components/ui/Header";
import Gap from "../../components/ui/Gap";
import { Input } from "../../components/ui/Input";
import StatusBarComp from "../../components/ui/StatusBarComp";
import { ThemeContext } from "../../contexts/ThemeContext";
import { RootStackParamList } from "../../lib/routes";
import { colors, fonts } from "../../lib/utils";
import { checkVoucher } from "../../services/membership";
import { showMessage } from "react-native-flash-message";
import { ButtonColor } from "../../components/ui/Button";

const Voucher = ({
  navigation,
}: NativeStackScreenProps<RootStackParamList, "Voucher">) => {
  const { isDarkMode } = useContext(ThemeContext);
  const [voucherCode, setVoucherCode] = useState("");

  const { update, transaction } = useTransactionStore();
  // const [statusCode, setStatusCode] = useState('');

  const claimVoucher = async () => {
    // const data = {
    //   voucher_code: code,
    //   package_id: id,
    //   signature: signature,
    //   down_pay: down_pay,
    // };
    if (transaction.type === TransactionType.MEMBERSHIP) {
      try {
        // const response = await Api.membershipVoucherNews(data, token);
        // const params = {
        //   name: name,
        //   email: email,
        //   phone: phone,
        //   id: id,
        //   item_name: item_name,
        //   package_price: response.data.data.package_price,
        //   item_price: response.data.data.package_total_price,
        //   item_price_fix: response.data.data.package_fix_price,
        //   type: type,
        //   item_count: item_count,
        //   voucher_name: response.data.data.voucher_name,
        //   discount: response.data.data.voucher_discount,
        //   signature: signature,
        //   sales_id: sales_id,
        //   index: index,
        //   down_pay: down_pay,
        //   token: token,
        //   isDarkMode: boolean,
        //   voucher_id: response.data.data.voucher_id,
        //   installments: response.data.data.installment_detail_total_price,
        //   due_date: response.data.data.installment_detail_due_date,
        //   exp_date: response.data.data.expired_at,
        // };
        // navigation.navigate('WillTransaction', params);
        if (voucherCode === "") {
          showMessage({
            message: "Voucher code is required",
            type: "warning",
            icon: "warning",
            backgroundColor: colors._red,
            color: colors._white,
          });
          return;
        }

        const { membership_id } = transaction.transaction as MembershipReq;
        const {final_price} = transaction;

        const { data } = await checkVoucher(voucherCode, membership_id);

        update({
          voucher_code: voucherCode,
          voucher: data,
          final_price: data.package_id ? final_price - data.discount : data.total_price,
        });

        navigation.navigate("PaymentMethod");
      } catch (error: any) {
        showMessage({
          message: error.message || "An error occurred",
          type: "warning",
          icon: "warning",
          backgroundColor: colors._red,
          color: colors._white,
        });
      }
    } else if (transaction.type === TransactionType.PT) {
      try {
        if (voucherCode === "") {
          showMessage({
            message: "Voucher code is required",
            type: "warning",
            icon: "warning",
            backgroundColor: colors._red,
            color: colors._white,
          });
          return;
        }

        const { package_pt_id } = transaction.transaction as PTReq;
        const {final_price} = transaction

        const { data } = await checkVoucher(voucherCode, package_pt_id);

        update({
          voucher_code: voucherCode,
          voucher: data,
          final_price: data.package_id ? final_price - data.discount : data.total_price,
        });

        navigation.navigate("PaymentMethod");
      } catch (error: any) {
        showMessage({
          message: error.message || "An error occurred",
          type: "warning",
          icon: "warning",
          backgroundColor: colors._red,
          color: colors._white,
        });
      }
    }
    // if (type === 'SC') {
    //   try {
    //     const response = await Api.sclassVoucher(data, token);
    //     if (response.data[0].value_percent === 0) {
    //       var price_after = item_price - parseInt(response.data[0].value_price);
    //       const params = {
    //         name: name,
    //         email: email,
    //         phone: phone,
    //         id: id,
    //         item_name: item_name,
    //         item_price: price_after,
    //         type: type,
    //         item_count: item_count,
    //         voucher_name: response.data[0].name,
    //         discount: parseInt(response.data[0].value_price),
    //         token: token,
    //         seat_number: seat_number,
    //         index: index,
    //         down_pay: down_pay,
    //         isDarkMode: boolean,
    //       };
    //       navigation.navigate('WillTransaction', params);
    //     } else {
    //       var discount =
    //         item_price * parseFloat(response.data[0].value_percent);
    //       var price_after = item_price - discount;
    //       const params = {
    //         name: name,
    //         email: email,
    //         phone: phone,
    //         id: id,
    //         item_name: item_name,
    //         item_price: price_after,
    //         type: type,
    //         item_count: item_count,
    //         voucher_name: response.data[0].name,
    //         discount: discount,
    //         token: token,
    //         seat_number: seat_number,
    //         index: index,
    //         down_pay: down_pay,
    //         isDarkMode: boolean,
    //       };
    //       navigation.navigate('WillTransaction', params);
    //     }
    //   } catch (error) {
    //     showMessage({
    //       message: 'Voucher Failed',
    //       type: 'warning',
    //       backgroundColor: colors._red,
    //       color: colors._white,
    //       icon: 'warning',
    //     });
    //   }
    // }
    // if (type === 'PPT') {
    //   try {
    //     const response = await Api.ptVoucher(data, token);
    //     if (response.data.message === 'Voucher already used') {
    //       showMessage({
    //         message: 'Voucher already used',
    //         type: 'warning',
    //         backgroundColor: colors._red,
    //         color: colors._white,
    //         icon: 'warning',
    //       });
    //     } else {
    //       const params = {
    //         type: type,
    //         name: name,
    //         email: email,
    //         phone: phone,
    //         item_name: response.data.data.package_name,
    //         package_pt_id: id,
    //         down_pay: down_pay,
    //         voucher_id: response.data.data.voucher_id,
    //         discount: response.data.data.voucher_discount,
    //         signature: signature,
    //         item_price_fix: response.data.data.package_fix_price, // harga setelah voucher
    //         exp_date: response.data.data.expired_at,
    //         voucher_discount: response.data.data.voucher_discount,
    //         package_price: response.data.data.package_price, //harga actual
    //         package_installments: response.data.data.package_installments,
    //         item_price: response.data.data.package_total_price, // harga yg harus dibayar
    //         installment_detail_total_price:
    //           response.data.data.installment_detail_total_price,
    //         installment_detail_due_date:
    //           response.data.data.installment_detail_due_date,
    //       };
    //       navigation.navigate('WillTransactionPt', params);
    //     }
    //   } catch (error) {
    //     showMessage({
    //       message: 'Voucher Failed',
    //       type: 'warning',
    //       backgroundColor: colors._red,
    //       color: colors._white,
    //       icon: 'warning',
    //     });
    //   }
    // }
  };

  const onNext = () => {
    update({
      voucher: undefined,
      voucher_code: "",
    });

    navigation.navigate("PaymentMethod");
  };

  // const onNext = () => {
  //   const data = {
  //     //Api
  //     name: name,
  //     email: email,
  //     phone: phone,
  //     id: id,
  //     //Tampilan
  //     item_name: item_name,
  //     item_price: item_price,
  //     type: type,
  //     item_count: item_count,
  //     token: token,
  //     sales_id: sales_id,
  //     signature: signature,
  //     seat_number: seat_number,
  //     down_pay: down_pay,
  //     index: index,
  //     isDarkMode: boolean,
  //   };
  //   navigation.navigate('WillTransaction', data);
  // };

  // const getVouher = async () => {
  //     if (type === 'MBR') {
  //         const response = await Api.getMembershipVoucher(token);
  //         setDataVoucher(response.data);
  //     }
  //     if (type === 'SC') {
  //         const response = await Api.getSclassVoucher(token);
  //         setDataVoucher(response.data);
  //     }
  //     if (type === 'PT') {
  //         const response = await Api.getPtVoucher(token);
  //         setDataVoucher(response.data);
  //     }
  // }

  // const useVoucher = async (params) => {
  //     const data = {
  //         code: params.voucher_code,
  //     }
  //     if (type === 'MBR') {
  //         const response = await Api.membershipVoucher(data, token);
  //         if (response.data[0].value === undefined) {
  //             setStatusCode(response.data)
  //         } else {
  //             setStatusCode(response.data[0].name)
  //             let persentase = parseInt(response.data[0].value * 100);
  //             let discount = item_price * persentase / 100;
  //             const data = {
  //                 //Api
  //                 name: name,
  //                 email: email,
  //                 phone: phone,
  //                 id: id,
  //                 //Tampilan
  //                 item_name: item_name,
  //                 item_price: item_price - discount,
  //                 package_name: item_name,
  //                 item_count: item_count,
  //                 voucher_name: response.data[0].name,
  //                 discount: discount,
  //                 token: token
  //             }
  //             navigation.navigate('WillTransaction', data)
  //         }
  //     }
  //     if (type === 'SC') {
  //         const response = await Api.sclassVoucher(data, token);
  //         if (response.data[0].value === undefined) {
  //             setStatusCode(response.data)
  //         } else {
  //             setStatusCode(response.data[0].name)
  //             let persentase = parseInt(response.data[0].value * 100);
  //             let discount = item_price * persentase / 100;
  //             const data = {
  //                 //Api
  //                 name: name,
  //                 email: email,
  //                 phone: phone,
  //                 id: id,
  //                 //Tampilan
  //                 item_name: item_name,
  //                 item_price: item_price - discount,
  //                 class_name: item_name,
  //                 item_count: item_count,
  //                 voucher_name: response.data[0].name,
  //                 discount: discount,
  //                 token: token
  //             }
  //             navigation.navigate('WillTransaction', data)
  //         }
  //     }
  //     if (type === 'PT') {
  //         const response = await Api.ptVoucher(data, token);
  //         if (response.data[0].value === undefined) {
  //             setStatusCode(response.data)
  //         } else {
  //             setStatusCode(response.data[0].name)
  //             let persentase = parseInt(response.data[0].value * 100);
  //             let discount = item_price * persentase / 100;
  //             const data = {
  //                 //Api
  //                 name: name,
  //                 email: email,
  //                 phone: phone,
  //                 id: id,
  //                 //Tampilan
  //                 item_name: item_name,
  //                 item_price: item_price - discount,
  //                 personal_trainer_name: item_name,
  //                 item_count: item_count,
  //                 voucher_name: response.data[0].name,
  //                 discount: discount,
  //                 token: token
  //             }
  //             navigation.navigate('WillTransaction', data)
  //         }
  //     }
  // }

  useEffect(() => {
    // getVouher();
  }, []);

  return (
    <SafeAreaView style={styles.container(isDarkMode)}>
      <StatusBarComp />
      <Header teks="Voucher" onPress={() => navigation.goBack()} />
      <View style={styles.content}>
        <View style={{ flexDirection: "row", alignItems: "flex-end" }}>
          <View style={{ flex: 1 }}>
            <Input
              placeholder="Input Voucher Code"
              value={voucherCode}
              onChangeText={value => setVoucherCode(value)}
            />
          </View>
          <Gap width={10} />
          <View
            style={{
              justifyContent: "flex-end",
            }}>
            <ButtonColor
              teks="Use"
              onPress={claimVoucher}
              backColor={colors._blue2}
              textColor={colors._white}
            />
          </View>
        </View>
        <Gap height={4} />
        {/* {statusCode !== '' && (
          <Text style={styles.teks2(isDarkMode)}>{statusCode}</Text>
        )} */}
        <Gap height={4} />
        <Text style={styles.teks2(isDarkMode)}>
          * Use the voucher code to get a discount
        </Text>
        {/* <Gap height={20} />
                <Text style={styles.teks(isDarkMode)}>Select Voucher</Text>
                <ScrollView showsVerticalScrollIndicator={false}>
                    {dataVoucher.map(data => {
                        const params = {
                            voucher_code: data.voucher_code
                        }
                        return <CardVoucher key={data.id} voucher_name={data.voucher_name} voucher_code={data.voucher_code} voucher_expired={data.voucher_expired} onPress={() => useVoucher(params)} />
                    })}
                </ScrollView> */}
      </View>
      <View
        style={{
          backgroundColor: isDarkMode ? colors._black2 : colors._white,
        }}>
        <TouchableOpacity style={{ padding: 24 }} onPress={onNext}>
          <Text style={styles.teskSkip}>Continue Without Use Voucher</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = {
  container: (isDarkMode: boolean) => ({
    flex: 1,
    backgroundColor: isDarkMode ? colors._black2 : colors._white,
  }),
  content: {
    paddingHorizontal: 24,
    flex: 1,
  },
  btnCheck: {
    padding: 18,
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
  } as StyleProp<ViewStyle>,
  teks: (isDarkMode: boolean) => ({
    color: isDarkMode ? colors._white : colors._black,
    marginBottom: 5,
    fontSize: 14,
    fontFamily: fonts.primary[400],
  }),
  teks2: (isDarkMode: boolean) => ({
    fontSize: 12,
    fontFamily: fonts.primary[300],
    color: isDarkMode ? colors._white : colors._black,
  }),
  teskSkip: {
    color: colors._blue2,
    fontSize: 14,
    fontFamily: fonts.primary[400],
    textAlign: "center",
  } as StyleProp<ViewStyle>,
};

export default Voucher;
