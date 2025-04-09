import { NativeStackScreenProps } from "@react-navigation/native-stack";
import {
  ColorValue,
  Image,
  SafeAreaView,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { RootStackParamList } from "../../lib/routes";
import React, { useContext, useEffect, useState } from "react";
import { ThemeContext } from "../../contexts/ThemeContext";
import { colors, fonts } from "../../lib/utils";
import NoData from "../../components/ui/NoData";
import StatusBarComp from "../../components/ui/StatusBarComp";
import Header from "../../components/ui/Header";
import { FlatList } from "react-native-gesture-handler";
import Gap from "../../components/ui/Gap";
import {
  ChevronRightIcon,
  ChevronsRightIcon,
  MapIcon,
  User2,
  UserIcon,
} from "lucide-react-native";
import { fetchDetailSchedule } from "../../services/schedule";
import { showMessage } from "react-native-flash-message";
import Loading from "../../components/ui/Loading";
import { IDetailScheduleActivity } from "../../lib/definition";
import moment from "moment";
import { ButtonColor } from "../../components/ui/Button";

export const DetailPTSchedule = ({
  navigation,
  route,
}: NativeStackScreenProps<RootStackParamList, "DetailPTSchedule">) => {
  const { isDarkMode } = useContext(ThemeContext);
  const { id } = route.params;

  const [isLoading, setIsLoading] = useState(false);
  const [scheduleActivity, setScheduleActivity] =
    useState<IDetailScheduleActivity | null>(null);

  const getScheduleActivity = async () => {
    setIsLoading(true);
    try {
      const { data } = await fetchDetailSchedule("pt", id);
      if (data) {
        setScheduleActivity(data);
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
    getScheduleActivity();
  }, []);

  return (
    <SafeAreaView
      style={{
        flex: 1,
        backgroundColor: isDarkMode ? colors._black2 : colors._white,
      }}>
      <StatusBarComp />
      <Header teks="Personal Trainer" onPress={() => navigation.goBack()} />
      <ScrollView
        style={{
          flex: 1,
          marginHorizontal: 24,
        }}>
        <Text
          style={{
            fontSize: 16,
            fontFamily: fonts.primary[600],
            color: isDarkMode ? colors._white : colors._black,
          }}>
          Personal Trainer Membership
        </Text>
        <Gap height={8} />
        <View
          style={{
            backgroundColor: isDarkMode ? colors._black : colors._grey2,
            padding: 8,
            flexDirection: "row",
            borderRadius: 10,
            width: "100%",
          }}>
          <Image
            src={scheduleActivity?.trainer_image}
            style={{
              width: 150,
              height: 150,
              borderRadius: 10,
              backgroundColor: colors._grey,
            }}
          />
          <Gap width={16} />
          <View
            style={{
              flexDirection: "column",
              justifyContent: "space-between",
              flexGrow: 1,
            }}>
            <View>
              <Text
                style={{
                  fontSize: 16,
                  fontFamily: fonts.primary[600],
                  color: isDarkMode ? colors._white : colors._black,
                }}>
                {scheduleActivity?.trainer_name}
              </Text>
              <Gap height={8} />
              <Text
                style={{
                  fontSize: 14,
                  fontFamily: fonts.primary[300],
                  color: isDarkMode ? colors._white : colors._black,
                }}>
                {scheduleActivity?.trainer_spesification}
              </Text>
            </View>
            <View style={{}}>
              <Text
                style={{
                  fontSize: 14,
                  fontFamily: fonts.primary[400],
                  color: isDarkMode ? colors._white : colors._black,
                  alignSelf: "flex-end",
                }}>
                {scheduleActivity?.trainer_session}/
                {scheduleActivity?.trainer_periode} Session
              </Text>
            </View>
          </View>
        </View>
        <Gap height={16} />
        <Text
          style={{
            fontSize: 16,
            fontFamily: fonts.primary[600],
            color: isDarkMode ? colors._white : colors._black,
          }}>
          Next Schedule
        </Text>
        <Gap height={4} />
        <View
          style={{
            height: 2,
            width: "100%",
            backgroundColor: colors._grey4,
          }}
        />
        <Gap height={4} />
        <Text
          style={{
            fontSize: 14,
            fontFamily: fonts.primary[600],
            color: isDarkMode ? colors._white : colors._black,
            paddingBottom: 8,
          }}>
          {moment(scheduleActivity?.schedule_date).format("dddd, DD MMMM YYYY")}
        </Text>
      </ScrollView>

      {scheduleActivity?.status === "booking" ? (
        <>
          <View
            style={{
              paddingHorizontal: 16,
            }}>
            <ButtonColor
              backColor={colors._blue2}
              textColor={colors._white}
              teks={"Scan QR"}
              disabled={isLoading}
              onPress={() => {
                navigation.navigate("CheckinClass", {
                  seat_id: scheduleActivity?.seat_id || 0,
                  type: "pt",
                });
              }}
            />
          </View>
          <Gap height={16} />
        </>
      ) : null}
      {isLoading && <Loading />}
    </SafeAreaView>
  );
};
