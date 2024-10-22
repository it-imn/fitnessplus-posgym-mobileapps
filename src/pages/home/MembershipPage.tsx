import React, { useEffect } from "react";
import {
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleProp,
  StyleSheet,
  Text,
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

const Membership = ({ navigation }: any) => {
  const [isLoading, setIsLoading] = React.useState<boolean>(false);
  const [packages, setPackages] = React.useState<IMembershipPackage[]>([]);
  const [search, setSearch] = React.useState("");
  const [debouncedText] = useDebounce(search, 500);

  const getPackage = async (token: CancelToken) => {
    setIsLoading(true);
    try {
      console.log("debouncedText", debouncedText);
      const { data } = await fetchMembershipPackages(token, debouncedText);
      if (data) {
        setPackages(data);
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

  useEffect(() => {
    const source = axios.CancelToken.source();

    getPackage(source.token);

    return () => {
      source.cancel("Cancelling in cleanup");
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [debouncedText]);

  return (
    <LinearGradient
      colors={[colors._green2, colors._blue2]}
      start={{ x: 0, y: 1 }}
      end={{ x: 1, y: 0 }}
      style={styles.container}>
      <SafeAreaView style={{ flex: 1 }}>
        <StatusBar
          barStyle="dark-content"
          hidden={false}
          backgroundColor={colors._blue2}
          translucent={false}
        />
        <Header teks="Membership" onPress={() => navigation.goBack()} />
        <View style={{ flex: 1, paddingHorizontal: 20 }}>
          <Input
            placeholder="Search Membership"
            value={search}
            onChangeText={setSearch}
          />
          <Gap height={16} />
          <ScrollView showsVerticalScrollIndicator={false}>
            {packages.map((data: IMembershipPackage) => {
              return (
                <ItemMember
                  key={data.id}
                  membershipPackage={data}
                  onPress={() =>
                    navigation.navigate("MembershipDetail", { id: data.id })
                  }
                />
              );
            })}
          </ScrollView>
        </View>
        {isLoading && <Loading />}
      </SafeAreaView>
    </LinearGradient>
  );
};

const ItemMember = ({
  membershipPackage,
  onPress,
}: {
  membershipPackage: IMembershipPackage;
  onPress: () => void;
}) => {
  return (
    <TouchableOpacity style={styles.containerItemMember} onPress={onPress}>
      <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
        <Text style={styles.namePackage}>{membershipPackage.name}</Text>
        {membershipPackage.discount_value !== 0 && (
          <View style={styles.cardDisc}>
            <Text style={styles.text2}>
              {membershipPackage.discount_percent
                ? `${membershipPackage.discount_value} %`
                : convertToRupiah(membershipPackage.discount_value.toString())}
            </Text>
          </View>
        )}
      </View>
      <View style={{ paddingHorizontal: 12, paddingBottom: 12 }}>
        <Gap height={8} />
        <View style={{ flexDirection: "row", alignItems: "center" }}>
          {membershipPackage.price !== membershipPackage.total_price && (
            <>
              <Text style={styles.text4}>
                {convertToRupiah(membershipPackage.price.toString())}
              </Text>
              <Gap width={4} />
            </>
          )}
          <Text style={styles.textPrice}>
            {convertToRupiah(membershipPackage.total_price.toString())}
          </Text>
        </View>
        <Gap height={8} />
        <Text style={styles.text3}>{membershipPackage.periode} days</Text>
        <View style={{ flexDirection: "row", alignItems: "center" }}>
          {membershipPackage.dp_price_disc === 0 &&
          membershipPackage.dp_discount === 0 ? (
            <></>
          ) : (
            <View style={styles.dpSec}>
              <Text style={styles.text}>
                {membershipPackage.dp_price_disc === 0
                  ? `${membershipPackage.dp_discount}%`
                  : convertToRupiah(
                      membershipPackage.dp_price_disc.toString(),
                    )}{" "}
                Dp Available
              </Text>
            </View>
          )}
          {/* <Gap width={10} />
                    <View style={styles.ptFree}>
                        <Text style={styles.text}>Free PT</Text>
                    </View> */}
        </View>
        <Gap height={8} />
        <Button teks="Join Now" onPress={onPress} />
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
