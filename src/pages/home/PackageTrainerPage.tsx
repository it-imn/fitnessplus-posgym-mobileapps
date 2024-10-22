import { NativeStackScreenProps } from "@react-navigation/native-stack";
import React, { useContext, useEffect, useState } from "react";
import {
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

const PackageTrainer = ({
  navigation,
  route,
}: NativeStackScreenProps<RootStackParamList, "PackageTrainer">) => {
  const { id } = route.params;
  const { isDarkMode } = useContext(ThemeContext);
  const [packages, setPackages] = useState<IPTPackage[]>([]);

  const getPackage = async () => {
    try {
      const { data } = await fetchPersonalTrainerPackage(id);
      if (data) {
        setPackages(data);
      }
    } catch (err: any) {
      showMessage({
        message: err.message || "An error occurred",
        type: "warning",
        color: colors._white,
        icon: "warning",
        backgroundColor: colors._red,
      });
    }
  };

  useEffect(() => {
    getPackage();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <SafeAreaView style={styles.container(isDarkMode)}>
      <StatusBarComp />
      <Header teks="Package PT" onPress={() => navigation.goBack()} />
      <ScrollView style={{ paddingHorizontal: 24 }}>
        {packages.map((packagePT: IPTPackage) => {
          return (
            <CardPackageTrainer
              key={packagePT.id}
              packagePT={packagePT}
              onPress={() =>
                navigation.navigate("DetailPackageTrainer", {
                  id: packagePT.id,
                  pt_id: id,
                })
              }
              // aditional_feature={data.aditional_feature}
              // down_payment={data.down_payment}
              // pt_two_name={data.pt_two_name}
              //   onPress={() => gotoDetail(package.id)}
            />
          );
        })}
      </ScrollView>
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
      <Text style={styles.teks3(isDarkMode)}>{packagePT.period} Days</Text>
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
