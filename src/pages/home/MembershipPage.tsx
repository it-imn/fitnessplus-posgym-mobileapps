import React, { useContext, useEffect, useState } from "react";
import {
  FlatList,
  Image,
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleProp,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  ViewStyle,
} from "react-native";
import LinearGradient from "react-native-linear-gradient";
import { useDebounce } from "use-debounce";
import axios, { CancelToken } from "axios";
import Header from "../../components/ui/Header";
import Gap from "../../components/ui/Gap";
import { Input } from "../../components/ui/Input";
import Loading from "../../components/ui/Loading";
import { IMembershipPackage } from "../../lib/definition";
import { colors, convertToRupiah, fonts } from "../../lib/utils";
import { fetchMembershipPackages } from "../../services/membership";
import { showMessage } from "react-native-flash-message";
import { Button } from "../../components/ui/Button";
import { ThemeContext } from "../../contexts/ThemeContext";
import StatusBarComp from "../../components/ui/StatusBarComp";
import NoData from "../../components/ui/NoData";
import { usePaymentStore } from "../../stores/usePaymentStore";

const Membership = ({ navigation }: any) => {
  const [isLoading, setIsLoading] = React.useState<boolean>(false);
  const [packages, setPackages] = React.useState<IMembershipPackage[]>([]);
  const [search, setSearch] = React.useState("");
  const [debouncedText] = useDebounce(search, 500);
  const [page, setPage] = useState(1);
  const [hasNextPage, setHasNextPage] = useState(true);
  const { isDarkMode } = useContext(ThemeContext);
  const { reset } = usePaymentStore();

  const getPackage = async (
    _page: number,
    _search: string,
    token?: CancelToken,
  ) => {
    setIsLoading(true);
    try {
      const { data, hasNext } = await fetchMembershipPackages(
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
    <SafeAreaView
      style={{
        flex: 1,
        backgroundColor: isDarkMode ? colors._black2 : colors._white,
      }}>
      <StatusBarComp />
      <Header teks="Membership" onPress={() => navigation.goBack()} />
      <View style={{ paddingHorizontal: 20, flex: 1 }}>
        <TextInput
          onChangeText={handleSearchChange}
          value={search}
          placeholder={"Search membership"}
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
        <Gap height={16} />
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
          renderItem={({ item: membership }) => (
            <MembershipCard
              {...membership}
              onPress={() => {
                reset();
                navigation.navigate("MembershipDetail", {
                  id: membership.id,
                });
              }}
            />
          )}
          keyExtractor={item => item.id.toString()}
          ListEmptyComponent={<NoData text="No Data Available" />}
        />
      </View>
      {isLoading && <Loading />}
    </SafeAreaView>
  );
};

const MembershipCard = ({
  name,
  image,
  discount_value,
  discount_percent,
  price,
  total_price,
  periode,
  dp_price_disc,
  dp_discount,
  onPress,
}: {
  name: string;
  image: string;
  discount_value: number;
  discount_percent: number;
  price: number;
  total_price: number;
  periode: string;
  dp_price_disc: number;
  dp_discount: number;
  onPress: () => void;
}) => {
  const { isDarkMode } = useContext(ThemeContext);

  return (
    <TouchableOpacity
      style={{
        padding: 12,
        borderRadius: 12,
        backgroundColor: isDarkMode ? colors._black : colors._grey2,
        marginBottom: 10,
        marginHorizontal: 4,
        flexDirection: "row",
        justifyContent: "space-between",
      }}
      onPress={onPress}>
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          flexShrink: 1,
        }}>
        <Image
          source={{
            uri: image,
          }}
          style={{
            width: 50,
            height: 50,
            alignSelf: "center",
            borderRadius: 4,
          }}
        />
        <Gap width={12} />
        <View
          style={{
            flexShrink: 1,
          }}>
          <View style={{ flexDirection: "row", alignItems: "center" }}>
            {price !== total_price && (
              <>
                <Text
                  style={{
                    fontFamily: fonts.primary[300],
                    fontSize: 12,
                    color: isDarkMode ? colors._white : colors._black,
                    textDecorationLine: "line-through",
                  }}>
                  {convertToRupiah(price.toString())}
                </Text>
                <Gap width={4} />
              </>
            )}
            <Text
              style={{
                fontFamily: fonts.primary[400],
                fontSize: 14,
                color: isDarkMode ? colors._white : colors._black,
              }}>
              {convertToRupiah(total_price.toString())}
            </Text>
          </View>
          <Gap height={8} />
          <Text
            style={{
              fontFamily: fonts.primary[400],
              fontSize: 14,
              color: isDarkMode ? colors._white : colors._black,
            }}
            numberOfLines={2}>
            {name}
          </Text>
          <Gap height={8} />
          <View style={{ flexDirection: "row", alignItems: "center" }}>
            {dp_price_disc === 0 && dp_discount === 0 ? (
              <></>
            ) : (
              <View
                style={{
                  backgroundColor: colors._blue2,
                  padding: 8,
                  borderRadius: 12,
                }}>
                <Text
                  style={{
                    fontFamily: fonts.primary[400],
                    fontSize: 12,
                    color: isDarkMode ? colors._white : colors._black,
                  }}>
                  {dp_price_disc === 0
                    ? `${dp_discount}%`
                    : convertToRupiah(dp_price_disc.toString())}{" "}
                  Dp Available
                </Text>
              </View>
            )}
          </View>
        </View>
      </View>
      <View
        style={{
          justifyContent: "center",
        }}>
        <Text
          style={{
            fontFamily: fonts.primary[400],
            fontSize: 12,
            color: isDarkMode ? colors._white : colors._black,
          }}>
          {periode}
        </Text>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    position: "absolute",
    height: "100%",
    width: "100%",
  },
  containerItemMember: {
    marginBottom: 8,
    backgroundColor: colors._black3,
    borderRadius: 12,
    opacity: 0.8,
  },
  namePackage: {
    fontFamily: fonts.primary[400],
    fontSize: 16,
    color: colors._white,
    padding: 12,
    maxWidth: "70%",
  },
  text3: {
    fontFamily: fonts.primary[300],
    fontSize: 14,
    color: colors._white,
  },
  text4: {
    fontFamily: fonts.primary[300],
    fontSize: 14,
    color: colors._white,
    textDecorationLine: "line-through",
  },
  textPrice: {
    fontFamily: fonts.primary[400],
    fontSize: 18,
    color: colors._white,
  },
  dpSec: {
    backgroundColor: colors._blue2,
    padding: 8,
    borderRadius: 12,
    marginTop: 12,
  },
  text: {
    fontFamily: fonts.primary[400],
    fontSize: 12,
    color: colors._white,
  },
  text2: {
    fontFamily: fonts.primary[400],
    fontSize: 12,
    color: colors._white,
  },
  ptFree: {
    backgroundColor: colors._yellow,
    padding: 8,
    width: "24%",
    borderRadius: 12,
  },
  cardDisc: {
    padding: 8,
    backgroundColor: colors._blue2,
    borderBottomLeftRadius: 12,
    borderTopRightRadius: 12,
    alignItems: "center",
    justifyContent: "center",
  },
});

export default Membership;
