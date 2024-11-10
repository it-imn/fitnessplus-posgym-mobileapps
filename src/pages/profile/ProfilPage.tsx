import React, { useContext, useEffect, useState } from "react";
import {
  Dimensions,
  Image,
  Modal,
  Platform,
  Role,
  SafeAreaView,
  ScrollView,
  StyleProp,
  Text,
  TouchableOpacity,
  View,
  ViewStyle,
} from "react-native";

import { fetchProfile } from "../../services/profile";
import { logout } from "../../services/auth";
import { BottomTabScreenProps } from "@react-navigation/bottom-tabs";
import {
  CompositeScreenProps,
  Theme,
  useIsFocused,
} from "@react-navigation/native";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { Membership, Power, EditPenWhite, EditPen } from "../../assets";
import Gap from "../../components/ui/Gap";
import Loading from "../../components/ui/Loading";
import StatusBarComp from "../../components/ui/StatusBarComp";
import { ThemeContext } from "../../contexts/ThemeContext";
import { UserDetail, ThemeType } from "../../lib/definition";
import { removeAllData } from "../../lib/local-storage";
import { TabParamList, RootStackParamList } from "../../lib/routes";
import { colors, fonts } from "../../lib/utils";
import { showMessage } from "react-native-flash-message";
import { fetchContractAgreementView } from "../../services/personal_trainer";
import {
  Button,
  ButtonColor,
  ButtonIconTeks,
} from "../../components/ui/Button";

const width = Dimensions.get("window").width;

const Profil = ({
  navigation,
}: CompositeScreenProps<
  BottomTabScreenProps<TabParamList, "Profil">,
  NativeStackScreenProps<RootStackParamList, "MainApp">
>) => {
  const { isDarkMode } = useContext(ThemeContext);

  const isFocused = useIsFocused();
  const [modalVisible, setModalVisible] = useState(false);
  const [modalEditVisible, setModalEditVisible] = useState(false);
  const [dataProfile, setDataProfile] = useState<UserDetail>({} as UserDetail);
  const [havePackagePT, setHavePackagePT] = useState<boolean>(false);
  const [haveMembership, setHaveMembership] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState(false);
  const [imageUrl, setImageUrl] = useState("");

  const getProfile = async () => {
    try {
      setIsLoading(true);

      const { data } = await fetchProfile();
      if (data) {
        setDataProfile(data);
        setImageUrl(data.image || data.image_error);
        setHaveMembership(data.membership.status !== "not_buy_package");
      }

      setIsLoading(false);
    } catch (err: any) {
      console.error(err);
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

  const getPackagePT = async () => {
    try {
      setIsLoading(true);

      const { data } = await fetchContractAgreementView();
      if (data) {
        setHavePackagePT(data.status === "buy_package_personal_trainer");
      }

      setIsLoading(false);
    } catch (err: any) {
      console.error(err);
      // showMessage({
      //   message: err.message || "An error occurred",
      //   type: "warning",
      //   icon: "warning",
      //   backgroundColor: colors._red,
      //   color: colors._white,
      // });
      setIsLoading(false);
    }
  };

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const onEditProfile = () => {
    navigation.navigate("EditProfil");
  };

  const onLogOut = async () => {
    setModalVisible(false);
    setIsLoading(true);
    try {
      await logout();
      await removeAllData();
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
      navigation.replace("LoginPage");
    }
  };

  const goToClassHistory = () => {
    navigation.navigate("ClassHistory");
  };

  // const onRating = async () => {
  //   navigation.navigate('RatingView', {
  //     branch_id: dataProfile.branch.id,
  //   });
  // };

  const gotoSetting = () => {
    const params = {
      // email_verified: dataProfile.membership,
      email_verified: "Not Verified",
    };
    navigation.navigate("Setting", params);
  };

  // const myGym = () => {
  //   showMessage({
  //     icon: 'warning',
  //     message: 'This feature is under construction',
  //     type: 'default',
  //     backgroundColor: colors._red,
  //     color: colors._white,
  //   });
  // };

  useEffect(() => {
    isFocused && Promise.all([getProfile(), getPackagePT()]);
  }, [isFocused]);

  return (
    <SafeAreaView style={styles.container(isDarkMode)}>
      <StatusBarComp />
      <Text style={styles.teks(isDarkMode)}>Profile</Text>
      <TouchableOpacity
        style={styles.btnOnOff}
        onPress={() => setModalVisible(!modalVisible)}>
        <Power width={24} height={24} />
      </TouchableOpacity>

      <ScrollView showsVerticalScrollIndicator={false}>
        <Image
          source={{
            uri: imageUrl,
          }}
          style={{
            width: width / 3,
            height: width / 3,
            borderRadius: width / 4,
            alignSelf: "center",
            borderWidth: 0.6,
            borderColor: colors._black,
          }}
          onError={() => {
            setImageUrl(dataProfile.image_error);
          }}
        />

        <Gap height={20} />
        <View style={styles.box(isDarkMode)}>
          <View
            style={{
              alignItems: "center",
              flexDirection: "row",
              justifyContent: "center",
            }}>
            <Text
              style={{
                color: isDarkMode ? colors._white : colors._black,
                fontSize: 18,
                fontFamily: fonts.primary[400],
              }}>
              {dataProfile.username}
            </Text>
            <Gap width={8} />
            {/* <TouchableOpacity style={{ width: 25, height: 25, alignItems: 'center', justifyContent: 'center' }} onPress={onEditProfile}>
                            {isDarkMode ? <EditPenWhite width={24} height={24} /> : <EditPen width={24} height={24} />}
                        </TouchableOpacity> */}
            <TouchableOpacity
              style={{
                width: 25,
                height: 25,
                alignItems: "center",
                justifyContent: "center",
              }}
              onPress={() => setModalEditVisible(!modalEditVisible)}>
              {isDarkMode ? (
                <EditPenWhite width={24} height={24} />
              ) : (
                <EditPen width={24} height={24} />
              )}
            </TouchableOpacity>
          </View>
          <View style={{ alignItems: "center", marginTop: 10 }}>
            <Text style={styles.cardBio(isDarkMode)}>{dataProfile.name}</Text>
            <Gap height={5} />
            <Text style={styles.cardBio(isDarkMode)}>{dataProfile.email}</Text>
          </View>
        </View>
        <View style={{ padding: 20 }}>
          <ButtonIconTeks
            teksColor={isDarkMode ? colors._white : colors._black}
            backColor={isDarkMode ? colors._black : colors._grey2}
            teks="Class History"
            type="class-history"
            onPress={goToClassHistory}
          />
          <Gap height={5} />
          {haveMembership ? (
            <>
              <ButtonIconTeks
                teksColor={isDarkMode ? colors._white : colors._black}
                backColor={isDarkMode ? colors._black : colors._grey2}
                teks={"Membership Agreement"}
                type={"membershipagreement"}
                onPress={() => navigation.navigate("MembershipAgreement")}
              />
              <Gap height={5} />
            </>
          ) : null}
          <Gap height={5} />
          {havePackagePT ? (
            <>
              <ButtonIconTeks
                teksColor={isDarkMode ? colors._white : colors._black}
                backColor={isDarkMode ? colors._black : colors._grey2}
                teks={"Package PT Agreement"}
                type={"membershipagreement"}
                onPress={() => navigation.navigate("PackagePTAgreement")}
              />
              <Gap height={5} />
            </>
          ) : null}

          <ButtonIconTeks
            teksColor={isDarkMode ? colors._white : colors._black}
            backColor={isDarkMode ? colors._black : colors._grey2}
            teks="Settings"
            type="setting"
            onPress={gotoSetting}
          />
        </View>
      </ScrollView>

      {isLoading && <Loading />}

      <Modal
        animationType="fade"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => {
          setModalVisible(!modalVisible);
        }}>
        <View style={styles.centeredView}>
          <View style={styles.modalView(isDarkMode)}>
            <Text style={styles.modalText}>Attention!</Text>
            <Gap height={8} />
            <Text style={styles.textStyle}>
              If you exit the App your data will be reset
            </Text>
            <Gap height={20} />
            <Text style={styles.textStyle2(isDarkMode)}>
              Are you sure to exit the App?
            </Text>
            <Gap height={20} />
            <View style={styles.btnBottom}>
              <TouchableOpacity
                style={styles.btnCancel}
                onPress={() => setModalVisible(!modalVisible)}>
                <Text style={styles.textStyle4}>No, Stay Here</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.btnYes} onPress={onLogOut}>
                <Text style={styles.textStyle3}>Yes, Logout</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      <Modal
        animationType="fade"
        transparent={true}
        visible={modalEditVisible}
        onRequestClose={() => {
          setModalEditVisible(!modalEditVisible);
        }}>
        <View style={styles.centeredView}>
          <View style={styles.modalView(isDarkMode)}>
            <Text style={styles.modalText}>Attention!</Text>
            <Gap height={8} />
            <Text style={styles.textStyle}>
              If you want to change data profile
            </Text>
            <Gap height={20} />
            <Text style={styles.textStyle2(isDarkMode)}>Contact the Admin</Text>
            <Gap height={20} />
            {/* <View style={styles.btnBottom}>
                            <TouchableOpacity style={styles.btnCancel} onPress={() => setModalEditVisible(!modalEditVisible)}>
                                <Text style={styles.textStyle4}>Close</Text>
                            </TouchableOpacity>
                        </View> */}
            <ButtonColor
              backColor={colors._blue2}
              textColor={colors._white}
              teks="Close"
              onPress={() => setModalEditVisible(!modalEditVisible)}
            />
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
};

const styles = {
  container: (isDarkMode: boolean) =>
    ({
      backgroundColor: isDarkMode ? colors._black2 : colors._white,
      flex: 1,
    } as StyleProp<ViewStyle>),
  box: (isDarkMode: boolean) => ({
    marginHorizontal: 20,
    padding: 18,
    backgroundColor: isDarkMode ? colors._black : colors._grey2,
    borderRadius: 10,
    shadowColor: colors._black,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  }),
  cardBio: (isDarkMode: boolean) => ({
    color: isDarkMode ? colors._white : colors._black,
    fontSize: 14,
    fontFamily: fonts.primary[300],
  }),
  btnOnOff: {
    backgroundColor: colors._red,
    width: 32,
    height: 32,
    borderRadius: 17,
    justifyContent: "center",
    alignItems: "center",
    position: "absolute",
    right: 24,
    top: Platform.OS === "ios" ? 64 : 16,
  } as StyleProp<ViewStyle>,
  centeredView: {
    padding: 24,
    justifyContent: "flex-end",
    width: "100%",
    height: "100%",
    backgroundColor: colors._black3,
  } as StyleProp<ViewStyle>,
  modalView: (isDarkMode: boolean) => ({
    backgroundColor: isDarkMode ? colors._black : colors._white,
    padding: 12,
    borderRadius: 8,
  }),
  modalText: {
    fontSize: 18,
    color: colors._red,
    fontFamily: fonts.primary[400],
    textAlign: "center",
  } as StyleProp<ViewStyle>,
  textStyle: {
    fontSize: 14,
    color: colors._red,
    fontFamily: fonts.primary[300],
    textAlign: "center",
  } as StyleProp<ViewStyle>,
  textStyle2: (isDarkMode: boolean) =>
    ({
      fontSize: 14,
      color: isDarkMode ? colors._white : colors._black,
      fontFamily: fonts.primary[300],
      textAlign: "center",
    } as StyleProp<ViewStyle>),
  textStyle3: {
    fontSize: 14,
    color: colors._black,
    fontFamily: fonts.primary[400],
    textAlign: "center",
  } as StyleProp<ViewStyle>,
  textStyle4: {
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
  teks: (isDarkMode: boolean) =>
    ({
      color: isDarkMode ? colors._white : colors._black,
      fontFamily: fonts.primary[600],
      fontSize: 20,
      textAlign: "center",
      padding: 20,
    } as StyleProp<ViewStyle>),
};

export default Profil;
