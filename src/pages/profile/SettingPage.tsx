import { Theme } from "@react-navigation/native";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import React, { useContext, useState } from "react";
import {
  Modal,
  SafeAreaView,
  StyleProp,
  Switch,
  Text,
  TouchableOpacity,
  View,
  ViewStyle,
} from "react-native";
import { ArrowWhite, ArrowBlack, IconTheme } from "../../assets";
import { ButtonIconTeks } from "../../components/ui/Button";
import Gap from "../../components/ui/Gap";
import StatusBarComp from "../../components/ui/StatusBarComp";
import { ThemeContext } from "../../contexts/ThemeContext";
import { ThemeType } from "../../lib/definition";
import { getToken } from "../../lib/local-storage";
import { RootStackParamList } from "../../lib/routes";
import { colors, fonts } from "../../lib/utils";

const Setting = ({
  navigation,
}: NativeStackScreenProps<RootStackParamList, "Setting">) => {
  const { isDarkMode, toggleTheme, theme } = useContext(ThemeContext);
  // const {email_verified} = route.params;
  const [modalVisible, setModalVisible] = useState(false);

  // const gotoBiodata = () => {
  // TODO: gatau bedanya
  // navigation.navigate('BioUser');
  // navigation.navigate('DetailBioUser');
  // };

  const deleteAccount = () => {
    navigation.navigate("DeleteAccount");
  };

  // const onEditPassword = () => {
  //   getData('userProfile').then(res => {
  //     const params = {
  //       username: res.username,
  //     };
  //     navigation.navigate('EditPassword', params);
  //   });
  // };

  // const gotoModal = () => {
  //   setModalVisible(!modalVisible);
  // };

  // const gotoVerification = async () => {
  //   try {
  //     await Api.getCodeVerify();
  //     const token = await getToken();
  //     if (!token) {
  //       return;
  //     }
  //     setModalVisible(!modalVisible);
  //     const params = {
  //       token: token,
  //     };
  //     navigation.replace("Verification", params);
  //   } catch (error) {}
  // };

  return (
    <SafeAreaView style={styles.container(isDarkMode)}>
      <StatusBarComp />
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.btnBack}
          onPress={() => navigation.goBack()}>
          {isDarkMode ? <ArrowWhite /> : <ArrowBlack />}
        </TouchableOpacity>
        <Text style={styles.teks(isDarkMode)}>Settings</Text>
        <View style={{ width: 24, height: 24 }} />
      </View>
      <View style={{ paddingHorizontal: 24, marginTop: 12 }}>
        {/* <TouchableOpacity
          style={styles.btnVerify(isDarkMode)}
          disabled={email_verified === 'Not Verified' ? false : true}
          onPress={gotoModal}>
          <View
            style={{
              width: 25,
              height: 25,
              alignItems: 'center',
              justifyContent: 'center',
            }}>
            <IconVerify width={24} height={24} />
          </View>
          <Gap width={10} />
          <Text numberOfLines={1} style={styles.teks2(isDarkMode)}>
            Verify your account
          </Text>
          <View style={{flex: 1}} />
          <Text numberOfLines={1} style={styles.teks2(isDarkMode)}>
            {email_verified}
          </Text>
        </TouchableOpacity>
        <Gap height={5} />
        <ButtonIconTeks
          teksColor={
            isDarkMode ? colors._white : colors._black
          }
          backColor={
            isDarkMode ? colors._black : colors._grey2
          }
          teks="Biodata"
          type="biodata"
          noIcon={false}
          onPress={gotoBiodata}
        />
        <Gap height={5} />
        <ButtonIconTeks
          teksColor={
            isDarkMode ? colors._white : colors._black
          }
          backColor={
            isDarkMode ? colors._black : colors._grey2
          }
          teks="Change Password"
          type="password"
          noIcon={false}
          onPress={onEditPassword}
        />
        <Gap height={5} /> */}
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "space-between",
            paddingVertical: 14,
            paddingHorizontal: 16,
            backgroundColor: isDarkMode ? colors._black : colors._grey2,
            borderRadius: 10,
          }}>
          <View style={{ flexDirection: "row", alignItems: "center" }}>
            <View
              style={{
                width: 25,
                height: 25,
                alignItems: "center",
                justifyContent: "center",
              }}>
              <IconTheme width={24} height={24} />
            </View>
            <Gap width={10} />
            <Text
              style={{
                color: isDarkMode ? colors._white : colors._black,
                fontSize: 14,
                fontFamily: fonts.primary[300],
              }}>
              Select Theme (Dark)
            </Text>
          </View>
          <Switch
            trackColor={{ false: colors._white, true: colors._black2 }}
            thumbColor={isDarkMode ? colors._blue2 : colors._white}
            ios_backgroundColor={colors._black2}
            onValueChange={toggleTheme}
            value={isDarkMode}
          />
        </View>
        <Gap height={5} />
        <ButtonIconTeks
          teksColor={colors._red}
          backColor={isDarkMode ? colors._black : colors._grey2}
          teks="Delete Account"
          type="deleteAccount"
          noIcon={false}
          onPress={deleteAccount}
        />
      </View>
      {/* <Modal
        animationType="fade"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => {
          setModalVisible(!modalVisible);
        }}>
        <View style={styles.centeredView}>
          <View style={styles.modalView(isDarkMode)}>
            <Text style={styles.teks3(isDarkMode)}>
              We will send verification code to your email. Please check your
              email box.
            </Text>
            <Gap height={20} />
            <View style={styles.btnBottom}>
              <TouchableOpacity
                style={styles.btnCancel}
                onPress={() => setModalVisible(!modalVisible)}>
                <Text style={styles.teks5}>No, Thanks</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.btnYes}
                onPress={gotoVerification}>
                <Text style={styles.teks4}>Yes, Send</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal> */}
    </SafeAreaView>
  );
};

const styles = {
  container: (isDarkMode: boolean) => ({
    flex: 1,
    backgroundColor: isDarkMode ? colors._black2 : colors._white,
  }),
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 16,
  } as StyleProp<ViewStyle>,
  btnBack: {
    width: 24,
    height: 24,
    borderRadius: 8,
    justifyContent: "center",
    alignItems: "center",
  } as StyleProp<ViewStyle>,
  teks: (isDarkMode: boolean) => ({
    color: isDarkMode ? colors._white : colors._black,
    fontFamily: fonts.primary[600],
    fontSize: 20,
  }),
  teks2: (isDarkMode: boolean) => ({
    color: isDarkMode ? colors._white : colors._black,
    fontSize: 14,
    fontFamily: fonts.primary[300],
  }),
  btnVerify: (isDarkMode: boolean) =>
    ({
      paddingVertical: 14,
      paddingHorizontal: 16,
      backgroundColor: isDarkMode ? colors._black : colors._grey2,
      borderRadius: 10,
      alignItems: "center",
      flexDirection: "row",
    } as StyleProp<ViewStyle>),
  centeredView: {
    padding: 24,
    justifyContent: "flex-end",
    width: "100%",
    height: "100%",
    backgroundColor: colors._black3,
  } as StyleProp<ViewStyle>,
  modalView: (isDarkMode: boolean) =>
    ({
      backgroundColor: isDarkMode ? colors._black : colors._white,
      padding: 12,
      borderRadius: 8,
    } as StyleProp<ViewStyle>),
  teks3: (isDarkMode: boolean) =>
    ({
      fontSize: 14,
      color: isDarkMode ? colors._white : colors._black,
      fontFamily: fonts.primary[300],
      textAlign: "center",
    } as StyleProp<ViewStyle>),
  teks4: {
    fontSize: 14,
    color: colors._black,
    fontFamily: fonts.primary[400],
    textAlign: "center",
  } as StyleProp<ViewStyle>,
  teks5: {
    fontSize: 14,
    color: colors._white,
    fontFamily: fonts.primary[400],
    textAlign: "center",
  } as StyleProp<ViewStyle>,
  btnYes: {
    backgroundColor: colors._grey2,
    padding: 12,
    width: "48%",
    borderRadius: 8,
  } as StyleProp<ViewStyle>,
  btnCancel: {
    backgroundColor: colors._blue,
    padding: 12,
    width: "48%",
    borderRadius: 8,
  } as StyleProp<ViewStyle>,
  btnBottom: {
    flexDirection: "row",
    justifyContent: "space-between",
  } as StyleProp<ViewStyle>,
};

export default Setting;
