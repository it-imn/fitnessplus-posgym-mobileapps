import { NativeStackScreenProps } from "@react-navigation/native-stack";
import {
  ColorValue,
  SafeAreaView,
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
  Clock,
  ClockIcon,
  DoorOpen,
  MapIcon,
  Sofa,
  SofaIcon,
  User2,
  UserIcon,
} from "lucide-react-native";
import Loading from "../../components/ui/Loading";
import { fetchListSchedules } from "../../services/schedule";
import { showMessage } from "react-native-flash-message";
import { IScheduleActivity } from "../../lib/definition";
import moment, { duration } from "moment";
import { useIsFocused } from "@react-navigation/native";

interface ISchedule {
  date: string;
  time: string;
  title: string;
  duration: string;
  place: string;
  instructor: string;
  type: "class" | "pt";
  onPress: () => void;
}

export const ListSchedule = ({
  navigation,
}: NativeStackScreenProps<RootStackParamList, "ListSchedule">) => {
  const { isDarkMode } = useContext(ThemeContext);

  const [filter, setFilter] = useState<"all" | "class" | "pt">("all");
  const [schedules, setSchedules] = useState<IScheduleActivity[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const isFocused = useIsFocused();

  const [page, setPage] = useState(1);
  const [hasNextPage, setHasNextPage] = useState(true);

  const getSchedule = async (_page: number, signal: AbortSignal) => {
    setIsLoading(true);
    try {
      const { data, hasNext } = await fetchListSchedules(
        filter,
        {
          page: _page,
        },
        {
          signal,
        },
      );
      if (data) {
        setSchedules(prev => [...prev, ...data]);

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

  // Handle pagination when reaching the end of the list
  const handleEndReached = async () => {
    if (!hasNextPage || isLoading) return;

    const nextPage = page + 1;
    setPage(nextPage);

    const ctrl = new AbortController();
    getSchedule(nextPage, ctrl.signal);
  };

  // Fetch
  useEffect(() => {
    console.log("fetch");
    setPage(1);
    setSchedules([]);

    const ctrl = new AbortController();

    getSchedule(1, ctrl.signal);

    return () => {
      ctrl.abort();
    };
  }, [filter, isFocused]);

  return (
    <SafeAreaView
      style={{
        flex: 1,
        backgroundColor: isDarkMode ? colors._black2 : colors._white,
      }}>
      <StatusBarComp />
      <Header
        teks="Schedule Activity"
        onPress={() => navigation.replace("MainApp")}
      />
      <View
        style={{
          flexDirection: "row",
          paddingHorizontal: 24,
        }}>
        <Tab
          onPress={() => setFilter("all")}
          text="All"
          color={colors._black3}
          active={filter === "all"}
        />
        <Tab
          onPress={() => setFilter("class")}
          text="Class"
          color={colors._green}
          active={filter === "class"}
        />
        <Tab
          onPress={() => setFilter("pt")}
          text="Personal Trainer"
          color={colors._blue2}
          active={filter === "pt"}
        />
      </View>
      <Gap height={16} />
      <FlatList
        style={{
          flex: 1,
          paddingHorizontal: 24,
        }}
        data={schedules}
        renderItem={({ item }) => (
          <View style={{ paddingBottom: 16 }}>
            <Card
              scheduleActivity={item}
              onPress={() => {
                console.log(item.id, item.type);
                item.type === "pt"
                  ? navigation.navigate("DetailPTSchedule", { id: item.id })
                  : navigation.navigate("DetailClassSchedule", { id: item.id });
              }}
            />
          </View>
        )}
        onRefresh={() => {
          console.log("refresh");
          setPage(1);
          setSchedules([]);

          const ctrl = new AbortController();

          getSchedule(1, ctrl.signal);
        }}
        onEndReached={handleEndReached}
        keyExtractor={item => `${item.order_code.toString()}-${item.day_date}`}
        ListEmptyComponent={<NoData text="No Data Available" />}
      />

      {isLoading && <Loading />}
    </SafeAreaView>
  );
};

const Tab = ({
  onPress,
  text,
  active,
  color,
}: {
  onPress: () => void;
  text: string;
  active: boolean;
  color: ColorValue;
}) => {
  const { isDarkMode } = useContext(ThemeContext);

  return (
    <TouchableOpacity
      style={{
        flexGrow: 1,
        paddingVertical: 8,
        borderRadius: 50,
        backgroundColor: active ? color : colors._white,
      }}
      onPress={onPress}>
      <Text
        style={{
          fontSize: 14,
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

const Card = ({
  scheduleActivity,
  onPress,
}: {
  scheduleActivity: IScheduleActivity;
  onPress: () => void;
}) => {
  const { isDarkMode } = useContext(ThemeContext);

  return (
    <TouchableOpacity
      onPress={onPress}
      style={{
        marginBottom: 16,
      }}>
      <View
        style={{
          backgroundColor: isDarkMode ? colors._black : colors._grey2,
          borderRadius: 10,
          flexDirection: "row",
          shadowColor: colors._black,
          shadowOffset: {
            width: 0,
            height: 2,
          },
          shadowOpacity: 0.25,
          shadowRadius: 3.84,
          elevation: 5,
        }}>
        <View
          style={{
            backgroundColor: colors._blue2,
            width: 4,
            borderStartStartRadius: 10,
            borderBottomLeftRadius: 10,
          }}
        />
        <Gap width={8} />
        <View>
          <Gap height={8} />
          <Text
            style={{
              fontSize: 14,
              fontFamily: fonts.primary[400],
              color: colors._blue2,
            }}>
            {scheduleActivity.trainer}
          </Text>
          <Gap height={4} />
          <Text
            style={{
              fontSize: 16,
              fontFamily: fonts.primary[400],
              color: colors._black,
            }}>
            {scheduleActivity.day_date}
          </Text>
          <Gap height={8} />
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              flexWrap: "wrap",
            }}>
            <View
              style={{
                flexDirection: "row",
                justifyContent: "center",
                alignItems: "center",
              }}>
              <DoorOpen size={16} color={colors._grey4} />
              <Gap width={8} />
              <Text
                style={{
                  fontSize: 12,
                  fontFamily: fonts.primary[400],
                  color: colors._grey4,
                }}>
                {scheduleActivity.type === "class" ? "Class" : "PT"}
              </Text>
            </View>
            <Gap width={16} />
            <View
              style={{
                flexDirection: "row",
                justifyContent: "center",
                alignItems: "center",
              }}>
              <SofaIcon size={16} color={colors._grey4} />
              <Gap width={8} />
              <Text
                style={{
                  fontSize: 12,
                  fontFamily: fonts.primary[400],
                  color: colors._grey4,
                }}>
                {scheduleActivity.status}
              </Text>
            </View>
            <Gap width={16} />
            <View
              style={{
                flexDirection: "row",
                justifyContent: "center",
                alignItems: "center",
              }}>
              <ClockIcon size={16} color={colors._grey4} />
              <Gap width={8} />
              <Text
                style={{
                  fontSize: 12,
                  fontFamily: fonts.primary[400],
                  color: colors._grey4,
                }}>
                {scheduleActivity.start_time} - {scheduleActivity.finish_time}
              </Text>
            </View>
            <Gap width={16} />
          </View>
          <Gap height={8} />
        </View>
      </View>
    </TouchableOpacity>
  );
};

// startTime and finishTime format = 09:00:00
function getDuration(startTime: string, finishTime: string) {
  const start = new Date(`1970-01-01T${startTime}`);
  const finish = new Date(`1970-01-01T${finishTime}`);

  const diff = finish.getTime() - start.getTime();
  const hours = Math.floor(diff / 1000 / 60 / 60);
  const minutes = Math.floor((diff / 1000 / 60) % 60);

  return `${hours}h ${minutes}m`;
}
