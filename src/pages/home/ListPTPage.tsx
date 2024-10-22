import { NativeStackScreenProps } from "@react-navigation/native-stack";
import axios, { CancelToken } from "axios";
import React, { useContext, useEffect, useState } from "react";
import {
  Image,
  SafeAreaView,
  ScrollView,
  StyleProp,
  Text,
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

const ListPT = ({
  navigation,
}: NativeStackScreenProps<RootStackParamList, "ListPT">) => {
  const { isDarkMode } = useContext(ThemeContext);

  const [isLoading, setIsLoading] = useState(false);
  const [personalTrainers, setPersonalTrainers] = useState<IPersonalTrainer[]>(
    [],
  );

  const [search, setSearch] = React.useState("");
  const [debouncedText] = useDebounce(search, 500);

  const getPersonalTrainers = async (token: CancelToken) => {
    setIsLoading(true);
    try {
      const { data } = await fetchPersonalTrainersWithQuery(
        token,
        debouncedText,
      );
      if (data) {
        setPersonalTrainers(data);
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
    const source = axios.CancelToken.source();

    getPersonalTrainers(source.token);

    return () => {
      source.cancel("Cancelling in cleanup");
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [debouncedText]);

  return (
    <SafeAreaView style={styles.container(isDarkMode)}>
      <StatusBarComp />
      <Header teks="Personal Trainer" onPress={() => navigation.goBack()} />
      <View style={{ paddingHorizontal: 24 }}>
        <Input
          placeholder="Search Personal Trainer"
          value={search}
          onChangeText={setSearch}
        />
      </View>
      <Gap height={16} />
      {personalTrainers.length > 0 ? (
        <ScrollView showsVerticalScrollIndicator={false}>
          <View style={{ paddingHorizontal: 24 }}>
            {personalTrainers.map((data: IPersonalTrainer) => {
              return (
                <CardPT
                  isDarkMode={isDarkMode}
                  personalTrainer={data}
                  onPress={() =>
                    navigation.navigate("DetailPT", {
                      id: data.id,
                    })
                  }
                />
              );
            })}
          </View>
        </ScrollView>
      ) : (
        <NoData text="No personal trainer available" />
      )}
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
