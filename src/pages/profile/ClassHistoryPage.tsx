import { BottomTabScreenProps } from "@react-navigation/bottom-tabs";
import { CompositeScreenProps, Theme } from "@react-navigation/native";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import React, { useContext, useEffect, useState } from "react";
import {
  SafeAreaView,
  ScrollView,
  View,
  Modal,
  Text,
  TouchableOpacity,
  Dimensions,
  Image,
  FlatList,
} from "react-native";
import Header from "../../components/ui/Header";
import { errorModal } from "../../components/Modal";
import Gap from "../../components/ui/Gap";
import { Input } from "../../components/ui/Input";
import Loading from "../../components/ui/Loading";
import NoData from "../../components/ui/NoData";
import StatusBarComp from "../../components/ui/StatusBarComp";
import { ThemeContext } from "../../contexts/ThemeContext";
import { IClassHistory, ThemeType } from "../../lib/definition";
import { RootStackParamList, TabParamList } from "../../lib/routes";
import { colors, fonts } from "../../lib/utils";
import { fetchBookingHistory, cancelBooking } from "../../services/class";
import { showMessage } from "react-native-flash-message";
import { Button, ButtonColor } from "../../components/ui/Button";
import { useDebounce } from "use-debounce";
import { CancelToken } from "axios";

export const ClassHistory = ({
  navigation,
}: CompositeScreenProps<
  NativeStackScreenProps<RootStackParamList, "ClassHistory">,
  BottomTabScreenProps<TabParamList, "Home">
>) => {
  const { isDarkMode } = useContext(ThemeContext);
  // const [status, setStatus] = React.useState<TabStatus>();
  const [bookingHistory, setBookingHistory] = React.useState<IClassHistory[]>(
    [],
  );
  const [isLoading, setIsLoading] = React.useState<boolean>(false);
  const [isViewModal, setIsViewModal] = React.useState<boolean>(false);
  const [cancelClass, setCancelClass] = React.useState<{
    id: number | null;
    name: string | null;
  }>({ id: null, name: null });
  const [reason, setReason] = React.useState<string>("");
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [hasNextPage, setHasNextPage] = useState(true);
  const [debouncedText] = useDebounce(search, 500);

  const getBookingHistory = async (
    _page: number,
    _search: string,
    token?: CancelToken,
  ) => {
    setIsLoading(true);
    try {
      const { data, hasNext } = await fetchBookingHistory(
        { page: _page, search: _search },
        { cancelToken: token },
      );
      if (data) {
        setBookingHistory(prev => [...prev, ...data]);
        setHasNextPage(hasNext);
      }
    } catch (err: any) {
      showMessage({
        icon: "warning",
        message: err.message || "An error occured",
        type: "default",
        backgroundColor: colors._red,
        color: colors._white,
      });
    } finally {
      setIsLoading(false);
    }
  };

  const onCancel = async () => {
    console.log(cancelClass);
    setIsLoading(true);
    try {
      const { data } = await cancelBooking(cancelClass.id!, reason);
      if (data) {
        setReason("");
        setCancelClass({ id: null, name: null });
        setIsViewModal(false);
        setBookingHistory([]);
        getBookingHistory(1, debouncedText);

        showMessage({
          message: "Class has been cancelled",
          type: "success",
          icon: "success",
          backgroundColor: colors._green,
          color: colors._white,
        });
      }
    } catch (err: any) {
      errorModal(err.message || "An error occured", isDarkMode);
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

    getBookingHistory(nextPage, debouncedText);
  };

  // Fetch
  useEffect(() => {
    console.log("fetch");
    setPage(1);
    setBookingHistory([]);

    getBookingHistory(1, debouncedText);
  }, [debouncedText]);

  return (
    <SafeAreaView
      style={{
        backgroundColor: isDarkMode ? colors._black2 : colors._white,
        flex: 1,
      }}>
      <StatusBarComp />

      <Header
        teks="My Class History"
        onPress={() => {
          navigation.navigate("Home");
        }}
      />
      <Gap height={16} />

      <View
        style={{
          flex: 2,
          paddingHorizontal: 16,
        }}>
        <FlatList
          style={{}}
          numColumns={2}
          refreshing={isLoading}
          onRefresh={() => {
            console.log("refresh");
            setPage(1);
            setBookingHistory([]);
            getBookingHistory(1, debouncedText);
          }}
          onEndReached={handleEndReached}
          data={bookingHistory}
          keyExtractor={(_, index) => index.toString()}
          renderItem={({ item }) => (
            <ClassHistoryCard
              key={item.id}
              classHistory={item}
              cancelClassId={cancelClass.id}
              onCancel={() => {
                setCancelClass({
                  id: item.id,
                  name: item.class_name,
                });
              }}
            />
          )}
          ListEmptyComponent={<NoData text="No Data Available" />}
          columnWrapperStyle={{ justifyContent: "space-between" }} // Optional: Adds spacing between columns
          contentContainerStyle={{ rowGap: 16 }} // Adds gap between rows
        />
      </View>
      <Gap height={16} />
      <View
        style={{
          paddingHorizontal: 16,
        }}>
        <ButtonColor
          backColor={colors._blue2}
          textColor={colors._white}
          teks={
            cancelClass.id === null
              ? "Select class to cancel"
              : "Cancel Booking"
          }
          disabled={cancelClass.id === null}
          onPress={() => {
            setIsViewModal(true);
          }}
        />
      </View>
      <Gap height={16} />

      <Modal
        animationType="fade"
        transparent={true}
        visible={isViewModal}
        onRequestClose={() => {
          setIsViewModal(false);
          setCancelClass({ id: null, name: null });
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
              Are you sure want to cancel {cancelClass.name} class?
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
                  setCancelClass({ id: null, name: null });
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

// const tabStatus: {[key: string]: string} = {
//   active: 'Active Classes',
//   inactive: 'Inactive Classes',
//   withdrawn: 'Withdrawn Classes',
// };

// type TabStatus = keyof typeof tabStatus;

function ClassHistoryCard({
  classHistory,
  // status,
  cancelClassId,
  onCancel,
}: {
  classHistory: IClassHistory;
  status?: "Active" | "Inactive" | "Withdrawn";
  cancelClassId: number | null;
  onCancel: () => void;
}) {
  const { isDarkMode } = useContext(ThemeContext);

  return (
    <TouchableOpacity
      onPress={onCancel}
      style={{
        height: 300,
        width: Dimensions.get("window").width / 2 - 32,
        backgroundColor: isDarkMode ? colors._black : colors._grey2,
        flexDirection: "column",
        gap: 8,
        borderRadius: 16,
        borderColor:
          cancelClassId === classHistory.id ? colors._green : colors._grey2,
        borderWidth: 2,
      }}>
      {/* <View
        style={{
          position: 'absolute',
          zIndex: 1,
          borderTopLeftRadius: 16,
          borderBottomRightRadius: 16,
          backgroundColor: colors._backBlue,
        }}>
        <Text
          style={{
            padding: 8,
            fontFamily: fonts.primary[400],
            fontSize: 12,
            color: isDarkMode ? colors._white : colors._black,
          }}>
          {status}
        </Text>
      </View> */}
      <Image
        style={{
          flex: 1,
          backgroundColor: colors._backGreen,
          borderRadius: 16,
        }}
        source={{ uri: classHistory.image }}
      />
      <View
        style={{
          flexDirection: "column",
          gap: 8,
          paddingHorizontal: 8,
          paddingVertical: 16,
        }}>
        <Text
          style={{
            fontFamily: fonts.primary[300],
            fontSize: 12,
            color: isDarkMode ? colors._white : colors._black,
          }}>
          {classHistory.class_name}
        </Text>
        <Text
          style={{
            fontFamily: fonts.primary[400],
            fontSize: 16,
            color: isDarkMode ? colors._white : colors._black,
          }}>
          {classHistory.day}, {classHistory.start_time_class} AM -{" "}
          {classHistory.date_class}
        </Text>
        {classHistory.seat_number && (
          <Text
            style={{
              fontFamily: fonts.primary[300],
              fontSize: 12,
              color: isDarkMode ? colors._white : colors._black,
            }}>
            Seat {classHistory.seat_number}
          </Text>
        )}
        <Text
          style={{
            fontFamily: fonts.primary[200],
            fontSize: 12,
            color: isDarkMode ? colors._white : colors._black,
          }}>
          {classHistory.instructure_name}
        </Text>
      </View>
    </TouchableOpacity>
  );
}
