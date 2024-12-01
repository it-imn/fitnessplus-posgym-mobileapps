import { NativeStackScreenProps } from "@react-navigation/native-stack";
import React, { useContext, useEffect, useState } from "react";
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
              {packageInstallment.due_date}
            </Text>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );
};
