import { NativeStackScreenProps } from "@react-navigation/native-stack";
import React, { Fragment, useContext, useEffect, useState } from "react";
import {
  FlatList,
  SafeAreaView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import Header from "../../components/ui/Header";
import NoData from "../../components/ui/NoData";
import StatusBarComp from "../../components/ui/StatusBarComp";
import { ThemeContext } from "../../contexts/ThemeContext";
import { RootStackParamList } from "../../lib/routes";
import { colors, fonts } from "../../lib/utils";
import { INotification } from "../../lib/definition";
import { fetchNotifications } from "../../services/notification";
import { useIsFocused } from "@react-navigation/native";
import { CancelToken } from "axios";
import { useDebounce } from "use-debounce";
import { Icon } from "lucide-react-native";
import Gap from "../../components/ui/Gap";
import Loading from "../../components/ui/Loading";
import moment from "moment";

export const Notification = ({
  navigation,
}: NativeStackScreenProps<RootStackParamList, "Notification">) => {
  const { isDarkMode } = useContext(ThemeContext);

  const [notifications, setNotifications] = useState<INotification[]>([]);
  const [isLoading, setIsLoading] = React.useState(false);
  const isFocused = useIsFocused();
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [hasNextPage, setHasNextPage] = useState(true);
  const [debouncedText] = useDebounce(search, 500);

  const getNotifications = async (
    _page: number,
    _search: string,
    token?: CancelToken,
  ) => {
    setIsLoading(true);
    try {
      const { data, hasNext } = await fetchNotifications(
        { page: _page, search: _search },
        { cancelToken: token },
      );
      setNotifications(prev => [...prev, ...data]); // Append for pagination

      setHasNextPage(hasNext);
    } catch (error: any) {
      console.error(error);
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

    getNotifications(nextPage, debouncedText);
  };

  // Fetch
  useEffect(() => {
    console.log("fetch");
    setPage(1);
    setNotifications([]);

    getNotifications(1, debouncedText);
  }, [debouncedText]);

  return (
    <SafeAreaView
      style={{
        flex: 1,
        backgroundColor: isDarkMode ? colors._black2 : colors._white,
      }}>
      <StatusBarComp />
      <Header teks="Notification" onPress={() => navigation.goBack()} />
      <View
        style={{
          paddingHorizontal: 20,
          flex: 1,
        }}>
        <TextInput
          onChangeText={handleSearchChange}
          value={search}
          placeholder="Search"
          placeholderTextColor={colors._grey4}
          style={{
            padding: 12,
            fontSize: 13,
            fontFamily: fonts.primary[300],
            backgroundColor: isDarkMode ? colors._black : colors._grey2,
            borderRadius: 10,
            color: isDarkMode ? colors._white : colors._black,
            borderWidth: 0.5,
            borderColor: isDarkMode ? colors._grey4 : colors._grey3,
          }}
        />
        <Gap height={24} />
        <FlatList
          refreshing={isLoading}
          onRefresh={() => {
            console.log("refresh");
            setPage(1);
            setNotifications([]);

            getNotifications(1, debouncedText);
          }}
          onEndReached={handleEndReached}
          data={notifications}
          keyExtractor={(_, index) => index.toString()}
          renderItem={({ item }) => (
            <ListNotification
              notification={item}
              onPress={() => {
                navigation.navigate("DetailPaymentPackage", { id: item.notifiable_id });
              }}
            />
          )}
          ListEmptyComponent={<NoData text="No Data Available" />}
        />
      </View>

      {isLoading && <Loading />}
    </SafeAreaView>
  );
};

const ListNotification = ({
  onPress,
  notification,
}: {
  onPress: () => void;
  notification: INotification;
}) => {
  const { isDarkMode } = useContext(ThemeContext);

  return (
    <Fragment>
      <TouchableOpacity
        onPress={onPress}
        style={{
          flexDirection: "row",
          padding: 12,
          borderRadius: 12,
          justifyContent: "space-between",
          alignItems: "center",
          flex: 1,
        }}>
        <View
          style={{
            flexDirection: "column",
            alignItems: "flex-start",
            gap: 8,
            flexShrink: 1,
          }}>
          <Text
            style={{
              fontSize: 12,
              color: isDarkMode ? colors._white : colors._black,
              fontFamily: fonts.primary[400],
            }}>
            {notification.message}
          </Text>
          <Text
            style={{
              fontFamily: fonts.primary[400],
              fontSize: 12,
              color: isDarkMode ? colors._grey4 : colors._grey3,
            }}>
            {moment(notification.created_at).format(
              "dddd, MMMM DD, yyyy, HH:mm",
            )}
          </Text>
        </View>
      </TouchableOpacity>
      <View
        style={{ width: "100%", height: 1, backgroundColor: colors._grey3 }}
      />
    </Fragment>
  );
};
