import React, { useContext, useEffect, useState } from "react";
import {
  GestureResponderEvent,
  Image,
  SafeAreaView,
  ScrollView,
  StyleProp,
  Text,
  TouchableOpacity,
  View,
  ViewStyle,
} from "react-native";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { RootStackParamList } from "../../lib/routes";
import { Theme } from "@react-navigation/native";
import Header from "../../components/ui/Header";
import Gap from "../../components/ui/Gap";
import { ThemeContext } from "../../contexts/ThemeContext";
import { IBranch, ThemeType } from "../../lib/definition";
import { colors, fonts } from "../../lib/utils";
import { fetchBranchesWithGym } from "../../services/gym";
import { useSignUpStore } from "../../stores/useSignUpStore";
import { showMessage } from "react-native-flash-message";
import StatusBarComp from "../../components/ui/StatusBarComp";

const SelectBranch = ({
  navigation,
}: NativeStackScreenProps<RootStackParamList, "SelectBranch">) => {
  const { isDarkMode } = useContext(ThemeContext);
  const [branches, setBranches] = useState<IBranch[]>([]);
  const gymId = useSignUpStore(state => state.signUpReq.gym_id);
  const updateSignUpReq = useSignUpStore(state => state.update);

  const getBranch = async () => {
    try {
      const { data } = await fetchBranchesWithGym(gymId);
      if (data) {
        setBranches(data);
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
    getBranch();
  }, []);

  return (
    <SafeAreaView
      style={{
        flex: 1,
        backgroundColor: isDarkMode ? colors._black2 : colors._white,
      }}>
      <StatusBarComp />
      <Header teks="SELECT BRANCH" onPress={() => navigation.goBack()} />
      <View style={styles.container}>
        <Text style={styles.teks2(isDarkMode)}>
          Select branch you want to register
        </Text>
        <Gap height={20} />
        <ScrollView showsVerticalScrollIndicator={false}>
          {branches.map((data: IBranch) => {
            return (
              <CardSelectBranch
                key={data.id}
                branch_name={data.name}
                branch_image={data.image}
                onPress={() => {
                  updateSignUpReq({
                    branch_id: data.id,
                    branch_name: data.name,
                  });
                  navigation.navigate("SignConfirmation");
                }}
              />
            );
          })}
        </ScrollView>
      </View>
    </SafeAreaView>
  );
};

const CardSelectBranch = ({
  onPress,
  branch_name,
  branch_image,
}: {
  onPress: (e: GestureResponderEvent) => void;
  branch_name: string;
  branch_image: string;
}) => {
  const { isDarkMode } = useContext(ThemeContext);

  return (
    <TouchableOpacity
      style={{
        alignItems: "center",
        flexDirection: "row",
        backgroundColor: isDarkMode ? colors._black : colors._grey2,
        borderRadius: 10,
        marginBottom: 8,
        padding: 16,
      }}
      onPress={onPress}>
      <Image
        source={{ uri: branch_image }}
        style={{ width: 30, height: 30, borderRadius: 10 }}
      />
      <Gap width={10} />
      <Text
        style={{
          color: isDarkMode ? colors._white : colors._black,
          fontFamily: fonts.primary[400],
          fontSize: 14,
        }}>
        {branch_name}
      </Text>
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
};

export default SelectBranch;
