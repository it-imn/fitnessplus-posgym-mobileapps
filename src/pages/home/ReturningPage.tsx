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
import {
  fetchFacilites,
  fetchLoanedFacilities,
  loanFacility,
} from "../../services/branch";
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
import { fetchProfile } from "../../services/profile";
import { useModalStore } from "../../stores/useModalStore";

type TGuarantee = "None" | "ID Card" | "Driver License" | "Passport" | "Other";

const Returning = ({
  navigation,
  route,
}: CompositeScreenProps<
  NativeStackScreenProps<RootStackParamList, "Returning">,
  BottomTabScreenProps<TabParamList, "Home">
>) => {
  const { isDarkMode } = useContext(ThemeContext);
  const [isLoading, setIsLoading] = useState(false);
  const { code } = route.params;
  const [smallTowel, setSmallTowel] = useState<IFacility | null>(null);
  const [largeTowel, setlargeTowel] = useState<IFacility | null>(null);
  const [locker, setLocker] = useState<IFacility | null>(null);
  const [isSelectSmallTowel, setIsSelectSmallTowel] = useState(false);
  const [isSelectLargeTowel, setIsSelectLargeTowel] = useState(false);
  const [isSelectLocker, setIsSelectLocker] = useState(false);
  const [data, setData] = useState<IFacility[]>([]);
  const [checkId, setCheckId] = useState<number | null>(null);
  const { openModal, closeModal } = useModalStore();
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
      if (smallTowel && !isSelectSmallTowel) {
        errorModal("Check the small towel", isDarkMode);
        return;
      }

      if (largeTowel && !isSelectLargeTowel) {
        errorModal("Check the large towel", isDarkMode);
        return;
      }

      if (locker && !isSelectLocker) {
        errorModal("Check the locker", isDarkMode);
        return;
      }

      await checkIn(code);

      showMessage({
        message: "Checkout Succes",
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

  const getFacilities = async (checkId: number) => {
    setIsLoading(true);
    try {
      const { data } = await fetchLoanedFacilities(checkId);
      if (data) {
        setData(data);
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

  const getProfile = async () => {
    setIsLoading(true);
    try {
      const { data } = await fetchProfile();
      if (data) {
        setCheckId(data.visit_gym.check_id);
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
    getProfile();
  }, []);

  useEffect(() => {
    checkId && getFacilities(checkId);
  }, [checkId]);

  return (
    <SafeAreaView style={styles.container(isDarkMode)}>
      <StatusBarComp />
      <Header teks="Member Facilities" onPress={() => navigation.goBack()} />
      <View style={styles.content}>
        <ScrollView style={{ flex: 1 }}>
          <Text style={styles.teks1(isDarkMode)}>
            Please select the item you want to return
          </Text>
          <Gap height={8} />
          {smallTowel && (
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
              <Input
                placeholder="Small towel number"
                keyboardType="number-pad"
                value={smallTowel.number ? smallTowel.number.toString() : ""}
                onChangeText={value => {}}
                editable={false}
              />
              <Gap height={20} />
            </>
          )}
          {largeTowel && (
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
              <Input
                placeholder="Large towel number"
                keyboardType="number-pad"
                value={largeTowel.number ? largeTowel.number.toString() : ""}
                onChangeText={value => {}}
                editable={false}
              />
              <Gap height={20} />
            </>
          )}
          {locker && (
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
              <Input
                placeholder="Locker number"
                keyboardType="number-pad"
                value={locker.number ? locker.number.toString() : ""}
                onChangeText={value => {}}
                editable={false}
              />
              <Gap height={8} />
              <Text style={styles.teks1(isDarkMode)}>
                Guarantee: {locker.guarantee}
              </Text>
              <Gap height={20} />
            </>
          )}
          <Gap height={30} />
        </ScrollView>
        <ButtonColor
          backColor={colors._blue2}
          textColor={colors._white}
          teks="Checkout"
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

export default Returning;
