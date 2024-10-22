import { NativeStackScreenProps } from "@react-navigation/native-stack";
import React, { useContext, useEffect } from "react";
import { SafeAreaView, ScrollView, Text, View } from "react-native";
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

      {packageInstallment.length === 0 ? (
        <NoData text="No Data Available" />
      ) : (
        <ScrollView>
          {packageInstallment.map((data: IDetailInstallmentMembership) => {
            return <DetailPackageInstallmentCard key={data.id} data={data} />;
          })}
        </ScrollView>
      )}

      {isLoading && <Loading />}
    </SafeAreaView>
  );
};

const DetailPackageInstallmentCard = ({
  data,
}: {
  data: IDetailInstallmentMembership;
}) => {
  const { isDarkMode } = useContext(ThemeContext);

  return (
    <View
      style={{
        padding: 16,
        backgroundColor: colors._backBlue,
        marginHorizontal: 24,
        borderRadius: 8,
        elevation: 2,
        marginBottom: 8,
      }}>
      <View
        style={{
          flex: 1,
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "flex-end",
        }}>
        <Text
          style={{
            fontFamily: fonts.primary[600],
            fontSize: 20,
            color: isDarkMode ? colors._white : colors._black,
          }}>
          Installment {data.installment_number}
        </Text>
        <Text
          style={{
            fontFamily: fonts.primary[400],
            fontSize: 24,
            color: isDarkMode ? colors._white : colors._black,
          }}>
          {convertToRupiah(data.total.toString())}
        </Text>
      </View>
      <Gap height={4} />
      <View
        style={{
          flex: 1,
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "flex-end",
        }}>
        <Text
          style={{
            fontFamily: fonts.primary[400],
            fontSize: 14,
            color: isDarkMode ? colors._white : colors._black,
          }}>
          Due: {data.due_date}
        </Text>
        <Text
          style={{
            fontFamily: fonts.primary[400],
            fontSize: 14,
            color: isDarkMode ? colors._white : colors._black,
          }}>
          {data.status}
        </Text>
      </View>
      {/* <Text
        style={{
          fontFamily: fonts.primary[400],
          fontSize: 14,
          color: isDarkMode ? colors._white : colors._black,
        }}>
        {data.is_pay ? 'Paid' : 'Not Paid'}
      </Text>
      <Text
        style={{
          fontFamily: fonts.primary[400],
          fontSize: 14,
          color: isDarkMode ? colors._white : colors._black,
        }}>
        {data.is_reminder ? 'Reminder' : 'Not Reminder'}
      </Text>
       */}
    </View>
  );
};
