import { NativeStackScreenProps } from "@react-navigation/native-stack";
import React, { Fragment, useContext, useEffect, useState } from "react";
import {
  FlatList,
  Image,
  SafeAreaView,
  ScrollView,
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
import { INews, INotification } from "../../lib/definition";
import {
  fetchNotifications,
  readNotification,
} from "../../services/notification";
import { useIsFocused } from "@react-navigation/native";
import { CancelToken } from "axios";
import { useDebounce } from "use-debounce";
import { Icon } from "lucide-react-native";
import Gap from "../../components/ui/Gap";
import Loading from "../../components/ui/Loading";
import moment from "moment";
import { fetchDetailNews } from "../../services/news";
import { showMessage } from "react-native-flash-message";

export const DetailNews = ({
  navigation,
  route,
}: NativeStackScreenProps<RootStackParamList, "DetailNews">) => {
  const { isDarkMode } = useContext(ThemeContext);

  const { id } = route.params;

  const [news, setNews] = useState<INews | null>(null);
  const [isLoading, setIsLoading] = React.useState(false);
  const isFocused = useIsFocused();

  const getNews = async () => {
    setIsLoading(true);
    try {
      const { data } = await fetchDetailNews(id);
      setNews(data);
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

  useEffect(() => {
    isFocused && getNews();
  }, [isFocused]);

  return (
    <SafeAreaView
      style={{
        flex: 1,
        backgroundColor: isDarkMode ? colors._black2 : colors._white,
      }}>
      <StatusBarComp />
      <Header teks="Detail News" onPress={() => navigation.goBack()} />

      <ScrollView
        style={{
          flex: 1,
          paddingHorizontal: 20,
          paddingTop: 10,
          backgroundColor: isDarkMode ? colors._black2 : colors._white,
        }}>
        <Text
          style={{
            fontFamily: fonts.primary[600],
            fontSize: 20,
            color: isDarkMode ? colors._white : colors._black,
          }}>
          {news?.title}
        </Text>
        <Gap height={10} />
        <Text
          style={{
            fontFamily: fonts.primary[400],
            fontSize: 14,
            color: isDarkMode ? colors._grey4 : colors._grey3,
          }}>
          {news?.created_at}
        </Text>
        <Gap height={10} />
        <Image
          source={{ uri: news?.image_thumbnail }}
          style={{
            width: "100%",
            height: 200,
            borderRadius: 10,
          }}
          resizeMode="cover"
        />
        <Gap height={24} />
        <Text
          style={{
            fontFamily: fonts.primary[300],
            fontSize: 14,
            color: isDarkMode ? colors._white : colors._black,
          }}>
          {news?.description}
        </Text>
      </ScrollView>

      {isLoading && <Loading />}
    </SafeAreaView>
  );
};
