import { NativeStackScreenProps } from "@react-navigation/native-stack";
import {
  ColorValue,
  Image,
  Modal,
  SafeAreaView,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { RootStackParamList } from "../../lib/routes";
import { useContext, useEffect, useState } from "react";
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
import {
  IDetailScheduleActivity,
  IScheduleActivity,
} from "../../lib/definition";
import { fetchDetailSchedule } from "../../services/schedule";
import { showMessage } from "react-native-flash-message";
import Loading from "../../components/ui/Loading";
import moment from "moment";
import { cancelBooking } from "../../services/class";
import { Input } from "../../components/ui/Input";
import { ButtonColor } from "../../components/ui/Button";

export const DetailClassSchedule = ({
  navigation,
  route,
}: NativeStackScreenProps<RootStackParamList, "DetailClassSchedule">) => {
  const { isDarkMode } = useContext(ThemeContext);
  const { id } = route.params;
  const [scheduleActivity, setScheduleActivity] =
    useState<IDetailScheduleActivity | null>(null);

  const [isLoading, setIsLoading] = useState(false);
  const [isViewModal, setIsViewModal] = useState<boolean>(false);
  const [reason, setReason] = useState<string>("");

  const onCancel = async () => {
    setIsLoading(true);
    try {
      const { data } = await cancelBooking(id, reason);
      if (data) {
        setReason("");
        setIsViewModal(false);

        showMessage({
          message: "Class has been cancelled",
          type: "success",
          icon: "success",
          backgroundColor: colors._green,
          color: colors._white,
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

  const getScheduleActivity = async () => {
    setIsLoading(true);
    try {
      const { data } = await fetchDetailSchedule("class", id);
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

  const [filter, setFilter] = useState<
    "schedule" | "description" | "instructor"
  >("schedule");

  return (
    <SafeAreaView
      style={{
        flex: 1,
        backgroundColor: isDarkMode ? colors._black2 : colors._white,
      }}>
      <StatusBarComp />
      <Header
        teks="Detail Class Schedule"
        onPress={() => navigation.goBack()}
      />
      <ScrollView
        style={{
          flex: 1,
        }}>
        <Image
          src={scheduleActivity?.schedule_image}
          style={{
            width: 150,
            height: 150,
            alignSelf: "center",
            backgroundColor: colors._grey,
          }}
        />
        <Gap height={16} />
        <View
          style={{
            paddingHorizontal: 24,
          }}>
          <Text
            style={{
              fontSize: 24,
              fontFamily: fonts.primary[600],
              color: isDarkMode ? colors._white : colors._black,
              paddingBottom: 8,
            }}>
            {scheduleActivity?.schedule_name}
          </Text>
          <Text
            style={{
              fontSize: 12,
              color: isDarkMode ? colors._grey4 : colors._grey3,
              fontFamily: fonts.primary[400],
            }}>
            Order Code
          </Text>
          <Gap height={4} />
          <Text
            style={{
              fontSize: 12,
              fontFamily: fonts.primary[400],
              color: isDarkMode ? colors._white : colors._black,
            }}>
            {scheduleActivity?.order_code}
          </Text>
          <Gap height={16} />
          <View
            style={{
              flex: 1,
              height: 2,
              backgroundColor: colors._grey4,
            }}
          />
          <Gap height={16} />
          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
            }}>
            <Tab
              onPress={() => setFilter("schedule")}
              text="Schedule"
              active={filter === "schedule"}
            />
            <Tab
              onPress={() => setFilter("description")}
              text="Description"
              active={filter === "description"}
            />
            <Tab
              onPress={() => setFilter("instructor")}
              text="Instructor"
              active={filter === "instructor"}
            />
          </View>
          <Gap height={16} />
          {filter === "schedule" ? (
            <View>
              <Text
                style={{
                  fontSize: 14,
                  fontFamily: fonts.primary[300],
                  color: isDarkMode ? colors._white : colors._black,
                  alignSelf: "center",
                }}>
                {moment(scheduleActivity?.schedule_date).format(
                  "dddd, DD MMMM YYYY",
                )}
              </Text>
              <Gap height={8} />
              <View
                style={{
                  padding: 16,
                  backgroundColor: colors._backGreen,
                  borderRadius: 8,
                }}>
                <View
                  style={{
                    flexDirection: "row",
                    justifyContent: "space-between",
                  }}>
                  <Text
                    style={{
                      fontSize: 16,
                      fontFamily: fonts.primary[600],
                      color: colors._black,
                    }}>
                    {Number(scheduleActivity?.schedule_start?.split(":")[0]) >=
                    16
                      ? "Evening"
                      : Number(
                          scheduleActivity?.schedule_start?.split(":")[0],
                        ) >= 12
                      ? "Afternoon"
                      : "Morning"}
                  </Text>
                  <Text
                    style={{
                      fontSize: 16,
                      fontFamily: fonts.primary[600],
                      color: colors._black,
                    }}>
                    {scheduleActivity?.schedule_member_join}/
                    {scheduleActivity?.schedule_quota}
                  </Text>
                </View>
                <Gap height={8} />
                <View
                  style={{
                    flexDirection: "row",
                    justifyContent: "space-between",
                  }}>
                  <Text
                    style={{
                      fontSize: 14,
                      fontFamily: fonts.primary[400],
                      color: colors._black,
                    }}>
                    {scheduleActivity?.schedule_start} -{" "}
                    {scheduleActivity?.schedule_end}
                  </Text>
                  <Text
                    style={{
                      fontSize: 14,
                      fontFamily: fonts.primary[400],
                      color: colors._black,
                    }}>
                    Seat No. {scheduleActivity?.book_number}
                  </Text>
                </View>
                <Text
                  style={{
                    fontSize: 12,
                    fontFamily: fonts.primary[300],
                    color: colors._black,
                    fontStyle: "italic",
                  }}>
                  {scheduleActivity?.schedule_duration}
                </Text>
                <Gap height={8} />
                <View
                  style={{
                    flexDirection: "row",
                    justifyContent: "space-between",
                  }}>
                  <Text
                    style={{
                      fontSize: 16,
                      fontFamily: fonts.primary[600],
                      color: colors._black,
                    }}>
                    {scheduleActivity?.trainer_name}
                  </Text>
                </View>
              </View>
            </View>
          ) : filter === "description" ? (
            <View>
              <Text
                style={{
                  fontSize: 16,
                  fontFamily: fonts.primary[300],
                  color: isDarkMode ? colors._white : colors._black,
                }}>
                {scheduleActivity?.schedule_description}
              </Text>
            </View>
          ) : (
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
              </View>
            </View>
          )}
        </View>
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
                });
              }}
            />
          </View>
          <Gap height={8} />
          <View
            style={{
              paddingHorizontal: 16,
            }}>
            <ButtonColor
              backColor={colors._red}
              textColor={colors._white}
              teks={"Cancel Booking"}
              disabled={isLoading}
              onPress={() => {
                setIsViewModal(true);
              }}
            />
          </View>
          <Gap height={16} />
        </>
      ) : null}

      <Modal
        animationType="fade"
        transparent={true}
        visible={isViewModal}
        onRequestClose={() => {
          setIsViewModal(false);
        }}>
        <View
          style={{
            padding: 24,
            justifyContent: "center",
            width: "100%",
            height: "100%",
            backgroundColor: colors._black3,
          }}>
          <View
            style={{
              backgroundColor: isDarkMode ? colors._black : colors._white,
              padding: 12,
              borderRadius: 8,
            }}>
            <Text
              style={{
                color: isDarkMode ? colors._white : colors._black,
              }}>
              Are you sure want to cancel {scheduleActivity?.schedule_name}{" "}
              class?
            </Text>
            <Gap height={8} />
            <Input
              placeholder="Input your reason"
              value={reason}
              onChangeText={value => setReason(value)}
            />
            <Gap height={16} />
            <View
              style={{
                flexDirection: "row",
                justifyContent: "center",
                gap: 16,
              }}>
              <TouchableOpacity
                style={{
                  backgroundColor: colors._red,
                  padding: 12,
                  borderRadius: 8,
                }}
                onPress={() => {
                  setIsViewModal(false);
                }}>
                <Text
                  style={{
                    color: colors._white,
                  }}>
                  No
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={{
                  backgroundColor: colors._grey2,
                  padding: 12,
                  borderRadius: 8,
                }}
                onPress={onCancel}>
                <Text
                  style={{
                    color: colors._black,
                  }}>
                  Yes
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {isLoading && <Loading />}
    </SafeAreaView>
  );
};

const Tab = ({
  onPress,
  text,
  active,
}: {
  onPress: () => void;
  text: string;
  active: boolean;
}) => {
  const { isDarkMode } = useContext(ThemeContext);

  return (
    <TouchableOpacity
      style={{
        paddingVertical: 8,
        paddingHorizontal: 16,
        borderRadius: 50,
        backgroundColor: active ? colors._grey : colors._white,
        borderWidth: 1,
        borderColor: active ? colors._white : colors._grey,
      }}
      onPress={onPress}>
      <Text
        style={{
          fontSize: 12,
          fontFamily: fonts.primary[400],
          color: active
            ? colors._white
            : isDarkMode
            ? colors._white
            : colors._black,
          textAlign: "center",
        }}>
        {text}
      </Text>
    </TouchableOpacity>
  );
};
