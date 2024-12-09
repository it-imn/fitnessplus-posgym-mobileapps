import { NativeStackScreenProps } from "@react-navigation/native-stack";
import React, { Fragment, useContext, useEffect, useState } from "react";
import {
  FlatList,
  SafeAreaView,
  ScrollView,
  Text,
  TextInput,
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
import { useDebounce } from "use-debounce";
import { CancelToken } from "axios";
import { AlarmClockIcon } from "lucide-react-native";

export const InstallmentPackage = ({
  navigation,
}: NativeStackScreenProps<RootStackParamList, "InstallmentPackage">) => {
  const { isDarkMode } = useContext(ThemeContext);
  const [isLoading, setIsLoading] = React.useState<boolean>(false);
  const [packages, setPackages] = React.useState<IInstallmentMembership[]>([]);

  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [hasNextPage, setHasNextPage] = useState(true);
  const [debouncedText] = useDebounce(search, 500);

  const getInstallments = async (
    _page: number,
    _search: string,
    token?: CancelToken,
  ) => {
    setIsLoading(true);
    try {
      const { data, hasNext } = await fetchInstallmentsMembership(
        { page: _page, search: _search },
        { cancelToken: token },
      );
      if (data) {
        setPackages(prev => [...prev, ...data]);

        setHasNextPage(hasNext);
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

  // Handle search input change directly
  const handleSearchChange = (text: string) => {
    console.log("search");
    setSearch(text);
  };

  // Handle pagination when reaching the end of the list
  const handleEndReached = async () => {
    if (!hasNextPage || isLoading) return;

    const nextPage = page + 1;
    setPage(nextPage);

    getInstallments(nextPage, debouncedText);
  };

  // Fetch
  useEffect(() => {
    console.log("fetch");
    setPage(1);
    setPackages([]);

    getInstallments(1, debouncedText);
  }, [debouncedText]);

  return (
    <SafeAreaView
      style={{
        flex: 1,
        backgroundColor: isDarkMode ? colors._black2 : colors._white,
      }}>
      <StatusBarComp />
      <Header teks="Installment Package" onPress={() => navigation.goBack()} />

      <View style={{ paddingHorizontal: 20, flex: 1 }}>
        <TextInput
          onChangeText={handleSearchChange}
          value={search}
          placeholder="Search"
          placeholderTextColor={colors._grey4}
          style={{
            padding: 12,
            fontSize: 13,
            fontFamily: fonts.primary[300],
            backgroundColor: isDarkMode ? colors._black : colors._grey2,
            borderRadius: 10,
            color: isDarkMode ? colors._white : colors._black,
            borderWidth: 0.5,
            borderColor: isDarkMode ? colors._grey4 : colors._grey3,
          }}
        />
        <Gap height={24} />
        <FlatList
          refreshing={isLoading}
          onRefresh={() => {
            console.log("refresh");
            setPage(1);
            setPackages([]);

            getInstallments(1, debouncedText);
          }}
          onEndReached={handleEndReached}
          data={packages}
          keyExtractor={(_, index) => index.toString()}
          renderItem={({ item }) => (
            <PackageCard
              packageInstallment={item}
              onPress={() =>
                navigation.navigate("DetailInstallmentPackage", {
                  id: item.payment_id,
                })
              }
            />
          )}
          ListEmptyComponent={<NoData text="No Data Available" />}
        />
      </View>

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
              {packageInstallment.package_name}
            </Text>
            <Gap height={4} />
            <Text
              style={{
                fontFamily: fonts.primary[300],
                fontSize: 14,
                color: isDarkMode ? colors._white : colors._black,
              }}
              numberOfLines={2}>
              {convertToRupiah(packageInstallment.next_bill.toString() || "0")}
            </Text>
            <Gap height={4} />
            <Text
              style={{
                fontFamily: fonts.primary[300],
                fontSize: 8,
                color: isDarkMode ? colors._white : colors._black,
              }}
              numberOfLines={2}>
              {packageInstallment.order_code}
            </Text>
          </View>
        </View>
        <View
          style={{
            flexDirection: "column",
            alignItems: "flex-end",
            justifyContent: "space-between",
            alignSelf: "flex-end",
            width: 120,
          }}>
          <View style={{ flexDirection: "row", justifyContent: "center" }}>
            <AlarmClockIcon size={16} color={colors._gold3} />
            <Gap width={4} />
            <Text
              style={{
                fontFamily: fonts.primary[300],
                fontSize: 14,
                color: isDarkMode ? colors._white : colors._black,
              }}
              numberOfLines={2}>
              Installment {packageInstallment.installment_number}
            </Text>
          </View>
          <Gap height={4} />
          <Text
            style={{
              fontFamily: fonts.primary[300],
              fontSize: 14,
              color: colors._red,
            }}>
            {packageInstallment.due_date}
          </Text>
        </View>
      </TouchableOpacity>
      <View
        style={{ width: "100%", height: 1, backgroundColor: colors._grey3 }}
      />
    </Fragment>
  );
};
