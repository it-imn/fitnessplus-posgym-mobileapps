import { NativeStackScreenProps } from "@react-navigation/native-stack";
import React, { useContext, useEffect, useState } from "react";
import {
  Image,
  Modal,
  SafeAreaView,
  ScrollView,
  StyleProp,
  Text,
  TouchableOpacity,
  View,
  ViewStyle,
} from "react-native";
import BouncyCheckbox from "react-native-bouncy-checkbox";
import { ImageConfirmation } from "../../assets";
import Gap from "../../components/ui/Gap";
import Loading from "../../components/ui/Loading";
import StatusBarComp from "../../components/ui/StatusBarComp";
import { ThemeContext } from "../../contexts/ThemeContext";
import { ThemeType } from "../../lib/definition";
import { RootStackParamList } from "../../lib/routes";
import { colors, fonts } from "../../lib/utils";
import { register } from "../../services/member";
import { useSignUpStore } from "../../stores/useSignUpStore";
import { Button, ButtonColor } from "../../components/ui/Button";
import { showMessage } from "react-native-flash-message";
import Header from "../../components/ui/Header";

const SignConfirmation = ({
  navigation,
}: NativeStackScreenProps<RootStackParamList, "SignConfirmation">) => {
  const { isDarkMode } = useContext(ThemeContext);
  const [modalVisible, setModalVisible] = useState(false);
  // const [loading, setLoading] = useState(false);
  const signUpReq = useSignUpStore(state => state.signUpReq);
  const resetSignUpReq = useSignUpStore(state => state.reset);
  const [myPassword, setMyPassword] = useState(signUpReq.password);
  const [seePassword, setSeePassword] = useState(false);
  const updateSignUp = useSignUpStore(state => state.update);
  const [isLoading, setIsLoading] = useState(false);

  const onHide = () => {
    var showpassword = signUpReq.password;
    var hidden = "";
    for (let i = 0; i < showpassword.length; i++) {
      hidden += "*";
    }
    setSeePassword(!seePassword);
    if (!seePassword) {
      setMyPassword(hidden);
    } else {
      setMyPassword(signUpReq.password);
    }
  };

  const onSave = async () => {
    setModalVisible(!modalVisible);
    setIsLoading(true);
    try {
      await register(signUpReq);

      resetSignUpReq();

      navigation.replace("SignUpSuccess");
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
    onHide();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <>
      <SafeAreaView style={styles.container(isDarkMode)}>
        <StatusBarComp />
        <Header
          teks="Register Confirmation"
          onPress={() => navigation.goBack()}
        />
        <View style={styles.content}>
          <ScrollView showsVerticalScrollIndicator={false}>
            <View style={{ flex: 1 }}>
              <Text style={styles.teks(isDarkMode)}>
                Here is your registration data, make sure the data you fill is
                correct.
              </Text>
              <Gap height={30} />
              <Text style={styles.teks2(isDarkMode)}>Name</Text>
              <Gap height={4} />
              <Text style={styles.teks(isDarkMode)}>{signUpReq.name}</Text>
              <Gap height={20} />
              <Text style={styles.teks2(isDarkMode)}>Username</Text>
              <Gap height={4} />
              <Text style={styles.teks(isDarkMode)}>{signUpReq.username}</Text>
              <Gap height={20} />
              <Text style={styles.teks2(isDarkMode)}>Email</Text>
              <Gap height={4} />
              <Text style={styles.teks(isDarkMode)}>{signUpReq.email}</Text>
              <Gap height={20} />
              <Text style={styles.teks2(isDarkMode)}>Phone Number</Text>
              <Gap height={4} />
              <Text style={styles.teks(isDarkMode)}>{signUpReq.phone}</Text>
              <Gap height={20} />

              <Text style={styles.teks2(isDarkMode)}>Password</Text>
              <Gap height={4} />
              <TouchableOpacity onPress={onHide}>
                <Text style={styles.teks(isDarkMode)}>{myPassword}</Text>
              </TouchableOpacity>
              <Gap height={20} />
              <Text style={styles.teks2(isDarkMode)}>Gym</Text>
              <Gap height={4} />
              <Text style={styles.teks(isDarkMode)}>{signUpReq.gym_name}</Text>
              <Gap height={20} />
              <Text style={styles.teks2(isDarkMode)}>Branch</Text>
              <Gap height={4} />
              <Text style={styles.teks(isDarkMode)}>
                {signUpReq.branch_name}
              </Text>
              <Gap height={20} />
              {/* {expired_date != undefined &&
                                <>
                                    <Text style={styles.teks2(isDarkMode)}>Expired Date</Text>
                                    <Gap height={4} />
                                    <Text style={styles.teks(isDarkMode)}>{expired_date}</Text>
                                    <Gap height={20} />
                                </>
                            } */}
              {/* {code !== undefined && (
                <>
                  <Text style={styles.teks2(isDarkMode)}>Code</Text>
                  <Gap height={4} />
                  <Text style={styles.teks(isDarkMode)}>{code}</Text>
                  <Gap height={20} />
                </>
              )} */}
              <Gap height={20} />
              <Text style={styles.font6(isDarkMode)}>
                I acknowledge that{" "}
                <Text style={styles.font8(isDarkMode)}>
                  I have read and understand the terms and conditions
                </Text>{" "}
                of PosGym and the particular fitness center by checking the box
                below.{" "}
                <Text style={styles.font8(isDarkMode)}>
                  I also consent to PosGym using my personal data
                </Text>{" "}
                to enhance the quality of their services.
              </Text>
              <Gap height={12} />
              <View
                style={{
                  flexDirection: "row",
                  alignContent: "center",
                  justifyContent: "flex-start",
                  maxWidth: "80%",
                }}>
                <BouncyCheckbox
                  isChecked={signUpReq.term}
                  onPress={() => updateSignUp({ term: !signUpReq.term })}
                  fillColor={colors._blue}
                  unFillColor={isDarkMode ? colors._black : colors._white}
                  iconImageStyle={{ tintColor: colors._black }}
                />
                <Gap width={8} />
                <Text style={styles.font6(isDarkMode)}>I agree to </Text>
                <TouchableOpacity
                  onPress={() => navigation.navigate("TermCondition")}>
                  <Text style={styles.font7}>
                    Terms of Service and Privacy Policy
                  </Text>
                </TouchableOpacity>
              </View>
              <Gap height={20} />
            </View>
          </ScrollView>
          <ButtonColor
            backColor={colors._blue2}
            textColor={colors._white}
            disabled={!signUpReq.term}
            teks="Confirm Registration"
            onPress={() => setModalVisible(!modalVisible)}
          />
        </View>
        <Modal
          animationType="fade"
          transparent={true}
          visible={modalVisible}
          onRequestClose={() => {
            setModalVisible(!modalVisible);
          }}>
          <View style={styles.mainModal}>
            <View style={styles.contentModal(isDarkMode)}>
              <Text style={styles.teks4(isDarkMode)}>
                Complete Registration?
              </Text>
              <Gap height={8} />
              <Text style={styles.teks5(isDarkMode)}>
                Make sure the data you fill in is correct, the data that has
                been registered cannot be used to register again
              </Text>
              <Gap height={20} />
              <Image source={ImageConfirmation} />
              <Gap height={20} />
              <View style={styles.btnBottom}>
                <TouchableOpacity
                  style={styles.btnCancel}
                  onPress={() => setModalVisible(!modalVisible)}>
                  <Text style={styles.textStyle4}>Don't Save</Text>
                </TouchableOpacity>
                <Gap width={12} />
                <TouchableOpacity style={styles.btnYes} onPress={onSave}>
                  <Text style={styles.textStyle3}>Yes, Save</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </Modal>
        {isLoading && <Loading />}
      </SafeAreaView>
    </>
  );
};

const styles = {
  container: (isDarkMode: boolean) => ({
    flex: 1,
    backgroundColor: isDarkMode ? colors._black2 : colors._white,
  }),
  content: {
    padding: 24,
    flex: 1,
  },
  teks: (isDarkMode: boolean) => ({
    fontSize: 14,
    fontFamily: fonts.primary[400],
    color: isDarkMode ? colors._white : colors._black,
  }),
  teks2: (isDarkMode: boolean) => ({
    fontSize: 16,
    fontFamily: fonts.primary[600], // 500
    color: isDarkMode ? colors._white : colors._black,
  }),
  mainModal: {
    backgroundColor: colors._black3,
    width: "100%",
    height: "100%",
    justifyContent: "flex-end",
  } as StyleProp<ViewStyle>,
  contentModal: (isDarkMode: boolean) =>
    ({
      padding: 12,
      alignItems: "center",
      backgroundColor: isDarkMode ? colors._black : colors._white,
    } as StyleProp<ViewStyle>),
  teks4: (isDarkMode: boolean) => ({
    color: isDarkMode ? colors._white : colors._black,
    fontSize: 16,
    fontFamily: fonts.primary[400],
  }),
  teks5: (isDarkMode: boolean) =>
    ({
      color: isDarkMode ? colors._white : colors._black,
      fontSize: 12,
      fontFamily: fonts.primary[300],
      textAlign: "center",
    } as StyleProp<ViewStyle>),
  btnBottom: {
    flexDirection: "row",
    justifyContent: "space-between",
  } as StyleProp<ViewStyle>,
  btnYes: {
    backgroundColor: colors._grey2,
    padding: 12,
    width: "45%",
    borderRadius: 8,
  } as StyleProp<ViewStyle>,
  btnCancel: {
    backgroundColor: colors._blue,
    padding: 12,
    width: "45%",
    borderRadius: 8,
  } as StyleProp<ViewStyle>,
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
  font6: (isDarkMode: boolean) => ({
    color: isDarkMode ? colors._white : colors._black,
    fontSize: 12,
    fontFamily: fonts.primary[300],
  }),
  font8: (isDarkMode: boolean) => ({
    color: isDarkMode ? colors._white : colors._black,
    fontSize: 12,
    fontFamily: fonts.primary[600],
  }),
  //   teks: {
  //     color: colors._gold,
  //     fontSize: 16,
  //     fontFamily: fonts.primary[300],
  //   },
  font7: {
    color: colors._blue2,
    fontSize: 12,
    fontFamily: fonts.primary[400],
  },
};

export default SignConfirmation;
