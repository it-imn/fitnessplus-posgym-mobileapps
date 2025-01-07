import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { RootStackParamList } from "../../lib/routes";
import { useContext, useEffect, useState } from "react";
import { ThemeContext } from "../../contexts/ThemeContext";
import {
  FlatList,
  SafeAreaView,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import StatusBarComp from "../../components/ui/StatusBarComp";
import { colors } from "../../lib/utils";
import Header from "../../components/ui/Header";
import Loading from "../../components/ui/Loading";
import { showMessage } from "react-native-flash-message";
import { fetchClassSeat, postBooking } from "../../services/class";
import Gap from "../../components/ui/Gap";
import { ButtonColor } from "../../components/ui/Button";

export default function ChooseSeat({
  navigation,
  route,
}: NativeStackScreenProps<RootStackParamList, "ChooseSeat">) {
  const { id, standard_class_id } = route.params;
  const { isDarkMode } = useContext(ThemeContext);
  const [isLoading, setIsLoading] = useState(false);
  const [seats, setSeats] = useState<{ id: number; status: number }[]>([]);

  const [selectedSeat, setSelectedSeat] = useState<number>(0);

  const getSeats = async () => {
    setIsLoading(true);
    try {
      // find first available seat
      const firstAvailable = mockData.find(item => item.status === 2);
      if (firstAvailable) {
        setSelectedSeat(firstAvailable.id);
      }

      setSeats(mockData);

      await fetchClassSeat(standard_class_id);
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

  const goPayStd = async () => {
    try {
      setIsLoading(true);

      await postBooking(id, selectedSeat);

      navigation.navigate("BookingSuccess");
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
    getSeats();
  }, []);

  return (
    <SafeAreaView
      style={{
        backgroundColor: isDarkMode ? colors._black2 : colors._white,
        flex: 1,
      }}>
      <StatusBarComp />
      <Header teks="Choose Seat" onPress={() => navigation.goBack()} />

      <View
        style={{
          flex: 1,
          paddingHorizontal: 20,
        }}>
        {/* Legend */}
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "space-between",
          }}>
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
            }}>
            <View
              style={{
                borderRadius: 8,
                width: 36,
                height: 36,
                backgroundColor: colors._grey3,
                margin: 8,
                justifyContent: "center",
                alignItems: "center",
              }}
            />
            <Text>Selected</Text>
          </View>
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
            }}>
            <View
              style={{
                borderRadius: 8,
                width: 36,
                height: 36,
                backgroundColor: colors._blue2,
                margin: 8,
                justifyContent: "center",
                alignItems: "center",
              }}
            />
            <Text>Available</Text>
          </View>
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
            }}>
            <View
              style={{
                borderRadius: 8,
                width: 36,
                height: 36,
                backgroundColor: colors._red,
                margin: 8,
                justifyContent: "center",
                alignItems: "center",
              }}
            />
            <Text>Booked</Text>
          </View>
        </View>
        <Gap height={16} />
        <ScrollView
          style={{
            flex: 1,
          }}>
          <View
            style={{
              flexDirection: "row",
              justifyContent: "center",
              flex: 1,
            }}>
            <View
              style={{
                flexDirection: "row",
                flexWrap: "wrap",
                width: 5 * (48 + 2 * 8), // numCol * (width + margin)
              }}>
              {seats.map((item, _) => {
                return (
                  <Item
                    isSelected={selectedSeat === item.id}
                    key={item.id}
                    item={item}
                    onPress={() => {
                      if (item.status === 2) {
                        setSelectedSeat(item.id);
                      }
                    }}
                  />
                );
              })}
            </View>
          </View>
        </ScrollView>
        <Gap height={16} />
        <ButtonColor
          backColor={colors._blue2}
          textColor={colors._white}
          teks="Next"
          onPress={goPayStd}
          disabled={isLoading}
        />
        <Gap height={16} />
      </View>

      {isLoading && <Loading />}
    </SafeAreaView>
  );
}

const Item = ({
  isSelected,
  item,
  onPress,
}: {
  isSelected: boolean;
  item: { id: number; status: number };
  onPress: () => void;
}) => {
  return (
    <TouchableOpacity
      disabled={item.status === 1}
      style={{
        borderRadius: 8,
        width: 48,
        height: 48,
        backgroundColor: isSelected
          ? colors._grey3
          : item.status === 1
          ? colors._red
          : colors._blue2,
        margin: 8,
        justifyContent: "center",
        alignItems: "center",
      }}
      onPress={onPress}>
      <Text>{item.id}</Text>
    </TouchableOpacity>
  );
};

const mockData = [
  {
    id: 1,
    status: 1,
  },
  {
    id: 2,
    status: 1,
  },
  {
    id: 3,
    status: 1,
  },
  {
    id: 4,
    status: 1,
  },
  {
    id: 5,
    status: 1,
  },
  {
    id: 6,
    status: 1,
  },
  {
    id: 7,
    status: 2,
  },
  {
    id: 8,
    status: 2,
  },
  {
    id: 9,
    status: 1,
  },
  {
    id: 10,
    status: 1,
  },
  {
    id: 11,
    status: 2,
  },
  {
    id: 12,
    status: 1,
  },
  {
    id: 13,
    status: 1,
  },
];
