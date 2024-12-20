import {
  SafeAreaView,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import StatusBarComp from "../../components/ui/StatusBarComp";
import { colors, convertToRupiah, fonts } from "../../lib/utils";
import { Fragment, useContext, useState } from "react";
import { ThemeContext } from "../../contexts/ThemeContext";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { RootStackParamList } from "../../lib/routes";
import BouncyCheckbox from "react-native-bouncy-checkbox";
import Gap from "../../components/ui/Gap";
import { useInstallmentStore } from "../../stores/useInstallmentStore";
import moment from "moment";
import Header from "../../components/ui/Header";
import { showMessage } from "react-native-flash-message";
import { payInstallment } from "../../services/installment";
import Loading from "../../components/ui/Loading";

export const PaymentInstallment = ({
  navigation,
  route,
}: NativeStackScreenProps<RootStackParamList, "PaymentInstallment">) => {
  const { id } = route.params;
  const { isDarkMode } = useContext(ThemeContext);
  const [isLoading, setIsLoading] = useState(false);
  const { installment, reset, update } = useInstallmentStore();

  const onPay = async () => {
    setIsLoading(true);

    try {
      const { data, message } = await payInstallment({
        payment_id: id,
        installment_id: installment.installmentIds,
        total_pay: installment.total,
        payment_method: installment.paymentMethod,
      });

      showMessage({
        message: message,
        type: "success",
        icon: "success",
        backgroundColor: colors._green,
        color: colors._white,
      });

      reset();

      if (data.payment_url) {
        navigation.replace("PaymentGateway", {
          id: data.id,
          url: data.payment_url,
        });
        return;
      }
      
      navigation.replace("MainApp");
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
              {installment.mambershipName} x {installment.installmentIds.length}
            </Text>
            <Text
              style={{
                fontSize: 12,
                fontFamily: fonts.primary[400],
                color: isDarkMode ? colors._grey4 : colors._grey3,
                textAlign: "right",
                width: 90,
              }}>
              {convertToRupiah(installment.total.toString())}
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
              {installment.salesName}
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
          <Gap height={12} />
          <Text
            style={{
              fontSize: 12,
              fontFamily: fonts.primary[400],
              color: isDarkMode ? colors._white : colors._black,
            }}>
            Member
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
              {installment.memberName}
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
          <Gap height={12} />
          <Text
            style={{
              fontSize: 12,
              fontFamily: fonts.primary[400],
              color: isDarkMode ? colors._white : colors._black,
            }}>
            Payment Date
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
              {moment(new Date()).format("dddd, DD MMMM yyyy")}
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
              Type
            </Text>
            <Text
              style={{
                fontSize: 12,
                fontFamily: fonts.primary[400],
                color: isDarkMode ? colors._grey4 : colors._grey3,
              }}>
              Installment
            </Text>
          </View>
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
              {convertToRupiah(installment.total?.toString())}
            </Text>
          </View>
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
              {convertToRupiah(installment.total?.toString())}
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
                isChecked={installment.paymentMethod === "cash"}
                size={16}
                disableText
                disabled
                onPress={() => {}}
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
                  paymentMethod: "non-cash",
                });
              }}>
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
                isChecked={installment.paymentMethod === "non-cash"}
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
            {convertToRupiah(installment.total?.toString())}
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
          disabled={isLoading}
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
