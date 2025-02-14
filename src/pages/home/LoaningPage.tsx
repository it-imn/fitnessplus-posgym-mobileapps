import { Picker } from "@react-native-picker/picker";
import React, { useContext, useEffect, useState } from "react";
import {
  SafeAreaView,
  ScrollView,
  StyleProp,
  Text,
  View,
  ViewStyle,
} from "react-native";
import { fetchFacilites, loanFacility } from "../../services/branch";
import { checkIn } from "../../services/member";
import BouncyCheckbox from "react-native-bouncy-checkbox";
import { BottomTabScreenProps } from "@react-navigation/bottom-tabs";
import { CompositeScreenProps } from "@react-navigation/native";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import Header from "../../components/ui/Header";
import { errorModal } from "../../components/Modal";
import Gap from "../../components/ui/Gap";
import { Input } from "../../components/ui/Input";
import StatusBarComp from "../../components/ui/StatusBarComp";
import { ThemeContext } from "../../contexts/ThemeContext";
import { IFacility } from "../../lib/definition";
import { RootStackParamList, TabParamList } from "../../lib/routes";
import { colors, fonts } from "../../lib/utils";
import { showMessage } from "react-native-flash-message";
import { Button, ButtonColor } from "../../components/ui/Button";
import Loading from "../../components/ui/Loading";

type TGuarantee = "None" | "ID Card" | "Driver License" | "Passport" | "Other";

const Loaning = ({
  navigation,
  route,
}: CompositeScreenProps<
  NativeStackScreenProps<RootStackParamList, "Loaning">,
  BottomTabScreenProps<TabParamList, "Home">
>) => {
  const { isDarkMode } = useContext(ThemeContext);
  const [isLoading, setIsLoading] = useState(false);
  const { code } = route.params;
  const [smallTowel, setSmallTowel] = useState<IFacility>({} as IFacility);
  const [largeTowel, setlargeTowel] = useState<IFacility>({} as IFacility);
  const [locker, setLocker] = useState<IFacility>({} as IFacility);
  const [isSelectSmallTowel, setIsSelectSmallTowel] = useState(false);
  const [smallTowelLockerNumber, setSmallTowelLockerNumber] = useState(0);
  const [isSelectLargeTowel, setIsSelectLargeTowel] = useState(false);
  const [largeTowelLockerNumber, setLargeTowelLockerNumber] = useState(0);
  const [isSelectLocker, setIsSelectLocker] = useState(false);
  const [lockerNumber, setLockerNumber] = useState(0);
  const [guarantee, setGuarantee] = useState<TGuarantee>("None");
  const [other, setOther] = useState("");
  //   const [lockerAvailable, setLockerAvailable] = useState([]);
  //   const [smallTowel, setSmallTowel] = useState(false);
  //   const [largeTowel, setlargeTowel] = useState(false);
  //   const [locker, setLocker] = useState(false);
  //   const [selectedLockerAvailable, setSelectedLockerAvailable] = useState('');
  //   const [other, setOther] = useState('');
  //   const [jmlSmallTowel, setjmlSmallTowel] = useState(1);
  //   const [jmlLargeTowel, setjmlLargeTowel] = useState(1);
  //   const [jmlSmallTowelAvailabe, setjmlSmallTowelAvailabe] = useState('');
  //   const [jmlLargeTowelAvailabe, setjmlLargeTowelAvailabe] = useState('');
  //   const [expireDate, setExpireDate] = useState([]);

  const onSubmit = async () => {
    setIsLoading(true);
    try {
      if (isSelectSmallTowel) {
        await loanFacility(smallTowel.id, "None", smallTowelLockerNumber);
      }

      if (isSelectLargeTowel) {
        await loanFacility(largeTowel.id, "None", largeTowelLockerNumber);
      }

      if (isSelectLocker) {
        await loanFacility(
          locker.id,
          guarantee === "Other" ? other : guarantee,
          lockerNumber,
        );
      }

      await checkIn(code);

      showMessage({
        message: "Checkin Succes",
        type: "success",
        icon: "success",
        backgroundColor: colors._green,
        color: colors._white,
      });

      navigation.replace("MainApp");
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

  const getFacilities = async () => {
    setIsLoading(true);
    try {
      const { data } = await fetchFacilites();
      if (data) {
        data.map((item: IFacility) => {
          if (item.facilities_name === "Small Towel") {
            setSmallTowel(item);
          } else if (item.facilities_name === "Large Towel") {
            setlargeTowel(item);
          } else if (item.facilities_name === "Locker") {
            setLocker(item);
          }
        });
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

  // const getExpire = async () => {
  // const response = await Api.getExpireDate(token);
  // setExpireDate(response.data);
  // };

  useEffect(() => {
    getFacilities();
    // getExpire();
  }, []);

  return (
    <SafeAreaView style={styles.container(isDarkMode)}>
      <StatusBarComp />
      <Header teks="Member Facilities" onPress={() => navigation.goBack()} />
      <View style={styles.content}>
        <ScrollView style={{ flex: 1 }}>
          <Text style={styles.teks1(isDarkMode)}>
            Please select the item you want to borrow
          </Text>
          <Gap height={8} />
          {smallTowel.stock > 0 && (
            <>
              <View
                style={{
                  flexDirection: "row",
                  justifyContent: "flex-start",
                  alignContent: "center",
                }}>
                <BouncyCheckbox
                  isChecked={isSelectSmallTowel}
                  onPress={() => setIsSelectSmallTowel(!isSelectSmallTowel)}
                  fillColor={colors._blue}
                  unFillColor={isDarkMode ? colors._black : colors._white}
                  iconImageStyle={{ tintColor: colors._black }}
                />
                <Gap width={4} />
                <Text style={styles.teks1(isDarkMode)}>Small Towel</Text>
              </View>
              <Gap height={8} />
            </>
          )}
          {isSelectSmallTowel && (
            <>
              <Input
                placeholder="Small towel number"
                keyboardType="number-pad"
                value={smallTowelLockerNumber.toString()}
                onChangeText={value => setSmallTowelLockerNumber(Number(value))}
              />
              <Gap height={20} />
            </>
          )}
          {largeTowel.stock > 0 && (
            <>
              <View
                style={{
                  flexDirection: "row",
                  justifyContent: "flex-start",
                  alignContent: "center",
                }}>
                <BouncyCheckbox
                  isChecked={isSelectLargeTowel}
                  onPress={() => setIsSelectLargeTowel(!isSelectLargeTowel)}
                  fillColor={colors._blue}
                  unFillColor={isDarkMode ? colors._black : colors._white}
                  iconImageStyle={{ tintColor: colors._black }}
                />
                <Gap width={4} />
                <Text style={styles.teks1(isDarkMode)}>Large Towel</Text>
              </View>
              <Gap height={8} />
            </>
          )}
          {isSelectLargeTowel && (
            <>
              <Input
                placeholder="Large towel number"
                keyboardType="number-pad"
                value={largeTowelLockerNumber.toString()}
                onChangeText={value => setLargeTowelLockerNumber(Number(value))}
              />
              <Gap height={20} />
            </>
          )}
          {locker.stock > 0 && (
            <>
              <View
                style={{
                  flexDirection: "row",
                  justifyContent: "flex-start",
                  alignContent: "center",
                }}>
                <BouncyCheckbox
                  isChecked={isSelectLocker}
                  onPress={() => setIsSelectLocker(!isSelectLocker)}
                  fillColor={colors._blue}
                  unFillColor={isDarkMode ? colors._black : colors._white}
                  iconImageStyle={{ tintColor: colors._black }}
                />
                <Gap width={4} />
                <Text style={styles.teks1(isDarkMode)}>Locker</Text>
              </View>
              <Gap height={8} />
            </>
          )}
          {isSelectLocker && (
            <>
              <Input
                placeholder="Locker number"
                keyboardType="number-pad"
                value={lockerNumber.toString()}
                onChangeText={value => setLockerNumber(Number(value))}
              />
              <Gap height={20} />
            </>
          )}
          <Gap height={30} />

          {isSelectLocker && (
            <>
              <Text style={styles.teks1(isDarkMode)}>Guarantee</Text>
              <Gap height={4} />
              <View
                style={{
                  borderRadius: 10,
                  overflow: "hidden",
                  backgroundColor: isDarkMode ? colors._black : colors._grey2,
                }}>
                <Picker
                  selectedValue={guarantee}
                  style={{
                    color: isDarkMode ? colors._white : colors._black,
                    fontSize: 14,
                    fontFamily: fonts.primary[400],
                  }}
                  itemStyle={{
                    color: isDarkMode ? colors._white : colors._black,
                    fontSize: 14,
                    fontFamily: fonts.primary[400],
                  }}
                  dropdownIconColor={isDarkMode ? colors._white : colors._black}
                  onValueChange={itemValue => setGuarantee(itemValue)}>
                  <Picker.Item
                    label="ID Card"
                    value="ID Card"
                    style={{ fontSize: 14, fontFamily: fonts.primary[400] }}
                  />
                  <Picker.Item
                    label="Driver License"
                    value="Driver License"
                    style={{ fontSize: 14, fontFamily: fonts.primary[400] }}
                  />
                  <Picker.Item
                    label="Passport"
                    value="Passport"
                    style={{ fontSize: 14, fontFamily: fonts.primary[400] }}
                  />
                  <Picker.Item
                    label="Other"
                    value="Other"
                    style={{ fontSize: 14, fontFamily: fonts.primary[400] }}
                  />
                </Picker>
              </View>
              <Gap height={20} />
              {guarantee === "Other" && (
                <Input
                  placeholder="Other"
                  value={other}
                  onChangeText={value => setOther(value)}
                />
              )}
              <Gap height={20} />
            </>
          )}
        </ScrollView>
        <ButtonColor
          backColor={colors._blue2}
          textColor={colors._white}
          teks="Save"
          onPress={onSubmit}
        />
      </View>

      {isLoading && <Loading />}
    </SafeAreaView>
  );
};

const styles = {
  container: (isDarkMode: boolean) => ({
    flex: 1,
    backgroundColor: isDarkMode ? colors._black2 : colors._white,
  }),
  flexCheckbox: (isDarkMode: boolean) =>
    ({
      flexDirection: "row",
      alignCon: "center",
      backgroundColor: isDarkMode ? colors._black : colors._grey2,
      borderRadius: 4,
      padding: 4,
      flex: 1,
    } as StyleProp<ViewStyle>),
  content: {
    padding: 24,
    flex: 1,
  },
  teks1: (isDarkMode: boolean) => ({
    fontSize: 14,
    fontFamily: fonts.primary[400],
    color: isDarkMode ? colors._white : colors._black,
  }),
  teks2: {
    color: colors._grey4,
    fontFamily: fonts.primary[400],
    fontSize: 14,
  },
};

export default Loaning;
