import { NativeStackScreenProps } from "@react-navigation/native-stack";
import React, { Fragment, useContext, useEffect, useState } from "react";
import {
  FlatList,
  Image,
  SafeAreaView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import Header from "../../components/ui/Header";
import NoData from "../../components/ui/NoData";
import StatusBarComp from "../../components/ui/StatusBarComp";
import { ThemeContext } from "../../contexts/ThemeContext";
import { ISubmissionPackage, ThemeType } from "../../lib/definition";
import { RootStackParamList } from "../../lib/routes";
import { colors, convertToRupiah, fonts } from "../../lib/utils";
import Gap from "../../components/ui/Gap";
import { useIsFocused } from "@react-navigation/native";
import { useDebounce } from "use-debounce";
import { CancelToken } from "axios";
import { fetchSubmissionPackages } from "../../services/membership";
import Loading from "../../components/ui/Loading";

export const SubmissionPackage = ({
  navigation,
}: NativeStackScreenProps<RootStackParamList, "SubmissionPackage">) => {
  const { isDarkMode } = useContext(ThemeContext);

  const [submissionPackages, setSubmissionPackages] = useState<
    ISubmissionPackage[]
  >([]);
  const [isLoading, setIsLoading] = React.useState(false);
  const isFocused = useIsFocused();
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [hasNextPage, setHasNextPage] = useState(true);
  const [debouncedText] = useDebounce(search, 500);

  const getSubmissionPackages = async (
    _page: number,
    _search: string,
    token?: CancelToken,
  ) => {
    setIsLoading(true);
    try {
      const { data, hasNext } = await fetchSubmissionPackages(
        { page: _page, search: _search },
        { cancelToken: token },
      );
      setSubmissionPackages(prev => [...prev, ...data]); // Append for pagination

      setHasNextPage(hasNext);
    } catch (error: any) {
      console.error(error);
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

    getSubmissionPackages(nextPage, debouncedText);
  };

  // Fetch
  useEffect(() => {
    console.log("fetch");
    setPage(1);
    setSubmissionPackages([]);

    getSubmissionPackages(1, debouncedText);
  }, [debouncedText]);

  return (
    <SafeAreaView
      style={{
        flex: 1,
        backgroundColor: isDarkMode ? colors._black2 : colors._white,
      }}>
      <StatusBarComp />
      <Header teks="Submission Package" onPress={() => navigation.goBack()} />

      <View
        style={{
          paddingHorizontal: 20,
          flex: 1,
        }}>
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
            setSubmissionPackages([]);

            getSubmissionPackages(1, debouncedText);
          }}
          onEndReached={handleEndReached}
          data={submissionPackages}
          keyExtractor={(_, index) => index.toString()}
          renderItem={({ item }) => (
            <ListHistoryDetail
              submissionPackage={item}
              onPress={() =>
                navigation.navigate("DetailSubmissionPackage", { id: item.id })
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

const ListHistoryDetail = ({
  submissionPackage,
  onPress,
}: {
  submissionPackage: ISubmissionPackage;
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
          {/* <Image
            source={
              {
                // uri: submissionPackage.image,
              }
            }
            style={{
              width: 50,
              height: 50,
              borderRadius: 50,
              alignSelf: "center",
              borderWidth: 0.5,
              borderColor: isDarkMode ? colors._grey4 : colors._grey3,
            }}
          />
          <Gap width={16} /> */}
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
              {submissionPackage.membership}
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
              {submissionPackage.package_table === "membership"
                ? "Membership"
                : "Personal Trainer"}
            </Text>
            <Gap height={4} />
            <Text
              style={{
                fontFamily: fonts.primary[300],
                fontSize: 8,
                color: isDarkMode ? colors._white : colors._black,
              }}
              numberOfLines={2}>
              {submissionPackage.payment_order_code}
            </Text>
          </View>
        </View>
        <View
          style={{
            flexDirection: "column",
            alignItems: "flex-end",
            justifyContent: "space-between",
            width: 120,
          }}>
          <View
            style={{
              backgroundColor:
                submissionPackage.status.toLowerCase() === "installment"
                  ? colors._gold4
                  : colors._blue2,
              borderRadius: 8,
            }}>
            <Text
              style={{
                fontFamily: fonts.primary[400],
                fontSize: 10,
                color: colors._white,
                padding: 4,
              }}>
              {submissionPackage.status}
            </Text>
          </View>
          <Gap height={8} />
          <Text
            style={{
              fontFamily: fonts.primary[400],
              fontSize: 12,
              color: isDarkMode ? colors._white : colors._black,
            }}
            numberOfLines={2}>
            {submissionPackage.expired_at}
          </Text>
          <Gap height={4} />
          <Text
            style={{
              fontFamily: fonts.primary[300],
              fontSize: 8,
              color: isDarkMode ? colors._white : colors._black,
            }}>
            {submissionPackage.payment_date}
          </Text>
        </View>
      </TouchableOpacity>
      <View
        style={{ width: "100%", height: 1, backgroundColor: colors._grey3 }}
      />
    </Fragment>
  );
};
