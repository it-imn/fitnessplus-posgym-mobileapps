import { NativeStackScreenProps } from "@react-navigation/native-stack";
import React, { useContext, useEffect } from "react";
import {
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
import { IInstallmentMembership, ThemeType } from "../../lib/definition";
import { RootStackParamList } from "../../lib/routes";
import { colors, convertToRupiah, fonts } from "../../lib/utils";
import { fetchInstallmentsMembership } from "../../services/installment";
import { showMessage } from "react-native-flash-message";

export const InstallmentPackage = ({
  navigation,
}: NativeStackScreenProps<RootStackParamList, "InstallmentPackage">) => {
  const { isDarkMode } = useContext(ThemeContext);
  const [isLoading, setIsLoading] = React.useState<boolean>(false);
  const [packages, setPackages] = React.useState<IInstallmentMembership[]>([]);

  const getInstallments = async () => {
    setIsLoading(true);
    try {
      const { data } = await fetchInstallmentsMembership();
      if (data) {
        setPackages(data);
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
    getInstallments();
  }, []);

  return (
    <SafeAreaView
      style={{
        flex: 1,
        backgroundColor: isDarkMode ? colors._black2 : colors._white,
      }}>
      <StatusBarComp />
      <Header teks="Installment Package" onPress={() => navigation.goBack()} />

      {packages.length === 0 ? (
        <View
          style={{
            flex: 1,
            alignContent: "center",
            justifyContent: "center",
          }}>
          <NoData text="No Data Available" />
        </View>
      ) : (
        <ScrollView
          style={{
            paddingHorizontal: 24,
          }}>
          {packages.map((packageInstallment: IInstallmentMembership) => {
            return (
              <PackageCard
                packageInstallment={packageInstallment}
                onPress={() =>
                  navigation.navigate("DetailInstallmentPackage", {
                    id: packageInstallment.payment_id,
                  })
                }
              />
            );
          })}
        </ScrollView>
      )}

      {isLoading && <Loading />}
    </SafeAreaView>
  );
};

const PackageCard = ({
  packageInstallment,
  onPress,
}: {
  packageInstallment: IInstallmentMembership;
  onPress: () => void;
}) => {
  const { isDarkMode } = useContext(ThemeContext);
  return (
    <TouchableOpacity
      onPress={onPress}
      style={{
        backgroundColor: isDarkMode ? colors._black : colors._grey2,
        flexDirection: "column",
        gap: 8,
        borderRadius: 16,
        // borderColor:
        //   cancelClassId === classHistory.id ? colors._green : colors._grey2,
        borderWidth: 2,
        padding: 16,
        marginBottom: 8,
      }}>
      <View style={{ backgroundColor: colors._backBlue }}>
        <Text
          style={{
            color: colors._black2,
            fontFamily: fonts.primary[600],
            fontSize: 16,
          }}>
          {packageInstallment.package_name}
        </Text>
        <Gap height={4} />
        <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
          <View>
            <Text
              style={{
                color: colors._grey,
                fontFamily: fonts.primary[400],
                fontSize: 12,
              }}>
              Next Bill
            </Text>
            <Text
              style={{
                color: colors._black2,
                fontFamily: fonts.primary[600],
                fontSize: 14,
              }}>
              {convertToRupiah(packageInstallment.next_bill.toString())}
            </Text>
          </View>
          <View>
            <Text
              style={{
                color: colors._red,
                fontFamily: fonts.primary[400],
                fontSize: 12,
                textAlign: "right",
              }}>
              Due Date
            </Text>
            <Text
              style={{
                color: colors._red,
                fontFamily: fonts.primary[600],
                fontSize: 14,
              }}>
              {convertToRupiah(packageInstallment.next_bill.toString())}
            </Text>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );
};
