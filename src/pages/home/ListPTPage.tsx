import { NativeStackScreenProps } from "@react-navigation/native-stack";
import axios, { CancelToken } from "axios";
import React, { useContext, useEffect, useState } from "react";
import {
  FlatList,
  Image,
  SafeAreaView,
  ScrollView,
  StyleProp,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  ViewStyle,
} from "react-native";
import Header from "../../components/ui/Header";
import { useDebounce } from "use-debounce";
import Gap from "../../components/ui/Gap";
import { Input } from "../../components/ui/Input";
import Loading from "../../components/ui/Loading";
import NoData from "../../components/ui/NoData";
import StatusBarComp from "../../components/ui/StatusBarComp";
import { ThemeContext } from "../../contexts/ThemeContext";
import { IPersonalTrainer, Theme, ThemeType } from "../../lib/definition";
import { RootStackParamList } from "../../lib/routes";
import { colors, fonts } from "../../lib/utils";
import { fetchPersonalTrainersWithQuery } from "../../services/personal_trainer";
import { showMessage } from "react-native-flash-message";
import { fetchProfile } from "../../services/profile";

const ListPT = ({
  navigation,
}: NativeStackScreenProps<RootStackParamList, "ListPT">) => {
  const { isDarkMode } = useContext(ThemeContext);

  const [isLoading, setIsLoading] = useState(false);
  const [personalTrainers, setPersonalTrainers] = useState<IPersonalTrainer[]>(
    [],
  );
  const [haveMembership, setHaveMembership] = useState<boolean>(false);

  const [search, setSearch] = React.useState("");
  const [debouncedText] = useDebounce(search, 500);

  const [page, setPage] = useState(1);
  const [hasNextPage, setHasNextPage] = useState(true);

  const getPersonalTrainers = async (
    _page: number,
    _search: string,
    token?: CancelToken,
  ) => {
    setIsLoading(true);
    try {
      const { data, hasNext } = await fetchPersonalTrainersWithQuery(
        { page: _page, search: _search },
        { cancelToken: token },
      );
      if (data) {
        setPersonalTrainers(prev => [...prev, ...data]);

        setHasNextPage(hasNext);
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

    getPersonalTrainers(nextPage, debouncedText);
  };

  const getProfile = async () => {
    try {
      setIsLoading(true);

      const { data } = await fetchProfile();
      if (data) {
        setHaveMembership(data.membership.status === "active");
      }

      setIsLoading(false);
    } catch (err: any) {
      showMessage({
        message: err.message || "An error occurred",
        type: "warning",
        icon: "warning",
        backgroundColor: colors._red,
        color: colors._white,
      });
      setIsLoading(false);
    }
  };

  // Fetch
  useEffect(() => {
    console.log("fetch");
    setPage(1);
    setPersonalTrainers([]);

    getPersonalTrainers(1, debouncedText);
    getProfile();
  }, [debouncedText]);

  return (
    <SafeAreaView style={styles.container(isDarkMode)}>
      <StatusBarComp />
      <Header teks="Personal Trainer" onPress={() => navigation.goBack()} />
      <View style={{ paddingHorizontal: 24, flex: 1 }}>
        <TextInput
          onChangeText={handleSearchChange}
          value={search}
          placeholder={"Search personal trainer"}
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
        <Gap height={16} />
        <FlatList
          refreshing={isLoading}
          onRefresh={() => {
            console.log("refresh");
            setPage(1);
            setPersonalTrainers([]);

            getPersonalTrainers(1, debouncedText);
          }}
          onEndReached={handleEndReached}
          data={personalTrainers}
          keyExtractor={(_, index) => index.toString()}
          renderItem={({ item }) => (
            <CardPT
              isDarkMode={isDarkMode}
              personalTrainer={item}
              onPress={() => {
                if (!haveMembership) {
                  showMessage({
                    message: "You need to buy membership first",
                    type: "warning",
                    icon: "warning",
                    backgroundColor: colors._red,
                    color: colors._white,
                  });
                  return;
                }

                navigation.navigate("DetailPT", {
                  id: item.id,
                });
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

const CardPT = ({
  personalTrainer,
  onPress,
  isDarkMode,
}: {
  personalTrainer: IPersonalTrainer;
  onPress: () => void;
  isDarkMode: boolean;
}) => {
  return (
    <TouchableOpacity
      style={styles.containerCardPT(isDarkMode)}
      onPress={onPress}>
      <Image
        source={{ uri: `${personalTrainer.image}` }}
        style={styles.imgbgCardPT}
      />
      <View style={{ paddingHorizontal: 8 }}>
        <Text numberOfLines={1} style={styles.teksCardPT(isDarkMode)}>
          {personalTrainer.name}
        </Text>
        <Gap height={2} />
        <Text style={styles.teks2CardPT(isDarkMode)}>
          {personalTrainer.gender}, {personalTrainer.age} year
        </Text>
        <Gap height={4} />
        <Text style={styles.teks2CardPT(isDarkMode)}>
          {personalTrainer.total_package} packages active
        </Text>
      </View>
    </TouchableOpacity>
  );
};

const styles = {
  teksCardPT: (isDarkMode: boolean) => ({
    color: isDarkMode ? colors._grey2 : colors._black,
    fontFamily: fonts.primary[600],
    fontSize: 12,
  }),
  teks2CardPT: (isDarkMode: boolean) => ({
    color: isDarkMode ? colors._grey2 : colors._black,
    fontFamily: fonts.primary[300],
    fontSize: 12,
  }),
  containerCardPT: (isDarkMode: boolean) =>
    ({
      marginBottom: 8,
      backgroundColor: isDarkMode ? colors._black : colors._grey2,
      padding: 12,
      borderRadius: 12,
      flexDirection: "row",
      alignItems: "center",
    } as StyleProp<ViewStyle>),
  imgbgCardPT: {
    borderRadius: 25,
    width: 50,
    height: 50,
  },
  scrolll: {
    flexWrap: "wrap",
    flexDirection: "row",
    padding: 10,
  },
  container: (isDarkMode: boolean) => ({
    backgroundColor: isDarkMode ? colors._black2 : colors._white,
    flex: 1,
  }),
  notes: (isDarkMode: boolean) => ({
    fontFamily: fonts.primary[300],
    fontSize: 12,
    color: isDarkMode ? colors._white : colors._black,
    textAlign: "center",
  }),
};

export default ListPT;
