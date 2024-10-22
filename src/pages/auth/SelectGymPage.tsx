import { Theme } from "@react-navigation/native";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import React, { useContext, useState, useEffect } from "react";
import {
  SafeAreaView,
  View,
  Text,
  ScrollView,
  GestureResponderEvent,
  TouchableOpacity,
  StyleProp,
  ViewStyle,
} from "react-native";
import Header from "../../components/ui/Header";
import Gap from "../../components/ui/Gap";
import StatusBarComp from "../../components/ui/StatusBarComp";
import { ThemeContext } from "../../contexts/ThemeContext";
import { IGym, ThemeType } from "../../lib/definition";
import { RootStackParamList } from "../../lib/routes";
import { colors, fonts } from "../../lib/utils";
import { fetchGyms } from "../../services/gym";
import { useSignUpStore } from "../../stores/useSignUpStore";
import { showMessage } from "react-native-flash-message";

const SelectGym = ({
  navigation,
}: NativeStackScreenProps<RootStackParamList, "SelectGym">) => {
  const { isDarkMode } = useContext(ThemeContext);
  const [gyms, setGyms] = useState<IGym[]>([]);
  const updateSignUpReq = useSignUpStore(state => state.update);

  const getGym = async () => {
    try {
      const { data } = await fetchGyms();
      if (data) {
        setGyms(data);
      }
    } catch (error: any) {
      showMessage({
        message: error.message || "An error occurred",
        type: "warning",
        icon: "warning",
        backgroundColor: colors._red,
        color: colors._white,
      });
    }
  };

  useEffect(() => {
    getGym();
  }, []);

  return (
    <SafeAreaView
      style={{
        flex: 1,
        backgroundColor: isDarkMode ? colors._black2 : colors._white,
      }}>
      <StatusBarComp />
      <Header teks="SELECT GYM" onPress={() => navigation.goBack()} />
      <View style={styles.container}>
        <Text style={styles.teks2(isDarkMode)}>
          Select gym you want to register
        </Text>
        <Gap height={20} />
        <ScrollView showsVerticalScrollIndicator={false}>
          {gyms.map((data: IGym) => {
            return (
              <CardSelectGym
                key={data.id}
                gym_name={data.name_gym}
                onPress={() => {
                  updateSignUpReq({ gym_id: data.id, gym_name: data.name_gym });

                  navigation.navigate("SelectBranch");
                }}
              />
            );
          })}
        </ScrollView>
      </View>
    </SafeAreaView>
  );
};

const CardSelectGym = ({
  onPress,
  gym_name,
}: {
  onPress: (e: GestureResponderEvent) => void;
  gym_name: string;
}) => {
  const { isDarkMode } = useContext(ThemeContext);

  return (
    <TouchableOpacity
      style={styles.containerCard(isDarkMode)}
      onPress={onPress}>
      <View
        style={{
          width: 10,
          height: 10,
          borderRadius: 5,
          backgroundColor: isDarkMode ? colors._white : colors._black,
        }}
      />
      <Gap width={10} />
      <Text style={styles.teksCard(isDarkMode)}>{gym_name}</Text>
    </TouchableOpacity>
  );
};

const styles = {
  container: {
    flex: 1,
    padding: 24,
  },
  teks2: (isDarkMode: boolean) => ({
    color: isDarkMode ? colors._white : colors._black,
    marginBottom: 5,
    fontSize: 16,
    fontFamily: fonts.primary[400],
  }),
  teksCard: (isDarkMode: boolean) => ({
    color: isDarkMode ? colors._white : colors._black,
    fontFamily: fonts.primary[400],
    fontSize: 14,
  }),
  containerCard: (isDarkMode: boolean) =>
    ({
      alignItems: "center",
      flexDirection: "row",
      backgroundColor: isDarkMode ? colors._black : colors._grey2,
      borderRadius: 10,
      marginBottom: 8,
      padding: 16,
    } as StyleProp<ViewStyle>),
};

export default SelectGym;
