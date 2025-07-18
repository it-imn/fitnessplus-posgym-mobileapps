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
import { AlarmClockIcon } from "lucide-react-native";
import { useInstallmentStore } from "../../stores/useInstallmentStore";
import { useIsFocused } from "@react-navigation/native";

export const InstallmentPackage = ({
  navigation,
}: NativeStackScreenProps<RootStackParamList, "InstallmentPackage">) => {
  const { isDarkMode } = useContext(ThemeContext);
  const [isLoading, setIsLoading] = React.useState<boolean>(false);
  const [packages, setPackages] = React.useState<IInstallmentMembership[]>([]);
  const isFocused = useIsFocused();

  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [hasNextPage, setHasNextPage] = useState(true);
  const [debouncedText] = useDebounce(search, 500);

  const { reset } = useInstallmentStore();

  const getInstallments = async (
    _page: number,
    _search: string,
    signal: AbortSignal
  ) => {
    setIsLoading(true);
    try {
      const { data, hasNext } = await fetchInstallmentsMembership(
        { page: _page, search: _search },
        { signal },
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

    const ctrl = new AbortController();
    getInstallments(nextPage, debouncedText, ctrl.signal);
  };

  // Fetch
  useEffect(() => {
    console.log("fetch");
    setPage(1);
    setPackages([]);

    const ctrl = new AbortController();
    getInstallments(1, debouncedText, ctrl.signal);
    return () => {
      ctrl.abort();
    };
  }, [debouncedText, isFocused]);

  return (
    <SafeAreaView
      style={{
        flex: 1,
        backgroundColor: isDarkMode ? colors._black2 : colors._white,
      }}>
      <StatusBarComp />
      <Header teks="Installment Package" onPress={() => navigation.goBack()} />

      <View style={{ flex: 1 }}>
        <TextInput
          onChangeText={handleSearchChange}
          value={search}
          placeholder="Search"
          placeholderTextColor={colors._grey4}
          style={{
            marginHorizontal: 20,
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

            const ctrl = new AbortController();
            getInstallments(1, debouncedText, ctrl.signal);
          }}
          onEndReached={handleEndReached}
          data={packages}
          keyExtractor={(_, index) => index.toString()}
          renderItem={({ item }) => (
            <PackageCard
              packageInstallment={item}
              onPress={() => {
                reset();
                
                navigation.navigate("DetailInstallmentPackage", {
                  id: item.payment_id,
                });
              }}
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
          marginHorizontal: 20,
          marginBottom: 16,
          backgroundColor: isDarkMode ? colors._black : colors._white,
          shadowColor: colors._black,
          shadowOffset: {
            width: 0,
            height: 2,
          },
          shadowOpacity: 0.1,
          shadowRadius: 3.84,
          elevation: 2,
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
          <View
            style={{
              flexDirection: "row",
              justifyContent: "center",
              borderRadius: 8,
              backgroundColor: colors._blue2,
              paddingHorizontal: 8,
              paddingVertical: 4,
            }}>
            <Text
              style={{
                fontFamily: fonts.primary[300],
                fontSize: 14,
                color: colors._white,
              }}
              numberOfLines={2}>
              {packageInstallment.installment_number === 1
                ? "1st"
                : packageInstallment.installment_number === 2
                ? "2nd"
                : packageInstallment.installment_number === 3
                ? "3rd"
                : packageInstallment.installment_number + "th"}
            </Text>
          </View>
          <Gap height={4} />

          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
            }}>
            <AlarmClockIcon size={16} color={colors._red} />
            <Gap width={4} />
            <Text
              style={{
                fontFamily: fonts.primary[300],
                fontSize: 14,
                color: colors._red,
              }}>
              {packageInstallment.due_date}
            </Text>
          </View>
        </View>
      </TouchableOpacity>
      {/* <View
        style={{ width: "100%", height: 1, backgroundColor: colors._grey3 }}
      /> */}
    </Fragment>
  );
};
