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

  const { update } = useInstallmentStore();

  const getInstallment = async () => {
    setIsLoading(true);
    try {
      const { data, bill: billRes } = await fetchInstallmentMembership(
        route.params.id,
      );
      if (data) {
        setPackage(data);
        setBill(billRes);
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
        renderItem={({ item }) => (
          <DetailPackageInstallmentCard
            data={item}
            onPress={() => {
              update({
                installmentNumber: item.installment_number,
                mambershipName: item.membership_name,
                memberName: item.member_name,
                salesName: item.sales_name,
                total: item.total,
              });

              navigation.navigate("PaymentInstallment", { id: item.id });
            }}
          />
        )}
        ListEmptyComponent={<NoData text="No Data Available" />}
      />

      {isLoading && <Loading />}
    </SafeAreaView>
  );
};

const DetailPackageInstallmentCard = ({
  data,
  onPress,
}: {
  data: IDetailInstallmentMembership;
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
        disabled={!data.is_pay}
        onPress={onPress}>
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            flexShrink: 1,
          }}>
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
          {data.is_pay && (
            <Fragment>
              <Gap width={8} />
              <View
                style={{
                  backgroundColor: colors._blue2,
                  borderRadius: 8,
                }}>
                <Text
                  style={{
                    fontFamily: fonts.primary[400],
                    fontSize: 10,
                    color: colors._white,
                    padding: 4,
                  }}>
                  Pay now
                </Text>
              </View>
            </Fragment>
          )}
        </View>
      </TouchableOpacity>
      <View
        style={{ width: "100%", height: 1, backgroundColor: colors._grey3 }}
      />
    </Fragment>
  );
};
