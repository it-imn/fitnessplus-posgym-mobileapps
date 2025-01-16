import { NativeStackScreenProps } from "@react-navigation/native-stack";
import React, { useContext, useEffect, useState } from "react";
import {
  FlatList,
  SafeAreaView,
  ScrollView,
  StyleProp,
  Text,
  TouchableOpacity,
  View,
  ViewStyle,
} from "react-native";
import Header from "../../components/ui/Header";
import StatusBarComp from "../../components/ui/StatusBarComp";
import { ThemeContext } from "../../contexts/ThemeContext";
import { IPTPackage } from "../../lib/definition";
import { RootStackParamList } from "../../lib/routes";
import { colors, convertToRupiah, fonts } from "../../lib/utils";
import { fetchPersonalTrainerPackage } from "../../services/personal_trainer";
import { showMessage } from "react-native-flash-message";
import Gap from "../../components/ui/Gap";
import { useDebounce } from "use-debounce";
import { CancelToken } from "axios";
import NoData from "../../components/ui/NoData";
import Loading from "../../components/ui/Loading";
import { usePaymentStore } from "../../stores/usePaymentStore";

const PackageTrainer = ({
  navigation,
  route,
}: NativeStackScreenProps<RootStackParamList, "PackageTrainer">) => {
  const { id } = route.params;
  const { isDarkMode } = useContext(ThemeContext);
  const [packages, setPackages] = useState<IPTPackage[]>([]);

  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [hasNextPage, setHasNextPage] = useState(true);
  const [debouncedText] = useDebounce(search, 500);

  const { reset } = usePaymentStore();

  const [isLoading, setIsLoading] = useState(false);

  const getPackage = async (
    _page: number,
    _search: string,
    token?: CancelToken,
  ) => {
    setIsLoading(true);
    try {
      const { data, hasNext } = await fetchPersonalTrainerPackage(
        id,
        { page: _page, search: _search },
        { cancelToken: token },
      );
      if (data) {
        setPackages(prev => [...prev, ...data]);

        setHasNextPage(hasNext);
      }
    } catch (err: any) {
      showMessage({
        message: err.message || "An error occurred",
        type: "warning",
        color: colors._white,
        icon: "warning",
        backgroundColor: colors._red,
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

    getPackage(nextPage, debouncedText);
  };

  // Fetch
  useEffect(() => {
    console.log("fetch");
    setPage(1);
    setPackages([]);

    getPackage(1, debouncedText);
  }, [debouncedText]);

  return (
    <SafeAreaView style={styles.container(isDarkMode)}>
      <StatusBarComp />
      <Header teks="Package PT" onPress={() => navigation.goBack()} />
      <View style={{ paddingHorizontal: 24, flex: 1 }}>
        <FlatList
          refreshing={isLoading}
          onRefresh={() => {
            console.log("refresh");
            setPage(1);
            setPackages([]);

            getPackage(1, debouncedText);
          }}
          onEndReached={handleEndReached}
          data={packages}
          keyExtractor={(_, index) => index.toString()}
          renderItem={({ item }) => (
            <CardPackageTrainer
              key={item.id}
              packagePT={item}
              onPress={() => {
                reset();

                navigation.navigate("DetailPackageTrainer", {
                  id: item.id,
                  pt_id: id,
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

const CardPackageTrainer = ({
  packagePT,
  onPress,
}: {
  packagePT: IPTPackage;
  onPress: () => void;
}) => {
  const { isDarkMode } = useContext(ThemeContext);
  return (
    <TouchableOpacity
      style={styles.containerCardPackageTrainer(isDarkMode)}
      onPress={onPress}>
      <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
        <Text style={styles.teks(isDarkMode)}>{packagePT.package_name}</Text>
        {packagePT.down_payment && packagePT.dp_discount !== 0 && (
          <View style={styles.canDp}>
            <Text style={styles.teks6}>
              {`${packagePT.dp_discount}% DP Available`}
            </Text>
          </View>
        )}
        {packagePT.down_payment && packagePT.dp_price_disc !== 0 && (
          <View style={styles.canDp}>
            <Text style={styles.teks6}>
              {`${convertToRupiah(
                packagePT.dp_price_disc.toString(),
              )} DP Available`}
            </Text>
          </View>
        )}
        {!packagePT.down_payment && packagePT.discount !== 0 && (
          <View style={styles.canDp}>
            <Text style={styles.teks6}>{`Disc ${packagePT.discount}%`}</Text>
          </View>
        )}
        {!packagePT.down_payment && packagePT.price_disc !== 0 && (
          <View style={styles.canDp}>
            <Text style={styles.teks6}>
              {convertToRupiah(packagePT.price_disc.toString())}
            </Text>
          </View>
        )}
      </View>
      <Gap height={4} />
      <Text style={styles.teks2(isDarkMode)}>
        {convertToRupiah(packagePT.total.toString())}
      </Text>
      <Gap height={8} />
      {/* <Text style={styles.teks3(isDarkMode)}>
        {`${
          session_pt_two == null
            ? session
            : parseInt(session, 10) + parseInt(session_pt_two, 10)
        } session`}{' '}
        Session / Take Action
      </Text>
      <Gap height={4} /> */}
      <Text style={styles.teks3(isDarkMode)}>{packagePT.period} Days - {packagePT.session} Sessions</Text>
      {/* {
                aditional_feature == "split_pt" &&
                <>
                    <Gap height={12} />
                    <Text style={styles.teks4}>Split PT {pt_two_name}</Text>
                </>
            } */}
      <Gap height={4} />
      {/* {dp_discount !== '0' && (
        <Text style={styles.teks5}>{dp_discount}% DP Available</Text>
      )}
      {dp_price_disc !== '0' && (
        <Text style={styles.teks5}>
          {convertToRupiah(dp_price_disc)} DP Available
        </Text>
      )}
      <Gap height={12} /> */}
    </TouchableOpacity>
  );
};

const styles = {
  containerCardPackageTrainer: (theme: boolean) => ({
    backgroundColor: theme === true ? colors._black : colors._grey2,
    borderRadius: 16,
    marginBottom: 8,
  }),
  teks: (theme: boolean) =>
    ({
      fontSize: 16,
      fontFamily: fonts.primary[400],
      color: theme === true ? colors._grey2 : colors._black,
      marginTop: 12,
      marginLeft: 12,
      maxWidth: "60%",
    } as StyleProp<ViewStyle>),
  teks2: (theme: boolean) => ({
    fontSize: 24,
    fontFamily: fonts.primary[200],
    color: theme === true ? colors._grey2 : colors._black,
    marginLeft: 12,
  }),
  teks3: (theme: boolean) => ({
    fontSize: 12,
    fontFamily: fonts.primary[300],
    color: theme === true ? colors._grey2 : colors._black,
    marginLeft: 12,
  }),
  teks4: {
    fontSize: 12,
    fontFamily: fonts.primary[300],
    color: colors._grey2,
    marginLeft: 12,
  },
  teks5: {
    fontSize: 12,
    fontFamily: fonts.primary[400],
    color: colors._green,
    marginLeft: 12,
  },
  teks6: {
    fontSize: 12,
    fontFamily: fonts.primary[400],
    color: colors._grey2,
    marginLeft: 12,
  },
  canDp: {
    padding: 8,
    backgroundColor: colors._blue2,
    borderBottomLeftRadius: 16,
    borderTopRightRadius: 16,
    alignItems: "center",
    justifyContent: "center",
    height: 32,
  } as StyleProp<ViewStyle>,
  container: (isDarkMode: boolean) => ({
    flex: 1,
    backgroundColor: isDarkMode ? colors._black2 : colors._white,
  }),
};

export default PackageTrainer;
