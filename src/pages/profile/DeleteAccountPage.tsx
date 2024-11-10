import React, { useContext, useState } from "react";
import {
  SafeAreaView,
  ScrollView,
  StyleProp,
  Text,
  View,
  ViewStyle,
} from "react-native";
import { showMessage } from "react-native-flash-message";
import BouncyCheckbox from "react-native-bouncy-checkbox";
import { Theme } from "@react-navigation/native";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import Header from "../../components/ui/Header";
import Gap from "../../components/ui/Gap";
import { ThemeContext } from "../../contexts/ThemeContext";
import { ThemeType } from "../../lib/definition";
import { removeAllData } from "../../lib/local-storage";
import { RootStackParamList } from "../../lib/routes";
import { colors, fonts } from "../../lib/utils";
import { deleteAccount } from "../../services/auth";
import { ButtonColor } from "../../components/ui/Button";
import Loading from "../../components/ui/Loading";

const DeleteAccount = ({
  navigation,
}: NativeStackScreenProps<RootStackParamList, "DeleteAccount">) => {
  const { isDarkMode } = useContext(ThemeContext);
  const [agree, setAgree] = useState(true);
  const [isLoading, setIsLoading] = useState(false);

  const onDeleteAccount = async () => {
    if (!agree) {
      showMessage({
        icon: "warning",
        message: "Please agree to the terms of account deletion",
        type: "default",
        backgroundColor: colors._red,
        color: colors._white,
      });
      return;
    }

    setIsLoading(true);
    try {
      await deleteAccount();
      await removeAllData();

      showMessage({
        icon: "success",
        message: "Delete account success",
        type: "default",
        backgroundColor: colors._green,
        color: colors._white,
      });

      navigation.replace("LoginPage");
    } catch (error: any) {
      showMessage({
        icon: "warning",
        message: error.message || "An error occured",
        type: "default",
        backgroundColor: colors._red,
        color: colors._white,
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container(isDarkMode)}>
      <Header teks="Delete Account" onPress={() => navigation.goBack()} />
      <View style={styles.content}>
        <ScrollView showsVerticalScrollIndicator={false}>
          <Text style={styles.text(isDarkMode)}>
            You are trying to delete your posgym account. You will no longer be
            able to use your account and your data will be lost. By deleting
            your account, you agree to the following:
          </Text>
          <Gap height={16} />
          <Text style={styles.text(isDarkMode)}>
            - All transaction history will be lost.
          </Text>
          <Gap height={4} />
          <Text style={styles.text(isDarkMode)}>
            - All class data that you have attended and that you are currently
            participating in will be lost.
          </Text>
          <Gap height={4} />
          <Text style={styles.text(isDarkMode)}>
            - All personal trainer data you have attended and are currently
            following will be lost.
          </Text>
          <Gap height={4} />
          <Text style={styles.text(isDarkMode)}>
            - All membership package data that you have participated in and are
            currently following will be lost.
          </Text>
          <Gap height={4} />
          <Text style={styles.text(isDarkMode)}>
            - All your merchandise purchase history data will be lost including
            merchandise that you have paid for but have not taken.
          </Text>
          <Gap height={4} />
          <Text style={styles.text(isDarkMode)}>
            - Accounts that have been deleted cannot be recovered.
          </Text>
          <Gap height={16} />
          <Text style={styles.text(isDarkMode)}>
            I hereby agree to all terms of account deletion
          </Text>
          <Gap height={12} />
          <View
            style={{
              flexDirection: "row",
              alignContent: "center",
              justifyContent: "flex-start",
            }}>
            <BouncyCheckbox
              isChecked={!agree}
              onPress={() => setAgree(!agree)}
              fillColor={colors._blue}
              unFillColor={isDarkMode ? colors._black : colors._white}
              iconImageStyle={{ tintColor: colors._black }}
            />
            <Gap width={8} />
            <Text style={styles.text(isDarkMode)}>
              Yes, I want to permanently delete my posgym account
            </Text>
          </View>
        </ScrollView>
      </View>
      <View style={{ padding: 24 }}>
        <ButtonColor
          teks="Delete Account"
          disabled={agree}
          backColor={agree ? colors._grey4 : colors._red}
          textColor={colors._white}
          onPress={onDeleteAccount}
        />
      </View>

      {isLoading && <Loading />}
    </SafeAreaView>
  );
};
const styles = {
  container: (isDarkMode: boolean) => ({
    backgroundColor: isDarkMode ? colors._black2 : colors._white,
    flex: 1,
  }),
  content: {
    paddingHorizontal: 24,
    flex: 1,
  },
  text: (isDarkMode: boolean) => ({
    fontSize: 14,
    color: isDarkMode ? colors._white : colors._black,
    lineHeight: 18,
    fontFamily: fonts.primary[300],
  }),
  text2: {
    fontSize: 14,
    color: colors._black,
    lineHeight: 18,
    fontFamily: fonts.primary[400],
    maxWidth: "80%",
    textAlign: "center",
    alignSelf: "center",
  } as StyleProp<ViewStyle>,
  centeredView: {
    padding: 24,
    justifyContent: "flex-end",
    width: "100%",
    height: "100%",
    backgroundColor: colors._black3,
  } as StyleProp<ViewStyle>,
  modalView: {
    backgroundColor: colors._white,
    padding: 12,
    borderRadius: 20,
  },
  input: {
    padding: 12,
    fontSize: 13,
    fontFamily: fonts.primary[300],
    backgroundColor: colors._grey2,
    borderRadius: 10,
    color: colors._black,
  },
};

export default DeleteAccount;
