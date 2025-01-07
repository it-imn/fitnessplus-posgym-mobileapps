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
import { IChooseSeat } from "../../lib/definition";

export default function ChooseSeat({
  navigation,
  route,
}: NativeStackScreenProps<RootStackParamList, "ChooseSeat">) {
  const { id, standard_class_id } = route.params;
  const { isDarkMode } = useContext(ThemeContext);
  const [isLoading, setIsLoading] = useState(false);
  const [seats, setSeats] = useState<IChooseSeat[]>([]);

  const [selectedSeat, setSelectedSeat] = useState<number>(0);

  const getSeats = async () => {
    setIsLoading(true);
    try {
      const { data } = await fetchClassSeat(standard_class_id);
      if (data) {
        setSeats(data);

        // find first available seat
        const firstAvailable = data.find((item) => !item.selected);
        if (firstAvailable) {
          setSelectedSeat(firstAvailable.seat_id);
        }
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
                    isSelected={selectedSeat === item.seat_id}
                    key={item.seat_id}
                    item={item}
                    onPress={() => {
                      if (!item.selected) {
                        setSelectedSeat(item.seat_id);
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
          teks="Book Class"
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
  item: IChooseSeat;
  onPress: () => void;
}) => {
  return (
    <TouchableOpacity
      disabled={item.selected}
      style={{
        borderRadius: 8,
        width: 48,
        height: 48,
        backgroundColor: isSelected
          ? colors._grey3
          : item.selected
          ? colors._red
          : colors._blue2,
        margin: 8,
        justifyContent: "center",
        alignItems: "center",
      }}
      onPress={onPress}>
      <Text>{item.seat_number}</Text>
    </TouchableOpacity>
  );
};
