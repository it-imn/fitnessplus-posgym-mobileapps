import React, { useContext, useEffect, useState } from "react";
import {
  Platform,
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
import { z } from "zod";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import DateTimePicker, {
  DateTimePickerAndroid,
} from "@react-native-community/datetimepicker";
import { fetchProfile } from "../../services/profile";

const membershipSchema = z.object({
  startDate: z.date().refine(value => value.getDate() >= new Date().getDate(), {
    message: "Start date must be at least today",
  }),
});

const Voucher = ({
  navigation,
}: NativeStackScreenProps<RootStackParamList, "Voucher">) => {
  const { isDarkMode } = useContext(ThemeContext);
  const [voucherCode, setVoucherCode] = useState("");

  const { update, transaction } = useTransactionStore();
  // const [statusCode, setStatusCode] = useState('');
  const [showDatePickerIOS, setShowDatePickerIOS] = useState(false);
  const form = useForm<z.infer<typeof membershipSchema>>({
    resolver: zodResolver(membershipSchema),
    defaultValues: {
      startDate: new Date(),
    },
  });

  const getProfile = async () => {
    try {
      const { data } = await fetchProfile();
      if (data.membership.expired_at) {
        const expiredAt = new Date(data.membership.expired_at);
        // add one day
        expiredAt.setDate(expiredAt.getDate() + 1);
        form.setValue("startDate", expiredAt);
      }
    } catch (err: any) {
      console.error(err);
    }
  };

  const claimVoucher = async (values: z.infer<typeof membershipSchema>) => {
    if (transaction.type === TransactionType.MEMBERSHIP) {
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

        const { membership_id } = transaction.transaction as MembershipReq;
        const { final_price } = transaction;

        const { data } = await checkVoucher(voucherCode, membership_id, 0);

        update({
          voucher_code: voucherCode,
          voucher: data,
          final_price: data.package_id
            ? final_price - data.discount
            : data.total_price,
          transaction: {
            ...transaction.transaction,
            startDate: values.startDate,
          },
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
        const { final_price } = transaction;

        const { data } = await checkVoucher(voucherCode, package_pt_id, 0);

        update({
          voucher_code: voucherCode,
          voucher: data,
          final_price: data.package_id
            ? final_price - data.discount
            : data.total_price,
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

  const onNext = (values: z.infer<typeof membershipSchema>) => {
    update({
      voucher: undefined,
      voucher_code: "",
      transaction: {
        ...transaction.transaction,
        startDate: values.startDate,
      },
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
    getProfile();
  }, []);

  return (
    <SafeAreaView style={styles.container(isDarkMode)}>
      <StatusBarComp />
      <Header teks="Voucher" onPress={() => navigation.goBack()} />
      <View style={styles.content}>
        <View>
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
          <Text style={styles.teks2(isDarkMode)}>
            * Use the voucher code to get a discount
          </Text>
        </View>
        {transaction.type === TransactionType.MEMBERSHIP && (
          <>
            <Gap height={24} />
            <View>
              <Text
                style={{
                  color: isDarkMode ? colors._white : colors._black,
                  marginBottom: 5,
                  fontSize: 14,
                  fontFamily: fonts.primary[400],
                }}>
                Starting a gym?
              </Text>
              <Controller
                name="startDate"
                control={form.control}
                render={({ field: { onChange, value } }) => (
                  <TouchableOpacity
                    style={{
                      padding: 12,
                      backgroundColor: isDarkMode
                        ? colors._black
                        : colors._grey2,
                      borderRadius: 10,
                      borderWidth: 0.5,
                      borderColor: isDarkMode ? colors._grey4 : colors._grey3,
                    }}
                    onPress={() => {
                      if (Platform.OS === "android") {
                        DateTimePickerAndroid.open({
                          value: value,
                          mode: "date",
                          onChange: (_, selectedDate) => {
                            if (selectedDate) {
                              onChange(selectedDate);
                            }
                          },
                        });
                      } else if (Platform.OS === "ios") {
                        setShowDatePickerIOS(true);
                      }
                    }}>
                    <Text
                      style={{
                        color: isDarkMode ? colors._white : colors._black,
                        fontSize: 14,
                        fontFamily: fonts.primary[400],
                      }}>
                      {form.getValues("startDate").toLocaleDateString("id-ID")}
                    </Text>
                  </TouchableOpacity>
                )}
              />
              {showDatePickerIOS && (
                <Controller
                  name="startDate"
                  control={form.control}
                  render={({ field: { onChange, value } }) => (
                    <DateTimePicker
                      value={value}
                      mode="date"
                      display="default"
                      onChange={(_, selectedDate) => {
                        setShowDatePickerIOS(false);
                        if (selectedDate) {
                          onChange(selectedDate);
                        }
                      }}
                    />
                  )}
                />
              )}
              {form.formState.errors.startDate && (
                <Text style={{ color: colors._red, marginTop: 4 }}>
                  {form.formState.errors.startDate.message}
                </Text>
              )}
            </View>
          </>
        )}
      </View>
      <View
        style={{
          backgroundColor: isDarkMode ? colors._black2 : colors._white,
        }}>
        <TouchableOpacity
          style={{ padding: 24 }}
          onPress={form.handleSubmit(onNext)}>
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
