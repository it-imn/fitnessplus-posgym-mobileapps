import { NativeStackScreenProps } from "@react-navigation/native-stack";
import React, { Fragment, useContext, useEffect } from "react";
import {
  FlatList,
  SafeAreaView,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import Header from "../../components/ui/Header";
import Gap from "../../components/ui/Gap";
import Loading from "../../components/ui/Loading";
import NoData from "../../components/ui/NoData";
import StatusBarComp from "../../components/ui/StatusBarComp";
import { ThemeContext } from "../../contexts/ThemeContext";
import { IDetailInstallmentMembership, ThemeType } from "../../lib/definition";
import { RootStackParamList } from "../../lib/routes";
import { colors, convertToRupiah, fonts } from "../../lib/utils";
import { fetchInstallmentMembership } from "../../services/installment";
import { showMessage } from "react-native-flash-message";
import { useInstallmentStore } from "../../stores/useInstallmentStore";
import { AlarmClockIcon } from "lucide-react-native";
import BouncyCheckbox from "react-native-bouncy-checkbox";

export const DetailInstallmentPackage = ({
  navigation,
  route,
}: NativeStackScreenProps<RootStackParamList, "DetailInstallmentPackage">) => {
  const { isDarkMode } = useContext(ThemeContext);
  const [isLoading, setIsLoading] = React.useState<boolean>(false);
  const [packageInstallment, setPackage] = React.useState<
    IDetailInstallmentMembership[]
  >([]);
  const [bill, setBill] = React.useState<number>(0);
  const [canPayIds, setCanPayIds] = React.useState<number[]>([]);

  const { installment, update } = useInstallmentStore();

  const getInstallment = async () => {
    setIsLoading(true);
    try {
      const { data, bill: billRes } = await fetchInstallmentMembership(
        route.params.id,
      );
      if (data) {
        setPackage(data);
        setBill(billRes);

        const canPay = data.filter(item => item.is_pay);
        setCanPayIds(canPay.map(item => item.id));
        console.log(canPayIds);
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
    getInstallment();
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
        teks="Detail Installment Package"
        onPress={() => navigation.goBack()}
      />

      <Gap height={8} />
      <View
        style={{
          alignItems: "center",
          paddingHorizontal: 20,
        }}>
        <Text
          style={{
            fontFamily: fonts.primary[400],
            fontSize: 24,
            color: isDarkMode ? colors._white : colors._black,
          }}>
          Total Bill
        </Text>
        <Text
          style={{
            fontFamily: fonts.primary[600],
            fontSize: 36,
            color: isDarkMode ? colors._white : colors._black,
          }}>
          {convertToRupiah(bill.toString())}
        </Text>
      </View>

      <Gap height={16} />

      <FlatList
        style={{
          flex: 1,
          paddingHorizontal: 20,
        }}
        // refreshing={isLoading}
        // onRefresh={() => {
        //   console.log("refresh");
        //   setPage(1);
        //   setSubmissionPackages([]);

        //   getSubmissionPackages(1, debouncedText);
        // }}
        // onEndReached={handleEndReached}
        data={packageInstallment}
        keyExtractor={(_, index) => index.toString()}
        renderItem={({ item, index }) => (
          <DetailPackageInstallmentCard
            data={item}
            isSelected={installment.installmentIds.includes(item.id)}
            disabled={
              !canPayIds.includes(item.id) || // Disable if not in canPayIds
              (canPayIds.indexOf(item.id) !== 0 && // Disable if not the first item
                !installment.installmentIds.includes(
                  canPayIds[canPayIds.indexOf(item.id) - 1],
                )) // Disable if the previous item is not selected
            }
            onPress={() => {
              if (item.is_pay) {
                const isChecked = installment.installmentIds.includes(item.id);
                if (isChecked) {
                  const idx = installment.installmentIds.indexOf(item.id);
                  const remainingIds = installment.installmentIds.slice(0, idx);

                  const newTotal = remainingIds.reduce((sum, id) => {
                    const installmentItem = packageInstallment.find(
                      pkg => pkg.id === id,
                    );
                    return sum + (installmentItem?.total || 0);
                  }, 0);

                  update({
                    installmentIds: remainingIds,
                    total: newTotal,
                  });
                } else {
                  const total = installment.total + item.total;
                  update({
                    installmentIds: [...installment.installmentIds, item.id],
                    total: total,
                  });
                }
              }

              console.log(installment);
            }}
          />
        )}
        ListEmptyComponent={<NoData text="No Data Available" />}
      />

      {installment.installmentIds.length > 0 && (
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
            onPress={() => {
              console.log(packageInstallment[0]);
              update({
                mambershipName: packageInstallment[0].membership_name,
                memberName: packageInstallment[0].member_name,
                salesName: packageInstallment[0].sales_name,
              });
              navigation.navigate("PaymentInstallment", {
                id: route.params.id,
              });
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

const DetailPackageInstallmentCard = ({
  data,
  isSelected,
  disabled,
  onPress,
}: {
  data: IDetailInstallmentMembership;
  isSelected: boolean;
  disabled: boolean;
  onPress: () => void;
}) => {
  const { isDarkMode } = useContext(ThemeContext);

  return (
    <Fragment>
      <TouchableOpacity
        style={{
          flexDirection: "row",
          padding: 12,
          borderRadius: 12,
          justifyContent: "space-between",
          alignItems: "center",
          flex: 1,
        }}
        disabled={!data.is_pay || disabled}
        onPress={onPress}>
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            flexShrink: 1,
          }}>
          {data.is_pay && (
            <>
              <BouncyCheckbox
                isChecked={isSelected}
                size={16}
                disableText
                disabled
                fillColor={colors._blue}
                unFillColor={isDarkMode ? colors._black : colors._white}
                iconImageStyle={{ tintColor: colors._blue, borderRadius: 0 }}
                innerIconStyle={{ borderRadius: 0 }}
                style={{ borderRadius: 0 }}
                iconStyle={{ borderRadius: 0 }}
              />
              <Gap width={16} />
            </>
          )}
          <View
            style={{
              flexDirection: "column",
              flexShrink: 1,
            }}>
            <Text
              style={{
                fontFamily: fonts.primary[600],
                fontSize: 14,
                color: isDarkMode ? colors._white : colors._black,
                flexShrink: 1,
              }}>
              Installment {data.installment_number}
            </Text>
            <Gap height={8} />
            <Text
              style={{
                fontFamily: fonts.primary[400],
                fontSize: 12,
                color: isDarkMode ? colors._white : colors._black,
                flexShrink: 1,
              }}
              numberOfLines={2}>
              {convertToRupiah(data.total.toString())}
            </Text>
            <Gap height={4} />
            <Text
              style={{
                fontFamily: fonts.primary[300],
                fontSize: 8,
                color: isDarkMode ? colors._white : colors._black,
              }}
              numberOfLines={2}>
              {data.order_code}
            </Text>
          </View>
        </View>
        <View
          style={{
            flexDirection: "column",
            alignItems: "flex-end",
            justifyContent: "space-between",
            alignSelf: "flex-end",
          }}>
          <View
            style={{
              flexDirection: "row",
              alignItems: "flex-end",
              justifyContent: "flex-end",
            }}>
            <AlarmClockIcon size={16} color={colors._gold3} />
            <Gap width={4} />
            <Text
              style={{
                fontFamily: fonts.primary[300],
                fontSize: 14,
                color: colors._red,
              }}>
              {data.due_date}
            </Text>
          </View>

          <Gap height={4} />
          <View
            style={{
              flexDirection: "row",
              alignItems: "flex-end",
              justifyContent: "flex-end",
              width: 120,
            }}>
            <View
              style={{
                backgroundColor:
                  data.status === "success" ? colors._green : colors._gold3,
                borderRadius: 8,
              }}>
              <Text
                style={{
                  fontFamily: fonts.primary[400],
                  fontSize: 10,
                  color: colors._white,
                  padding: 4,
                }}>
                {data.status}
              </Text>
            </View>
          </View>
        </View>
      </TouchableOpacity>
      <View
        style={{ width: "100%", height: 1, backgroundColor: colors._grey3 }}
      />
    </Fragment>
  );
};
