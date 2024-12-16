import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { Fragment, useContext, useEffect, useState } from "react";
import {
  SafeAreaView,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import BouncyCheckbox from "react-native-bouncy-checkbox";
import Gap from "../../components/ui/Gap";
import Header from "../../components/ui/Header";
import StatusBarComp from "../../components/ui/StatusBarComp";
import { ThemeContext } from "../../contexts/ThemeContext";
import { RootStackParamList } from "../../lib/routes";
import { colors, convertToRupiah, fonts } from "../../lib/utils";
import { usePaymentStore } from "../../stores/usePaymentStore";
import { showMessage } from "react-native-flash-message";
import { buyMembership, checkVoucher } from "../../services/membership";
import Loading from "../../components/ui/Loading";
import { buyPersonalTrainerPackage } from "../../services/personal_trainer";
import { IPaymentSummary } from "../../lib/definition";
import {
  fetchPaymentSummary,
  fetchPaymentSummaryPt,
} from "../../services/payment";

export const Payment = ({
  navigation,
}: NativeStackScreenProps<RootStackParamList, "Payment">) => {
  const { isDarkMode } = useContext(ThemeContext);
  const { payment, update, reset } = usePaymentStore();

  const [isLoading, setIsLoading] = useState(false);
  const [voucher, setVoucher] = useState<string>("");
  const [paymentSummary, setPaymentSummary] = useState<IPaymentSummary | null>(
    null,
  );

  const onApplyVoucher = async () => {
    if (voucher === "") {
      showMessage({
        message: "Voucher code is required",
        type: "warning",
        icon: "warning",
        backgroundColor: colors._red,
        color: colors._white,
      });
      return;
    }

    setIsLoading(true);
    try {
      if (payment.membershipId) {
        await checkVoucher(voucher, payment.membershipId, payment.salesId || 0);
      } else if (payment.packagePTId) {
        await checkVoucher(voucher, payment.packagePTId, payment.salesId || 0);
      }

      update({
        voucherCode: voucher,
      });
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

  const onPay = async () => {
    setIsLoading(true);
    try {
      if (payment.membershipId) {
        const { data } = await buyMembership(
          payment.salesId || 0,
          payment.membershipId,
          payment.paymentMethod,
          payment.signature,
          payment.voucherCode || "",
          payment.isDp,
          (payment?.startDate || new Date()).toISOString().slice(0, 10),
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
      } else if (payment.packagePTId) {
        const { data } = await buyPersonalTrainerPackage(
          payment.packagePTId,
          payment.ptId || 0,
          payment.signature,
          payment.voucherCode || "",
          payment.isDp,
          (payment?.startDate || new Date()).toISOString().slice(0, 10),
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

  const getPaymentSummary = async () => {
    setIsLoading(true);
    try {
      if (payment.membershipId) {
        const { data } = await fetchPaymentSummary({
          membership_id: payment.membershipId || 0,
          sales_id: payment.salesId || 0,
          voucher_code: payment.voucherCode || null,
          payment_method: payment.paymentMethod,
          down_payment_membership: payment.isDp,
        });

        setPaymentSummary(data);
      } else if (payment.packageId) {
        const { data } = await fetchPaymentSummaryPt({
          package_personal_trainer_id: payment.packagePTId || 0,
          sales_id: payment.salesId || 0,
          voucher_code: payment.voucherCode || null,
          payment_method: payment.paymentMethod,
          down_payment: payment.isDp,
        });

        setPaymentSummary(data);
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
    getPaymentSummary();
  }, [payment.isDp, payment.voucherCode, payment.paymentMethod]);

  return (
    <SafeAreaView
      style={{
        flex: 1,
        backgroundColor: isDarkMode ? colors._black2 : colors._white,
      }}>
      <StatusBarComp />
      <Header teks="Payment" onPress={() => navigation.goBack()} />
      <ScrollView
        style={{
          flexDirection: "column",
          flex: 1,
          paddingHorizontal: 24,
        }}>
        <View
          style={{
            backgroundColor: isDarkMode ? colors._black : colors._grey2,
            padding: 12,
            borderRadius: 8,
          }}>
          <Text
            style={{
              fontSize: 14,
              fontFamily: fonts.primary[400],
              color: isDarkMode ? colors._grey2 : colors._black,
            }}>
            Package Summary
          </Text>
          <Gap height={8} />
          <Text
            style={{
              fontSize: 12,
              fontFamily: fonts.primary[400],
              color: isDarkMode ? colors._white : colors._black,
            }}>
            Package
          </Text>
          <Gap height={2} />
          <View
            style={{
              flexDirection: "row",
              alignItems: "flex-start",
              justifyContent: "space-between",
            }}>
            <Text
              style={{
                fontSize: 12,
                fontFamily: fonts.primary[400],
                color: isDarkMode ? colors._grey4 : colors._grey3,
                flexShrink: 1,
              }}>
              {payment.packageName} x 1
            </Text>
            <Text
              style={{
                fontSize: 12,
                fontFamily: fonts.primary[400],
                color: isDarkMode ? colors._grey4 : colors._grey3,
                textAlign: "right",
                width: 90,
              }}>
              {convertToRupiah(payment.packagePrice.toString())}
            </Text>
          </View>
          {payment.salesId && (
            <Fragment>
              <Gap height={12} />
              <View
                style={{
                  width: "100%",
                  height: 1,
                  backgroundColor: colors._grey3,
                }}
              />
              <Gap height={12} />
              <Text
                style={{
                  fontSize: 12,
                  fontFamily: fonts.primary[400],
                  color: isDarkMode ? colors._white : colors._black,
                }}>
                Consultant Member
              </Text>
              <Gap height={2} />
              <View
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  justifyContent: "space-between",
                }}>
                <Text
                  style={{
                    fontSize: 12,
                    fontFamily: fonts.primary[400],
                    color: isDarkMode ? colors._grey4 : colors._grey3,
                  }}>
                  {payment.salesName} ({payment.salesEmail})
                </Text>
              </View>
            </Fragment>
          )}
        </View>
        <Gap height={16} />
        <View
          style={{
            backgroundColor: isDarkMode ? colors._black : colors._grey2,
            padding: 12,
            borderRadius: 8,
          }}>
          <View>
            <Text
              style={{
                fontSize: 14,
                fontFamily: fonts.primary[400],
                color: isDarkMode ? colors._grey2 : colors._black,
              }}>
              Voucher
            </Text>
            <Gap height={8} />
            <View style={{ flexDirection: "row" }}>
              <TextInput
                onChangeText={text => setVoucher(text)}
                value={voucher}
                placeholder={"Enter code"}
                placeholderTextColor={colors._grey4}
                style={{
                  flex: 1,
                  padding: 12,
                  fontSize: 14,
                  fontFamily: fonts.primary[400],
                  backgroundColor: isDarkMode ? colors._black : colors._grey2,
                  borderRadius: 10,
                  color: isDarkMode ? colors._white : colors._black,
                  borderWidth: 0.5,
                  borderColor: isDarkMode ? colors._grey4 : colors._grey3,
                }}
              />
              <Gap width={10} />
              <TouchableOpacity
                style={{
                  justifyContent: "center",
                  alignItems: "center",
                  backgroundColor: colors._blue2,
                  borderRadius: 10,
                  padding: 16,
                }}
                onPress={onApplyVoucher}>
                <Text
                  style={{
                    fontSize: 12,
                    color: colors._white,
                    fontFamily: fonts.primary[400],
                  }}>
                  Apply
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
        <Gap height={16} />
        {payment.isDpAvailable && (
          <Fragment>
            <View
              style={{
                backgroundColor: isDarkMode ? colors._black : colors._grey2,
                padding: 12,
                borderRadius: 8,
              }}>
              <Text
                style={{
                  fontSize: 14,
                  fontFamily: fonts.primary[400],
                  color: isDarkMode ? colors._grey2 : colors._black,
                }}>
                Payment Type
              </Text>
              <Gap height={8} />
              <View>
                <TouchableOpacity
                  style={{
                    backgroundColor: isDarkMode ? colors._black : colors._grey2,
                    padding: 12,
                    borderRadius: 10,
                    borderWidth: 0.5,
                    borderColor: isDarkMode ? colors._grey4 : colors._grey3,
                    flexDirection: "row",
                    alignItems: "center",
                    justifyContent: "space-between",
                  }}
                  onPress={() => {
                    update({
                      isDp: false,
                    });
                  }}>
                  <Text
                    style={{
                      fontSize: 14,
                      fontFamily: fonts.primary[300],
                      color: colors._black,
                    }}>
                    Full Payment
                  </Text>
                  <BouncyCheckbox
                    isChecked={!payment.isDp}
                    size={16}
                    disableText
                    disabled
                    fillColor={colors._blue}
                    unFillColor={isDarkMode ? colors._black : colors._white}
                    iconImageStyle={{ tintColor: colors._blue }}
                  />
                </TouchableOpacity>
                <Gap height={8} />
                <TouchableOpacity
                  style={{
                    backgroundColor: isDarkMode ? colors._black : colors._grey2,
                    padding: 12,
                    borderRadius: 10,
                    borderWidth: 0.5,
                    borderColor: isDarkMode ? colors._grey4 : colors._grey3,
                    flexDirection: "row",
                    alignItems: "center",
                    justifyContent: "space-between",
                  }}
                  onPress={() => {
                    update({
                      isDp: true,
                    });
                  }}>
                  <Text
                    style={{
                      fontSize: 14,
                      fontFamily: fonts.primary[300],
                      color: colors._black,
                    }}>
                    Down Payment
                  </Text>
                  <BouncyCheckbox
                    isChecked={payment.isDp}
                    size={16}
                    disableText
                    disabled
                    fillColor={colors._blue}
                    unFillColor={isDarkMode ? colors._black : colors._white}
                    iconImageStyle={{ tintColor: colors._blue }}
                  />
                </TouchableOpacity>
              </View>
              <Gap height={16} />
            </View>
            <Gap height={16} />
          </Fragment>
        )}
        <View
          style={{
            backgroundColor: isDarkMode ? colors._black : colors._grey2,
            padding: 12,
            borderRadius: 8,
          }}>
          <Text
            style={{
              fontSize: 14,
              fontFamily: fonts.primary[400],
              color: isDarkMode ? colors._grey2 : colors._black,
            }}>
            Payment Summary
          </Text>
          <Gap height={8} />
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "space-between",
            }}>
            <Text
              style={{
                fontSize: 12,
                fontFamily: fonts.primary[400],
                color: isDarkMode ? colors._grey4 : colors._grey3,
              }}>
              Subtotal
            </Text>
            <Text
              style={{
                fontSize: 12,
                fontFamily: fonts.primary[400],
                color: isDarkMode ? colors._grey4 : colors._grey3,
              }}>
              {convertToRupiah(paymentSummary?.sub_total.toString() || "0")}
            </Text>
          </View>
          {paymentSummary?.discount !== 0 && (
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "space-between",
              }}>
              <Text
                style={{
                  fontSize: 12,
                  fontFamily: fonts.primary[400],
                  color: isDarkMode ? colors._grey4 : colors._grey3,
                }}>
                Discount
              </Text>
              <Text
                style={{
                  fontSize: 12,
                  fontFamily: fonts.primary[400],
                  color: isDarkMode ? colors._grey4 : colors._grey3,
                }}>
                {convertToRupiah(paymentSummary?.discount.toString() || "0")}
              </Text>
            </View>
          )}
          {paymentSummary?.voucher_id && (
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "space-between",
              }}>
              <Text
                style={{
                  fontSize: 12,
                  fontFamily: fonts.primary[400],
                  color: isDarkMode ? colors._grey4 : colors._grey3,
                }}>
                Voucher
              </Text>
              <Text
                style={{
                  fontSize: 12,
                  fontFamily: fonts.primary[400],
                  color: isDarkMode ? colors._grey4 : colors._grey3,
                }}>
                {convertToRupiah(paymentSummary?.voucher.toString() || "0")}
              </Text>
            </View>
          )}
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "space-between",
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
              {convertToRupiah(paymentSummary?.total_pay.toString() || "0")}
            </Text>
          </View>
        </View>
        <Gap height={16} />
        <View
          style={{
            backgroundColor: isDarkMode ? colors._black : colors._grey2,
            padding: 12,
            borderRadius: 8,
          }}>
          <Text
            style={{
              fontSize: 14,
              fontFamily: fonts.primary[400],
              color: isDarkMode ? colors._grey2 : colors._black,
            }}>
            Payment Method
          </Text>
          <Gap height={8} />
          <View>
            <TouchableOpacity
              style={{
                backgroundColor: isDarkMode ? colors._black : colors._grey2,
                padding: 12,
                borderRadius: 10,
                borderWidth: 0.5,
                borderColor: isDarkMode ? colors._grey4 : colors._grey3,
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "space-between",
              }}
              onPress={() => {
                update({
                  paymentMethod: "cash",
                });
              }}>
              <Text
                style={{
                  fontSize: 14,
                  fontFamily: fonts.primary[300],
                  color: colors._black,
                }}>
                Cash
              </Text>
              <BouncyCheckbox
                isChecked={true}
                size={16}
                disableText
                disabled
                fillColor={colors._blue}
                unFillColor={isDarkMode ? colors._black : colors._white}
                iconImageStyle={{ tintColor: colors._blue }}
              />
            </TouchableOpacity>
            <Gap height={8} />
            <TouchableOpacity
              style={{
                backgroundColor: isDarkMode ? colors._black : colors._grey2,
                padding: 12,
                borderRadius: 10,
                borderWidth: 0.5,
                borderColor: isDarkMode ? colors._grey4 : colors._grey3,
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "space-between",
              }}
              disabled
              onPress={() => {}}>
              <Text
                style={{
                  fontSize: 14,
                  fontFamily: fonts.primary[300],
                  color: colors._black,
                }}>
                Non Cash
              </Text>
              <BouncyCheckbox
                size={16}
                disableText
                disabled
                isChecked={false}
                onPress={() => {}}
                fillColor={colors._blue}
                unFillColor={isDarkMode ? colors._black : colors._white}
                iconImageStyle={{ tintColor: colors._blue }}
              />
            </TouchableOpacity>
          </View>
          <Gap height={16} />
        </View>
        <Gap height={16} />
      </ScrollView>
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
            {convertToRupiah(paymentSummary?.total_pay.toString() || "0")}
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
          onPress={onPay}>
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

      {isLoading && <Loading />}
    </SafeAreaView>
  );
};
